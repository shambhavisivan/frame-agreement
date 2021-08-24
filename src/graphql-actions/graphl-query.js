export const PRODUCTS_IN_CATALOGUE = `query Products($catalogueId: ID!) {
	productsInCatalogue(catalogueId: $catalogueId) {
		data {
			id
			name
			role(version: "2-0-0")
			type
			commercialProductCode
		}
		hasMore
		nextPage {
			after
			limit
		}
	}
}`;

export const CATEGORIES_IN_CATALOGUE = `query categories($catalogueId: ID!) {
	categories(catalogueId: $catalogueId) {
		data {
			id
			name
			description
			subcategorySequence
			parentCategory {
				id
			}
		}
		hasMore
		nextPage {
			after
			limit
		}
	}
}`;

export const PRODUCTS_IN_CATEGORY = `
query Products($categoryId: ID!) {
	productsInCategory(categoryId: $categoryId) {
		data {
			id
			name
			role(version: "2-0-0")
			type
			sequence
			primary
		}
		hasMore
		nextPage {
			after
			limit
		}
	}
}
`;

export const PRODUCT_BY_IDENTIFIERS = `
query PRODUCT_BY_IDENTIFIERS($productIdentifiers: [ProductIdentifier]!) {
	getProductsByIdentifiers(productIdentifiers: $productIdentifiers ) {
		id
		name
		role(version: "2-0-0")
		type
		commercialProductCode
		commercialProductMetadata {
			attributeMetadata {
				version
				attributes {
					name
					values {
						value
					}
				}
			}
		}
		availableChildProducts {
			...addonFields
			group {
				name
				members {
				...addonFields
				}
			}
		}
	}
}

fragment addonFields on AvailableProduct {
	product {
		id
		name
		effectiveStartDate
		effectiveEndDate
		pricing(prgs: []) {
			listOneOffPrice
			listRecurringPrice
		}
		customFields {
			key
			value
		}
	}
	externalIds {
		key
		value
	}
}

`;
