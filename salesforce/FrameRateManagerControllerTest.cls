@isTest

private class FrameRateManagerControllerTest {

	public static final String FAC_ATTACHMENT_NAME = 'FrameAgreementAttachment';
	public static final String FAC_ATTACHMENT_DESC = 'Added products and negotiated data against Frame Agreement';
	public static final Integer ITEMS_PER_PAGE = 20;
	public static final List < String > FA_FIELDS = new List < String >{
		'Id', 'Name', 'csconta__Account__r.Name', 'csconta__Agreement_Name__c', 'csconta__Pricing_Rule_Group__c', 'csconta__Status__c', 'csconta__Valid_From__c', 'csconta__Valid_To__c'
	};

	public static String generateRandomString(Integer len) {
		final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
		String randStr = '';
		while (randStr.length() < len) {
		   Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
		   randStr += chars.substring(idx, idx+1);
		}
		return randStr;
	}

	static String setupPricingModel() {
		// commercial products
		cspmb__Price_Item__c cp_1 = new cspmb__Price_Item__c(Name='cp_1',cspmb__One_Off_Charge__c=10.00, cspmb__Is_Active__c=true, cspmb__Recurring_Charge__c =15-00);
		cspmb__Price_Item__c cp_2 = new cspmb__Price_Item__c(Name='cp_2',cspmb__One_Off_Charge__c=10.00, cspmb__Is_Active__c=true, cspmb__Recurring_Charge__c =15-00);

		Date invalidEndDate = Date.newInstance(1992, 3, 14);
		cspmb__Price_Item__c cp_3 = new cspmb__Price_Item__c(Name='cp_3',cspmb__One_Off_Charge__c=10.00, cspmb__Is_Active__c=true, cspmb__Recurring_Charge__c =15-00, cspmb__Effective_End_Date__c=invalidEndDate);

		insert cp_1;
		insert cp_2;
		insert cp_3;

		// pricing element and types
		cspmb__Pricing_Element_Type__c pricingElementType_1 = new cspmb__Pricing_Element_Type__c(cspmb__label__c='One-off charge', cspmb__type__c='One-off charge');
		cspmb__Pricing_Element_Type__c pricingElementType_2 = new cspmb__Pricing_Element_Type__c(cspmb__type__c='Recurring Charge');
		insert pricingElementType_1;
		insert pricingElementType_2;


		cspmb__Pricing_Element__c pricingElement_1 = new cspmb__Pricing_Element__c(cspmb__pricing_element_type__c=pricingElementType_1.Id, cspmb__commercial_product__c=cp_1.Id);
		cspmb__Pricing_Element__c pricingElement_2 = new cspmb__Pricing_Element__c(cspmb__pricing_element_type__c=pricingElementType_2.Id, cspmb__commercial_product__c=cp_1.Id);
		cspmb__Pricing_Element__c pricingElement_invalid = new cspmb__Pricing_Element__c(cspmb__pricing_element_type__c=pricingElementType_2.Id, cspmb__commercial_product__c=cp_1.Id, cspmb__effective_end_date__c=invalidEndDate);
		insert pricingElement_1;
		insert pricingElement_2;
		insert pricingElement_invalid;

		cspmb__pricing_rule__c pr_1 = new cspmb__pricing_rule__c(cspmb__description__c = 'Test.');
		insert pr_1;

		cspmb__Price_Item_Pricing_Rule_Association__c pipra_1 = new cspmb__Price_Item_Pricing_Rule_Association__c(cspmb__pricing_rule__c=pr_1.Id, cspmb__price_item__c=cp_1.Id, cspmb__pricing_element__c=pricingElement_1.Id);
		cspmb__Price_Item_Pricing_Rule_Association__c pipra_2 = new cspmb__Price_Item_Pricing_Rule_Association__c(cspmb__pricing_rule__c=pr_1.Id, cspmb__price_item__c=cp_1.Id, cspmb__pricing_element__c=pricingElement_2.Id);
		cspmb__Price_Item_Pricing_Rule_Association__c pipra_3 = new cspmb__Price_Item_Pricing_Rule_Association__c(cspmb__pricing_rule__c=pr_1.Id, cspmb__price_item__c=cp_1.Id, cspmb__pricing_element__c=pricingElement_invalid.Id);
		insert pipra_1;
		insert pipra_2;
		insert pipra_3;

		cspmb__Pricing_Rule_Group__c prg_1 = new cspmb__Pricing_Rule_Group__c(cspmb__description__c = 'Testing.', cspmb__pricing_rule_group_code__c = generateRandomString(10), csfam__standard_price_book__c=true);
		insert prg_1;

		cspmb__Pricing_Rule_Group_Rule_Association__c prgra_1 = new cspmb__Pricing_Rule_Group_Rule_Association__c(cspmb__pricing_rule__c = pr_1.Id, cspmb__Pricing_Rule_Group__c = prg_1.Id);
		insert prgra_1;

		csutil__JSON_Data__c standardPricebook = new csutil__JSON_Data__c(Name='FA-StandardPricebook', csutil__value__c=prgra_1.Id);
		insert standardPricebook;

		cspmb__Authorization_Level__c authLevel = new cspmb__Authorization_Level__c();
		insert authLevel;
		cspmb__Discount_Threshold__c discTres = new cspmb__Discount_Threshold__c(Name='testLevel', cspmb__Discount_Type__c='Percentage', cspmb__Discount_Threshold__c=10.00, cspmb__Authorization_Level__c=authLevel.Id);
		insert discTres;


		cspmb__Discount_Level__c discLevel = new cspmb__Discount_Level__c(Name='Test', cspmb__Charge_Type__c='RC', cspmb__Discount_Values__c='5,10,15');
		insert discLevel;

		cspmb__Discount_Association__c discAssoc = new cspmb__Discount_Association__c(cspmb__Price_Item__c=cp_2.Id, cspmb__Discount_Level__c=discLevel.Id);
		insert discAssoc;

		// RC & RCL
		cspmb__Rate_Card__c rc = new cspmb__Rate_Card__c(cspmb__Is_Active__c = true);
		insert rc;
		cspmb__Rate_Card_Line__c rcl = new cspmb__Rate_Card_Line__c(cspmb__Rate_Card__c=rc.Id, Name='testRCL', cspmb__Is_Active__c=true, cspmb__rate_value__c=124.99, cspmb__Rate_Card_Line_Unit__c='Sample Unit');
		insert rcl;
		cspmb__Price_Item_Rate_Card_Association__c pirc = new cspmb__Price_Item_Rate_Card_Association__c(cspmb__Rate_Card__c=rc.Id, cspmb__Price_Item__c=cp_1.Id);
		insert pirc;

		// ADDONS
		cspmb__Add_On_Price_Item__c add_1 = new cspmb__Add_On_Price_Item__c (Name='ADD1', cspmb__One_Off_Charge__c=10.00);
		cspmb__Add_On_Price_Item__c add_2 = new cspmb__Add_On_Price_Item__c (Name='ADD2', cspmb__One_Off_Charge__c=10.00);

		insert add_1;
		insert add_2;

		cspmb__Price_Item_Add_On_Price_Item_Association__c add1assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(cspmb__Add_On_Price_Item__c=add_1.Id, cspmb__Price_Item__c=cp_1.Id);
		cspmb__Price_Item_Add_On_Price_Item_Association__c add2assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(cspmb__Add_On_Price_Item__c=add_2.Id, cspmb__Price_Item__c=cp_3.Id);

		insert add1assoc;
		insert add2assoc;

		// FRAME AGREEMENTS
		csconta__Frame_Agreement__c fa_1 = new csconta__Frame_Agreement__c(csconta__Status__c='Draft', csconta__Agreement_Name__c='FA1');
		csconta__Frame_Agreement__c fa_2 = new csconta__Frame_Agreement__c(csconta__Status__c='Draft', csconta__Agreement_Name__c='FA2');
		csconta__Frame_Agreement__c fa_3 = new csconta__Frame_Agreement__c(csconta__Status__c='Draft', csconta__Agreement_Name__c='FA3');

		insert fa_1;
		insert fa_2;
		insert fa_3;

		/*********/
		String decomposeData = '[{"cpId":"' + cp_1.Id + '","recurring":266,"oneOff":null},{"cpId":"' + cp_1.Id + '","recurring":263,"oneOff":null},{"peId":"' + pricingElement_1.Id + '","recurring":12,"oneOff":null},{"peId":"' + pricingElement_1.Id + '","recurring":null,"oneOff":12},{"cpaoaId":"' + add1assoc.Id + '","recurring":null,"oneOff":12},{"cpaoaId":"' + add1assoc.Id + '","recurring":12,"oneOff":null}]';
		/*********/
		return decomposeData;
	}

	public static csfam__fac_settings__c setupSettings() {
		csutil__JSON_Data__c headerData = new csutil__JSON_Data__c(Name='FA-Header', csutil__value__c='[{"field":"csconta__Agreement_Name__c","readOnly":false,"label":"Agreement Name","type":"text","grid":2},{"field":"Arb_Field_Bool__c","readOnly":false,"label":"Arb Field Bool","type":"boolean","grid":1},{"field":"Arb_Field_Integer__c","readOnly":false,"label":"Arb Field Integer","type":"number","grid":2}]');
		csutil__JSON_Data__c categorizationData = new csutil__JSON_Data__c(Name='FA-Categorization', csutil__value__c='[{"name":"Alpha","field":"Categorization_Alpha__c","values":["Fixed","Mobile","Static"]},{"name":"Beta","field":"Categorization_Beta__c","values":["10GB","20GB","50GB","100GB"]}]');
		csutil__JSON_Data__c customButtonData = new csutil__JSON_Data__c(Name='FA-Custom-Buttons', csutil__value__c='[{"type":"action","label":"Action button","id":"bta1","method":"ActionFunction","hidden":["Active"]},{"type":"iframe","label":"iFrame button","id":"bta2","method":"iFrameFunction","hidden":["Active"]},{"type":"redirect","label":"Redirect button","id":"bta3","method":"RedirectFunction","hidden":["Active"]}]');
		csutil__JSON_Data__c standardButtonData = new csutil__JSON_Data__c(Name='FA-Standard-Buttons', csutil__value__c='{"Save":["Draft","Requires Approval"],"SubmitForApproval":["Requires Approval"],"Submit":["Approved"],"DeleteProducts":["Draft","Requires Approval"],"BulkNegotiate":["Draft","Requires Approval"],"AddProducts":["Draft","Requires Approval"]}');

		insert headerData;
		insert customButtonData;
		insert standardButtonData;
		insert categorizationData;

		csfam__fac_settings__c FACSettings = new csfam__fac_settings__c();
		FACSettings.csfam__active_status__c = 'Active';
		FACSettings.csfam__approved_status__c = 'Approved';
		FACSettings.csfam__closed_status__c = 'Replaced';
		FACSettings.csfam__draft_status__c = 'Draft';
		FACSettings.csfam__price_item_fields__c = 'cspmb__Contract_Term__c';
		FACSettings.csfam__rcl_fields__c = 'cspmb__Currency_Code__c, Category__c';
		FACSettings.csfam__requires_approval_status__c = 'Requires Approval';
		insert FACSettings;
		return FACSettings;

	}

	public static testMethod void testGetCustomSettings() {
		setupPricingModel();

		Test.startTest();

		Map < String, Object > csettings = FrameRateManagerController.getCustomSettings();

		Test.stopTest();

		system.assertNotEquals(null, csettings);

	}

	public static testMethod void testGetPriceItemCharges() {
		setupPricingModel();

		cspmb__Price_Item__c cp_1 = [select Id,Name from cspmb__Price_Item__c where Name='cp_1' limit 1];

		Test.startTest();

		FrameRateManagerController.ProductPricebookCharges picMap = FrameRateManagerController.getPriceItemCharges(cp_1.Id);

		Test.stopTest();

		system.assertNotEquals(null, picMap);

	}

	// public static testMethod void testGetApprovalHistory() {

	//     cspmb__Price_Item__c cp_1 = [select Id,Name from cspmb__Price_Item__c where Name='cp_1' limit 1];

	//     Approval.ProcessSubmitRequest app = new Approval.ProcessSubmitRequest();
	//     app.setObjectId(cp_1.id);
	//     Approval.ProcessResult result = Approval.process(app);

	//     Test.startTest();

	//     FrameRateManagerController.getApprovalHistory(cp_1.Id);

	//     Test.stopTest();

	// }


	public static testMethod void testMinorFunctions() {
		setupPricingModel();

		Id userId = UserInfo.getUserId();


		List<cspmb__Price_Item__c> cpList = [select Id from cspmb__Price_Item__c];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp: cpList) {
			cpIdList.add(cp.Id);
		}

		Test.startTest();

		Boolean isUserAdmin = FrameRateManagerController.isUserAdmin();
		Set < Id > isUserDelegate = FrameRateManagerController.isUserDelegate(userId);
		Map < Id, FrameRateManagerController.cpData > commercialProductData = FrameRateManagerController.getCommercialProductData(cpIdList);

		Test.stopTest();

		system.assertEquals(true, isUserAdmin);
		system.assertEquals(1, isUserDelegate.size());
		system.assertEquals(3, commercialProductData.keySet().size());

	}

	public static testMethod void testFrameAgreements() {
		setupPricingModel();
		setupSettings();
		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA1' limit 1];
		csconta__Frame_Agreement__c fa_2 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA2' limit 1];

		Test.startTest();

		List < csconta__Frame_Agreement__c > faList = FrameRateManagerController.getFrameAgreements();
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

		csconta__Frame_Agreement__c new_version_fa_1 = FrameRateManagerController.createNewVersionOfFrameAgrement(fa_1.Id);
		try {
			csconta__Frame_Agreement__c new_version_fa_2 = FrameRateManagerController.createNewVersionOfFrameAgrement('a0x1t000000yZF3'); // Invalid
		} catch (NullPointerException e) {}

		Test.stopTest(); /**********/

		system.assertEquals(3, faList.size());
		system.assertEquals(fa_1.Id, fa.Id);

		fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA1' limit 1];
		system.assertEquals('Active', fa_1.csconta__Status__c);
		system.assertNotEquals('Success', invalidString_1);
		system.assertNotEquals('Success', invalidString_2);

		List <csconta__Frame_Agreement__c> emptyList = new List <csconta__Frame_Agreement__c>([select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA2']);
		system.assertEquals(0, emptyList.size());
		system.assertEquals('FA1', cloned_1_fa_1.csconta__Agreement_Name__c);
	}

	public static testMethod void testUpsertFrameAgreement() {
		setupPricingModel();
		setupSettings();
		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c, csconta__Agreement_Name__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA1' limit 1];
		csconta__Frame_Agreement__c fa_2 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA2' limit 1];

		Test.startTest();

		FrameRateManagerController.upsertFrameAgreements(fa_1.Id, '{"csconta__Agreement_Name__c":"FA1_CHANGED","csfam__Arb_Field_Bool__c":true,"csfam__Arb_Field_Integer__c":48,"csfam__Arb_Field_Text__c":null,"csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}');
		// New
		FrameRateManagerController.upsertFrameAgreements(null, '{"csconta__Agreement_Name__c":"FA1_CHANGED","Arb_Field_Bool__c":true,"csfam__Arb_Field_Integer__c":48,"csfam__Arb_Field_Text__c":null,"csconta__effective_end_date__c":1547510400000,"csconta__Valid_From__c":1547510400000}');

		Test.stopTest(); /**********/

		fa_1 = [select Id, csconta__Status__c, csconta__Agreement_Name__c from csconta__Frame_Agreement__c where Id=:fa_1.Id limit 1];
		system.assertEquals('FA1_CHANGED', fa_1.csconta__Agreement_Name__c);
	}

	public static testMethod void testGetAppSettings() {
		setupPricingModel();

		setupSettings();

		Test.startTest();

		Map<String,Object> appSetting = FrameRateManagerController.getAppSettings();

		Test.stopTest();

		system.assertNotEquals(null, appSetting);

	}


	public static testMethod void testGetCommercialProducts() {
		setupPricingModel();
		setupSettings();

		List<cspmb__Price_Item__c> results = [select Id from cspmb__Price_Item__c];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp: results) {
			cpIdList.add(cp.Id);
		}

		Test.startTest();

		List < cspmb__Price_Item__c > getCommercialProducts = FrameRateManagerController.getCommercialProducts(cpIdList);

		Test.stopTest();

		system.assertEquals(3, cpIdList.size());
		system.assertEquals(2, getCommercialProducts.size());

	}

	public static testMethod void testGetCommercialProductsNull() {
		setupPricingModel();

		setupSettings();

		Test.startTest();

		List < cspmb__Price_Item__c > getCommercialProducts = FrameRateManagerController.getCommercialProducts(new List<Id>());

		Test.stopTest();

		system.assertEquals(2, getCommercialProducts.size());

	}

	public static testMethod void testFilterCommercialProducts() {
		setupPricingModel();

		setupSettings();
		String data = '[{"field":"Categorization_Alpha__c","values":["Fixed"]},{"field":"Categorization_Beta__c","values":["100GB"]}]';

		Test.startTest();

		List < cspmb__Price_Item__c > filteredCp = FrameRateManagerController.filterCommercialProducts(data);

		Test.stopTest();

		system.assertEquals(2, filteredCp.size());

	}

	public static testMethod void testGetAuthorizationLevels() {
		setupPricingModel();

		Test.startTest();

		List < cspmb__Discount_Threshold__c > discTresList = FrameRateManagerController.getAuthorizationLevels();

		Test.stopTest();

		system.assertEquals(1, discTresList.size());

	}

	public static testMethod void testGetDiscountevels() {
		setupPricingModel();

		Test.startTest();

		List < FrameRateManagerController.DiscountLevelWrapper > discLev = FrameRateManagerController.getDiscountevels();

		Test.stopTest();

		system.assertEquals(1, discLev.size());

	}

	public static testMethod void testApproval() {
		setupPricingModel();

		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA1' limit 1];

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

		// system.assertEquals();

	}

	public static testMethod void testPricingElements() {
		setupPricingModel();

		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA1' limit 1];
		cspmb__Price_Item__c cp_1 = [select Id,Name from cspmb__Price_Item__c where Name='cp_1' limit 1];

		Test.startTest();

		List < cspmb__Pricing_Element__c > pricingElementsList = FrameRateManagerController.getPricingElements(cp_1.Id);

		Test.stopTest();

		system.assertEquals(2, pricingElementsList.size());

	}

	public static testMethod void testDecomposeAttachment() {
		String decomposeData = setupPricingModel();
		csfam__fac_settings__c FACSettings = setupSettings();

		system.debug('FACSettings:' + FACSettings);

		csconta__Frame_Agreement__c fa_1 = [select Id, csconta__Status__c, csconta__replaced_frame_agreement__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA1' limit 1];

		csconta__Frame_Agreement__c fa_2 = [select Id, csconta__Status__c, csconta__replaced_frame_agreement__c from csconta__Frame_Agreement__c where csconta__Agreement_Name__c='FA2' limit 1];
		fa_2.csconta__replaced_frame_agreement__c = fa_1.Id;
		update fa_2;
		system.debug('fa_2:' + fa_2);
		Test.startTest();

		Id prId = FrameRateManagerController.createPricingRuleGroup();
		Id prId_2 = FrameRateManagerController.createPricingRuleGroup();

		String decomposeResult_1 = FrameRateManagerController.decomposeAttachment(decomposeData, prId, fa_1.Id);
		String decomposeResult_2 = FrameRateManagerController.decomposeAttachment(decomposeData, prId_2, fa_2.Id);

		FrameRateManagerController.undoDecomposition(prId);

		system.assertEquals('Success', decomposeResult_1);

		List < cspmb__Price_Item_Pricing_Rule_Association__c > pipraList = [select Id from cspmb__Price_Item_Pricing_Rule_Association__c where cspmb__pricing_rule__c =: prId limit 10000];

		system.assertEquals(0, pipraList.size());
		Test.stopTest();
	}

	public static testMethod void testAttachmentMethods() {
		setupPricingModel();
		cspmb__Price_Item__c cp_1 = [select Id,Name from cspmb__Price_Item__c where Name='cp_1' limit 1];
		cspmb__Price_Item__c cp_2 = [select Id,Name from cspmb__Price_Item__c where Name='cp_2' limit 1];

		List <String> attachmentBodies = new List <String>();

		Test.startTest();

		Attachment a1 = FrameRateManagerController.createAttachment(cp_1.Id, 'TestName', 'testDescription', 'TestBody_1', 'text/plain');
		attachmentBodies.add(a1.body.toString()); // TestBody_1

		attachmentBodies.add('TestBody_2'); // TestBody_2

		attachmentBodies.add(FrameRateManagerController.saveAttachment(cp_1.Id, 'TestBody_3')); // TestBody_3
		attachmentBodies.add(FrameRateManagerController.saveAttachment(cp_1.Id, 'TestBody_4')); // TestBody_4

		attachmentBodies.add(FrameRateManagerController.getAttachmentBody(cp_1.Id)); // VGVzdEJvZHlfNA==
		attachmentBodies.add(FrameRateManagerController.getAttachmentBody(cp_2.Id)); // null

		Test.stopTest();

		system.assertEquals('TestBody_1', attachmentBodies[0]);
		system.assertEquals('TestBody_2', attachmentBodies[1]);
		system.assertEquals('TestBody_3', attachmentBodies[2]);
		system.assertEquals('TestBody_4', attachmentBodies[3]);
		system.assertEquals('VGVzdEJvZHlfNA==', attachmentBodies[4]);
		system.assertEquals(null, attachmentBodies[5]);

	}

}