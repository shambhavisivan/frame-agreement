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
