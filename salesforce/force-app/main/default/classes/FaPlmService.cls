public class FaPlmService {

	public static cspmb__Catalogue__c createCatalogue(cspmb__Catalogue__c catalogue) {
		csplm.ResponseWrapper response = csplm.CatalogueService.upsertRecords(
			new List<cspmb__Catalogue__c>{ catalogue }
		);
		validateClientResponse(response);
		cspmb__Catalogue__c catalogueResponse = (cspmb__Catalogue__c)(response.result.get(0).record);

		return catalogueResponse;
	}

	public static List<cspmb__Product_Category__c> associateCategoryCatalogue(
		List<cspmb__Product_Category__c> categories,
		Id catalogueId
	) {
		List<csplm.CategoryRequest> categoryRequestList = new List<csplm.CategoryRequest>();

		for (cspmb__Product_Category__c category : categories) {
			csplm.CategoryRequest categoryRequest = new csplm.CategoryRequest();
			categoryRequest.catalogueId = catalogueId;
			categoryRequest.category = category;
			categoryRequestList.add(categoryRequest);
		}
		csplm.ResponseWrapper response = csplm.ProductCategoryService.upsertRootCategories(categoryRequestList);
		validateClientResponse(response);
		List<cspmb__Product_Category__c> createdCategories = new List<cspmb__Product_Category__c>();

		for (csplm.RecordWrapper recordResponse : response.result) {
			createdCategories.add((cspmb__Product_Category__c) recordResponse.record);
		}

		return createdCategories;
	}

	public static List<cspmb__Price_Item__c> createOffer(List<cspmb__Price_Item__c> offerRequestList) {
		csplm.ResponseWrapper response = csplm.OfferService.upsertRecords(offerRequestList);
		validateClientResponse(response);
		List<cspmb__Price_Item__c> createdOffers = new List<cspmb__Price_Item__c>();

		for (csplm.RecordWrapper recordResponse : response.result) {
			createdOffers.add((cspmb__Price_Item__c) recordResponse.record);
		}

		return createdOffers;
	}

	public static List<cspmb__Commercial_Product_Category_Association__c> associateOfferCategory(
		Id offerId,
		Id categoryId
	) {
		cspmb__Commercial_Product_Category_Association__c offerCategorAssociation =
			new cspmb__Commercial_Product_Category_Association__c(
				cspmb__commercial_product__c = offerId,
				cspmb__product_category__c = categoryId,
				cspmb__sequence__c = 0
			);
		csplm.ResponseWrapper response = csplm.CategoryCpAssociationService.upsertRecords(
			new List<cspmb__Commercial_Product_Category_Association__c>{ offerCategorAssociation }
		);
		validateClientResponse(response);
		List<cspmb__Commercial_Product_Category_Association__c> offerCategorAssociationResponse =
			new List<cspmb__Commercial_Product_Category_Association__c>();

		for (csplm.RecordWrapper recordResponse : response.result) {
			offerCategorAssociationResponse.add(
				(cspmb__Commercial_Product_Category_Association__c) recordResponse.record
			);
		}

		return offerCategorAssociationResponse;
	}

	public static List<cspmb__Price_Item__c> deleteOffers(List<Id> faOfferIdList) {
		csplm.ResponseWrapper response = csplm.OfferService.deleteRecords(faOfferIdList);
		validateClientResponse(response);
		List<cspmb__Price_Item__c> deletedFaOffers = new List<cspmb__Price_Item__c>();

		for (csplm.RecordWrapper deletedOfferResponse : response.result) {
			deletedFaOffers.add((cspmb__Price_Item__c) deletedOfferResponse.record);
		}

		return deletedFaOffers;
	}

	private static void validateClientResponse(csplm.ResponseWrapper response) {

		if (!response.success) {
			String errorMessage = '';
			for (csplm.Message error : response.errorMessages) {
				errorMessage += '\n' + error.key + ' - ' +
					error.defaultMessage + ' - params - ' + string.join(error.params,',');
			}
			throw new CustomExceptions.PlmClientException(errorMessage);
		}
	}
}
