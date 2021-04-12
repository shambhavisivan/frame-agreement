import { getDefaultCatalogueId } from "../api";
import { invokeGraphQLService } from "../utils/dispatcher-service";
import { PRODUCTS_IN_CATALOGUE, CATEGORIES_IN_CATALOGUE, PRODUCTS_IN_CATEGORY, PRODUCT_METADATA_BY_IDS } from "./graphl-query";

const TYPE_CP = "CommercialProduct";
const ROLE_BASIC = "Basic";
const ROLE_OFFER = "Offer";

export const queryCpIdsInCatalogue = async () => {
	const catalogueId = await getDefaultCatalogueId();
	const variables = {
		catalogueId: catalogueId,
	};

	try {
		const response = await invokeGraphQLService(
			PRODUCTS_IN_CATALOGUE,
			variables
		);
		if (!response.isSuccess) {
			throw new Error(response.error);
		} else {
			return response.data.productsInCatalogue.data
				.filter(
					(cp) =>
						cp.role && cp.role === ROLE_BASIC && cp.type === TYPE_CP
				)
				.map((cp) => cp.id);
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

export const queryCategoriesInCatalogue = async (catalogueId = null) => {
	if (!catalogueId) {
		catalogueId = await getDefaultCatalogueId();
	}
	const variables = {
		catalogueId: catalogueId,
	};

	try {
		const response = await invokeGraphQLService(
			CATEGORIES_IN_CATALOGUE,
			variables
		);

		if (!response.isSuccess) {
			throw new Error(response.error);
		} else {
			return response.data.categories.data;
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

export const queryProductsInCategory = async (categoryId) => {
	if (!categoryId) {
		throw new Error(
			"category Id cannot be null for queryProductsInCategory"
		);
	}
	const variables = {
		categoryId: categoryId,
	};

	try {
		const response = await invokeGraphQLService(
			PRODUCTS_IN_CATEGORY,
			variables
		);

		if (!response.isSuccess) {
			throw new Error(response.error);
		} else {
			return response.data.productsInCategory.data.filter(
				(cp) => cp.role && cp.role === ROLE_BASIC && cp.type === TYPE_CP
			);
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

export const queryOffersInCategory = async (categoryId) => {
	if (!categoryId) {
		throw new Error(
			"category Id cannot be null for queryOffersInCategory"
		);
	}
	const variables = {
		categoryId: categoryId,
	};

	try {
		const response = await invokeGraphQLService(
			PRODUCTS_IN_CATEGORY,
			variables
		);

		if (!response.isSuccess) {
			throw new Error(response.error);
		} else {
			return response.data.productsInCategory.data.filter(
				(cp) => cp.role && cp.role === ROLE_OFFER && cp.type === TYPE_CP
			);
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

export const queryOfferIdsInCatalogue = async () => {
	const catalogueId = await getDefaultCatalogueId();
	const variables = {
		catalogueId: catalogueId,
	};

	try {
		const response = await invokeGraphQLService(
			PRODUCTS_IN_CATALOGUE,
			variables
		);
		if (!response.isSuccess) {
			throw new Error(response.error);
		} else {
			return response.data.productsInCatalogue.data
				.filter(
					(cp) =>
						cp.role && cp.role === ROLE_OFFER && cp.type === TYPE_CP
				)
				.map((cp) => cp.id);
		}
	} catch (error) {
		throw new Error(error.message);
	}
};


export const queryCpMetadataByIds = async productIds => {
	const variables = {
		productIds
	};

	try {
		const response = await invokeGraphQLService(
			PRODUCT_METADATA_BY_IDS,
			variables
		);

		if (!response.isSuccess) {
			throw new Error(response.error);
		} else {
			return response.data.productsByIds;
		}
	} catch(error) {
		console.error('Error fetching metadata', error);
	}
}