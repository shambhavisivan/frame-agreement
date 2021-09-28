export const transformProductData = (products) => {
    let productsData = products.reduce((mapAccumulator, product) => {
		const addons =
			product._addons?.reduce((addonMapAccumulator, addon) => {
				addonMapAccumulator.set(addon.Id, addon);
				return addonMapAccumulator;
			}, new Map()) || new Map();
		product._addons = addons;
		const rateCards =
			product._rateCards?.reduce((rateCardMapAccumulator, rateCard) => {
				const rateCardLines =
					rateCard.rateCardLines?.reduce(
						(rateCardLineMapAccumulator, rateCardLine) => {
							rateCardLineMapAccumulator.set(
								rateCardLine.Id,
								rateCardLine
							);
							return rateCardLineMapAccumulator;
						},
						new Map()
					) || new Map();
				rateCard.rateCardLines = rateCardLines;
				rateCardMapAccumulator.set(rateCard.Id, rateCard);
				return rateCardMapAccumulator;
			}, new Map()) || new Map();
		product._rateCards = rateCards;
		const charges =
			product._charges?.reduce((chargeMapAccumulator, charge) => {
				chargeMapAccumulator.set(charge.Id, charge);
				return chargeMapAccumulator;
			}, new Map()) || new Map();
		product._charges = charges;
		mapAccumulator.set(product.Id, product);

		return mapAccumulator;
	}, new Map());

    return productsData;
}