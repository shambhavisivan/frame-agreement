public with sharing class UndoActivationQueueable implements Queueable {

	Id prId;
	Id faId;

	public UndoActivationQueueable(Id prId, Id faId) {
		this.prId = prId;
		this.faId = faId;
	}

	public void execute(QueueableContext context) {

		List <cspmb__Price_Item_Pricing_Rule_Association__c> pipra = [
			select Id
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__pricing_rule__c = :prId
			limit 1
		];

		if (pipra == null || pipra.isEmpty()) {
			FrameAgreementActivation.prRemoval(prId);
		} else {
			FrameAgreementActivation.pipraRemoval(prId);
			ID jobId = System.enqueueJob(new UndoActivationQueueable(prId, faId));
			csconta__Frame_Agreement__c fa = [
				select id, async_job__c
				from csconta__Frame_Agreement__c
				where id = :faId
			];
			fa.async_job__c = jobId.to15();
			update fa;
		}

	}
}
