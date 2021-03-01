export const PRODUCTS_IN_CATALOGUE = `query Products($catalogueId: ID!) {
	productsInCatalogue(catalogueId: $catalogueId) {
		data {
			id
			name
			role
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
			role
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
