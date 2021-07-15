@isTest
private class FrameAgreementServiceTest {
	@testSetup
	static void makeData(){
		Account account = new Account(name = 'Genpact');
		insert account;

		createFrameAgreements(5, 'Draft', account.Id);
		createFrameAgreements(5, 'Active', account.Id);
		createFrameAgreements(5, 'Approved', account.Id);
	}

	private static List<csconta__Frame_Agreement__c> createFrameAgreements(
		Integer count, String status, Id accountId
	) {
		List<csconta__Frame_Agreement__c> faList = new List<csconta__Frame_Agreement__c>();

		for (Integer i = 0; i < count; i++) {
			csconta__Frame_Agreement__c fa = new csconta__Frame_Agreement__c (
				csconta__agreement_name__c = 'FA-' + status + String.valueOf(i),
				csconta__status__c = status,
				csconta__account__c = accountId
			);

			faList.add(fa);
		}

		insert faList;
		return faList;
	}

	@isTest
	static void shouldFilterFAsWithStatus() {
		Account account = [select id from account limit 1];
		String filterFields = '{\"csconta__Status__c\":\"Active\"}';
		Test.startTest();
		List<csconta__Frame_Agreement__c> faList = FrameAgreementService.getFrameAgreements(
			account.Id, filterFields, null, 2
		);
		Test.stopTest();

		System.assertEquals(falist.size(), 2);

		for (csconta__Frame_Agreement__c fa : faList) {
			System.assertEquals('Active', fa.csconta__Status__c);
		}
	}

	@isTest
	static void shouldPaginateToGetAfterLastRecord(){
		Account account = [select id from account limit 1];
		List<csconta__Frame_Agreement__c> faInDb = [
			select id
			from csconta__Frame_Agreement__c
		];
		Test.startTest();
		List<csconta__Frame_Agreement__c> faList = FrameAgreementService.getFrameAgreements(
			account.Id, null, faInDb.get(4).Id, 5
		);
		Test.stopTest();

		System.assertEquals(faList.size(), 5);
		for (csconta__Frame_Agreement__c fa : faList) {
			System.assertNotEquals(faInDb.get(4).Id, fa.Id);
		}
	}

	@isTest
	static void shouldFilterFAsWithMultipleFilters() {
		Account account = [select id from account limit 1];
		String filterFields = '{\"csconta__Status__c\":\"Active\",\"csconta__Agreement_Name__c\":\"FA-Active\"}';
		Test.startTest();
		List<csconta__Frame_Agreement__c> faList = FrameAgreementService.getFrameAgreements(
			account.Id, filterFields, null, null
		);
		Test.stopTest();

		System.assertEquals(falist.size(), 5, 'should contain agreements with status and name in the filter');
	}

	@isTest
	static void shouldPaginateToGetAfterLastRecordWithFilter() {
		Account account = [select id from account limit 1];
		String filterFields = '{\"csconta__Status__c\":\"Draft\"}';
		List<csconta__Frame_Agreement__c> faInDb = [
			select id
			from csconta__Frame_Agreement__c
		];
		Test.startTest();
		List<csconta__Frame_Agreement__c> faList = FrameAgreementService.getFrameAgreements(
			account.Id, filterFields, faInDb.get(2).Id, 5
		);
		Test.stopTest();

		System.assertEquals(faList.size(), 2);
		for (csconta__Frame_Agreement__c fa : faList) {
			System.assertNotEquals(faInDb.get(2).Id, fa.Id);
		}
	}
}