import { getDefaultCatalogueId } from "../api";
import { invokeGraphQLService } from "../utils/dispatcher-service";
import {
	CATEGORIES_IN_CATALOGUE,
	PRODUCTS_IN_CATALOGUE,
	PRODUCTS_IN_CATEGORY,
} from "./graphl-query";

const ROLE_CP = "CommercialProduct";

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
			return response.data.productsInCatalogue.data.map((cp) => {
				if (cp.role && cp.role === ROLE_CP) {
					return cp.id;
				}
			});
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
			return response.data.productsInCategory.data;
		}
	} catch (error) {
		throw new Error(error.message);
	}
};
