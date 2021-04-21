@IsTest
private class FaPrgSelectorTest {

	@TestSetup
	static void setupData() {
		csconta__Frame_Agreement__c fa = new csconta__Frame_Agreement__c(
			csconta__status__c = 'Draft',
			csconta__agreement_name__c = 'FA1',
			csconta__effective_end_date__c = DateTime.now().addDays(1)
		);
		insert fa;
		cspmb__Pricing_Rule_Group__c prg = new cspmb__Pricing_Rule_Group__c(
			cspmb__description__c = 'Testing.',
			cspmb__pricing_rule_group_code__c = 'prg-1',
			csconta__frame_agreement__c = fa.id
		);
		insert prg;
		cscfga__Product_Basket__c pb = new cscfga__Product_Basket__c(
			name = 'PB 1',
			csconta__frame_agreement__c = fa.id
		);
		insert pb;
		cspsi.PrgSelectorRegistration configuration = new cspsi.PrgSelectorRegistration();
		configuration.version = '1-0-0';
		configuration.className = FaPrgSelector.class.getName();
		csutil__Json_Settings__c setting = new csutil__Json_Settings__c();
		setting.name = 'PSI/PrgSelectors/1';
		setting.csutil__json_configuration__c = Json.serializePretty(configuration);
		upsert setting;
	}

	public static testMethod void testPrgSelector() {
		cscfga__Product_Basket__c pb = [
			select id
			from cscfga__Product_Basket__c
			limit 1
		];
		User u = [
			select id, name
			from User
			where id = :UserInfo.getUserId()
		];
		Test.startTest();
		Set<String> prgs = cspsi.PrgSelector.selectPrgs('faId', u, pb.id, null);
		Test.stopTest();
		System.assertEquals(prgs.size(), 1);
		System.assertEquals(new List<String>(prgs)[0], 'prg-1');
	}

	public static testMethod void testPrgSelectorMultiplePrgs() {
		cscfga__Product_Basket__c pb = [
			select id, csconta__frame_agreement__c
			from cscfga__Product_Basket__c
			limit 1
		];
		User u = [
			select id, name
			from User
			where id = :UserInfo.getUserId()
		];
		cspmb__Pricing_Rule_Group__c prg = new cspmb__Pricing_Rule_Group__c(
			cspmb__description__c = 'Testing 2.',
			cspmb__pricing_rule_group_code__c = 'prg-2',
			csconta__frame_agreement__c = pb.csconta__frame_agreement__c
		);
		insert prg;
		Test.startTest();
		Set<String> prgs = cspsi.PrgSelector.selectPrgs('faId', u, pb.id, null);
		Test.stopTest();
		System.assertEquals(prgs.size(), 1);
	}

	public static testMethod void testPrgSelectorExpiredDate() {
		csconta__Frame_Agreement__c fa = [
			select id, csconta__effective_end_date__c
			from csconta__Frame_Agreement__c
			limit 1
		];
		// make it in the past
		fa.csconta__effective_end_date__c = fa.csconta__effective_end_date__c.addDays(-5);
		update fa;
		cscfga__Product_Basket__c pb = [
			select id
			from cscfga__Product_Basket__c
			limit 1
		];
		User u = [
			select id, name
			from User
			where id = :UserInfo.getUserId()
		];
		Test.startTest();
		Set<String> prgs = cspsi.PrgSelector.selectPrgs('faId', u, pb.id, null);
		Test.stopTest();
		System.assertEquals(prgs.size(), 0);
	}

}