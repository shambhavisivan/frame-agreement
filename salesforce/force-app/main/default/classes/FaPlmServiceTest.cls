@isTest
public class FaPlmServiceTest {

	private static final String DEFAULT_PRICING_RULE_GROUP_NAME = 'Default Pricing Rule Group';
	private static final String DEFAULT_PRICING_RULE_GROUP_CODE = 'Group-001';
	private static final String DEFAULT_PRICING_RULE = 'Default Pricing rule';
	private static final String DEFAULT_PRICING_RULE_CODE = 'Def-001';
	private static final String SAMPLE_CP = 'cp_1';

	@testSetup
	public static void setupPLMPricingRule() {
		cspmb__Pricing_Rule_Group__c defaultPriceRuleGroup = new cspmb__Pricing_Rule_Group__c(
			name = DEFAULT_PRICING_RULE_GROUP_NAME,
			cspmb__pricing_rule_group_code__c = DEFAULT_PRICING_RULE_GROUP_CODE
		);
		insert defaultPriceRuleGroup;
		cspmb__Pricing_Rule__c defaultPriceRule = new cspmb__Pricing_Rule__c(
			name = DEFAULT_PRICING_RULE,
			cspmb__pricing_rule_code__c = DEFAULT_PRICING_RULE_CODE
		);
		insert defaultPriceRule;

		cspmb__Pricing_Rule_Group_Rule_Association__c priceRuleGroupAsso = new cspmb__Pricing_Rule_Group_Rule_Association__c(
			cspmb__pricing_rule__c = defaultPriceRule.id, cspmb__pricing_rule_group__c = defaultPriceRuleGroup.id
		);
		insert priceRuleGroupAsso;

	}

	static List<cspmb__Price_Item__c> buildOfferRequest() {
		cspmb__Price_Item__c cp_1 = new cspmb__Price_Item__c(
			name = SAMPLE_CP,
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_1',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		insert cp_1;

		cspmb__Price_Item__c offerRequest = new cspmb__Price_Item__c(
			cspmb__master_price_item__c = cp_1.Id,
			cspmb__offer_code__c = 'newOffers'
		);

		List<cspmb__Price_Item__c> offerRequestList = new List<cspmb__Price_Item__c>();
		offerRequestList.add(offerRequest);

		return offerRequestList;
	}

	@isTest
	public static void testPLMCatalogueCreation() {
		cspmb__Catalogue__c catalogue = new cspmb__Catalogue__c(
			cspmb__description__c = 'test-catalogue'
		);

		Test.startTest();
		cspmb__Catalogue__c newCatalogue = FaPlmService.createCatalogue(catalogue);
		Test.stopTest();

		System.assertNotEquals(newCatalogue.id, null);
		System.assertEquals(newCatalogue.cspmb__description__c, catalogue.cspmb__description__c);
	}

	@isTest
	public static void testPLMExisingCategoryCatalogueAssociation() {
		cspmb__Catalogue__c catalogue = new cspmb__Catalogue__c(
			cspmb__description__c = 'test-catalogue'
		);
		catalogue = FaPlmService.createCatalogue(catalogue);

		List<cspmb__Product_Category__c> existingCategoryList = new List<cspmb__Product_Category__c>();

		cspmb__Product_Category__c category_1 = new cspmb__Product_Category__c(
			name = 'category_1',
			cspmb__description__c = 'testDescription',
			cspmb__subcategory_sequence__c = 0
		);
		insert category_1;
		existingCategoryList.add(category_1);

		cspmb__Product_Category__c category_2 = new cspmb__Product_Category__c(
			name = 'category_2',
			cspmb__description__c = 'testDescription',
			cspmb__subcategory_sequence__c = 0
		);
		insert category_2;
		existingCategoryList.add(category_2);

		//check existing category gets association
		Test.startTest();
		List<cspmb__Product_Category__c> categoryResponse = FaPlmService.associateCategoryCatalogue(
			existingCategoryList, catalogue.id
		);
		Test.stopTest();

		List<cspmb__Catalogue_Category_Association__c> catalogueCategory = [
			select id
			from cspmb__Catalogue_Category_Association__c
			where cspmb__catalogue__c = :catalogue.id
		];

		System.assertEquals(categoryResponse.size(), existingCategoryList.size());
		System.assertEquals(catalogueCategory.size(), existingCategoryList.size());
	}

	@isTest
	public static void testPLMNewCategoryCatalogueAssociation() {
		cspmb__Catalogue__c catalogue = new cspmb__Catalogue__c(
			cspmb__description__c = 'test-catalogue'
		);
		catalogue = FaPlmService.createCatalogue(catalogue);

		List<cspmb__Product_Category__c> existingCategoryList = new List<cspmb__Product_Category__c>();

		cspmb__Product_Category__c category_1 = new cspmb__Product_Category__c(
			name = 'category_1',
			cspmb__description__c = 'testDescription',
			cspmb__subcategory_sequence__c = 0
		);
		insert category_1;
		existingCategoryList.add(category_1);

		cspmb__Product_Category__c category_2 = new cspmb__Product_Category__c(
			name = 'category_2',
			cspmb__description__c = 'testDescription',
			cspmb__subcategory_sequence__c = 0
		);
		existingCategoryList.add(category_2);

		//check existing category gets association
		Test.startTest();
		List<cspmb__Product_Category__c> categoryResponse = FaPlmService.associateCategoryCatalogue(
			existingCategoryList, catalogue.id
		);
		Test.stopTest();

		List<cspmb__Catalogue_Category_Association__c> catalogueCategory = [
			select id
			from cspmb__Catalogue_Category_Association__c
			where cspmb__catalogue__c = :catalogue.id
		];

		System.assertEquals(categoryResponse.size(), existingCategoryList.size());
		System.assertEquals(catalogueCategory.size(), existingCategoryList.size());

	}

	@isTest
	public static void testPLMOfferCreation() {
		cspmb__Price_Item__c cp_1 = new cspmb__Price_Item__c(
			name = SAMPLE_CP,
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_1',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		insert cp_1;

		cspmb__Price_Item__c offerRequest = new cspmb__Price_Item__c(
			cspmb__master_price_item__c = cp_1.Id,
			cspmb__offer_code__c = 'newOffers'
		);

		List<cspmb__Price_Item__c> offerRequestList = new List<cspmb__Price_Item__c>{ offerRequest };

		Test.startTest();
		List<cspmb__Price_Item__c> newOffers = FaPlmService.createOffer(offerRequestList);
		Test.stopTest();

		System.assertEquals(newOffers.size(), offerRequestList.size());
		System.assertEquals(newOffers.get(0).cspmb__Master_Price_item__c, cp_1.Id);

	}

	@isTest
	public static void testPLMOfferCategoryAssociation() {
		List<cspmb__Price_Item__c> offerRequestList = buildOfferRequest();
		List<cspmb__Price_Item__c> newOffers = FaPlmService.createOffer(offerRequestList);
		cspmb__Catalogue__c catalogue = new cspmb__Catalogue__c(
			cspmb__description__c = 'test-catalogue'
		);
		catalogue = FaPlmService.createCatalogue(catalogue);
		cspmb__Product_Category__c category_1 = new cspmb__Product_Category__c(
			name = 'testName',
			cspmb__description__c = 'testDescription',
			cspmb__subcategory_sequence__c = 0
		);
		List<cspmb__Product_Category__c> categoryResponse = FaPlmService.associateCategoryCatalogue(
			new List<cspmb__Product_Category__c>{ category_1 }, catalogue.id
		);

		Test.startTest();
		List<cspmb__Commercial_Product_Category_Association__c> assocation = FaPlmService.associateOfferCategory(
			newOffers.get(0).id, categoryResponse.get(0).id
		);
		Test.stopTest();

		System.assertEquals(assocation.get(0).cspmb__commercial_product__c, newOffers.get(0).id);
		System.assertEquals(assocation.get(0).cspmb__Product_Category__c, categoryResponse.get(0).id);

	}

	@isTest
	public static void testPLMOfferDeletion() {
		List<cspmb__Price_Item__c> offerRequestList = buildOfferRequest();
		List<cspmb__Price_Item__c> newOffers = FaPlmService.createOffer(offerRequestList);
		Id createdOfferId = newOffers.get(0).id;

		Test.startTest();
		List<cspmb__Price_Item__c> deletedOffers = FaPlmService.deleteOffers(new List<Id>{ createdOfferId });
		Test.stopTest();

		List<cspmb__Price_Item__c> offerQuery = [
			select id from cspmb__Price_Item__c
			where id = :createdOfferId
		];

		System.assertEquals(deletedOffers.get(0).id, createdOfferId);
		System.assertEquals(offerQuery.size(), 0);

	}

	@isTest
	public static void testPLMClientException() {
		List<cspmb__Price_Item__c> offerRequestList = buildOfferRequest();
		offerRequestList.get(0).cspmb__offer_code__c = null;
		String errorMsg = '';

		Test.startTest();
		try{
			FaPlmService.createOffer(offerRequestList);
		} catch (CustomExceptions.PLMClientException e) {
			errorMsg = e.getMessage();
		}
		Test.stopTest();

		System.assertNotEquals(errorMsg, null);
	}

}
