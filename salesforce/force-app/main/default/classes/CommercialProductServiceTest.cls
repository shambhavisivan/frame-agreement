@isTest
private class CommercialProductServiceTest {
	@testSetup
	public static void setupCommercialProducts() {
		cspmb__price_item__c cp_1 = new cspmb__price_item__c(
			name = 'cp_1',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_1',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__price_item__c cp_2 = new cspmb__price_item__c(
			name = 'cp_2',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_2',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);

		cspmb__price_item__c cp_addon_inv = new cspmb__price_item__c(
			name = 'cp_addon_inv',
			cspmb__is_active__c = true,
			cspmb__price_item_code__c = 'cp_addon_inv',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__price_item__c cp_addon_assoc_inv = new cspmb__price_item__c(
			name = 'cp_addon_assoc_inv',
			cspmb__is_active__c = true,
			cspmb__price_item_code__c = 'cp_addon_assoc_inv',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);

		Date invalidEndDate = Date.newInstance(1992, 3, 14);
		cspmb__price_item__c cp_3 = new cspmb__price_item__c(
			name = 'cp_3',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__effective_end_date__c = invalidEndDate,
			cspmb__price_item_code__c = 'cp_3',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);

		cspmb__price_item__c cp_4 = new cspmb__price_item__c(
			name = 'cp_4',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_4',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__price_item__c cp_5 = new cspmb__price_item__c(
			name = 'cp_5',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_5',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__price_item__c cp_6 = new cspmb__price_item__c(
			name = 'cp_6',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_6',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__price_item__c cp_7 = new cspmb__price_item__c(
			name = 'cp_7',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_7',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
		);
		cspmb__price_item__c cp_8 = new cspmb__price_item__c(
			name = 'cp_8',
			cspmb__one_off_charge__c = 10.00,
			cspmb__is_active__c = true,
			cspmb__recurring_charge__c = 15 - 00,
			cspmb__price_item_code__c = 'cp_8',
			cspmb__type__c = 'Commercial Product',
			cspmb__role__c = 'Basic'
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
	}
	// tests on queryProducts()
	@isTest
	static void queryProductsTestAllNullParams() {
		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(null, null, null, null);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 9);
		for(cspmb__price_item__c pi: queriedCPs) {
			System.assertNotEquals(pi.name, 'cp_3');
		}
	}
	@isTest
	static void queryProductsTestPriceItemIdsNull() {
		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
		];

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(null, null, null, 5);
		String lastRecordId = queriedCPs.get(queriedCPs.size() - 1).id;
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(null, null, lastRecordId, 5);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 5);
		for(cspmb__price_item__c pi: queriedCPs) {
			System.assertNotEquals(pi.name, 'cp_3');
			System.assertNotEquals(nextQueriedCPs.get(0).id, pi.id);
		}
	}
	@isTest
	static void queryProductsTestCpIdsNullWithQueryLimit() {
		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
		];

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(null, null, null, 5);
		String lastRecordId = queriedCPs.get(queriedCPs.size() - 1).id;
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(null, null, lastRecordId, 5);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 5);
		for(cspmb__price_item__c pi: queriedCPs) {
			System.assertNotEquals(pi.name, 'cp_3');
			System.assertNotEquals(nextQueriedCPs.get(0).id, pi.id);
		}
	}
	@isTest
	static void queryProductsTestCpIdsEmpty() {
		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
		];

		Test.startTest();

		//without lastRecordId, without queryLimit
		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			null,
			null
		);
		//with lastRecordId, without queryLimit
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			queriedCPs.get(queriedCPs.size() - 1).id,
			null
		);
		//without lastRecordId, with queryLimit
		List<cspmb__price_item__c> queriedCPsWithLimit = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			null,
			4
		);
		// with lastRecordId, with queryLimit
		List<cspmb__price_item__c> nextQueriedCPsWithLimit = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			queriedCPsWithLimit.get(queriedCPsWithLimit.size() - 1).id,
			4
		);
		List<cspmb__price_item__c> nextCPsListWithLimit = CommercialProductService.queryProducts(
			new List<Id>(),
			null,
			nextQueriedCPsWithLimit.get(nextQueriedCPsWithLimit.size() - 1).id,
			4
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 9);
		System.assertEquals(nextQueriedCPs.size(), 0);
		for(cspmb__price_item__c cp: nextQueriedCPsWithLimit) {
			System.assertNotEquals(cp.id, queriedCPsWithLimit.get(queriedCPsWithLimit.size() - 1).id);
		}
		System.assertEquals(queriedCPsWithLimit.size(), 4);
		System.assertEquals(nextQueriedCPsWithLimit.size(), 4);
		System.assertEquals(nextCPsListWithLimit.size(), 1);
	}
	@isTest
	static void queryProductsTestCpIdsNonEmpty() {
		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		//without lastRecordId, without queryLimit
		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(cpIdList, null, null, null);
		//with lastRecordId, without queryLimit
		List<cspmb__price_item__c> nextQueriedCPs = CommercialProductService.queryProducts(
			cpIdList,
			null,
			queriedCPs.get(queriedCPs.size() - 1).id,
			null
		);
		//without lastRecordId, with queryLimit
		List<cspmb__price_item__c> queriedCPsWithLimit = CommercialProductService.queryProducts(
			cpIdList,
			null,
			null,
			4
		);
		// with lastRecordId, with queryLimit
		List<cspmb__price_item__c> nextQueriedCPsWithLimit = CommercialProductService.queryProducts(
			cpIdList,
			null,
			queriedCPsWithLimit.get(queriedCPsWithLimit.size() - 1).id,
			4
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 9);
		System.assertEquals(nextQueriedCPs.size(), 9);
		System.assertEquals(queriedCPsWithLimit.size(), 9);
		System.assertEquals(nextQueriedCPsWithLimit.size(), 9);
	}
	@isTest
	static void queryProductsTestFilerFieldsNonEmpty() {

		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
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
			null
		);
		List<cspmb__price_item__c> queriedCPs2 = CommercialProductService.queryProducts(
			null,
			'{\"cspmb__type__c\":\"cp_7\"}',
			queriedCPs.get(queriedCPs.size() - 1).id,
			null
		);
		List<cspmb__price_item__c> queriedCPs3 = CommercialProductService.queryProducts(
			null,
			'{\"name\":\"cp_7\"}',
			queriedCPs.get(queriedCPs.size() - 1).id,
			0
		);
		List<cspmb__price_item__c> queriedCPs4 = CommercialProductService.queryProducts(
			cpIdList,
			'{\"name\":\"cp_7\"}',
			null,
			3
		);
		// with multiple filter fields
		List<cspmb__price_item__c> queriedCPs5 = CommercialProductService.queryProducts(
			null,
			'{\"name\":\"cp_2\",\"cspmb__price_item_code__c\":\"cp_2\"}',
			null,
			3
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 1);
		System.assertEquals(queriedCPs2.size(), 0);
		System.assertEquals(queriedCPs3.size(), 0);
		System.assertEquals(queriedCPs4.size(), 9);
		System.assertEquals(queriedCPs5.size(), 1);
	}
	@isTest
	static void queryProductsTestAllNonNullParams() {

		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
		];
		List<Id> cpIdList = new List<Id>();

		for (cspmb__price_item__c cp : cps) {
			cpIdList.add(cp.id);
		}

		Test.startTest();

		List<cspmb__price_item__c> queriedCPs = CommercialProductService.queryProducts(
			cpIdList,
			'{\"name\":\"cp_2\",\"cspmb__price_item_code__c\":\"cp_2\"}',
			cps[4].id,
			6
		);

		Test.stopTest();

		System.assertEquals(queriedCPs.size(), 9);
	}
	@isTest
	static void shouldPaginateWhenNoPriceItemIds() {
		List<cspmb__price_item__c> cps = [
			select id
			from cspmb__price_item__c
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
			6
		);
		List<cspmb__price_item__c> queriedCPs2 = CommercialProductService.queryProducts(
			new List<Id>(),
			'{\"cspmb__role__c\":\"Basic\",\"cspmb__type__c\":\"Commercial Product\"}',
			queriedCPs.get(queriedCPs.size() - 1).id,
			2
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
}