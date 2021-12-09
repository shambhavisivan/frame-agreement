@isTest
private class API_1Test {

	private static final String NO_ATTACH_FA_NAME = 'FA1';
	private static final String VALID_FA_NAME = 'FA2';
	private static final String TWO_ATTACH_FA_NAME = 'FA3';

	static void setupData() {
		Account test_account = new Account(name = 'TestAcc');
		insert test_account;

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
		facSettings.decomposition_chunk_size__c = 5;
		insert facSettings;

		// commercial products
		cspmb__Price_Item__c cp_1 = new cspmb__Price_Item__c(
			name = 'cp_1',
			cspmb__one_off_charge__c = 10,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15,
			cspmb__Price_Item_Code__c = 'cp_1',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_no_prices = new cspmb__Price_Item__c(
			name = 'cp_no_prices',
			cspmb__is_active__c = true,
			cspmb__Price_Item_Code__c = 'cp_no_prices',
			cspmb__Type__c = 'Commercial Product',
			cspmb__Role__c = 'Basic'
		);
		insert cp_1;
		insert cp_no_prices;

		// pricing element and types
		cspmb__Pricing_Element_Type__c pricingElementType_1 = new cspmb__Pricing_Element_Type__c(
			cspmb__label__c = 'One-off charge',
			cspmb__type__c = 'One-off charge'
		);
		cspmb__Pricing_Element_Type__c pricingElementType_2 = new cspmb__Pricing_Element_Type__c(
			cspmb__label__c = 'Recurring Charge',
			cspmb__type__c = 'Recurring Charge'
		);
		insert pricingElementType_1;
		insert pricingElementType_2;

		cspmb__Pricing_Element__c pricingElement_1 = new cspmb__Pricing_Element__c(
			cspmb__pricing_element_type__c = pricingElementType_1.Id
		);
		insert pricingElement_1;

		// ADDONS
		cspmb__Add_On_Price_Item__c add_1 = new cspmb__Add_On_Price_Item__c(
			name = 'ADD1',
			cspmb__billing_frequency__c = 'Monthly',
			cspmb__is_active__c = true
		);
		cspmb__Add_On_Price_Item__c add_standalone = new cspmb__Add_On_Price_Item__c(
			name = 'ADD2',
			cspmb__billing_frequency__c = 'Monthly',
			cspmb__is_active__c = true,
			cspmb__one_off_charge__c = 32,
			cspmb__recurring_charge__c = 23
		);
		insert add_1;
		insert add_standalone;

		cspmb__Price_Item_Add_On_Price_Item_Association__c add1assoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
			cspmb__add_on_price_item__c = add_1.Id,
			cspmb__price_item__c = cp_1.Id,
			cspmb__recurring_charge__c = 7,
			cspmb__overrides_add_on_charges__c = true
		);
		insert add1assoc;

		// FRAME AGREEMENTS
		csconta__Frame_Agreement__c fa_1 = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = NO_ATTACH_FA_NAME,
			csconta__account__c = test_account.Id
		);
		csconta__Frame_Agreement__c fa_2 = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = VALID_FA_NAME,
			csconta__account__c = test_account.Id
		);
		csconta__Frame_Agreement__c fa_3 = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = TWO_ATTACH_FA_NAME,
			csconta__account__c = test_account.Id
		);
		insert fa_1;
		insert fa_2;
		insert fa_3;

		// cp_1, add1assoc, pricingElement_1, add_standalone, cp_no_prices -> has to create cppra for every except cp_no_prices
		String body = '{"custom":{},"products":{"' +
			cp_1.id + '":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_addons":{"' +
			add1assoc.id + '":{"oneoff":' + add1assoc.cspmb__one_off_charge__c + ',"recurring":' + add1assoc.cspmb__recurring_charge__c +
			'}},"_charges":{"' + pricingelement_1.id +'":{"oneoff":17,"recurring":18}},"_product":{"oneoff":' +
			cp_1.cspmb__one_off_charge__c + ',"recurring":' + cp_1.cspmb__recurring_charge__c + '},"_allowances":{}},"' +
			cp_no_prices.id + '":{"_volume":{"mv":null,"mvp":null,"muc":null,"mucp":null},"_product":{"oneoff":' +
			cp_no_prices.cspmb__one_off_charge__c + ',"recurring":' + cp_no_prices.cspmb__recurring_charge__c +
			'},"_allowances":{}}},"addons":{"' + add_standalone.id + '":{"oneoff":' + add_standalone.cspmb__one_off_charge__c +
			',"recurring":' + add_standalone.cspmb__recurring_charge__c + '}}}';

		Attachment faAttach = new Attachment(
			ParentId = fa_2.id,
			Body =  Blob.valueOf(body),
			Description = 'Added products and negotiated data against Frame Agreement',
			ContentType = 'text/plain',
			Name = 'FrameAgreementAttachment'
		);
		insert faAttach;

		Attachment faAttach2 = new Attachment(
			ParentId = fa_3.id,
			Body =  Blob.valueOf(body),
			Description = 'Added products and negotiated data against Frame Agreement',
			ContentType = 'text/plain',
			Name = 'FrameAgreementAttachment'
		);
		insert faAttach2;

		String otherBody = 'OtherData';
		Attachment otherAttach = new Attachment(
			ParentId = fa_3.id,
			Body =  Blob.valueOf(otherBody),
			Description = 'Added other attachment',
			ContentType = 'text/plain',
			Name = 'OtherAttachment'
		);
		insert otherAttach;
	}

	@isTest
	public static void activateFrameAgreementTest() {
		setupData();

		csconta__Frame_Agreement__c fa_null_attachment = [
			select id
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = :NO_ATTACH_FA_NAME
		];
		csconta__Frame_Agreement__c fa = [
			select id
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = :VALID_FA_NAME
		];
		csconta__Frame_Agreement__c fa_two_attachment = [
			select id
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = :TWO_ATTACH_FA_NAME
		];

		Test.startTest();

		String fa1_msg = API_1.activateFrameAgreement(fa_null_attachment.id, false);
		String fa2_msg = API_1.activateFrameAgreement(fa.id, false);
		String fa3_msg = API_1.activateFrameAgreement(fa_two_attachment.id, false);

		Test.stopTest();

		Map<String, Object> null_pointer_msg = (Map<String, Object>) JSON.deserializeUntyped(fa1_msg);
		Map<String, Object> success_msg = (Map<String, Object>) JSON.deserializeUntyped(fa2_msg);
		Map<String, Object> fa_two_attachment_success_msg = (Map<String, Object>) JSON.deserializeUntyped(fa3_msg);

		System.assertEquals('Framework attachment does not exist.', null_pointer_msg.get('errorMessage'));
		System.assertEquals('Success', success_msg.get('status'));
		System.assertEquals('Success', fa_two_attachment_success_msg.get('status'));
		List<cspmb__Price_Item_Pricing_Rule_Association__c> cppras = [
			select id, cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
		];
		// We should be having the PRA records created based on FA2 + FA3
		System.assertEquals(4 + 4, cppras.size(), cppras);
	}

	@isTest
	public static void activateFrameAgreementStatusTest() {
		setupData();

		Fac_Settings__c facSettings = FrameRateManagerController.getFacSetting();

		csconta__Frame_Agreement__c fa_1 = [
			select id, csconta__status__c
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = :VALID_FA_NAME
		];
		fa_1.csconta__status__c = facSettings.approved_status__c;
		update fa_1;
		csconta__Frame_Agreement__c fa_2 = FrameRateManagerController.cloneFrameAgreement(fa_1.id, null);
		fa_2.csconta__status__c = facSettings.active_status__c;
		update fa_2;
		csconta__Frame_Agreement__c fa_3 = FrameRateManagerController.cloneFrameAgreement(fa_1.id, null);
		fa_3.csconta__status__c = facSettings.requires_approval_status__c;
		update fa_3;
		csconta__Frame_Agreement__c fa_4 = FrameRateManagerController.cloneFrameAgreement(fa_1.id, null);
		fa_4.csconta__status__c = facSettings.closed_status__c;
		update fa_4;
		csconta__Frame_Agreement__c fa_5 = FrameRateManagerController.cloneFrameAgreement(fa_1.id, null);
		fa_5.csconta__status__c = 'Pending';
		update fa_5;

		Test.startTest();

		String msg1 = API_1.activateFrameAgreement(fa_1.id, false);
		String msg2 = API_1.activateFrameAgreement(fa_2.id, false);
		String msg3 = API_1.activateFrameAgreement(fa_3.id, false);
		String msg4 = API_1.activateFrameAgreement(fa_4.id, false);
		String msg5 = API_1.activateFrameAgreement(fa_5.id, false);

		Test.stopTest();

		Map<String, Object> msgMap1 = (Map<String, Object>) JSON.deserializeUntyped(msg1);
		Map<String, Object> msgMap2 = (Map<String, Object>) JSON.deserializeUntyped(msg2);
		Map<String, Object> msgMap3 = (Map<String, Object>) JSON.deserializeUntyped(msg3);
		Map<String, Object> msgMap4 = (Map<String, Object>) JSON.deserializeUntyped(msg4);
		Map<String, Object> msgMap5 = (Map<String, Object>) JSON.deserializeUntyped(msg5);


		System.assertEquals('Success', msgMap1.get('status'));
		List<cspmb__Price_Item_Pricing_Rule_Association__c> cppras = [
			select id, cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
		];
		System.assertEquals(4, cppras.size(), cppras);

		System.assertEquals(API_1.FA_ALREADY_ACTIVATED_MSG, msgMap2.get('errorMessage'));
		System.assertEquals(
			String.format(API_1.FA_CANNOT_ACTIVATE_MSG,
				new List<String> { facSettings.requires_approval_status__c }
			),
			msgMap3.get('errorMessage'));
		System.assertEquals(API_1.FA_REPLACED_MSG, msgMap4.get('errorMessage'));
		System.assertEquals(
			String.format(API_1.FA_CANNOT_ACTIVATE_MSG,
				new List<String> { 'Pending' }
			),
			msgMap5.get('errorMessage'));
	}

	@isTest
	public static void activateFrameAgreementAsyncTest() {
		setupData();

		csconta__Frame_Agreement__c fa = [
			select id, csconta__status__c, async_job__c
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = :VALID_FA_NAME
		];

		Map<String, Id> cprg = FrameAgreementActivation.createPricingRuleGroup(fa.id);
		String data = FrameAgreementActivation.structureFAData(fa.id);
		DecomposeAttachmentQueueable decompose = new DecomposeAttachmentQueueable(
			data,
			5,
			cprg.get('prId'),
			fa.id
		);

		Test.startTest();

		// Max depth limit walkaround
		decompose.execute(null);

		String msg1 = API_1.getAsyncActivationStatus(fa.id);

		Test.stopTest();

		String msg2 = API_1.getAsyncActivationStatus(fa.id);
		List<cspmb__Price_Item_Pricing_Rule_Association__c> cppras = [
			select id, cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
		];

		Map<String, Object> inProgressMsg = (Map<String, Object>) JSON.deserializeUntyped(msg1);
		Map<String, Object> completedMsg = (Map<String, Object>) JSON.deserializeUntyped(msg2);

		System.assertEquals(4, cppras.size(), cppras);
		System.assertEquals('In Progress', inProgressMsg.get('status'));
		System.assertEquals('Completed', completedMsg.get('status'));
	}

	@isTest
	public static void undoFAActivationTest() {
		setupData();

		csconta__Frame_Agreement__c fa = [
			select id
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = :VALID_FA_NAME
		];
		API_1.activateFrameAgreement(fa.id, false);

		cspmb__Pricing_Rule_Group_Rule_Association__c prgra = [
			select cspmb__pricing_rule__c
			from cspmb__Pricing_Rule_Group_Rule_Association__c
			where cspmb__pricing_rule_group__c in (
				select id
				from cspmb__Pricing_Rule_Group__c
				where csconta__Frame_Agreement__c = :fa.id
			)
		];

		Test.startTest();

		String msg = API_1.undoActivation(prgra.cspmb__pricing_rule__c);
		String activationStatusMsg = API_1.getAsyncActivationStatus(fa.id);

		Test.stopTest();

		Map<String, Object> activationStatus = (Map<String, Object>)JSON.deserializeUntyped(activationStatusMsg);

		List<cspmb__Price_Item_Pricing_Rule_Association__c> cppras = [
			select id, cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
		];

		System.assertEquals(0, cppras.size());
		System.assertEquals('Success', msg);
		System.assertEquals('Completed', activationStatus.get('status'));
	}
}