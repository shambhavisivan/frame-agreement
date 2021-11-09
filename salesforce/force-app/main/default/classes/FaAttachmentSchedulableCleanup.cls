public class FaAttachmentSchedulableCleanup implements Schedulable {
	public void execute(SchedulableContext sc) {
		FaAttachmentBatchableCleanup faAttachmentBatchableCleanup = new FaAttachmentBatchableCleanup();
		Database.executebatch(faAttachmentBatchableCleanup);
	}
 }
