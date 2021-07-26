@IsTest
private class FrameRateManagerControllerTest {
	public static final String FAC_ATTACHMENT_NAME = 'FrameAgreementAttachment';
	public static final String FAC_ATTACHMENT_DESC = 'Added products and negotiated data against Frame Agreement';
	public static final Integer ITEMS_PER_PAGE = 20;
	public static final List<String> FA_FIELDS = new List<String>{
		'Id', 'Name', 'csconta__Account__r.Name', 'csconta__Agreement_Name__c', 'csconta__Pricing_Rule_Group__c', 'csconta__Status__c', 'csconta__Valid_From__c', 'csconta__Valid_To__c'
	};

	public static final String SAMPLE_CP_NAME = 'cp_1';

	public static String generateRandomString(Integer len) {
		final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
		String randStr = '';
		while (randStr.length() < len) {
			Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
			randStr += chars.substring(idx, idx + 1);
		}
		return randStr;
	}

	static String setupPricingModel() {
		FrameRateManagerControllerTest.setupSettings();
		Account test_account = new Account(Name = 'TestAcc');
		insert test_account;

		Test.setCurrentPageReference(new PageReference('Page.FAMEditor'));
		System.currentPageReference().getParameters().put('account', test_account.Id);
		// commercial products
		cspmb__Price_Item__c cp_1 = new cspmb__Price_Item__c(
			Name = SAMPLE_CP_NAME,
			cspmb__One_Off_Charge__c = 10.00,
			cspmb__Is_Active__c = true,
			cspmb__Recurring_Charge__c = 15 - 00,
			cspmb__Price_Item_Code__c = 'cp_1',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_2 = new cspmb__Price_Item__c(
			Name = 'cp_2',
			cspmb__One_Off_Charge__c = 10.00,
			cspmb__Is_Active__c = true,
			cspmb__Recurring_Charge__c = 15 - 00,
			cspmb__Price_Item_Code__c = 'cp_2',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);

		cspmb__Price_Item__c cp_addon_inv = new cspmb__Price_Item__c(
			Name = 'cp_addon_inv',
			cspmb__Is_Active__c = true,
			cspmb__Price_Item_Code__c = 'cp_addon_inv',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_addon_assoc_inv = new cspmb__Price_Item__c(
			Name = 'cp_addon_assoc_inv',
			cspmb__Is_Active__c = true,
			cspmb__Price_Item_Code__c = 'cp_addon_assoc_inv',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);

		Date invalidEndDate = Date.newInstance(1992, 3, 14);
		cspmb__Price_Item__c cp_3 = new cspmb__Price_Item__c(
			Name = 'cp_3',
			cspmb__One_Off_Charge__c = 10.00,
			cspmb__Is_Active__c = true,
			cspmb__Recurring_Charge__c = 15 - 00,
			cspmb__Effective_End_Date__c = invalidEndDate,
			cspmb__Price_Item_Code__c = 'cp_3',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);


		insert cp_1;
		insert cp_2;
		insert cp_3;
		insert cp_addon_inv;
		insert cp_addon_assoc_inv;

		// allowances
		cspmb__Usage_Type__c ut_main = new cspmb__Usage_Type__c(
			Name = 'ut_main', cspmb__unit_of_measure__c = 'Minute', cspmb__type__c = 'Group'
		);

		cspmb__Usage_Type__c ut_1 = new cspmb__Usage_Type__c(
			Name = 'ut_1', cspmb__unit_of_measure__c = 'Minute', cspmb__type__c = 'Single'
		);
		cspmb__Usage_Type__c ut_2 = new cspmb__Usage_Type__c(
			Name = 'ut_2', cspmb__unit_of_measure__c = 'Minute', cspmb__type__c = 'Single'
		);

		insert ut_main;
		insert ut_1;
		insert ut_2;

		cspmb__Usage_Type_Grouping__c ut_group_1 = new cspmb__Usage_Type_Grouping__c(
			cspmb__parent_usage_type__c = ut_main.Id, cspmb__child_usage_type__c = ut_1.Id
		);
		cspmb__Usage_Type_Grouping__c ut_group_2 = new cspmb__Usage_Type_Grouping__c(
			cspmb__parent_usage_type__c = ut_main.Id, cspmb__child_usage_type__c = ut_2.Id
		);

		insert ut_group_1;
		insert ut_group_2;

		cspmb__Allowance__c al_1 = new cspmb__Allowance__c(Name = 'al_1', cspmb__usage_type__c = ut_main.Id);
		cspmb__Allowance__c al_2 = new cspmb__Allowance__c(Name = 'al_2', cspmb__usage_type__c = ut_main.Id);

		insert al_1;
		insert al_2;

		// pricing element and types
		cspmb__Pricing_Element_Type__c pricingElementType_1 = new cspmb__Pricing_Element_Type__c(
			cspmb__label__c = 'One-off charge', cspmb__type__c = 'One-off charge'
		);
		cspmb__Pricing_Element_Type__c pricingElementType_2 = new cspmb__Pricing_Element_Type__c(
			cspmb__type__c = 'Recurring Charge'
		);
		insert pricingElementType_1;
		insert pricingElementType_2;


		cspmb__Pricing_Element__c pricingElement_1 = new cspmb__Pricing_Element__c(
			cspmb__pricing_element_type__c = pricingElementType_1.Id, cspmb__commercial_product__c = cp_1.Id
		);
		cspmb__Pricing_Element__c pricingElement_2 = new cspmb__Pricing_Element__c(
			cspmb__pricing_element_type__c = pricingElementType_2.Id, cspmb__commercial_product__c = cp_1.Id
		);
		cspmb__Pricing_Element__c pricingElement_invalid = new cspmb__Pricing_Element__c(
			cspmb__pricing_element_type__c = pricingElementType_2.Id, cspmb__commercial_product__c = cp_1.Id, cspmb__effective_end_date__c = invalidEndDate
		);
		insert pricingElement_1;
		insert pricingElement_2;
		insert pricingElement_invalid;

		cspmb__pricing_rule__c pr_1 = new cspmb__pricing_rule__c(cspmb__description__c = 'Test.');
		insert pr_1;

		cspmb__Price_Item_Pricing_Rule_Association__c pipra_1 = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.Id, cspmb__price_item__c = cp_1.Id,
			cspmb__pricing_element__c = pricingElement_1.Id
		);
		cspmb__Price_Item_Pricing_Rule_Association__c pipra_2 = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.Id, cspmb__price_item__c = cp_1.Id,
			cspmb__pricing_element__c = pricingElement_2.Id
		);
		cspmb__Price_Item_Pricing_Rule_Association__c pipra_3 = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.Id, cspmb__price_item__c = cp_1.Id,
			cspmb__pricing_element__c = pricingElement_invalid.Id
		);
		insert pipra_1;
		insert pipra_2;
		insert pipra_3;

		cspmb__Pricing_Rule_Group__c prg_1 = new cspmb__Pricing_Rule_Group__c(
			cspmb__description__c = 'Testing.', cspmb__pricing_rule_group_code__c = generateRandomString(10)
		);
		insert prg_1;

		cspmb__Pricing_Rule_Group_Rule_Association__c prgra_1 = new cspmb__Pricing_Rule_Group_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.Id, cspmb__Pricing_Rule_Group__c = prg_1.Id
		);
		insert prgra_1;

		csutil__JSON_Data__c standardPricebook = new csutil__JSON_Data__c(
			Name = 'FA-StandardPricebook', csutil__value__c = prg_1.Id
		);
		insert standardPricebook;

		cspmb__Authorization_Level__c authLevel = new cspmb__Authorization_Level__c();
		insert authLevel;
		cspmb__Discount_Threshold__c discTres = new cspmb__Discount_Threshold__c(
			Name = 'testLevel', cspmb__Discount_Type__c = 'Percentage',
			cspmb__Discount_Threshold__c = 10.00, cspmb__Authorization_Level__c = authLevel.Id
		);
		insert discTres;


		cspmb__Discount_Level__c discLevel = new cspmb__Discount_Level__c(Name = 'Test', cspmb__Charge_Type__c = 'RC', cspmb__Discount_Values__c = '5,10,15');
		insert discLevel;

		cspmb__Discount_Association__c discAssoc = new cspmb__Discount_Association__c(cspmb__Price_Item__c = cp_2.Id, cspmb__Discount_Level__c = discLevel.Id);
		insert discAssoc;

		// RC & RCL
		cspmb__Rate_Card__c rc = new cspmb__Rate_Card__c(cspmb__Is_Active__c = true);
		insert rc;
		cspmb__Rate_Card_Line__c rcl = new cspmb__Rate_Card_Line__c(
			cspmb__rate_card__c = rc.id,
			name = 'testrcl',
			cspmb__is_active__c = true,
			cspmb__rate_value__c = 124.99,
			cspmb__rate_card_line_unit__c = 'sample unit'
		);
		insert rcl;
		cspmb__Rate_Card_Line__c rcl2 = new cspmb__Rate_Card_Line__c(
			cspmb__rate_card__c = rc.id,
			name = 'testrcl2',
			cspmb__is_active__c = true,
			cspmb__rate_value__c = 124.99,
			cspmb__rate_card_line_unit__c = 'sample unit',
			cspmb__effective_end_date__c = Date.today().addDays(5)
		);
		insert rcl2;
		cspmb__Rate_Card_Line__c rcl3 = new cspmb__Rate_Card_Line__c(
			cspmb__rate_card__c = rc.id,
			name = 'testrcl3',
			cspmb__is_active__c = false,
			cspmb__rate_value__c = 124.99,
			cspmb__rate_card_line_unit__c = 'sample unit'
		);
		insert rcl3;
		cspmb__Rate_Card_Line__c rcl4 = new cspmb__Rate_Card_Line__c(
			cspmb__rate_card__c = rc.id,
			name = 'testrcl2',
			cspmb__is_active__c = true,
			cspmb__rate_value__c = 124.99,
			cspmb__rate_card_line_unit__c = 'sample unit',
			cspmb__effective_start_date__c = Date.today().addDays(5)
		);
		insert rcl4;
		cspmb__Rate_Card_Line__c rcl5 = new cspmb__Rate_Card_Line__c(
			cspmb__rate_card__c = rc.id,
			name = 'testrcl5',
			cspmb__is_active__c = true,
			cspmb__rate_value__c = 124.99,
			cspmb__rate_card_line_unit__c = 'sample unit',
			cspmb__effective_start_date__c = Date.today().addDays(-5),
			cspmb__effective_end_date__c = Date.today().addDays(5)
		);
		insert rcl5;
		cspmb__Rate_Card_Line__c rcl6 = new cspmb__Rate_Card_Line__c(
			cspmb__rate_card__c = rc.id,
			name = 'testrcl6',
			cspmb__is_active__c = true,
			cspmb__rate_value__c = 124.99,
			cspmb__rate_card_line_unit__c = 'sample unit',
			cspmb__effective_start_date__c = Date.today().addDays(-5),
			cspmb__effective_end_date__c = Date.today().addDays(-3)
		);
		insert rcl6;
		cspmb__Rate_Card_Line__c rcl7 = new cspmb__Rate_Card_Line__c(
			cspmb__rate_card__c = rc.id,
			name = 'testrcl7',
			cspmb__is_active__c = true,
			cspmb__rate_value__c = 124.99,
			cspmb__rate_card_line_unit__c = 'sample unit',
			cspmb__effective_start_date__c = Date.today(),
			cspmb__effective_end_date__c = Date.today()
		);
		insert rcl7;
		cspmb__Price_Item_Rate_Card_Association__c pirc = new cspmb__Price_Item_Rate_Card_Association__c(
			cspmb__rate_card__c = rc.id,
			cspmb__price_item__c = cp_1.id
		);
		insert pirc;

		// ADDONS
		cspmb__Add_On_Price_Item__c add_1 = new cspmb__Add_On_Price_Item__c(
			Name = 'ADD1', cspmb__One_Off_Charge__c = 10.00, cspmb__Billing_Frequency__c = 'Monthly', cspmb__Is_Active__c = true
		);
		cspmb__Add_On_Price_Item__c add_2 = new cspmb__Add_On_Price_Item__c(
			Name = 'ADD2', cspmb__One_Off_Charge__c = 10.00, cspmb__Billing_Frequency__c = 'Monthly', cspmb__Is_Active__c = true
		);


		cspmb__Add_On_Price_Item__c add_invalid_start = new cspmb__Add_On_Price_Item__c(
			Name = 'ADD_INV_START', cspmb__One_Off_Charge__c = 10.00, cspmb__Is_Active__c = true,
			cspmb__Effective_Start_Date__c = Date.today().addDays(1)
		);
		cspmb__Add_On_Price_Item__c add_invalid_end = new cspmb__Add_On_Price_Item__c(
			Name = 'ADD_INV_END', cspmb__One_Off_Charge__c = 10.00, cspmb__Is_Active__c = true,
			cspmb__Effective_End_Date__c = Date.today().addDays(-1)
		);
		cspmb__Add_On_Price_Item__c add_inactive = new cspmb__Add_On_Price_Item__c(
			Name = 'ADD_INACTIVE', cspmb__One_Off_Charge__c = 10.00, cspmb__Is_Active__c = false
		);

		insert add_1;
		insert add_2;

		insert add_invalid_start;
		insert add_invalid_end;
		insert add_inactive;

		cspmb__Price_Item_Add_On_Price_Item_Association__c add1assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_1.Id, cspmb__Price_Item__c = cp_1.Id, cspmb__Overrides_Add_On_Charges__c = false
		);
		cspmb__Price_Item_Add_On_Price_Item_Association__c add2assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_2.Id, cspmb__Price_Item__c = cp_3.Id
		);

		cspmb__Price_Item_Add_On_Price_Item_Association__c addValassocStart = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_1.Id, cspmb__Price_Item__c = cp_addon_assoc_inv.Id
		);
		cspmb__Price_Item_Add_On_Price_Item_Association__c addInvassocStart = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_1.Id, cspmb__Price_Item__c = cp_addon_assoc_inv.Id,
			cspmb__effective_start_date__c = Date.today().addDays(1)
		);
		cspmb__Price_Item_Add_On_Price_Item_Association__c addInvassocEnd = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_2.Id, cspmb__Price_Item__c = cp_addon_assoc_inv.Id,
			cspmb__effective_end_date__c = Date.today().addDays(-1)
		);

		cspmb__Price_Item_Add_On_Price_Item_Association__c add3assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_invalid_start.Id, cspmb__Price_Item__c = cp_addon_inv.Id
		);
		cspmb__Price_Item_Add_On_Price_Item_Association__c add4assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_invalid_end.Id, cspmb__Price_Item__c = cp_addon_inv.Id
		);
		cspmb__Price_Item_Add_On_Price_Item_Association__c add5assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__Add_On_Price_Item__c = add_inactive.Id, cspmb__Price_Item__c = cp_addon_inv.Id
		);

		insert add1assoc;
		insert add2assoc;

		insert addValassocStart;
		insert addInvassocStart;
		insert addInvassocEnd;

		insert add3assoc;
		insert add4assoc;
		insert add5assoc;

		// FRAME AGREEMENTS
		csconta__Frame_Agreement__c fa_1 = new csconta__Frame_Agreement__c(
			csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'FA1', csconta__Account__c = test_account.Id
		);
		csconta__Frame_Agreement__c fa_2 = new csconta__Frame_Agreement__c(csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'FA2');
		csconta__Frame_Agreement__c fa_3 = new csconta__Frame_Agreement__c(csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'FA3');

		csconta__Frame_Agreement__c fa_master = new csconta__Frame_Agreement__c(
			csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'FA-Master', csconta__agreement_level__c = 'Master Agreement'
		);

		csconta__Frame_Agreement__c fA_account = new csconta__Frame_Agreement__c(
			csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'FA_account', csconta__Account__c = test_account.Id
		);

		insert fa_1;
		insert fa_2;
		insert fa_3;
		insert fA_account;
		insert fa_master;

		String decomposeData = '[{"cpId":"' + cp_1.Id + '","recurring":266,"oneOff":null},{"cpId":"' + cp_1.Id + '","recurring":263,"oneOff":null},{"peId":"' + pricingElement_1.Id + '","recurring":12,"oneOff":null},{"peId":"' + pricingElement_1.Id + '","recurring":null,"oneOff":12},{"cpaoaId":"' + add1assoc.Id + '","recurring":null,"oneOff":12},{"cpaoaId":"' + add1assoc.Id + '","recurring":12,"oneOff":null}]';

		return decomposeData;
	}

	static void setupStdCategory() {
		Id catalogue = Id.valueOf(FrameRateManagerController.getDefaultCatalogueId());

		List<cspmb__Product_Category__c> categoryList = new List<cspmb__Product_Category__c>();

		cspmb__Product_Category__c category = new cspmb__Product_Category__c(
			cspmb__description__c = 'test-category-1'
		);
		categoryList.add(category);
		category = new cspmb__Product_Category__c(
			cspmb__description__c = 'test-category-2'
		);
		categoryList.add(category);

		FaPlmService.associateCategoryCatalogue(categoryList, catalogue);
	}

	static List<PRECategory> setUpPRECategory() {
		setupStdCategory();
		Id stdCatalog = FrameRateManagerController.getDefaultCatalogueId();

		List<cspmb__Catalogue_Category_Association__c> stdCatalogueCategory = [
			select id, cspmb__product_category__c
			from cspmb__Catalogue_Category_Association__c where cspmb__catalogue__c = :stdCatalog
		];

		List<Id> categoryIdList = new List<Id>();

		for (cspmb__Catalogue_Category_Association__c association : stdCatalogueCategory) {
			categoryIdList.add(association.cspmb__product_category__c);
		}

		List<cspmb__product_category__c> stdCategoryList = [
			select id, Name, cspmb__Description__c, cspmb__Subcategory_Sequence__c
			from cspmb__product_category__c where Id in :categoryIdList
		];

		List<PRECategory> stdPreCategoryList = new List<PRECategory>();
		for (cspmb__product_category__c stdCategory : stdCategoryList) {
			PRECategory preCategory = new PRECategory();
			preCategory.id = String.valueOf(stdCategory.Id);
			preCategory.name = stdCategory.Name;
			preCategory.description = stdCategory.cspmb__Description__c;
			preCategory.subcategorySequence = Integer.valueOf(stdCategory.cspmb__Subcategory_Sequence__c);

			stdPreCategoryList.add(preCategory);
		}
		return stdPreCategoryList;
	}

	@TestSetup
	static void makeData() {
		Fac_Settings__c facSettings = new Fac_Settings__c();
		facSettings.active_status__c = 'Active';
		facSettings.approved_status__c = 'Approved';
		facSettings.closed_status__c = 'Replaced';
		facSettings.draft_status__c = 'Draft';
		facSettings.price_item_fields__c = 'cspmb__Contract_Term__c, cspmb__One_Off_Charge__c, cspmb__ONE_OFF_CHARGE__c';
		facSettings.rcl_fields__c = 'cspmb__Currency_Code__c, cspmb__rate_card_line_code__c';
		facSettings.requires_approval_status__c = 'Requires Approval';
		facSettings.standalone_addon_fields__c = 'cspmb__Add_On_Price_Item_Code__c, cspmb__One_Off_Charge__c, cspmb__ONE_OFF_CHARGE__c';
		facSettings.certificate_name__c = 'selfcert';
		facSettings.dispatcher_service_url__c = 'https://cs-messaging-dispatcher-eu-dev.herokuapp.com';
		facSettings.is_ps_enabled__c = true;
		insert facSettings;
	}

	public static void setupSettings() {
		cspmb__Catalogue__c catalogue = new cspmb__Catalogue__c (
			name = 'catalogue-test'
		);
		insert catalogue;
		csutil__JSON_Data__c defaultCatalogueId = new csutil__JSON_Data__c(Name = 'FA-defaultcatalogue', csutil__value__c = catalogue.Id);
		csutil__JSON_Data__c headerData = new csutil__JSON_Data__c(Name = 'FA-Header', csutil__value__c = '[{"field":"csconta__Agreement_Name__c","readOnly":false,"label":"Agreement Name","type":"text","grid":2}]');
		csutil__JSON_Data__c categorizationData = new csutil__JSON_Data__c(Name = 'FA-Categorization', csutil__value__c = '[{"name":"Alpha","field":"cspmb__Discount_Type__c","values":["Percentage","Amount","Negative Line Item"]}]');
		csutil__JSON_Data__c customButtonData = new csutil__JSON_Data__c(Name = 'FA-Custom-Buttons', csutil__value__c = '[{"type":"action","label":"Action button","id":"bta1","method":"ActionFunction","hidden":["Active"]},{"type":"iframe","label":"iFrame button","id":"bta2","method":"iFrameFunction","hidden":["Active"]},{"type":"redirect","label":"Redirect button","id":"bta3","method":"RedirectFunction","hidden":["Active"]}]');
		csutil__JSON_Data__c standardButtonData = new csutil__JSON_Data__c(Name = 'FA-Standard-Buttons', csutil__value__c = '{"Save":["Draft","Requires Approval"],"SubmitForApproval":["Requires Approval"],"Submit":["Approved"],"DeleteProducts":["Draft","Requires Approval"],"BulkNegotiate":["Draft","Requires Approval"],"AddProducts":["Draft","Requires Approval"]}');
		csutil__JSON_Data__c customTabsData = new csutil__JSON_Data__c(Name = 'FA-Custom-Tabs', csutil__value__c = '[{"label":"Custom tab","container_id":"customTab1","onEnter":"customTabEnter"}]');

		insert defaultCatalogueId;
		insert headerData;
		insert customButtonData;
		insert standardButtonData;
		insert categorizationData;
		insert customTabsData;
	}

	@isTest
	public static void testConstructor() {
		setupPricingModel();
		setupSettings();

		Test.startTest();
		FrameRateManagerController controller = new FrameRateManagerController();
		Test.stopTest();
	}

	@isTest
	public static void testConstructorInvalid() {
		Test.startTest();
		Boolean exceptionOccured = false;
		try {
			FrameRateManagerController controller = new FrameRateManagerController();
		} catch (Exception e) {
			exceptionOccured = true;
		}
		Test.stopTest();
		System.assertEquals(true, exceptionOccured);
	}

	@isTest
	public static void testGetCustomSettings() {
		setupPricingModel();

		Test.startTest();

		Map<String, Object> csettings = FrameRateManagerController.getCustomSettings();

		Test.stopTest();

		System.assertNotEquals(null, csettings);
		System.assertEquals(csettings.get('standalone_addon_fields'),
			'cspmb__Add_On_Price_Item_Code__c, cspmb__One_Off_Charge__c, cspmb__ONE_OFF_CHARGE__c');
		System.assertEquals(csettings.get('dispatcherServiceUrl'),
			'https://cs-messaging-dispatcher-eu-dev.herokuapp.com');
		System.assertEquals(csettings.get('isPsEnabled'), true);
	}

	@isTest
	public static void testGetPriceItemCharges() {
		setupPricingModel();

		Map<Id, cspmb__Price_Item__c> cp_1 = new Map<Id, cspmb__Price_Item__c>([select Id,Name from cspmb__Price_Item__c where Name = 'cp_1']);
		List <Id> cpIdList = new List<Id>(cp_1.keySet());


		Test.startTest();
		Map <Id, List <FrameRateManagerController.PricingElementWrapper>> picMap = FrameRateManagerController.getCommercialProductCharges(cpIdList);
		// Invalid Id
		Map <Id, List <FrameRateManagerController.PricingElementWrapper>> picMapEmpty = FrameRateManagerController.getCommercialProductCharges(new List <Id>{
			'01p1t00000M4Gqp'
		});

		Test.stopTest();

		System.assertNotEquals(0, picMap.keySet().size());
		System.assertEquals(0, picMapEmpty.keySet().size());

	}

	@isTest
	public static void testGetAccountsInformation() {
		setupPricingModel();

		Account testAcc = [Select Id, Name from Account where Name = 'TestAcc' limit 1];
		csconta__Frame_Agreement__c fA_account = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'fA_account' limit 1];

		Test.startTest();

		Map<String, Object> accountsInfo = FrameRateManagerController.getAccountsInformation(fA_account.Id, null);

		Test.stopTest();

		Account resultMainAccount = (Account) accountsInfo.get('main_account');
		List <csconta__Account_Frame_Agreement_Association__c> associatedAcc = (List <csconta__Account_Frame_Agreement_Association__c>) accountsInfo.get('associated_accounts');

		System.assertEquals((String) testAcc.Id, resultMainAccount.Id);
		System.assertEquals(1, accountsInfo.get('count'));
		System.assertEquals(0, associatedAcc.size());

	}

	// deleteAccountAssociation(String assocId)
	// addAccountAssociation(String faId, String accountId)

	@isTest
	public static void testAddDeleteAccountAssociation() {
		setupPricingModel();

		Account testAcc = [Select Id, Name from Account where Name = 'TestAcc' limit 1];

		csconta__Frame_Agreement__c fa_3 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA3' limit 1];
		csconta__Frame_Agreement__c fA_account = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'fA_account' limit 1];

		Test.startTest();

		csconta__Account_Frame_Agreement_Association__c assoc_1 = FrameRateManagerController.addAccountAssociation(fA_account.Id, testAcc.Id);
		csconta__Account_Frame_Agreement_Association__c assoc_2 = FrameRateManagerController.addAccountAssociation(fa_3.Id, testAcc.Id);

		FrameRateManagerController.deleteAccountAssociation(assoc_2.Id);

		Map<String, Object> accountsInfo_1 = FrameRateManagerController.getAccountsInformation(fA_account.Id, null);
		Map<String, Object> accountsInfo_2 = FrameRateManagerController.getAccountsInformation(fa_3.Id, 'Name != null');

		Test.stopTest();

		List <csconta__Account_Frame_Agreement_Association__c> associatedAcc_1 = (List <csconta__Account_Frame_Agreement_Association__c>) accountsInfo_1.get('associated_accounts');
		List <csconta__Account_Frame_Agreement_Association__c> associatedAcc_2 = (List <csconta__Account_Frame_Agreement_Association__c>) accountsInfo_2.get('associated_accounts');

		System.assertEquals(1, associatedAcc_1.size());
		System.assertEquals(0, associatedAcc_2.size());

	}

	@isTest
	public static void testGetFieldLabels() {
		setupPricingModel();

		Test.startTest();

		Map <String, String> fields = FrameRateManagerController.getFieldLabels('cspmb__Price_Item__c');

		Test.stopTest();

		Boolean isEffectiveDateInFields = fields.containsKey('cspmb__billing_frequency__c');
		System.assertEquals(isEffectiveDateInFields, true);

	}

	@isTest
	public static void getFindReplacementCommercialProduct() {
		setupPricingModel();

		cspmb__Price_Item__c cp_replace_1 = new cspmb__Price_Item__c(
			Name = 'cp_replace_1',
			cspmb__Price_Item_Code__c = 'PC333C',
			cspmb__One_Off_Charge__c = 10.00,
			cspmb__Is_Active__c = true,
			cspmb__Recurring_Charge__c = 15 - 00,
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_replace_2 = new cspmb__Price_Item__c(
			Name = 'cp_replace_2',
			cspmb__Price_Item_Code__c = 'PC333C',
			cspmb__One_Off_Charge__c = 10.00,
			cspmb__Is_Active__c = true,
			cspmb__Recurring_Charge__c = 15 - 00,
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);

		insert cp_replace_1;
		insert cp_replace_2;

		Test.startTest();

		Map <String, Map<String, Object>> result = FrameRateManagerController.findReplacementCommercialProduct(new List<String>{
			cp_replace_1.Id
		});

		Test.stopTest();

		Boolean isCp2InResponse = JSON.serialize(result).contains(cp_replace_2.Id);
		System.assertEquals(isCp2InResponse, true);

	}

	@isTest
	public static void testGetLookupInformation() {
		setupPricingModel();
		setupSettings();

		Account testAcc = [Select Id, Name from Account where Name = 'TestAcc' limit 1];

		String field = 'csconta__Account__c';
		String column = 'Name';
		String whereClause = 'name != null';
		String initValId = testAcc.Id;

		Map<String, Object> params = new Map<String, Object> ();
		params.put('pointedObject', 'Account');
		params.put('columns', new List<String>{
			'Name', 'Type'
		});
		params.put('whereClause', whereClause);
		params.put('search', null);
		params.put('lastId', null);
		params.put('offset', 20);

		Map<String, Object> params_2 = new Map<String, Object> ();
		params_2.put('field', field);
		params_2.put('columns', new List<String>{
			'Name', 'Type'
		});
		params_2.put('whereClause', null);
		params_2.put('search', null);
		params_2.put('lastId', null);
		params_2.put('offset', 20);


		Map<String, Object> params_3 = new Map<String, Object> ();
		params_3.put('pointedObject', 'Account');
		params_3.put('columns', new List<String>{
			'Name', 'Type'
		});
		params_3.put('whereClause', null);
		params_3.put('search', 'Name != null');
		params_3.put('lastId', testAcc.Id);
		params_3.put('offset', 20);

		Test.startTest();

		Map<String, Object> info_1 = FrameRateManagerController.getLookupInformation(field, column, null, null);
		Map<String, Object> info_2 = FrameRateManagerController.getLookupInformation(field, column, whereClause, initValId);

		List<Object> lookup_records_1 = FrameRateManagerController.getLookupRecords(JSON.serialize(params));
		List<Object> lookup_records_2 = FrameRateManagerController.getLookupRecords(JSON.serialize(params_2));
		List<Object> lookup_records_3 = FrameRateManagerController.getLookupRecords(JSON.serialize(params_3));

		// initialLabel
		// count

		Test.stopTest();

		System.assertEquals(2, info_1.size());
		System.assertEquals(3, info_2.size());

		System.assertEquals(1, lookup_records_1.size());
		System.assertEquals(1, lookup_records_2.size());
		System.assertEquals(0, lookup_records_3.size());

	}

	@isTest
	public static void testCpAddonAssociations() {
		setupPricingModel();

		Id userId = UserInfo.getUserId();

		List<cspmb__Price_Item__c> cpList = [select Id from cspmb__Price_Item__c];
		cspmb__Price_Item__c cp_addon_inv = [select Id from cspmb__Price_Item__c where Name = 'cp_addon_inv'];
		cspmb__Price_Item__c cp_1 = [select Id from cspmb__Price_Item__c where Name = 'cp_1'];
		cspmb__Price_Item__c cp_addon_assoc_inv = [select Id from cspmb__Price_Item__c where Name = 'cp_addon_assoc_inv'];

		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp : cpList) {
			cpIdList.add(cp.Id);
		}

		Test.startTest();

		Boolean isUserAdmin = FrameRateManagerController.isUserAdmin();
		Set <Id> isUserDelegate = FrameRateManagerController.isUserDelegate(userId);

		List<String> uniqueList = FrameRateManagerController.getUniqueListElements(new List<String>{
			'a1', 'a1', 'a2'
		});

		Map<String, Object> commercialProductData = FrameRateManagerController.getCommercialProductData(
			cpIdList,
			new List<Id>()
		);

		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> addonsInvalid = FrameRateManagerController.getAddons(new List <Id>{
			cp_addon_inv.Id
		});
		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> addonsValid = FrameRateManagerController.getAddons(new List <Id>{
			cp_1.Id
		});
		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> addons2InvalidAssoc1Valid = FrameRateManagerController.getAddons(new List <Id>{
			cp_addon_assoc_inv.Id
		});

		List <cspmb__Price_Item_Add_On_Price_Item_Association__c> addonAssoc_cp_addon_inv = [
			select Id, cspmb__Price_Item__c, cspmb__Add_On_Price_Item__r.cspmb__Effective_End_Date__c, cspmb__Add_On_Price_Item__r.cspmb__Effective_Start_Date__c
			from cspmb__Price_Item_Add_On_Price_Item_Association__c
			where cspmb__Price_Item__c = :cp_addon_inv.Id and cspmb__Add_On_Price_Item__r.cspmb__Is_Active__c = true
		];

		Test.stopTest();

		System.assertEquals(uniqueList.size(), 2);
		System.assertEquals(addonAssoc_cp_addon_inv.size(), 2);
		System.assertEquals(addonsInvalid.keySet().size(), 0);
		System.assertEquals(addonsValid.keySet().size(), 1);
		System.assertEquals(addons2InvalidAssoc1Valid.keySet().size(), 1);
		//System.assertEquals(1, isUserDelegate.size());
		//System.assertEquals(3, commercialProductData.keySet().size());

	}

	@isTest
	public static void testCpAddonAssociationsWithoutPS() {
		setupPricingModel();

		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		Id userId = UserInfo.getUserId();

		List<cspmb__Price_Item__c> cpList = [select Id from cspmb__Price_Item__c];
		cspmb__Price_Item__c cp_addon_inv = [select Id from cspmb__Price_Item__c where Name = 'cp_addon_inv'];
		cspmb__Price_Item__c cp_1 = [select Id from cspmb__Price_Item__c where Name = 'cp_1'];
		cspmb__Price_Item__c cp_addon_assoc_inv = [select Id from cspmb__Price_Item__c where Name = 'cp_addon_assoc_inv'];

		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp : cpList) {
			cpIdList.add(cp.Id);
		}

		Test.startTest();

		Boolean isUserAdmin = FrameRateManagerController.isUserAdmin();
		Set <Id> isUserDelegate = FrameRateManagerController.isUserDelegate(userId);

		List<String> uniqueList = FrameRateManagerController.getUniqueListElements(new List<String>{'a1', 'a1', 'a2'});

		Map<String, Object> commercialProductData = FrameRateManagerController.getCommercialProductData(
			cpIdList,
			new List<Id>()
		);

		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> addonsInvalid = FrameRateManagerController.getAddons(new List <Id>{
			cp_addon_inv.Id
		});
		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> addonsValid = FrameRateManagerController.getAddons(new List <Id>{
			cp_1.Id
		});
		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> addons2InvalidAssoc1Valid = FrameRateManagerController.getAddons(new List <Id>{
			cp_addon_assoc_inv.Id
		});

		List <cspmb__Price_Item_Add_On_Price_Item_Association__c> addonAssoc_cp_addon_inv = [
			select Id, cspmb__Price_Item__c, cspmb__Add_On_Price_Item__r.cspmb__Effective_End_Date__c, cspmb__Add_On_Price_Item__r.cspmb__Effective_Start_Date__c
			from cspmb__Price_Item_Add_On_Price_Item_Association__c
			where cspmb__Price_Item__c = :cp_addon_inv.Id and cspmb__Add_On_Price_Item__r.cspmb__Is_Active__c = true
		];

		Test.stopTest();

		system.assertEquals(uniqueList.size(), 2);
		system.assertEquals(addonAssoc_cp_addon_inv.size(), 2);
		system.assertEquals(addonsInvalid.keySet().size(), 0);
		system.assertEquals(addonsValid.keySet().size(), 1);
		system.assertEquals(addons2InvalidAssoc1Valid.keySet().size(), 1);

	}

	@isTest
	public static void testFrameAgreements() {
		setupPricingModel();
		setupSettings();
		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA1' limit 1];
		csconta__Frame_Agreement__c fa_2 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA2' limit 1];

		Account acc = [select Id from Account where Name = 'TestAcc' limit 1];

		Test.startTest();

		List<csconta__Frame_Agreement__c> faList = FrameRateManagerController.getFrameAgreements(acc.Id);
		List<csconta__Frame_Agreement__c> faListInvalid = FrameRateManagerController.getFrameAgreements('invalid');

		csconta__Frame_Agreement__c fa = FrameRateManagerController.getFrameAgreement(fa_1.Id);
		FrameRateManagerController.setFrameAgreementState(fa_1.Id, 'Active');
		String invalidString_1 = FrameRateManagerController.setFrameAgreementState('a0x1t000000yZF3', 'Active'); // Invalid
		String invalidString_2 = FrameRateManagerController.setFrameAgreementState(null, 'Active'); // Invalid

		FrameRateManagerController.deleteFrameAgreement(fa_2.Id);
		FrameRateManagerController.deleteFrameAgreement(fa_2.Id);

		csconta__Frame_Agreement__c cloned_1_fa_1 = FrameRateManagerController.cloneFrameAgreement(fa_1.Id);
		FrameRateManagerController.saveAttachment(fa_1.Id, 'TestBody_3');
		csconta__Frame_Agreement__c cloned_2_fa_1 = FrameRateManagerController.cloneFrameAgreement(fa_1.Id);
		csconta__Frame_Agreement__c cloned_invalid = FrameRateManagerController.cloneFrameAgreement('a0x1t000000yZF3'); // Invalid

		csconta__Frame_Agreement__c new_version_fa_1 = FrameRateManagerController.createNewVersionOfFrameAgreement(fa_1.Id);

		// Invalids
		Boolean expectedExceptionThrown = false;
		try {
			FrameRateManagerController.getFrameAgreement('a0x1t000000yZF3');
			csconta__Frame_Agreement__c new_version_fa_2 = FrameRateManagerController.createNewVersionOfFrameAgreement('a0x1t000000yZF3');
		} catch (Exception e) {
			expectedExceptionThrown = true;
		}

		Test.stopTest();

		System.assertEquals(2, faList.size());
		System.assertEquals(fa_1.Id, fa.Id);

		fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA1' limit 1];
		System.assertEquals('Active', fa_1.csconta__Status__c);
		System.assertNotEquals('Success', invalidString_1);
		System.assertNotEquals('Success', invalidString_2);

		List<csconta__Frame_Agreement__c> emptyList = new List<csconta__Frame_Agreement__c>([select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA2']);
		System.assertEquals(0, emptyList.size());
		System.assertEquals('FA1', cloned_1_fa_1.csconta__Agreement_Name__c);
		System.assertEquals(expectedExceptionThrown, true);
	}

	@isTest
	public static void testCreateNewFrameAgreement() {
		setupPricingModel();
		setupSettings();
		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__frame_agreement_number__c, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA1' limit 1];

		Test.startTest();

		csconta__Frame_Agreement__c fa_1_clone_1 = FrameRateManagerController.createNewVersionOfFrameAgreement(fa_1.Id);
		csconta__Frame_Agreement__c fa_1_clone_2 = FrameRateManagerController.createNewVersionOfFrameAgreement(fa_1_clone_1.Id);

		Test.stopTest();

		System.assertEquals(fa_1_clone_2.csconta__frame_agreement_number__c, fa_1.csconta__frame_agreement_number__c);
	}

	@isTest
	public static void testCloneFrameAgreementWithAssociations() {
		setupPricingModel();

		Account testAcc = [Select Id, Name from Account where Name = 'TestAcc' limit 1];

		csconta__Frame_Agreement__c fa_3 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA3' limit 1];
		FrameRateManagerController.addAccountAssociation(fa_3.Id, testAcc.Id);

		Test.startTest();

		csconta__Frame_Agreement__c cloned_1_fa_1 = FrameRateManagerController.cloneFrameAgreement(fa_3.Id);
		List <csconta__Account_Frame_Agreement_Association__c> cloned_assoc_list = [select Id from csconta__Account_Frame_Agreement_Association__c where csconta__Frame_Agreement__c = :cloned_1_fa_1.Id];

		Test.stopTest();

		System.assertEquals(1, cloned_assoc_list.size());

	}

	@isTest
	public static void testUpsertFrameAgreement() {
		setupPricingModel();
		setupSettings();

		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c, csconta__Agreement_Name__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA1' limit 1];
		csconta__Frame_Agreement__c fa_2 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA2' limit 1];
		List<PRECategory> stdPreCategoryList = setUpPRECategory();

		Test.startTest();

		FrameRateManagerController.upsertFrameAgreements(fa_1.id, '{"csconta__Agreement_Name__c":"FA1_CHANGED","csconta__Status__c":"Draft","csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}', null);
		// New
		csconta__Frame_Agreement__c newFa = FrameRateManagerController.upsertFrameAgreements(null, '{"csconta__Agreement_Name__c":"FA1_CHANGED","csconta__Status__c":"Draft","csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}', stdPreCategoryList);

		Test.stopTest();

		fa_1 = [select id, csconta__status__c, csconta__agreement_Name__c from csconta__Frame_Agreement__c where id = :fa_1.id limit 1];
		System.assertEquals('FA1_CHANGED', fa_1.csconta__Agreement_Name__c);

		Id faCatalog = newFa.csconta__catalogue__c;
		System.assertNotEquals(faCatalog, null);

		Id stdCatalog = FrameRateManagerController.getDefaultCatalogueId();

		List<cspmb__Catalogue_Category_Association__c> stdCatalogueCategory = [
			select id, cspmb__product_category__c
			from cspmb__Catalogue_Category_Association__c where cspmb__catalogue__c = :stdCatalog
		];

		List<cspmb__Catalogue_Category_Association__c> faCatalogueCategory = [
			select id from cspmb__Catalogue_Category_Association__c where cspmb__catalogue__c = :faCatalog
		];

		System.assertEquals(faCatalogueCategory.size(), stdCatalogueCategory.size());
	}

	@isTest
	public static void testPsDisabledUpsertFrameAgreement() {
		setupPricingModel();
		setupSettings();

		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		Test.startTest();

		// New
		csconta__Frame_Agreement__c newFa = FrameRateManagerController.upsertFrameAgreements(null, '{"csconta__Agreement_Name__c":"FA1_CHANGED","csconta__Status__c":"Draft","csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}', null);

		Test.stopTest();

		Id faCatalog = newFa.csconta__catalogue__c;

		System.assertNotEquals(newFa.id, null);
		System.assertEquals(faCatalog, null);
	}

	@isTest
	public static void testGetAppSettings() {
		setupPricingModel();

		setupSettings();
		Account acc = [select Id from Account where Name = 'TestAcc' limit 1];

		Test.startTest();

		Map<String, Object> appSetting = FrameRateManagerController.getAppSettings(acc.Id);

		Test.stopTest();

		System.assertNotEquals(null, appSetting);

	}

	@isTest
	public static void testGetAppSettingsNull() {
		setupPricingModel();

		Account acc = [select Id from Account where Name = 'TestAcc' limit 1];

		Test.startTest();

		Map<String, Object> appSetting = FrameRateManagerController.getAppSettings(acc.Id);

		Test.stopTest();

		System.assertNotEquals(null, appSetting);

	}

	@isTest
	public static void testGetCommercialProductsIfPrsEnabledFalse() {
		setupPricingModel();
		setupSettings();
		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		List<cspmb__Price_Item__c> results = [select Id from cspmb__Price_Item__c];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp : results) {
			cpIdList.add(cp.Id);
		}

		Test.startTest();

		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(cpIdList);

		Test.stopTest();

		System.assertEquals(5, cpIdList.size());
		System.assertEquals(4, getCommercialProducts.size());
	}

	@isTest
	public static void testGetCommercialProductsIfPrsEnabledTrue() {
		setupPricingModel();
		setupSettings();

		List<cspmb__Price_Item__c> results = [select Id from cspmb__Price_Item__c];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp : results) {
			cpIdList.add(cp.Id);
		}

		Test.startTest();

		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(cpIdList);

		Test.stopTest();

		System.assertEquals(5, cpIdList.size());
		System.assertEquals(5, getCommercialProducts.size());
	}

	@IsTest
	static void testCPLegacyPricing() {
		setupPricingModel();
		setupSettings();

		cspmb__Price_Item__c cp = new cspmb__Price_Item__c(
			Name = 'cp_temp',
			cspmb__One_Off_Charge__c = 9.00,
			cspmb__Is_Active__c = true,
			cspmb__Recurring_Charge__c = 11.99,
			cspmb__Price_Item_Code__c = 'cp_temp',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		insert cp;

		List<Id> cpIdList = new List<Id>{
			cp.Id
		};

		List<cspmb__pricing_rule__c> pr = [select id, cspmb__description__c from cspmb__pricing_rule__c];

		cspmb__Price_Item_Pricing_Rule_Association__c cppra = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__one_off_adjustment_type__c = 'Absolute Discount',
			cspmb__price_item__c = cp.id,
			cspmb__recurring_adjustment_type__c = 'Absolute Discount',
			cspmb__pricing_rule__c = pr[0].id
		);
		insert cppra;

		Test.startTest();

		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(cpIdList);

		Test.stopTest();

		cp = [
			select Name, cspmb__One_Off_Charge__c, cspmb__Recurring_Charge__c
			from cspmb__Price_Item__c
			where id = :cp.id
		];
		cppra = [
			select cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :cp.id
		];

		System.assertEquals(9, cp.cspmb__One_Off_Charge__c);
		System.assertEquals(11.99, cp.cspmb__Recurring_Charge__c);

		System.assertEquals(null, cppra.cspmb__one_off_adjustment__c);
		System.assertEquals(null, cppra.cspmb__recurring_adjustment__c);

		System.assertEquals(9, getCommercialProducts[0].cspmb__One_Off_Charge__c);
		System.assertEquals(11.99, getCommercialProducts[0].cspmb__Recurring_Charge__c);
	}

	@IsTest
	static void testCPAdvancedPricing() {
		setupPricingModel();
		setupSettings();

		cspmb__Price_Item__c cp = new cspmb__Price_Item__c(
			Name = 'cp_temp',
			cspmb__Is_Active__c = true,
			cspmb__Price_Item_Code__c = 'cp_temp',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		insert cp;

		List<Id> cpIdList = new List<Id>{
			cp.Id
		};

		List<cspmb__pricing_rule__c> pr = [select id, cspmb__description__c from cspmb__pricing_rule__c];

		cspmb__Price_Item_Pricing_Rule_Association__c cppra = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__one_off_adjustment__c = 9.00,
			cspmb__one_off_adjustment_type__c = 'Initial Price',
			cspmb__price_item__c = cp.Id,
			cspmb__recurring_adjustment__c = 11.99,
			cspmb__recurring_adjustment_type__c = 'Initial Price',
			cspmb__pricing_rule__c = pr[0].Id
		);
		insert cppra;

		Test.startTest();

		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(cpIdList);

		Test.stopTest();

		cp = [
			select Name, cspmb__One_Off_Charge__c, cspmb__Recurring_Charge__c
			from cspmb__Price_Item__c
			where id = :cp.id
		];
		cppra = [
			select cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :cp.id
		];

		System.assertEquals(null, cp.cspmb__One_Off_Charge__c);
		System.assertEquals(null, cp.cspmb__Recurring_Charge__c);

		System.assertEquals(9, cppra.cspmb__one_off_adjustment__c);
		System.assertEquals(11.99, cppra.cspmb__recurring_adjustment__c);

		System.assertEquals(9, getCommercialProducts[0].cspmb__One_Off_Charge__c);
		System.assertEquals(11.99, getCommercialProducts[0].cspmb__Recurring_Charge__c);
	}

	@IsTest
	static void testCPAdvancedAndLegacyPricing() {
		setupPricingModel();
		setupSettings();

		cspmb__Price_Item__c cp = new cspmb__Price_Item__c(
			Name = 'cp_temp',
			cspmb__One_Off_Charge__c = 1.00,
			cspmb__Is_Active__c = true,
			cspmb__Recurring_Charge__c = 2.00,
			cspmb__Price_Item_Code__c = 'cp_temp',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		insert cp;

		List<Id> cpIdList = new List<Id>{
			cp.Id
		};

		List<cspmb__pricing_rule__c> pr = [select id, cspmb__description__c from cspmb__pricing_rule__c];

		cspmb__Price_Item_Pricing_Rule_Association__c cppra = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__one_off_adjustment__c = 3.00,
			cspmb__one_off_adjustment_type__c = 'Initial Price',
			cspmb__price_item__c = cp.Id,
			cspmb__recurring_adjustment__c = 4.00,
			cspmb__recurring_adjustment_type__c = 'Initial Price',
			cspmb__pricing_rule__c = pr[0].Id
		);
		insert cppra;

		Test.startTest();

		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(cpIdList);

		Test.stopTest();

		cp = [
			select Name, cspmb__One_Off_Charge__c, cspmb__Recurring_Charge__c
			from cspmb__Price_Item__c
			where id = :cp.id
		];
		cppra = [
			select cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :cp.id
		];

		System.assertEquals(1, cp.cspmb__One_Off_Charge__c);
		System.assertEquals(2, cp.cspmb__Recurring_Charge__c);

		System.assertEquals(3, cppra.cspmb__one_off_adjustment__c);
		System.assertEquals(4, cppra.cspmb__recurring_adjustment__c);

		System.assertEquals(3, getCommercialProducts[0].cspmb__One_Off_Charge__c);
		System.assertEquals(4, getCommercialProducts[0].cspmb__Recurring_Charge__c);
	}

	@isTest
	public static void testGetStandaloneAddons() {
		setupPricingModel();

		Fac_Settings__c facSettings = FrameRateManagerControllerTest.loadFacSettings();
		facSettings.standalone_addon_fields__c = '';
		Test.startTest();

		List<cspmb__Add_On_Price_Item__c> saAddons = FrameRateManagerController.getStandaloneAddons();

		Test.stopTest();

		System.assertEquals(2, saAddons.size());

	}

	@isTest
	public static void testFilterStandaloneAddons() {
		setupPricingModel();

		Fac_Settings__c facSettings = FrameRateManagerControllerTest.loadFacSettings();
		facSettings.standalone_addon_fields__c = '';

		Test.startTest();

		List<cspmb__Add_On_Price_Item__c> saAddons = FrameRateManagerController.filterStandaloneAddons('[{"field":"cspmb__Billing_Frequency__c","values":["Monthly"]}]');

		Test.stopTest();

		System.assertEquals(2, saAddons.size());

	}

	@isTest
	public static void testGetAddonDiscountInformation() {
		setupPricingModel();

		Fac_Settings__c facSettings = FrameRateManagerControllerTest.loadFacSettings();
		facSettings.standalone_addon_fields__c = '';

		Test.startTest();

		Map<String, Object> addon_di = FrameRateManagerController.getAddonDiscountInformation();

		Test.stopTest();

		System.assertEquals(true, addon_di.containsKey('discLevels'));
		System.assertEquals(true, addon_di.containsKey('dcList'));

	}


	@isTest
	public static void testGetCommercialProductsNullIsPrsEnabledFalse() {
		setupPricingModel();
		setupSettings();

		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		Test.startTest();
		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(new List<Id>());
		Test.stopTest();

		System.assertEquals(4, getCommercialProducts.size());
	}

	@isTest
	public static void testGetCommercialProductsNullIsPrsEnabledTrue() {
		setupPricingModel();
		setupSettings();

		Test.startTest();
		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(new List<Id>());
		Test.stopTest();

		System.assertEquals(0, getCommercialProducts.size());
	}


	@isTest
	public static void testApproval() {
		setupPricingModel();

		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA1' limit 1];

		Test.startTest();

		try {
			FrameRateManagerController.getApprovalHistory(fa_1.Id);
		} catch (Exception ex) {

		}

		try {
			FrameRateManagerController.approveRejectRecallRecord(fa_1.Id, 'TestComments', 'Approve');
		} catch (Exception ex) {

		}

		try {
			FrameRateManagerController.reassignApproval(fa_1.Id, fa_1.Id);
		} catch (Exception ex) {

		}

		try {
			FrameRateManagerController.submitForApproval(fa_1.Id);
		} catch (Exception ex) {

		}

		Test.stopTest();

		// System.assertEquals();

	}

	@isTest
	public static void testPricingElements() {
		setupPricingModel();

		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA1' limit 1];
		cspmb__Price_Item__c cp_1 = [select Id,Name from cspmb__Price_Item__c where Name = 'cp_1' limit 1];

		Test.startTest();

		List<cspmb__Pricing_Element__c> pricingElementsList = FrameRateManagerController.getPricingElements(cp_1.Id);

		Test.stopTest();

		System.assertEquals(2, pricingElementsList.size());

	}

	@isTest
	public static void testDecomposeAttachment() {
		String decomposeData = setupPricingModel();
		Fac_Settings__c facSettings = Fac_Settings__c.getInstance(UserInfo.getUserID());

		System.debug('facSettings:' + facSettings);

		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c, csconta__replaced_frame_agreement__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA1' limit 1];

		csconta__Frame_Agreement__c fa_2 = [select Id, csconta__Status__c, csconta__replaced_frame_agreement__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA2' limit 1];
		fa_2.csconta__replaced_frame_agreement__c = fa_1.Id;
		update fa_2;
		System.debug('fa_2:' + fa_2);
		Test.startTest();

		Id prId = FrameRateManagerController.createPricingRuleGroup(fa_1.Id);
		Id prId_2 = FrameRateManagerController.createPricingRuleGroup(fa_2.Id);

		String decomposeResult_1 = FrameRateManagerController.decomposeAttachment(decomposeData, prId, fa_1.Id);
		String decomposeResult_2 = FrameRateManagerController.decomposeAttachment(decomposeData, prId_2, fa_2.Id);

		FrameRateManagerController.undoDecomposition(prId);

		System.assertEquals('Success', decomposeResult_1);

		List<cspmb__Price_Item_Pricing_Rule_Association__c> pipraList = [select Id from cspmb__Price_Item_Pricing_Rule_Association__c where cspmb__pricing_rule__c = :prId limit 10000];
		List<cspmb__Price_Item_Pricing_Rule_Association__c> pipraList2 = [select Id from cspmb__Price_Item_Pricing_Rule_Association__c where cspmb__pricing_rule__c = :prId_2 limit 10000];

		Test.stopTest();

		System.assertEquals(0, pipraList.size()); // Deleted
		System.assertEquals(6, pipraList2.size());
	}

	@isTest
	public static void testAttachmentMethods() {
		setupPricingModel();
		cspmb__Price_Item__c cp_1 = [select Id,Name from cspmb__Price_Item__c where Name = 'cp_1' limit 1];
		cspmb__Price_Item__c cp_2 = [select Id,Name from cspmb__Price_Item__c where Name = 'cp_2' limit 1];

		List<String> attachmentBodies = new List<String>();

		Test.startTest();

		Attachment a1 = FrameRateManagerController.createAttachment(cp_1.Id, 'TestName', 'testDescription', 'TestBody_1', 'text/plain');
		attachmentBodies.add(a1.body.toString()); // TestBody_1

		attachmentBodies.add('TestBody_2'); // TestBody_2

		attachmentBodies.add(FrameRateManagerController.saveAttachment(cp_1.Id, 'TestBody_3')); // TestBody_3
		attachmentBodies.add(FrameRateManagerController.saveAttachment(cp_1.Id, 'TestBody_4')); // TestBody_4

		attachmentBodies.add(FrameRateManagerController.getAttachmentBody(cp_1.Id)); // VGVzdEJvZHlfNA==
		attachmentBodies.add(FrameRateManagerController.getAttachmentBody(cp_2.Id)); // null

		Test.stopTest();

		System.assertEquals('TestBody_1', attachmentBodies[0]);
		System.assertEquals('TestBody_2', attachmentBodies[1]);
		System.assertEquals('TestBody_3', attachmentBodies[2]);
		System.assertEquals('TestBody_4', attachmentBodies[3]);
		System.assertEquals('VGVzdEJvZHlfNA==', attachmentBodies[4]);
		System.assertEquals(null, attachmentBodies[5]);

	}

	@isTest
	public static void testPicklistOptions() {
		Test.startTest();
		Map<String, List <Map<String, Object>>> pickList = FrameRateManagerController.getPicklistOptions(new List<String>{
			'csconta__Status__c'
		});
		Test.stopTest();

		System.assertEquals(1, pickList.keySet().size());
	}

	@isTest
	public static void TestGetPointedObjectFromFa() {
		Test.startTest();

		String pointedObject = FrameRateManagerController.getPointedObjectFromFa('csconta__Pricing_Rule_Group__c');

		Test.stopTest();

		System.assertEquals('cspmb__Pricing_Rule_Group__c', pointedObject);
	}

	@isTest
	public static void testPriceItemDataEdgeCases() {
		FrameRateManagerControllerTest.setupSettings();
		cspmb__Price_Item__c cp_1 = new cspmb__Price_Item__c(
			cspmb__price_item_code__c = 'cp_1',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		insert cp_1;

		Test.startTest();
		Map<Id, List<FrameRateManagerController.RateCard>> emptyList = FrameRateManagerController.getRateCards(
			new List<Id>{ '01p1t00000M4Gqp' }
		);
		Test.stopTest();

		System.assertEquals(0, emptyList.keySet().size());
	}

	@isTest
	public static void testGetRateCardLines() {
		FrameRateManagerControllerTest.setupSettings();
		setupPricingModel();
		cspmb__Price_Item__c cp_1 = [
			select id
			from cspmb__Price_Item__c
			where name = 'cp_1'
			limit 1
		];

		Test.startTest();
		Map<Id, List<FrameRateManagerController.RateCard>> cpRcMap = FrameRateManagerController.getRateCards(
			new List<Id>{ cp_1.id }
		);
		Test.stopTest();

		System.assertEquals(1, cpRcMap.keySet().size(), 'one cp should equal to one item in the return list');
		for (List<FrameRateManagerController.RateCard> rcList : cpRcMap.values()) {
			System.assertEquals(1, rcList.size(), 'should be one rate card only');
			System.assertEquals(3, rcList[0].rateCardLines.size(), 'Only 3 out of 6 RCLs are returned');
		}
	}

	@isTest
	public static void testFrameAgreementMinorFunctions() {
		FrameRateManagerControllerTest.setupSettings();

		csconta__Frame_Agreement__c fa_1 = new csconta__Frame_Agreement__c();
		insert fa_1;

		Test.startTest();

		csconta__Frame_Agreement__c faGet = FrameRateManagerController.getFrameAgreement(fa_1.Id);
		String setStatusResult = FrameRateManagerController.setFrameAgreementState(fa_1.Id, 'Active');
		csconta__Frame_Agreement__c clonedFa = FrameRateManagerController.cloneFrameAgreement(fa_1.Id);
		String deleteResult = FrameRateManagerController.deleteFrameAgreement(fa_1.Id);
		Test.stopTest();
		System.assertNotEquals(null, faGet);
		System.assertEquals('Success', setStatusResult);
		System.assertNotEquals(null, clonedFa);
		System.assertEquals('Success', deleteResult);

	}

	@isTest
	public static void testFrameAgreementMasterFunctions() {

		setupPricingModel();

		Id fa_master_Id = [Select Id, csconta__Agreement_Name__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c = 'FA-Master'].Id;

		Set<Id> childFaSet = new Set<Id>(New Map<Id, csconta__Frame_Agreement__c>([Select Id, csconta__Agreement_Name__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c != 'FA-Master']).keySet());
		List <Id> childFaList = new List <Id> ();
		childFaList.addAll(childFaSet);

		Integer originalChildSize = childFaList.size();

		Integer faListWithMasterSetAfterAdd = 0;
		Integer faListWithMasterSetAfterDelete = 0;

		Test.startTest();
		FrameRateManagerController.addFaToMaster(fa_master_Id, childFaList);

		faListWithMasterSetAfterAdd = database.countQuery('select count() from csconta__Frame_Agreement__c where csconta__master_frame_agreement__c = :fa_master_Id');

		// Remove 1 id from the list
		childFaList.remove(0);
		// Delete the rest
		FrameRateManagerController.removeFaFromMaster(fa_master_Id, childFaList);
		// Should be 1
		faListWithMasterSetAfterDelete = database.countQuery('select count() from csconta__Frame_Agreement__c where csconta__master_frame_agreement__c = :fa_master_Id');

		Test.stopTest();

		System.assertEquals(originalChildSize, faListWithMasterSetAfterAdd);
		System.assertEquals(1, faListWithMasterSetAfterDelete);
	}

	@isTest
	public static void testAccountLookupErrors() {
		Test.startTest();

		String result1 = FrameRateManagerController.deleteAccountAssociation('01p1t00000M4Gqp');
		csconta__Account_Frame_Agreement_Association__c result2 = FrameRateManagerController.addAccountAssociation('01p1t00000M4Gqp', '01p1t00000M4Gqp');

		Test.stopTest();

		System.assertNotEquals('Success', result1);
		System.assertNotEquals(null, result2);
	}

	@isTest
	public static void testCloneFrameAgreementsWithCustomFields() {
		setupSettings();

		csutil__JSON_Data__c faCloneSettings = new csutil__JSON_Data__c(
			Name = 'FA-Clone', csutil__value__c = '["csconta__master_frame_agreement__c"]'
		);
		insert faCloneSettings;

		Account test_account = new Account(Name = 'TestAcc');
		insert test_account;

		csconta__Frame_Agreement__c masterFa = new csconta__Frame_Agreement__c(
			csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'masterFA1', csconta__agreement_level__c = 'Master Agreement'
		);
		insert masterFa;

		csconta__Frame_Agreement__c newFa = new csconta__Frame_Agreement__c(
			csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'FA1', csconta__Account__c = test_account.Id, csconta__master_frame_agreement__c = masterFa.Id
		);
		insert newFa;

		csconta__Frame_Agreement__c original = [
			select Id, csconta__master_frame_agreement__c, csconta__frame_agreement_number__c
			from csconta__Frame_Agreement__c
			where Id = :newFa.Id
			limit 1
		];

		Test.startTest();

		csconta__Frame_Agreement__c result = FrameRateManagerController.cloneFrameAgreement(newFa.Id);

		Test.stopTest();

		csconta__Frame_Agreement__c cloned = [
			select Id, csconta__master_frame_agreement__c, csconta__frame_agreement_number__c
			from csconta__Frame_Agreement__c
			where Id = :result.Id
			limit 1
		];

		System.assertEquals(original.csconta__master_frame_agreement__c, cloned.csconta__master_frame_agreement__c);
		System.assertNotEquals(original.csconta__frame_agreement_number__c, cloned.csconta__frame_agreement_number__c);
	}

	@isTest
	public static void testVersioningImpactOnEndDate() {
		Account test_account = new Account(name = 'TestAcc');
		insert test_account;

		Datetime futureDate = Datetime.now().addDays(1);

		csconta__Frame_Agreement__c originalFa = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_Name__c = 'FA1',
			csconta__effective_end_date__c = futureDate
		);
		insert originalFa;

		Test.startTest();

		csconta__Frame_Agreement__c result = FrameRateManagerController.createNewVersionOfFrameAgreement(originalFa.Id);

		Test.stopTest();

		originalFa = [
			select id, csconta__effective_end_date__c
			from csconta__Frame_Agreement__c
			where id = :originalFa.id
			limit 1
		];

		System.assertEquals(originalFa.csconta__effective_end_date__c, futureDate);
	}

	@isTest
	public static void testActivationImpactOnOldVersions() {
		Account test_account = new Account(name = 'TestAcc');
		insert test_account;

		String decomposeData = setupPricingModel();

		Datetime futureDate = Datetime.now().addDays(1);
		Datetime pastDate = Datetime.now().addDays(-1);

		csconta__Frame_Agreement__c originalFa = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = 'FA1',
			csconta__effective_end_date__c = futureDate
		);
		insert originalFa;

		csconta__Frame_Agreement__c originalFaWithNoEndDate = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = 'FA2',
			csconta__effective_end_date__c = null
		);
		insert originalFaWithNoEndDate;

		csconta__Frame_Agreement__c expiredOriginalFa = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = 'FA3',
			csconta__effective_end_date__c = pastDate
		);
		insert expiredOriginalFa;

		csconta__Frame_Agreement__c result = FrameRateManagerController.createNewVersionOfFrameAgreement(originalFa.id);
		Id prId = FrameRateManagerController.createPricingRuleGroup(result.id);

		csconta__Frame_Agreement__c resultFa2 =
			FrameRateManagerController.createNewVersionOfFrameAgreement(originalFaWithNoEndDate.id);
		Id prIdFa2 = FrameRateManagerController.createPricingRuleGroup(resultFa2.id);

		csconta__Frame_Agreement__c resultFa3 =
			FrameRateManagerController.createNewVersionOfFrameAgreement(expiredOriginalFa.id);
		Id prIdFa3 = FrameRateManagerController.createPricingRuleGroup(resultFa3.id);

		Test.startTest();

		FrameRateManagerController.decomposeAttachment(decomposeData, prId, result.id);
		FrameRateManagerController.decomposeAttachment(decomposeData, prIdFa2, resultFa2.id);
		FrameRateManagerController.decomposeAttachment(decomposeData, prIdFa3, resultFa3.id);

		Test.stopTest();

		originalFa = [
			select id, csconta__effective_end_date__c
			from csconta__Frame_Agreement__c
			where id = :originalFa.id
			limit 1
		];

		originalFaWithNoEndDate = [
			select id, csconta__effective_end_date__c
			from csconta__Frame_Agreement__c
			where id = :originalFaWithNoEndDate.id
			limit 1
		];

		expiredOriginalFa = [
			select id, csconta__effective_end_date__c
			from csconta__Frame_Agreement__c
			where id = :expiredOriginalFa.id
			limit 1
		];

		Date newEndDate = originalFa.csconta__effective_end_date__c.date();
		Date newEndDateFa2 = originalFaWithNoEndDate.csconta__effective_end_date__c.date();

		System.assertEquals(newEndDate, Date.today());
		System.assertEquals(newEndDateFa2, Date.today());
		System.assertEquals(expiredOriginalFa.csconta__effective_end_date__c, pastDate);
	}

	@IsTest
	private static void testGetUserLocale() {
		User u = createMockUserForProfile('System Administrator');

		System.runAs(u) {
			Test.startTest();
			Map<String, String> returnVal = FrameRateManagerController.getUserLocale();
			Test.stopTest();

			System.assertEquals(returnVal.get('userLocaleLang'), 'en');
			System.assertEquals(returnVal.get('userLocaleCountry'), 'US');
			System.assertEquals(returnVal.get('decimalSeparator'), '.');
		}
	}

	private static User createMockUser(Id profileId) {
		User u = new User(alias = 'TestUser', email = 'test@email.com',
			emailencodingkey = 'UTF-8', lastname = 'Testing',
			languagelocalekey = 'en_US', localesidkey = 'en_US', profileid = profileId,
			timezonesidkey = 'America/Los_Angeles', username = System.now().millisecond() + 'p***n.m****l@***.com');
		insert u;
		return u;
	}

	private static User createMockUserForProfile(String profileName) {
		Profile p = [SELECT Id FROM profile WHERE name like :profileName limit 1];

		return createMockUser(p.id);
	}

	private static Fac_Settings__c loadFacSettings() {
		return Fac_Settings__c.getInstance(UserInfo.getUserID());
	}

	@IsTest
	private static void testGetCatalogueId() {
		cspmb__Catalogue__c catalogue = new cspmb__Catalogue__c (
			name = 'catalogue-test'
		);
		insert catalogue;

		insert new csutil__JSON_Data__c (
			name = 'FA-defaultcatalogue', csutil__value__c = catalogue.id
		);

		Test.startTest();
		String resultCatalogue = FrameRateManagerController.getDefaultCatalogueId();
		Test.stopTest();

		System.assertEquals(catalogue.id, resultCatalogue);
	}

	@IsTest
	private static void testToThrowErrorGetCatalogueId() {
		cspmb__Catalogue__c catalogue = new cspmb__Catalogue__c (
			name = 'catalogue-test'
		);
		insert catalogue;

		insert new csutil__JSON_Data__c (
			name = 'FA-defaultcatalogue', csutil__value__c = ''
		);

		String exceptionMessage = '';

		Test.startTest();
		try {
			FrameRateManagerController.getDefaultCatalogueId();
			System.assert(false, 'above call should through an exception');
		} catch (Exception e) {
			exceptionMessage = e.getMessage();
		}
		Test.stopTest();

		System.assertEquals(exceptionMessage, FrameRateManagerController.NO_CATALOGUE_ID_MSG);
	}

	//TODO: add test for partner user, there is a licensing issue in scratch org, we will take this later on
	@IsTest
	private static void testOrgUrl() {
		User user = createMockUserForProfile('System Administrator');

		System.runAs(user) {
			Test.startTest();
			String returnedOrgUrl = FrameRateManagerController.getOrgUrl();
			Test.stopTest();

			System.assertNotEquals(returnedOrgUrl, null);
		}
	}

	@IsTest
	public static void testToGetDSAuthToken() {
		Test.startTest();
		DispatcherServiceController.DispatcherServiceToken response = FrameRateManagerController.getDispatcherAuthToken('fam/app');
		Test.stopTest();

		System.assertEquals(response.token, 'TOKEN');
	}

	@IsTest
	public static void testGetHiddenTabConfig() {
		insert new csutil__JSON_Data__c(
			name = 'FA-hiddentabs', csutil__value__c = '["product"]'
		);

		Test.startTest();
		Map<String, Boolean> responseMap = FrameRateManagerController.getHiddenTabConfig();
		Test.stopTest();

		System.assertEquals(responseMap.size(), 1);
		System.assertEquals(responseMap.get('product'), true);
	}

	@IsTest
	public static void testNullOnGetHiddenTabConfig() {
		Test.startTest();
		Map<String, Boolean> responseMap = FrameRateManagerController.getHiddenTabConfig();
		Test.stopTest();

		System.assertEquals(responseMap.size(), 0);
	}

	@isTest
	public static void getCommercialProductsWithInitialCategorizationFilter() {
		setupPricingModel();
		setupSettings();
		insert new csutil__JSON_Data__c(
			name = 'FA-Initial-Categorization',
			csutil__value__c = '[{"name": "Alpha","field": "cspmb__Role__c","values": ["Master"]}]'
		);

		List<cspmb__Price_Item__c> results = [
			select Id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp : results) {
			cpIdList.add(cp.Id);
		}

		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		Test.startTest();

		List<cspmb__Price_Item__c> getCommercialProducts = FrameRateManagerController.getCommercialProducts(cpIdList);

		Test.stopTest();

		System.assertEquals(5, cpIdList.size());
		System.assertEquals(4, getCommercialProducts.size());
	}

	public static testMethod void testFilterCommercialProductsReturnsEmpty() {
		setupPricingModel();
		setupSettings();
		String data = '[{"name":"Alpha","field":"cspmb__Discount_Type__c","values":["Percentage","Amount","Negative Line Item"]}]';

		Test.startTest();

		List<cspmb__Price_Item__c> filteredCp = FrameRateManagerController.filterCommercialProducts(data);

		Test.stopTest();

		System.assertEquals(0, filteredCp.size(), 'should return 0 cps because there is no discount type in test data');

	}

	@isTest
	public static void testFilterCommercialProducts() {
		setupPricingModel();
		setupSettings();
		String data = '[{"name":"Alpha","field":"name","values":["cp_1"]}]';

		Test.startTest();

		List<cspmb__Price_Item__c> filteredCp = FrameRateManagerController.filterCommercialProducts(data);

		Test.stopTest();

		System.assertEquals(1, filteredCp.size());
		System.assertEquals('cp_1', filteredCp[0].name);
	}

	@isTest
	public static void testFilterCommercialProductsThrowsException() {
		setupPricingModel();
		setupSettings();
		String malformedData= '[{"name":"Alpha""field":"name","values":["cp_1"]}]';

		Test.startTest();
		try {
			FrameRateManagerController.filterCommercialProducts(malformedData);
			System.assert(false, 'Should always throw exception on malformed json.');
		} catch (Exception e) {
			System.assertEquals(true, e.getMessage().startsWith('JSON value is malformed'));
		}
		Test.stopTest();
	}

	public static testMethod void testFilterWithMultipleConditions() {
		cspmb__Price_Item__c mobileL = new cspmb__Price_Item__c(
			name = 'Mobile L',
			cspmb__contract_term__c = '36 Months',
			cspmb__discount_type__c = 'Amount',
			cspmb__is_active__c = true,
			cspmb__role__c = 'Basic',
			cspmb__type__c = 'Commercial Product',
			cspmb__price_item_code__c = 'cp_1'
		);

		cspmb__Price_Item__c mobileXL = new cspmb__Price_Item__c(
			name = 'Mobile XL',
			cspmb__contract_term__c = '48 Months',
			cspmb__discount_type__c = 'Percentage',
			cspmb__is_active__c = true,
			cspmb__role__c = 'Basic',
			cspmb__type__c = 'Commercial Product',
			cspmb__price_item_code__c = 'cp_2'
		);

		cspmb__Price_Item__c mobileXXL = new cspmb__Price_Item__c(
			name = 'Mobile XXL',
			cspmb__contract_term__c = '60 Months',
			cspmb__discount_type__c = 'Negative Line Item',
			cspmb__is_active__c = true,
			cspmb__role__c = 'Basic',
			cspmb__type__c = 'Commercial Product',
			cspmb__price_item_code__c = 'cp_3'
		);

		insert mobileL;
		insert mobileXL;
		insert mobileXXL;

		String data = '[{"name":"Alpha","field":"cspmb__Discount_Type__c","values":["Percentage"]},{"name":"Beta","field":"cspmb__contract_term__c","values":["36 Months"]}]';

		Test.startTest();

		List<cspmb__Price_Item__c> filteredCp = FrameRateManagerController.filterCommercialProducts(data);

		Test.stopTest();

		Set<Id> filteredIds = new Set<Id>();

		for (cspmb__Price_Item__c cp: filteredCp) {
			filteredIds.add(cp.id);
		}

		System.assertEquals(2, filteredCp.size());
		System.assertEquals(true, filteredIds.contains(mobileL.id), 'Contains MobileL');
		System.assertEquals(true, filteredIds.contains(mobileXL.id), 'Contains MobileXL');
		System.assertEquals(false, filteredIds.contains(mobileXXL.id), 'Does not contain MobileXXL');

	}

	@IsTest
	public static void testFaOfferCategoryCreation() {
		setupPricingModel();
		setupSettings();

		List<PRECategory> stdPreCategoryList = setUpPRECategory();
		csconta__Frame_Agreement__c newFa = FrameRateManagerController.upsertFrameAgreements(null, '{"csconta__Agreement_Name__c":"FA1_CHANGED","csconta__Status__c":"Draft","csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}', stdPreCategoryList);

		List<cspmb__Catalogue_Category_Association__c> faCatalogueCategory = [
			select id, cspmb__product_category__c
			from cspmb__Catalogue_Category_Association__c where cspmb__catalogue__c = :newFa.csconta__catalogue__c
		];

		Test.startTest();

		FrameRateManagerController.createFaOfferCategory(newFa.id);

		Test.stopTest();

		List<cspmb__Catalogue_Category_Association__c> updatedFaCatalogueCategory = [
			select id, cspmb__product_category__c
			from cspmb__Catalogue_Category_Association__c where cspmb__catalogue__c = :newFa.csconta__catalogue__c
		];

		System.assertEquals(faCatalogueCategory.size() + 1, updatedFaCatalogueCategory.size());
	}

	@IsTest
	public static void testFaOfferCreation() {
		setupPricingModel();
		setupSettings();
		FaPlmServiceTest.setupPLMPricingRule();

		List<PRECategory> stdPreCategoryList = setUpPRECategory();
		csconta__Frame_Agreement__c newFa = FrameRateManagerController.upsertFrameAgreements(null, '{"csconta__Agreement_Name__c":"FA1_CHANGED","csconta__Status__c":"Draft","csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}', stdPreCategoryList);

		List<cspmb__Catalogue_Category_Association__c> faCatalogueCategory = [
			select id, cspmb__product_category__c
			from cspmb__Catalogue_Category_Association__c where cspmb__catalogue__c = :newFa.csconta__catalogue__c
		];

		cspmb__Product_Category__c offerCategory = FrameRateManagerController.createFaOfferCategory(newFa.id);

		cspmb__Price_Item__c cp = [
			select id from cspmb__Price_Item__c
			where name = :SAMPLE_CP_NAME
		];

		Test.startTest();

		cspmb__Price_Item__c createdOffer = FrameRateManagerController.createFaOffer(newFa.id, cp.id, offerCategory.id);

		Test.stopTest();

		System.assertNotEquals(offerCategory.id, null);

		List<cspmb__Commercial_Product_Category_Association__c> offerCategoryAssociation = [
			select id
			from cspmb__Commercial_Product_Category_Association__c
			where cspmb__commercial_product__c = :createdOffer.id and cspmb__product_category__c = :offerCategory.id
		];

		System.assertEquals(createdOffer.cspmb__master_price_item__c, cp.id);
		System.assertNotEquals(offerCategoryAssociation.size(), 0);
	}

	@IsTest
	public static void testFaOfferDeletion() {
		setupPricingModel();
		setupSettings();
		FaPlmServiceTest.setupPLMPricingRule();

		List<PRECategory> stdPreCategoryList = setUpPRECategory();
		csconta__Frame_Agreement__c newFa = FrameRateManagerController.upsertFrameAgreements(null, '{"csconta__Agreement_Name__c":"FA1_CHANGED","csconta__Status__c":"Draft","csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}', stdPreCategoryList);

		List<cspmb__Catalogue_Category_Association__c> faCatalogueCategory = [
			select id, cspmb__product_category__c
			from cspmb__Catalogue_Category_Association__c where cspmb__catalogue__c = :newFa.csconta__catalogue__c
		];

		cspmb__Product_Category__c offerCategory = FrameRateManagerController.createFaOfferCategory(newFa.id);

		cspmb__Price_Item__c cp = [
			select id from cspmb__price_item__c
			where name = :SAMPLE_CP_NAME
		];

		cspmb__Price_Item__c createdOffer = FrameRateManagerController.createFaOffer(
			newFa.id, cp.id, offerCategory.id
		);

		Test.startTest();

		FrameRateManagerController.deleteFaOffers(new List<Id>{ createdOffer.id });

		Test.stopTest();

		System.assertNotEquals(offerCategory.id, null);

		List<cspmb__Price_Item__c> offer = [
			select id
			from cspmb__Price_Item__c
			where id = :createdOffer.id
		];

		System.assertEquals(offer.size(), 0);
	}

	@isTest
	public static void testGetChildFrameAgreements() {
		csconta__Frame_Agreement__c faMaster = new csconta__Frame_Agreement__c(
			csconta__agreement_name__c = 'FA-Master',
			csconta__agreement_level__c = 'Master Agreement'
		);
		insert faMaster;

		insert new csconta__Frame_Agreement__c(
			csconta__agreement_name__c = 'FA-child-one',
			csconta__master_frame_agreement__c = faMaster.Id
		);

		insert new csconta__Frame_Agreement__c(
			csconta__Agreement_Name__c = 'FA-child-two',
			csconta__master_frame_agreement__c = faMaster.Id
		);

		insert new csconta__Frame_Agreement__c(
		  	csconta__Agreement_Name__c = 'FA-child-three',
			csconta__master_frame_agreement__c = faMaster.Id
		);

		Test.startTest();
		List<csconta__Frame_Agreement__c> childFas = FrameRateManagerController.getChildFrameAgreements(
			faMaster.Id
		);
		Test.stopTest();

		System.assertEquals(3, childFas.size());
	}
}
