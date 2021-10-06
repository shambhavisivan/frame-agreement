@IsTest
private class AddOnServiceTest {
	@TestSetup
	public static void setupPricingData() {
		cspmb__Price_Item__c cp_1 = new cspmb__Price_Item__c(
			name = 'cp_1',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_1',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_2 = new cspmb__Price_Item__c(
			name = 'cp_2',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_2',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_3 = new cspmb__Price_Item__c(
			name = 'cp_3',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_3',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);

		insert cp_1;
		insert cp_2;
		insert cp_3;

		Id cpId;
		List<cspmb__Price_Item__c> cps = [select id, name from cspmb__Price_Item__c order by id limit 2];
		for (Integer i = 1; i <= 18; i++) {
			if (i <= 10) {
				cpId = cps[0].id;
			}
			else {
				cpId = cps[1].id;
			}
    		cspmb__Add_On_Price_Item__c add_on = new cspmb__Add_On_Price_Item__c(
				name = 'AddOn' + String.valueOf(i),
				cspmb__one_off_charge__c = 10.00,
				cspmb__billing_frequency__c = 'Monthly',
				cspmb__is_active__c = true
			);
			insert add_on;
			List<cspmb__Add_On_Price_Item__c> addOns = [
				select name, id
				from cspmb__Add_On_Price_Item__c
				order by id
				limit :i
			];
			cspmb__Price_Item_Add_On_Price_Item_Association__c addonAssoc;
			if (i == 1) {
				addonAssoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
					cspmb__add_on_price_item__c = addOns[addOns.size() - 1].id,
					cspmb__price_item__c = cpId,
					cspmb__overrides_add_on_charges__c = true,
					cspmb__one_off_charge__c = 15.00
				);
			} else {
				addonAssoc = new cspmb__Price_Item_Add_On_Price_Item_Association__c(
					cspmb__add_on_price_item__c = addOns[addOns.size() - 1].id,
					cspmb__price_item__c = cpId,
					cspmb__overrides_add_on_charges__c = false
				);
			}
            insert addonAssoc;
		}
		cspmb__Add_On_Price_Item__c addOnInvalid = new cspmb__Add_On_Price_Item__c(
				name = 'AddOn Invalid',
				cspmb__one_off_charge__c = 10.00,
				cspmb__billing_frequency__c = 'Monthly',
				cspmb__is_active__c = false
		);
		insert addOnInvalid;
		List<cspmb__Price_Item__c> pi3 = [select id, name from cspmb__Price_Item__c where name = 'cp_3' limit 1];
		List<cspmb__Add_On_Price_Item__c> invalidAddOn = [
			select id, name
			from cspmb__Add_On_Price_Item__c
			where name = 'AddOn Invalid'
			limit 1
		];
		cspmb__Price_Item_Add_On_Price_Item_Association__c addonAssocInv =
			new cspmb__Price_Item_Add_On_Price_Item_Association__c(
					cspmb__add_on_price_item__c = invalidAddOn[0].id,
					cspmb__price_item__c = pi3[0].id,
					cspmb__overrides_add_on_charges__c = false
			);
		insert addonAssocInv;
	}

	private static Fac_Settings__c loadFacSettings() {
		return Fac_Settings__c.getInstance(UserInfo.getUserID());
	}

	// tests on queryAddOns()
	@IsTest
	static void queryAddOnsTestAllNullParams() {
		Boolean isInvalidPriceItemIdExceptionCaught = false;
		String exceptionText = '';

		Test.startTest();

		try {
			List<cspmb__add_on_price_item__c> queriedAOs = AddOnService.queryAddOns(null, null, null);
		}
		catch (Exception e) {
			isInvalidPriceItemIdExceptionCaught = true;
			exceptionText = e.getMessage();
		}

		Test.stopTest();

		System.assertEquals(isInvalidPriceItemIdExceptionCaught, true);
		System.assertEquals(exceptionText, System.Label.invalid_priceItem_Id);
	}

	@IsTest
	static void queryAddOnsTestPriceItemIdNull() {
		Boolean isInvalidPriceItemIdExceptionCaught = false;
		String exceptionText = '';

		Test.startTest();

		try {
			List<cspmb__add_on_price_item__c> queriedAOs = AddOnService.queryAddOns(
				null,
				'a0x4K000000RUxLQAW',
				4
			);
		}
		catch (Exception e) {
			isInvalidPriceItemIdExceptionCaught = true;
			exceptionText = e.getMessage();
		}

		Test.stopTest();

		System.assertEquals(isInvalidPriceItemIdExceptionCaught, true);
		System.assertEquals(exceptionText, System.Label.invalid_priceItem_Id);
	}

	@IsTest
	static void queryAddOnsTestWithCpId() {
		List<cspmb__Price_Item__c> cp = [
			select id
			from cspmb__Price_Item__c
			order by id
			limit 1
		];

		Test.startTest();
		List<cspmb__add_on_price_item__c> queriedAOs = AddOnService.queryAddOns(
			cp[0].id,
			null,
			4
		);
		List<cspmb__add_on_price_item__c> queriedAOs2 = AddOnService.queryAddOns(
			cp[0].id,
			queriedAOs.get(queriedAOs.size() - 1).id,
			4
		);
		Set<Id> aoIds = new Set<Id>();
		for (cspmb__add_on_price_item__c ao: queriedAOs) {
			aoIds.add(ao.id);
		}
		for (cspmb__add_on_price_item__c ao: queriedAOs2) {
			aoIds.add(ao.id);
		}
		Test.stopTest();

		System.assertNotEquals(queriedAOs.get(queriedAOs.size() - 1).id, queriedAOs2.get(0).id);
		// to ensure duplicate addOns are not present on the pages
		System.assertEquals(aoIds.size(), 8);
	}

	// this test validates names of all addons for every page and the total number of addons from all pages.
	@IsTest
	static void queryAddOnsTestShouldPaginate() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
			order by id
			limit 2
		];
		Boolean isPaginationCorrect = true;
		Test.startTest();
		Integer i = 1;
		Id cpId;
		Id lastRecordId = null;
		Boolean completed = false;

		List<cspmb__add_on_price_item__c> aoList = null;
		Set<Id> aoIds = new Set<Id>();
		while (!completed) {
			if (i <= 10) {
				cpId = cps[0].id;
			} else {
				cpId = cps[1].id;
			}
			if (aoList != null && aoList.size() != 0) {
				lastRecordId = aoList.get(aoList.size() - 1).id;
			}

			aoList = AddOnService.queryAddons(cpId, lastRecordId, 5);
			if (aoList != null) {
				for (cspmb__add_on_price_item__c ao: aoList) {
					aoIds.add(ao.id);
					if (ao.name == ('AddOn' + String.valueOf(i))) {
						i++;
					} else {
						isPaginationCorrect = false;
						completed = true;
					}
				}
			}
			if (aoList != null && aoList.size() == 0) {
				completed = true;
			}
		}

		Test.stopTest();

		System.assertEquals(isPaginationCorrect, true);
		System.assertEquals(aoIds.size(), 18);
	}

	// test for overriding of addon charges
	@IsTest()
	static void testOverrideAddOnCharges() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
			order by id
			limit 2
		];

		Test.startTest();

		List<cspmb__add_on_price_item__c> queriedAOs = AddOnService.queryAddOns(
			cps[0].id,
			null,
			2
		);

		Test.stopTest();

		System.assertEquals(
			queriedAOs[0].cspmb__one_off_charge__c,
			15,
			'AddOn charge not overridden by association charge 15.'
		);
		System.assertEquals(
			queriedAOs[1].cspmb__one_off_charge__c,
			10.00,
			'Incorrect AddOn charge'
		);
	}

	// standard existing tests
	@IsTest
	static void testCpAddonAssociationsWithoutPS() {
		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		Test.startTest();

		List<cspmb__Price_Item__c> pis = [
			select id, name
			from cspmb__Price_Item__c
			where name = 'cp_3'
		];
		List<cspmb__Price_Item__c> pis2 = [
			select id, name
			from cspmb__Price_Item__c
			where name = 'cp_1'
		];

		List<cspmb__add_on_price_item__c> addOns = AddOnService.queryAddOns(pis[0].id, null, 5);
		List<cspmb__add_on_price_item__c> addOns2 = AddOnService.queryAddOns(pis2[0].id, null, 6);

		Test.stopTest();

		System.assertEquals(addOns.size(), 0);
		System.assertEquals(addOns2.size(), 6);
	}
}