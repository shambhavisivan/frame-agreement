@isTest
public class FaAttachmentBatchableCleanupTest {

	@isTest
	public static void testBatchDelete() {
		List<Id> faIdList = new List<Id>();
		Integer totalFaToTest = 5;

		for (Integer i = 1; i <= totalFaToTest; i++) {
			csconta__Frame_Agreement__c fa_1 = new csconta__Frame_Agreement__c(
				csconta__Status__c = 'Draft', csconta__Agreement_Name__c = 'faName'
			);

			insert fa_1;
			faIdList.add(fa_1.id);

			FrameRateManagerController.createAttachment(fa_1.id, 'TestName', 'testDescription', 'TestBody_' + String.valueOf(i), 'text/plain');
			FrameRateManagerController.createAttachment(fa_1.id, 'TestName', 'testDescription', 'TestBody_'  + String.valueOf(i) + '.1', 'text/plain');
		}

		Test.startTest();

		FaAttachmentBatchableCleanup faAttachmentBatchableCleanup = new FaAttachmentBatchableCleanup();
		Database.executeBatch(faAttachmentBatchableCleanup);

		Test.stopTest();

		List<Attachment> attachmentList = [select id,lastModifiedDate from Attachment where parentId in :faIdList];

		System.assertEquals(totalFaToTest, attachmentList.size(), 'After batch clean up, only 1 attachment must be associated to each FA');

	}
}
