// window.FAM.subscribe("onBeforeAddProducts", (data) => {
//     return new Promise(resolve => {
//     	// window.FAC.api.toast("success", "Custom Resource", "onBeforeAddProducts: total " + data.length + " products");
//     	data.pop();
//         resolve(data);
//     });
// })

// window.FAM.subscribe("onBeforeAddProducts", (data) => {
//     return new Promise(resolve => {
//     	// window.FAC.api.toast("success", "Custom Resource", "onBeforeAddProducts: total " + data.length + " products");
//     	console.log(data);
//     	data.pop();
//         resolve(data);
//     });
// })

// window.FAM.subscribe("onBeforeAddProducts", (data) => {
//     return new Promise(resolve => {
//     	// window.FAC.api.toast("success", "Custom Resource", "onBeforeAddProducts: total " + data.length + " products");
//     	console.log(data);
//     	data.pop();
//         resolve(data);
//     });
// })

window.FAM.subscribe("onAfterAddProducts", data => {
	return new Promise(async resolve => {
		negotiateDiscountCodesForProducts(data)
		.then(r => {
			resolve(data);
		});
	});
});

function negotiateDiscountCodesForProducts(data) {
		// get discount codes
		// group all rcl codes
		// group all cp codes

		// Loop cp
		// do they have rate cards?
		// get all rate card lines from cp._rateCards > rateCardLines (FOI: Id, cspmb__Rate_Card__c, cspmb__rate_value__c)

		// Loop these rcl
		// cross reference rcl with rcl codes
		// Match?
		// you have original price, and negotiation info from group
		// append it to negoArray
		// in case of multiple codes being applied to same rcl, apply last one (overwrite while looping codes)

		// ********************************

		// get products (from data)
		// Loop cp
		// cross reference the list with cp codes
		// Match?
		// check code for oneOff/recc
		// apply appropriate discount and append to negoArray
		// in case of multiple codes being applied to same cp, apply last one (overwrite while looping codes)

		// ********************************
		// send negoArray to negotiate API

		let _activeFa = await window.FAM.api.getActiveFrameAgreement();
		let _commercialProducts;

		if (!data) {
			_commercialProducts = _activeFa._ui.commercialProducts;
		} else {
			_commercialProducts = _activeFa._ui.commercialProducts.filter(cp => data.includes(cp.Id));
		}

		// **************************************** HELPERS
		function calculateDiscount(type, discount, original) {
			// Used to calculate discount based on a) type (absolute/percentage), b) discount (value) c) original (value of charge)
			let result;
			discount = Math.abs(+discount);

			if (type === "Amount") {
				result = original - discount;
			} else {
				result = original - (original * discount) / 100;
			}

			var dp = decimalPlaces(result);
			if (dp > 2) {
				dp = 2;
			}

			return +result.toFixed(dp);
		}

		function decimalPlaces(num) {
			// Used to determine adequate decimal points
			var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
			if (!match) {
				return 0;
			}
			return Math.max(
				0,
				// Number of digits right of decimal point.
				(match[1] ? match[1].length : 0) -
					// Adjust for scientific notation.
					(match[2] ? +match[2] : 0)
			);
		}
		// ****************************************
		// Will hold negotiation API compliant structure
		let _negoArray = [];

		let discountCodes = await window.FAM.api.getCustomData();
		try {
			discountCodes = JSON.parse(discountCodes).codes || [];
		} catch (err) {
			console.warn(err);
			// WE'RE DONE HERE
			resolve(data);
			return;
		}

		if (!discountCodes.length) {
			// WE'RE DONE HERE
			resolve(data);
			return;
		}

		// Group codes by target to avoid wasteful looping
		let rcl_codes = discountCodes.filter(dc => dc.target_object__c === "Rate Card Line");
		let cp_codes = discountCodes.filter(dc => dc.target_object__c === "Commercial Product");

		// Generate map of original charges for product
		let _originalProductValues = _activeFa._ui.commercialProducts.reduce((acc, iter) => {
			let _data = {};
			if (iter.hasOwnProperty("cspmb__Recurring_Charge__c")) {
				_data.recurring = +iter.cspmb__Recurring_Charge__c;
			}
			if (iter.hasOwnProperty("cspmb__One_Off_Charge__c")) {
				_data.oneOff = +iter.cspmb__One_Off_Charge__c;
			}
			return { ...acc, [iter.Id]: _data };
		}, {});

		_commercialProducts.forEach(cp => {
			if (cp._rateCards && cp._rateCards.length && rcl_codes.length) {
				// rcl is nested inside rc, flatten this structure to avoid nested loop
				let _rateCardLines = cp._rateCards.reduce((acc, iter) => [...acc, ...iter.rateCardLines], []);

				_rateCardLines.forEach(rcl => {
					// This will be overriten for every discount code, last one will be applied
					let _negoFormatRcl = null;
					rcl_codes.forEach(rclc => {
						if (rclc.records[rcl.Id]) {
							_negoFormatRcl = {};
							_negoFormatRcl.priceItemId = cp.Id;
							_negoFormatRcl.rateCard = rcl.cspmb__Rate_Card__c;
							_negoFormatRcl.rateCardLine = rcl.Id;
							_negoFormatRcl.value = calculateDiscount(rclc.discount_type__c, rclc.rate_value__c, rcl.cspmb__rate_value__c);
						}
					});
					_negoArray.push(_negoFormatRcl);
				});
			}

			let _negoFormatCp = null;
			cp_codes.forEach(cpc => {
				if (cpc.records[cp.Id]) {
					_negoFormatCp = {};
					_negoFormatCp.priceItemId = cp.Id;
					_negoFormatCp.value = {};

					if (cpc.hasOwnProperty("recurring_charge__c") && _originalProductValues[cp.Id].hasOwnProperty("recurring")) {
						_negoFormatCp.value.recurring = calculateDiscount(
							cpc.discount_type__c,
							cpc.recurring_charge__c,
							_originalProductValues[cp.Id].recurring
						);
					}

					if (cpc.hasOwnProperty("one_off_charge__c") && _originalProductValues[cp.Id].hasOwnProperty("oneOff")) {
						_negoFormatCp.value.oneOff = calculateDiscount(
							cpc.discount_type__c,
							cpc.one_off_charge__c,
							_originalProductValues[cp.Id].oneOff
						);
					}

					_negoArray.push(_negoFormatCp);
				}
			});
		});

		return window.FAM.api.negotiate(_negoArray);
}