@IsTest
private class CommercialProductServiceTest {
	@TestSetup
	public static void setupCommercialProducts() {
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

		cspmb__Price_Item__c cp_addon_inv = new cspmb__Price_Item__c(
			name = 'cp_addon_inv',
			cspmb__is_active__c = true,
			cspmb__price_item_code__c = 'cp_addon_inv',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_addon_assoc_inv = new cspmb__Price_Item__c(
			name = 'cp_addon_assoc_inv',
			cspmb__is_active__c = true,
			cspmb__price_item_code__c = 'cp_addon_assoc_inv',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);

		Date invalidEndDate = Date.newInstance(1992, 3, 14);
		cspmb__Price_Item__c cp_3 = new cspmb__Price_Item__c(
			name = 'cp_3',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__effective_end_date__c = invalidEndDate,
			cspmb__price_item_code__c = 'cp_3',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);

		cspmb__Price_Item__c cp_4 = new cspmb__Price_Item__c(
			name = 'cp_4',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_4',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_5 = new cspmb__Price_Item__c(
			name = 'cp_5',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_5',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_6 = new cspmb__Price_Item__c(
			name = 'cp_6',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_6',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_7 = new cspmb__Price_Item__c(
			name = 'cp_7',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_7',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__Price_Item__c cp_8 = new cspmb__Price_Item__c(
			name = 'cp_8',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_8',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);

		// Master CP
		cspmb__Price_Item__c masterCp = new cspmb__Price_Item__c(
			name = 'masterCp',
			cspmb__one_off_charge__c = 50.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 25 - 00,
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Master'
		);

		insert cp_1;
		insert cp_2;
		insert cp_3;
		insert cp_4;
		insert cp_5;
		insert cp_6;
		insert cp_7;
		insert cp_8;
		insert cp_addon_inv;
		insert cp_addon_assoc_inv;
		insert masterCp;

		// Variant CP
		cspmb__Price_Item__c variantCp = new cspmb__Price_Item__c(
			name = 'variantCp',
			cspmb__one_off_charge__c = 60.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 25 - 00,
			cspmb__price_item_code__c = 'cp_5',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Variant',
			cspmb__master_price_item__c = masterCp.id
		);
		insert variantCp;

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
			cspmb__pricing_element_type__c = pricingElementType_1.id, cspmb__commercial_product__c = cp_1.id
		);
		cspmb__Pricing_Element__c pricingElement_2 = new cspmb__Pricing_Element__c(
			cspmb__pricing_element_type__c = pricingElementType_2.id, cspmb__commercial_product__c = cp_1.id
		);
		cspmb__Pricing_Element__c pricingElement_invalid = new cspmb__Pricing_Element__c(
			cspmb__pricing_element_type__c = pricingElementType_2.id,
			cspmb__commercial_product__c = cp_1.id,
			cspmb__effective_end_date__c = invalidEndDate
		);
		insert pricingElement_1;
		insert pricingElement_2;
		insert pricingElement_invalid;

		cspmb__pricing_rule__c pr_1 = new cspmb__pricing_rule__c(cspmb__description__c = 'Test.');
		insert pr_1;

		cspmb__Price_Item_Pricing_Rule_Association__c pipra_1 = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.id, cspmb__price_item__c = cp_1.id,
			cspmb__pricing_element__c = pricingElement_1.id
		);
		cspmb__Price_Item_Pricing_Rule_Association__c pipra_2 = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.id, cspmb__price_item__c = cp_1.id,
			cspmb__pricing_element__c = pricingElement_2.id
		);
		cspmb__Price_Item_Pricing_Rule_Association__c pipra_3 = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.id, cspmb__price_item__c = cp_1.id,
			cspmb__pricing_element__c = pricingElement_invalid.id
		);
		insert pipra_1;
		insert pipra_2;
		insert pipra_3;

		cspmb__Pricing_Rule_Group__c prg_1 = new cspmb__Pricing_Rule_Group__c(
			cspmb__description__c = 'Testing.',
			cspmb__pricing_rule_group_code__c = generateRandomString(10)
		);
		insert prg_1;

		cspmb__Pricing_Rule_Group_Rule_Association__c prgra_1 = new cspmb__Pricing_Rule_Group_Rule_Association__c(
			cspmb__pricing_rule__c = pr_1.id, cspmb__Pricing_Rule_Group__c = prg_1.id
		);
		insert prgra_1;
		csutil__JSON_Data__c standardPricebook = new csutil__JSON_Data__c(
			Name = 'FA-StandardPricebook', csutil__value__c = prg_1.id
		);
		insert standardPricebook;
	}

	private static Fac_Settings__c loadFacSettings() {
		return Fac_Settings__c.getInstance(UserInfo.getUserID());
	}

	public static String generateRandomString(Integer len) {
		final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
		String randStr = '';
		while (randStr.length() < len) {
			Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
			randStr += chars.substring(idx, idx + 1);
		}
		return randStr;
	}

	// tests on queryProducts() with pagination
	@IsTest
	static void queryProductsTestAllNullParams() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(null, null, null, null, new List<Id>());

		Test.stopTest();

		System.assertEquals(queriedCPs.size(),11);
		for(cspmb__price_item__c pi: queriedCPs) {
			System.assertNotEquals(pi.name, 'cp_3');
		}
	}

	@IsTest
	static void queryProductsTestPriceItemIdsNull() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(null, null, null, 5, new List<Id>());
		String lastRecordId = queriedCPs.get(queriedCPs.size() - 1).id;
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(null, null, lastRecordId, 5, new List<Id>());

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 5);
		for(cspmb__price_item__c pi: queriedCPs) {
			System.assertNotEquals(pi.name, 'cp_3');
			System.assertNotEquals(nextQueriedCPs.get(0).id, pi.id);
		}
	}

	@IsTest
	static void queryProductsTestCpIdsNullWithQueryLimit() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(null, null, null, 5, new List<Id>());
		String lastRecordId = queriedCPs.get(queriedCPs.size() - 1).id;
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(null, null, lastRecordId, 5, new List<Id>());

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 5);
		for(cspmb__price_item__c pi: queriedCPs) {
			System.assertNotEquals(pi.name, 'cp_3');
			System.assertNotEquals(nextQueriedCPs.get(0).id, pi.id);
		}
	}

	@IsTest
	static void queryProductsTestCpIdsEmpty() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];

		Test.startTest();

		//without lastRecordId, without queryLimit
		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			null,
			null,
			new List<Id>()
		);
		//with lastRecordId, without queryLimit
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			queriedCPs.get(queriedCPs.size() - 1).id,
			null,
			new List<Id>()
		);
		//without lastRecordId, with queryLimit
		List<cspmb__price_item__c> queriedCPsWithLimit = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			null,
			4,
			new List<Id>()
		);
		// with lastRecordId, with queryLimit
		List<cspmb__price_item__c> nextQueriedCPsWithLimit = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			queriedCPsWithLimit.get(queriedCPsWithLimit.size() - 1).id,
			4,
			new List<Id>()
		);
		List<cspmb__price_item__c> nextCPsListWithLimit = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			nextQueriedCPsWithLimit.get(nextQueriedCPsWithLimit.size() - 1).id,
			4,
			new List<Id>()
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 11);
		System.assertEquals(nextQueriedCPs.size(), 0);
		for(cspmb__price_item__c cp: nextQueriedCPsWithLimit) {
			System.assertNotEquals(cp.id, queriedCPsWithLimit.get(queriedCPsWithLimit.size() - 1).id);
		}
		System.assertEquals(queriedCPsWithLimit.size(), 4);
		System.assertEquals(nextQueriedCPsWithLimit.size(), 4);
		System.assertEquals(nextCPsListWithLimit.size(), 3);
	}

	@IsTest
	static void queryProductsTestCpIdsNonEmpty() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		//without lastRecordId, without queryLimit
		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(cpIdList, null, null, null, new List<Id>());
		//with lastRecordId, without queryLimit
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(
			cpIdList,
			null,
			queriedCPs.get(queriedCPs.size() - 1).id,
			null,
			new List<Id>()
		);
		//without lastRecordId, with queryLimit
		List<cspmb__price_item__c> queriedCPsWithLimit = CommercialProductService.queryProducts(
			cpIdList,
			null,
			null,
			4,
			new List<Id>()
		);
		// with lastRecordId, with queryLimit
		List<cspmb__price_item__c> nextQueriedCPsWithLimit = CommercialProductService.queryProducts(
			cpIdList,
			null,
			queriedCPsWithLimit.get(queriedCPsWithLimit.size() - 1).id,
			4,
			new List<Id>()
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 11);
		System.assertEquals(nextQueriedCPs.size(), 0);
		System.assertEquals(queriedCPsWithLimit.size(), 4);
		System.assertEquals(nextQueriedCPsWithLimit.size(), 4);
	}

	@IsTest
	static void queryProductsTestFilerFieldsNonEmpty() {

		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		//with single filter field combinations
		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(
			null,
			'{\"name\":\"cp_7\"}',
			null,
			null,
			new List<Id>()
		);
		List<cspmb__price_item__c> queriedCPs2 = CommercialProductService.queryProducts(
			null,
			'{\"cspmb__type__c\":\"cp_7\"}',
			queriedCPs.get(queriedCPs.size() - 1).id,
			null,
			new List<Id>()
		);
		List<cspmb__price_item__c> queriedCPs3 = CommercialProductService.queryProducts(
			null,
			'{\"name\":\"p_\"}',
			queriedCPs.get(queriedCPs.size() - 1).id,
			3,
			new List<Id>()
		);
		List<cspmb__price_item__c> queriedCPs4 = CommercialProductService.queryProducts(
			cpIdList,
			'{\"name\":\"p_\"}',
			null,
			3,
			new List<Id>()
		);
		// with multiple filter fields
		List<cspmb__price_item__c> queriedCPs5 = CommercialProductService.queryProducts(
			null,
			'{\"name\":\"cp_\",\"cspmb__price_item_code__c\":\"_2\"}',
			null,
			3,
			new List<Id>()
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 1);
		System.assertEquals(queriedCPs2.size(), 0);
		System.assertEquals(queriedCPs3.size(), 3);
		System.assertEquals(queriedCPs4.size(), 3);
		System.assertEquals(queriedCPs5.size(), 1);
	}

	@IsTest
	static void queryProductsTestAllNonNullParams() {

		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(
			cpIdList,
			'{\"name\":\"cp_2\",\"cspmb__price_item_code__c\":\"cp_2\"}',
			cps[0].id,
			6,
			new List<Id>()
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 1);
	}

	@IsTest
	static void testQueryProductsWithAlreadyAddedIds() {

		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		List<Id> alreadyAddedIds = new List<Id>();
		alreadyAddedIds.add(cps[6].id);
		alreadyAddedIds.add(cps[7].id);

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(
			cpIdList,
			'{\"name\":\"cp_\"}',
			cps[4].id,
			6,
			alreadyAddedIds
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 3);
	}

	@IsTest
	static void shouldPaginateWhenNoPriceItemIds() {
		List<cspmb__Price_Item__c> cps = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(
			new List<Id>(),
			'{\"name\":\"cp_2\",\"cspmb__price_item_code__c\":\"cp_2\"}',
			null,
			6,
			new List<Id>()
		);
		List<cspmb__price_item__c> queriedCPs2 = CommercialProductService.queryProducts(
			new List<Id>(),
			'{\"cspmb__role__c\":\"Basic\",\"cspmb__type__c\":\"Commercial Product\"}',
			queriedCPs.get(queriedCPs.size() - 1).id,
			2,
			new List<Id>()
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 1);
		System.assertEquals(queriedCPs2.size(), 2);
		System.assertEquals(queriedCPs2.get(0).cspmb__price_item_code__c, 'cp_4');
		System.assertEquals(queriedCPs2.get(1).cspmb__price_item_code__c, 'cp_5');
		for(cspmb__price_item__c pi: queriedCPs) {
			System.assertNotEquals(pi.id, queriedCPs2.get(0).id);
			System.assertNotEquals(pi.cspmb__price_item_code__c, 'cp_4');
			System.assertNotEquals(pi.cspmb__price_item_code__c, 'cp_5');
		}
	}

	// standard exisiting tests on fetching commercial products scenarios
	@IsTest
	static void testQueryProductsIfPrsEnabledTrue() {
		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = true;
		insert facSettings;

		List<cspmb__Price_Item__c> results = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp : results) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		List<cspmb__Price_Item__c> cps = CommercialProductService.queryProducts(cpIdList, null, null, 50, new List<Id>());

		Test.stopTest();

		System.assertEquals(12, cpIdList.size());
		System.assertEquals(12, cps.size());
	}

	@IsTest
	static void testQueryProductsIfPrsEnabledFalse() {
		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		List<cspmb__Price_Item__c> results = [
			select id
			from cspmb__Price_Item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__Price_Item__c cp : results) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		List<cspmb__Price_Item__c> cps = CommercialProductService.queryProducts(cpIdList, null, null, 50, new List<Id>());

		Test.stopTest();

		System.assertEquals(12, cpIdList.size());
		System.assertEquals(11, cps.size());
	}

	@IsTest
	static void testQueryProductsWithCPLegacyPricing() {
		List<cspmb__pricing_rule__c> pr = [
			select id, cspmb__description__c
			from cspmb__Pricing_Rule__c
		];

		List<cspmb__price_item__c> cp = [
			select id, name
			from cspmb__price_item__c
			where name = 'cp_1'
			limit 1
		];
		cspmb__Price_Item_Pricing_Rule_Association__c cppra = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__one_off_adjustment_type__c = 'Absolute Discount',
			cspmb__price_item__c = cp[0].id,
			cspmb__recurring_adjustment_type__c = 'Absolute Discount',
			cspmb__pricing_rule__c = pr[0].id
		);
		insert cppra;
		List<Id> cpIdList = new List<Id>{
			cp[0].id
		};

		Test.startTest();

		List<cspmb__Price_Item__c> cps = CommercialProductService.queryProducts(cpIdList, null, null, 50, new List<Id>());

		Test.stopTest();

		cppra = [
			select cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :cp[0].id
			limit 1
		];

		System.assertEquals(null, cppra.cspmb__one_off_adjustment__c);
		System.assertEquals(null, cppra.cspmb__recurring_adjustment__c);

		System.assertEquals(10, cps[0].cspmb__One_Off_Charge__c);
		System.assertEquals(15, cps[0].cspmb__Recurring_Charge__c);
	}

	@IsTest
	static void testQueryProductsWithCPAdvancedPricing() {
		List<cspmb__pricing_rule__c> pr = [
			select id, cspmb__description__c
			from cspmb__Pricing_Rule__c
		];

		List<cspmb__price_item__c> cp = [
			select id, name
			from cspmb__price_item__c
			where name = 'cp_1'
			limit 1
		];

		List<Id> cpIdList = new List<Id>{
			cp[0].id
		};

		cspmb__Price_Item_Pricing_Rule_Association__c cppra = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__one_off_adjustment__c = 9.00,
			cspmb__one_off_adjustment_type__c = 'Initial Price',
			cspmb__price_item__c = cp[0].id,
			cspmb__recurring_adjustment__c = 11.99,
			cspmb__recurring_adjustment_type__c = 'Initial Price',
			cspmb__pricing_rule__c = pr[0].id
		);
		insert cppra;

		Test.startTest();

		List<cspmb__Price_Item__c> cps = CommercialProductService.queryProducts(cpIdList, null, null, 50, new List<Id>());

		Test.stopTest();

		 List<cspmb__Price_Item_Pricing_Rule_Association__c> cppras = [
			select cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :cp[0].id and
			id = :cppra.id
			limit 1
		];

		System.assertEquals(9.00, cppras[0].cspmb__one_off_adjustment__c);
		System.assertEquals(11.99, cppras[0].cspmb__recurring_adjustment__c);

		System.assertEquals(9.00, cps[0].cspmb__One_Off_Charge__c);
		System.assertEquals(11.99, cps[0].cspmb__Recurring_Charge__c);
	}

	@IsTest
	static void testQueryProductsWithAdvancedAndLegacyPricing() {
		List<cspmb__Price_Item__c> cp = [
			select id, name
			from cspmb__Price_Item__c
			where name = 'cp_1'
			limit 1
		];

		List<Id> cpIdList = new List<Id>{
			cp[0].id
		};

		List<cspmb__pricing_rule__c> pr = [
			select id, cspmb__description__c
			from cspmb__Pricing_Rule__c
		];

		cspmb__Price_Item_Pricing_Rule_Association__c cppra = new cspmb__Price_Item_Pricing_Rule_Association__c(
			cspmb__one_off_adjustment__c = 3.00,
			cspmb__one_off_adjustment_type__c = 'Initial Price',
			cspmb__price_item__c = cp[0].id,
			cspmb__recurring_adjustment__c = 4.00,
			cspmb__recurring_adjustment_type__c = 'Initial Price',
			cspmb__pricing_rule__c = pr[0].id
		);
		insert cppra;

		Test.startTest();

		List<cspmb__Price_Item__c> cps = CommercialProductService.queryProducts(cpIdList, null, null, 50, new List<Id>());

		Test.stopTest();

		cp = [
			select Name, cspmb__One_Off_Charge__c, cspmb__Recurring_Charge__c
			from cspmb__Price_Item__c
			where id = :cp[0].id
			limit 1
		];
		List<cspmb__Price_Item_Pricing_Rule_Association__c> cppras = [
			select cspmb__one_off_adjustment__c, cspmb__recurring_adjustment__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :cp[0].id and
			id = :cppra.id
		];

		System.assertEquals(10, cp[0].cspmb__One_Off_Charge__c);
		System.assertEquals(15, cp[0].cspmb__Recurring_Charge__c);

		System.assertEquals(3, cppras[0].cspmb__one_off_adjustment__c);
		System.assertEquals(4, cppras[0].cspmb__recurring_adjustment__c);

		System.assertEquals(3, cps[0].cspmb__One_Off_Charge__c);
		System.assertEquals(4, cps[0].cspmb__Recurring_Charge__c);
	}

	@IsTest
	static void testQueryProductsNullIsPrsEnabledFalse() {
		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = false;
		insert facSettings;

		Test.startTest();
		List<cspmb__Price_Item__c> cps = CommercialProductService.queryProducts(new List<Id>(), null, null, 10, new List<Id>());
		Test.stopTest();

		System.assertEquals(10, cps.size());
	}

	@IsTest
	static void testQueryProductsNullIsPrsEnabledTrue() {
		Fac_Settings__c facSettings = loadFacSettings();
		facSettings.is_ps_enabled__c = true;
		insert facSettings;

		Test.startTest();
		List<cspmb__Price_Item__c> cps = CommercialProductService.queryProducts(new List<Id>(), null, null, 10, new List<Id>());
		Test.stopTest();

		System.assertEquals(0, cps.size());
	}
 }
