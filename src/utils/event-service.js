export const buildBulkNegotiationEventData = (
	negotiatedProducts,
	productsInAttachment,
	products,
	productType
) => {
	const negotiatedProductMap = negotiatedProducts.reduce(
		(mapAccumulator, negotiatedProduct) => {
			if (!mapAccumulator.has(negotiatedProduct.priceItemId)) {
				mapAccumulator.set(negotiatedProduct.priceItemId, new Array());
			}
			let negotiationList = mapAccumulator.get(
				negotiatedProduct.priceItemId
			);
			negotiationList.push(negotiatedProduct);

			return mapAccumulator;
		},
		new Map()
	);

	let eventHookData = {
		type: productType,
	};

	Array.from(negotiatedProductMap.keys()).forEach((priceItemId) => {
		let negotiationList = negotiatedProductMap.get(priceItemId);
		negotiationList.forEach((negotiation) => {
			const product = products.get(negotiation.priceItemId);
			if (negotiation.cpAddon) {
				Object.keys(negotiation.value).forEach((chargeType) => {
					eventHookData = frameHookAddonData(
						eventHookData,
						productsInAttachment,
						product,
						product._addons.get(negotiation.cpAddon),
						chargeType,
						negotiation.value[chargeType]
					);
				});
			} else if (negotiation.charge) {
				Object.keys(negotiation.value).forEach((chargeType) => {
					eventHookData = frameHookChargesData(
						eventHookData,
						productsInAttachment,
						product,
						product._charges.get(negotiation.charge),
						negotiation.value[chargeType]
					);
				});
			} else if (negotiation.rateCard) {
				eventHookData = frameHookRateCardsData(
					eventHookData,
					productsInAttachment,
					product,
					product._rateCards.get(negotiation.rateCard),
					product._rateCards
						.get(negotiation.rateCard)
						.rateCardLines.get(negotiation.rateCardLine),
					negotiation.value
				);
			} else {
				Object.keys(negotiation.value).forEach((chargeType) => {
					eventHookData = frameHookProductChargesData(
						eventHookData,
						productsInAttachment,
						product,
						chargeType,
						negotiation.value[chargeType]
					);
				});
			}
		});
	});

	return eventHookData;
};

export const frameHookAddonData = (
	eventHookData,
	updatedAttachment,
	cp,
	addon,
	chargeType,
	negotiatedValue
) => {
	const prevNegotiation = updatedAttachment[cp.Id]._addons || {};
	eventHookData[cp.Id] = {
		...eventHookData[cp.Id],
		addons: {
			...(eventHookData[cp.Id]?.addons || {}),
			previousNegotiations: {
				...(eventHookData[cp.Id]?.addons?.previousNegotiations || {}),
				[addon.Id]: {
					...(eventHookData[cp.Id]?.addons?.previousNegotiations[
						addon.Id
					] || {}),
					[chargeType]: prevNegotiation[addon.Id][chargeType],
				},
			},
			currentNegotiations: {
				...(eventHookData[cp.Id]?.addons?.currentNegotiations || {}),
				[addon.Id]: {
					...(eventHookData[cp.Id]?.addons?.currentNegotiations[
						addon.Id
					] || {}),
					[chargeType]: negotiatedValue,
				},
			},
		},
	};

	return eventHookData;
};

export const frameHookChargesData = (
	eventHookData,
	updatedAttachment,
	cp,
	charge,
	negotiatedValue
) => {
	const prevNegotiation = updatedAttachment[cp.Id]._charges || {};
	eventHookData[cp.Id] = {
		...eventHookData[cp.Id],
		charges: {
			...(eventHookData[cp.Id]?.charges || {}),
			previousNegotiations: {
				...(eventHookData[cp.Id]?.charges?.previousNegotiations || {}),
				[charge.Id]: {
					...(eventHookData[cp.Id]?.charges?.previousNegotiations[
						charge.Id
					] || {}),
					[charge._type]: prevNegotiation[charge.Id][charge._type],
				},
			},
			currentNegotiations: {
				...(eventHookData[cp.Id]?.charges?.currentNegotiations || {}),
				[charge.Id]: {
					...(eventHookData[cp.Id]?.charges?.currentNegotiations[
						charge.Id
					] || {}),
					[charge._type]: negotiatedValue,
				},
			},
		},
	};

	return eventHookData;
};

export const frameHookProductChargesData = (
	eventHookData,
	updatedAttachment,
	cp,
	chargeType,
	negotiatedValue
) => {
	const prevNegotiation = updatedAttachment[cp.Id]._product || {};
	eventHookData[cp.Id] = {
		...eventHookData[cp.Id],
		product: {
			...(eventHookData[cp.Id]?.product || {}),
			previousNegotiations: {
				...(eventHookData[cp.Id]?.product?.previousNegotiations || {}),
				[chargeType]: prevNegotiation[chargeType],
			},
			currentNegotiations: {
				...(eventHookData[cp.Id]?.product?.currentNegotiations || {}),
				[chargeType]: negotiatedValue,
			},
		},
	};

	return eventHookData;
};

export const frameHookRateCardsData = (
	eventHookData,
	updatedAttachment,
	cp,
	rc,
	rcl,
	negotiatedValue
) => {
	const prevNegotiation = updatedAttachment[cp.Id]._rateCards || {};
	eventHookData[cp.Id] = {
		...eventHookData[cp.Id],
		rateCards: {
			...(eventHookData[cp.Id]?.rateCards || {}),
			previousNegotiations: {
				...(eventHookData[cp.Id]?.rateCards?.previousNegotiations ||
					{}),
				[rc.Id]: {
					...(eventHookData[cp.Id]?.rateCards?.previousNegotiations[
						rc.Id
					] || {}),
					[rcl.Id]: prevNegotiation[rc.Id][rcl.Id],
				},
			},
			currentNegotiations: {
				...(eventHookData[cp.Id]?.rateCards?.currentNegotiations || {}),
				[rc.Id]: {
					...(eventHookData[cp.Id]?.rateCards?.currentNegotiations[
						rc.Id
					] || {}),
					[rcl.Id]: negotiatedValue,
				},
			},
		},
	};

	return eventHookData;
};
