@isTest
private class API_1Test {

	static void setupData() {
		Account test_account = new Account(name = 'TestAcc');
		insert test_account;

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
			csconta__agreement_name__c = 'FA1',
			csconta__account__c = test_account.Id
		);
		csconta__Frame_Agreement__c fa_2 = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = 'FA2',
			csconta__account__c = test_account.Id
		);
		insert fa_1;
		insert fa_2;

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

		Attachment newAttach = new Attachment(
			ParentId = fa_2.id,
			Body =  Blob.valueOf(body),
			Description = 'Added products and negotiated data against Frame Agreement',
			ContentType = 'text/plain',
			Name = 'FrameAgreementAttachment'
		);
		insert newAttach;
	}

	@isTest
	public static void activateFrameAgreementTest(){
		setupData();

		csconta__Frame_Agreement__c fa_null_attachment = [
			select id
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = 'FA1'
		];
		csconta__Frame_Agreement__c fa = [
			select id
			from csconta__Frame_Agreement__c
			where csconta__agreement_name__c = 'FA2'
		];

		Test.startTest();

		String msg1 = API_1.activateFrameAgreement(fa_null_attachment.id, false);
		String msg2 = API_1.activateFrameAgreement(fa.id, false);

		Test.stopTest();

		Map<String, Object> null_pointer_msg = (Map<String, Object>) JSON.deserializeUntyped(msg1);
		Map<String, Object> success_msg = (Map<String, Object>) JSON.deserializeUntyped(msg2);

		System.assertEquals('Framework attachment does not exist.', null_pointer_msg.get('errorMessage'));
		System.assertEquals('Success', success_msg.get('status'));
		List<cspmb__Price_Item_Pricing_Rule_Association__c> cppras = [
			select id, cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
		];
		System.assertEquals(4, cppras.size(), cppras);
	}
}
