import { getDefaultCatalogueId } from "../api";
import { invokeGraphQLService } from "../utils/dispatcher-service";
import { PRODUCTS_IN_CATALOGUE } from "./graphl-query";

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
