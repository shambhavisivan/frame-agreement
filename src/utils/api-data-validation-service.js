import {
	isDiscountAllowed,
	isFalsyExceptZero,
	isOneOff,
	isRecurring,
} from "./shared-service";

const RECURRING = "recurring";
const ONE_OFF = "oneOff";

export const validateNegotiationInputData = (
	negotiatedProductsInput,
	products,
	productsInAttachment,
	FACSettings
) => {
	let validInputNegotiationData = new Array();

	negotiatedProductsInput.forEach((negotiationProduct) => {
		const product = products.get(negotiationProduct.priceItemId) || {};

		if (negotiationProduct.cpAddon) {
			if (
				!isFalsyExceptZero(negotiationProduct.value?.oneOff) ||
				!isFalsyExceptZero(negotiationProduct.value?.recurring)
			) {
				if (product._addons?.has(negotiationProduct.cpAddon)) {
					const addon = product._addons.get(
						negotiationProduct.cpAddon
					);
					const originalOneOffValue = addon.cspmb__One_Off_Charge__c;
					const originalRecurringValue =
						addon.cspmb__Recurring_Charge__c;
					let validOneOff = true;
					let validRecurring = true;

					if (!isFalsyExceptZero(negotiationProduct.value?.oneOff)) {
						if (
							!isDiscountAllowed(ONE_OFF, addon) ||
							isFalsyExceptZero(originalOneOffValue)
						) {
							validOneOff = false;
						} else {
							const oneOffDiscountSet = getDiscountSet(
								addon,
								originalOneOffValue,
								ONE_OFF
							);

							negotiationProduct.value.oneOff = checkAndRestrictMinMax(
								negotiationProduct.value.oneOff,
								productsInAttachment[
									negotiationProduct.priceItemId
								]._addons[addon.Id].oneOff,
								originalOneOffValue,
								FACSettings
							);

							if (
								oneOffDiscountSet.size &&
								!oneOffDiscountSet.has(
									Number(negotiationProduct.value.oneOff)
								) &&
								Number(negotiationProduct.value.oneOff) !==
									originalOneOffValue
							) {
								validOneOff = false;
							}
						}
					}

					if (
						!isFalsyExceptZero(negotiationProduct.value?.recurring)
					) {
						if (
							!isDiscountAllowed(RECURRING, addon) ||
							isFalsyExceptZero(originalRecurringValue)
						) {
							validRecurring = false;
						} else {
							const recurringDiscountSet = getDiscountSet(
								addon,
								originalRecurringValue,
								RECURRING
							);

							negotiationProduct.value.recurring = checkAndRestrictMinMax(
								negotiationProduct.value.recurring,
								productsInAttachment[
									negotiationProduct.priceItemId
								]._addons[addon.Id].recurring,
								originalRecurringValue,
								FACSettings
							);

							if (
								recurringDiscountSet.size &&
								!recurringDiscountSet.has(
									Number(negotiationProduct.value.recurring)
								) &&
								Number(negotiationProduct.value.recurring) !==
									originalRecurringValue
							) {
								validRecurring = false;
							}
						}
					}

					if (validOneOff && validRecurring) {
						validInputNegotiationData.push(negotiationProduct);
					}
				}
			}
		} else if (negotiationProduct.charge) {
			if (product._charges?.has(negotiationProduct.charge)) {
				const charge = product._charges.get(negotiationProduct.charge);
				let validOneOff = false;
				let validRecurring = false;

				if (
					isDiscountAllowed(ONE_OFF, product) &&
					!isFalsyExceptZero(negotiationProduct.value?.oneOff) &&
					charge._type === ONE_OFF
				) {
					const originalOneOffValue = charge.oneOff;
					const oneOffDiscountSet = getDiscountSet(
						product,
						originalOneOffValue,
						ONE_OFF,
						charge,
						true
					);
					negotiationProduct.value.oneOff = checkAndRestrictMinMax(
						negotiationProduct.value.oneOff,
						productsInAttachment[negotiationProduct.priceItemId]
							._charges[charge.Id].oneOff,
						originalOneOffValue,
						FACSettings
					);
					validOneOff = true;

					if (
						oneOffDiscountSet.size &&
						!oneOffDiscountSet.has(
							Number(negotiationProduct.value.oneOff)
						) &&
						Number(negotiationProduct.value.oneOff) !==
							originalOneOffValue
					) {
						validOneOff = false;
					}
				} else if (
					isDiscountAllowed(RECURRING, product) &&
					!isFalsyExceptZero(negotiationProduct.value?.recurring) &&
					charge._type === RECURRING
				) {
					const originalRecurringValue = charge.recurring;
					const recurringDiscountSet = getDiscountSet(
						product,
						originalRecurringValue,
						RECURRING,
						charge,
						true
					);
					negotiationProduct.value.recurring = checkAndRestrictMinMax(
						negotiationProduct.value.recurring,
						productsInAttachment[negotiationProduct.priceItemId]
							._charges[charge.Id].recurring,
						originalRecurringValue,
						FACSettings
					);

					validRecurring = true;
					if (
						recurringDiscountSet.size &&
						!recurringDiscountSet.has(
							Number(negotiationProduct.value.recurring)
						) &&
						Number(negotiationProduct.value.recurring) !==
							originalRecurringValue
					) {
						validRecurring = false;
					}
				}

				if (validOneOff || validRecurring) {
					validInputNegotiationData.push(negotiationProduct);
				}
			}
		} else if (negotiationProduct.rateCard) {
			if (
				product._rateCards?.has(negotiationProduct.rateCard) &&
				product._rateCards
					.get(negotiationProduct.rateCard)
					.rateCardLines?.has(negotiationProduct.rateCardLine)
			) {
				const rateCard = product._rateCards.get(
					negotiationProduct.rateCard
				);
				const rateCardLine = rateCard.rateCardLines.get(
					negotiationProduct.rateCardLine
				);
				const originalRateValue = rateCardLine.cspmb__rate_value__c;

				if (!isFalsyExceptZero(originalRateValue)) {
					negotiationProduct.value = checkAndRestrictMinMax(
						negotiationProduct.value,
						productsInAttachment[negotiationProduct.priceItemId]
							._rateCards[rateCard.Id][rateCardLine.Id],
						originalRateValue,
						FACSettings
					);
					if (!isFalsyExceptZero(negotiationProduct.value)) {
						validInputNegotiationData.push(negotiationProduct);
					}
				}
			}
		} else {
			if (
				!isFalsyExceptZero(negotiationProduct.value?.oneOff) ||
				!isFalsyExceptZero(negotiationProduct.value?.recurring)
			) {
				const originalOneOffValue = product.cspmb__One_Off_Charge__c;
				const originalRecurringValue =
					product.cspmb__Recurring_Charge__c;
				let validOneOff = true;
				let validRecurring = true;

				if (!isFalsyExceptZero(negotiationProduct.value?.oneOff)) {
					if (
						!isDiscountAllowed(ONE_OFF, product) ||
						isFalsyExceptZero(originalOneOffValue)
					) {
						validOneOff = false;
					} else {
						const oneOffDiscountSet = getDiscountSet(
							product,
							originalOneOffValue,
							ONE_OFF
						);
						negotiationProduct.value.oneOff = checkAndRestrictMinMax(
							negotiationProduct.value.oneOff,
							productsInAttachment[negotiationProduct.priceItemId]
								._product.oneOff,
							originalOneOffValue,
							FACSettings
						);

						if (
							oneOffDiscountSet.size &&
							!oneOffDiscountSet.has(
								Number(negotiationProduct.value.oneOff)
							) &&
							Number(negotiationProduct.value.oneOff) !==
								originalOneOffValue
						) {
							validOneOff = false;
						}
					}
				}

				if (!isFalsyExceptZero(negotiationProduct.value?.recurring)) {
					if (
						!isDiscountAllowed(RECURRING, product) ||
						isFalsyExceptZero(originalRecurringValue)
					) {
						validRecurring = false;
					} else {
						const recurringDiscountSet = getDiscountSet(
							product,
							originalRecurringValue,
							RECURRING
						);
						negotiationProduct.value.recurring = checkAndRestrictMinMax(
							negotiationProduct.value.recurring,
							productsInAttachment[negotiationProduct.priceItemId]
								._product.recurring,
							originalRecurringValue,
							FACSettings
						);

						if (
							recurringDiscountSet.size &&
							!recurringDiscountSet.has(
								Number(negotiationProduct.value.recurring)
							) &&
							Number(negotiationProduct.value.recurring) !==
								originalRecurringValue
						) {
							validRecurring = false;
						}
					}
				}

				if (validOneOff && validRecurring) {
					validInputNegotiationData.push(negotiationProduct);
				}
			}
		}
	});

	return validInputNegotiationData;
};

const getDiscountSet = (
	productOrAddon,
	originalValue,
	chargeType,
	charge,
	isAdvancedCharges = false
) => {
	let discountSet = new Set();

	if (productOrAddon._discountLvIds?.length) {
		productOrAddon._discountLvIds.forEach((lv) => {
			let discount = lv.discountLevel;

			if (isAdvancedCharges && charge.Name !== discount.Name) {
				return;
			}

			discount.cspmb__Discount_Values__c.forEach((discountValue) => {
				let newPrice;
				if (discount.cspmb__Discount_Type__c === "Amount") {
					if (discountValue <= originalValue) {
						newPrice = originalValue - discountValue;
					}
				} else if (discount.cspmb__Discount_Type__c === "Percentage") {
					if (discountValue <= 100) {
						newPrice =
							((100 - discountValue) * originalValue) / 100;
					}
				}

				if (!isFalsyExceptZero(newPrice)) {
					newPrice = Number(newPrice).toFixedNumber();

					if (
						isOneOff(discount.cspmb__Charge_Type__c) &&
						chargeType === ONE_OFF
					) {
						discountSet.add(newPrice);
					} else if (
						isRecurring(discount.cspmb__Charge_Type__c) &&
						chargeType === RECURRING
					) {
						discountSet.add(newPrice);
					}
				}
			});
		});
	}

	return discountSet;
};

const checkAndRestrictMinMax = (
	negotiatedPrice,
	manualNegotiatedPrice,
	originalPrice,
	FACSettings
) => {
	if (FACSettings.input_minmax_restriction) {
		if (negotiatedPrice < 0 || negotiatedPrice > originalPrice) {
			negotiatedPrice = manualNegotiatedPrice;
		}
	}

	return negotiatedPrice;
};
