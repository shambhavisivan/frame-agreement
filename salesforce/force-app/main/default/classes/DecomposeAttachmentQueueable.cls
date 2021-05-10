public with sharing class DecomposeAttachmentQueueable implements Queueable {

	List<Object> categorizationData;
	Integer decompositionChunkSize;
	Id prId;
	Id faId;

	public DecomposeAttachmentQueueable(String data, Integer decompositionChunkSize, Id prId, Id faId) {
		this.decompositionChunkSize = decompositionChunkSize;
		this.prId = prId;
		this.faId = faId;
		categorizationData = (List<Object>) Json.deserializeUntyped(data);
	}

	public void execute(QueueableContext context) {

		List<Object> dataChunk = FrameAgreementActivation.sliceList(categorizationData, 0, decompositionChunkSize);
		if (dataChunk.size() > 0) {
			String msg = FrameAgreementActivation.decomposeAttachment(Json.serialize(dataChunk), prId);
			if (msg != 'Success') {
				throw new CustomExceptions.DecomposeAttachmentException(msg);
			}

			List<Object> nextDataChunk = FrameAgreementActivation.sliceList(
				categorizationData,
				decompositionChunkSize,
				categorizationData.size()
			);
			DecomposeAttachmentQueueable decompose = new DecomposeAttachmentQueueable(
				Json.serialize(nextDataChunk),
				decompositionChunkSize,
				prId,
				faId
			);

			ID jobId = System.enqueueJob(decompose);
			csconta__Frame_Agreement__c fa = [
				select id, async_job__c
				from csconta__Frame_Agreement__c
				where id = :faId
			];
			fa.async_job__c = jobId.to15();
			update fa;
		} else {
			String msg = FrameAgreementActivation.updateFAStatus(faId);
			if (msg != 'Success') {
				throw new CustomExceptions.UpdateFAStatusException(msg);
			} else {
				csconta__Frame_Agreement__c fa = [
					select id, async_job__c
					from csconta__Frame_Agreement__c
					where id = :faId
				];
				fa.async_job__c = null;
				update fa;
			}
		}
	}
}