public class FaAttachmentBatchableCleanup implements Database.Batchable<sObject> {
	Set<Id> faIdSetWithRelevantAttachment = new Set<Id>();

	private final String FA_ATTACHMENT_QUERY = 'select id, parentId, lastModifiedDate ' +
		'from attachment ' +
		'where parentId in (' +
			'select id ' +
			'from csconta__Frame_Agreement__c' +
		') ' +
		'order by lastModifiedDate desc';

	public Database.QueryLocator start(Database.BatchableContext batchContext){
		return Database.getQueryLocator(FA_ATTACHMENT_QUERY);
	}

	public void execute(Database.BatchableContext batchContext, List<sObject> recordList) {
		List<Attachment> recordToDelete = new List<Attachment>();

		for (sObject record: recordList) {
			Attachment attachment = (Attachment) record;
			if (faIdSetWithRelevantAttachment.contains(attachment.parentId)) {
				recordToDelete.add(attachment);
			} else {
				faIdSetWithRelevantAttachment.add(attachment.parentId);
			}
		}

		if (!recordToDelete.isEmpty()) {
			delete recordToDelete;
			DataBase.emptyRecycleBin(recordToDelete);
        }
	}

	public void finish(Database.BatchableContext batchContext){
	}
}
