import { getDefaultCatalogueId } from "../api";
import { PRODUCT_TYPE_CP, ROLE_BASIC, ROLE_OFFER } from "../utils/constants";
import { invokeGraphQLService } from "../utils/dispatcher-service";
import {
	PRODUCTS_IN_CATALOGUE,
	CATEGORIES_IN_CATALOGUE,
	PRODUCTS_IN_CATEGORY,
	PRODUCT_BY_IDENTIFIERS,
} from "./graphl-query";

export const queryCpsInCatalogue = async () => {
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
						cp.role && cp.role === ROLE_BASIC && cp.type === PRODUCT_TYPE_CP
				);
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
				(cp) => cp.role && cp.role === ROLE_BASIC && cp.type === PRODUCT_TYPE_CP
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
				(cp) => cp.role && cp.role === ROLE_OFFER && cp.type === PRODUCT_TYPE_CP
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
						cp.role && cp.role === ROLE_OFFER && cp.type === PRODUCT_TYPE_CP
				)
				.map((cp) => cp.id);
		}
	} catch (error) {
		throw new Error(error.message);
	}
};


export const queryCpDataByIds = productIds => {
	let productIdentifiers = [];
	productIds.forEach(productId => {
		productIdentifiers.push({
			productId
		});
	});

	return queryCpByIdentifiers(productIdentifiers);
}

export const queryCpDataByOfferCode = commercialProductOfferCodes => {
	let productIdentifiers = [];
	commercialProductOfferCodes.forEach(productCode => {
		productIdentifiers.push({
			productCode
		});
	});

	return queryCpByIdentifiers(productIdentifiers);
}

export const queryCpDataByProductCode = commercialProductCodes => {
	let productIdentifiers = [];
	commercialProductCodes.forEach(productCode => {
		productIdentifiers.push({
			productCode
		});
	});

	return queryCpByIdentifiers(productIdentifiers);
}

export const queryCpByIdentifiers = async (productIdentifiers) => {
	const variables = {
		productIdentifiers
	};

	try {
		const response = await invokeGraphQLService(
			PRODUCT_BY_IDENTIFIERS,
			variables
		);

		if (!response.isSuccess) {
			throw new Error(response.error);
		} else {
			return response.data.getProductsByIdentifiers;
		}
	} catch(error) {
		throw new Error(error.message);
	}
}