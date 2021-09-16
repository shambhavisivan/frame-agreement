global with sharing class API_1 {
	global static Map <String, Object> getDelta(Id fa1, Id fa2) {
		return FAMDelta.getDelta(fa1, fa2);
	}

	@TestVisible
	private static final String FA_ALREADY_ACTIVATED_MSG = 'FA is already active.';
	@TestVisible
	private static final String FA_REPLACED_MSG = 'FA was already activated and replaced.';
	@TestVisible
	private static final String FA_CANNOT_ACTIVATE_MSG = 'FA under {0} cannot be activated';
	@TestVisible
	private static final String FA_DEFAULT_ERROR_MSG = 'FA cannot be activated';

	global static String activateFrameAgreement(Id faId, Boolean isAsync) {
		Map<String, String> responseMessage = new Map<String, String>();
		responseMessage.put('status', 'Success');

		Fac_Settings__c facSettings = FrameRateManagerController.getFacSetting();
		Set<String> activationNonEligibleStatus = new Set<String> {
			facSettings.active_status__c,
			facSettings.requires_approval_status__c,
			'Pending',
			facSettings.closed_status__c
		};

		csconta__Frame_Agreement__c fa = [
			select id, async_job__c, csconta__status__c
			from csconta__Frame_Agreement__c
			where id = :faId
		];

		if (activationNonEligibleStatus.contains(fa.csconta__status__c)) {
			responseMessage.put('status', 'Error');

			if (fa.csconta__status__c == facSettings.active_status__c) {
				responseMessage.put('errorMessage', FA_ALREADY_ACTIVATED_MSG);
			} else if (fa.csconta__status__c == facSettings.requires_approval_status__c || fa.csconta__status__c == 'Pending') {
				responseMessage.put('errorMessage',
					String.format(FA_CANNOT_ACTIVATE_MSG, new List<Object> { fa.csconta__Status__c })
				);
			} else if (fa.csconta__status__c == facSettings.closed_status__c) {
				responseMessage.put('errorMessage', FA_REPLACED_MSG);
			} else {
				responseMessage.put('errorMessage', FA_DEFAULT_ERROR_MSG);
			}

			return Json.serialize(responseMessage);
		}

		Map<String, Id> cprg = FrameAgreementActivation.createPricingRuleGroup(faId);
		responseMessage.put('prgId', cprg.get('prgId'));

		String data;
			try {
				data = FrameAgreementActivation.structureFAData(faId);
			} catch (Exception e) {
				responseMessage.put('status', 'Error');
				responseMessage.put('errorMessage', e.getMessage());
				API_1.undoActivation(cprg.get('prId'));
				return Json.serialize(responseMessage);
			}

		if (!isAsync) {
			responseMessage.put('status', FrameAgreementActivation.decomposeAttachment(data, cprg.get('prId')));

			if (responseMessage.get('status') == 'Success') {
				responseMessage.put('status', FrameAgreementActivation.updateFAStatus(faId));
			}

			if (responseMessage.get('status') != 'Success') {
				responseMessage.put('errorMessage', responseMessage.get('status'));
				responseMessage.put('status', 'Error');
				API_1.undoActivation(cprg.get('prId'));
			}
		} else {
			Decimal chunkSize = [
				select decomposition_chunk_size__c from
				Fac_Settings__c
			]?.decomposition_chunk_size__c;

			try {
				DecomposeAttachmentQueueable decompose = new DecomposeAttachmentQueueable(
					data,
					chunkSize.intValue(),
					cprg.get('prId'),
					faId
				);

				ID jobID = System.enqueueJob(decompose);
				fa.async_job__c = jobID.to15();
				update fa;

				responseMessage.put('status', 'In progress');
			} catch (Exception e) {
				responseMessage.put('errorMessage', e.getTypeName() + ': ' + e.getMessage());
				responseMessage.put('status', 'Error');
				API_1.undoActivation(cprg.get('prId'));
			}
		}
		return Json.serialize(responseMessage);
	}

	// returns In Progres, Error or Completed
	global static String getAsyncActivationStatus(Id faId) {
		Map<String, Object> responseMessage = new Map<String, Object>();

		List<csconta__Frame_Agreement__c> fAgreements = [
			select csconta__status__c, async_job__c
			from csconta__Frame_Agreement__c
			where id = :faId
		];

		if (fAgreements?.isEmpty()) {
			responseMessage.put('status', 'Error');
			responseMessage.put('message', 'No Frame Agreement.');
			return Json.serialize(responseMessage);
		}
		csconta__Frame_Agreement__c fa = fAgreements.get(0);

		if (fa.csconta__status__c == 'Active') {
			responseMessage.put('status', 'Completed');
			responseMessage.put('message', 'Activation is completed.');
			return Json.serialize(responseMessage);
		}

		Id jobId = fa.async_job__c;
		if (jobId == null) {
			responseMessage.put('status', 'Error');
			responseMessage.put('message', 'Job id not defined.');
			return Json.serialize(responseMessage);
		}

		String jobMsg = FrameAgreementActivation.checkAsyncJob(jobID, 'DecomposeAttachmentQueueable');
		responseMessage = (Map<String, Object>) JSON.deserializeUntyped(jobMsg);
		if (responseMessage.get('status') == 'In Progress') {
			responseMessage.put('message', 'FA activation is in progress.');
		} else if (responseMessage.get('status') == 'Error') {
			cspmb__Pricing_Rule_Group_Rule_Association__c prgra = [
				select cspmb__pricing_rule__c
				from cspmb__Pricing_Rule_Group_Rule_Association__c
				where cspmb__pricing_rule_group__c in (
					select id
					from cspmb__Pricing_Rule_Group__c
					where csconta__Frame_Agreement__c = :faId)
			];
			API_1.undoActivation(prgra.cspmb__pricing_rule__c);
		}
		return Json.serialize(responseMessage);
	}

	global static String undoActivation(Id prId) {
		List<cspmb__Pricing_Rule_Group__c> prgList = [
			select id, csconta__Frame_Agreement__c
			from cspmb__Pricing_Rule_Group__c
			where id in (
				select cspmb__pricing_rule_group__c
				from cspmb__Pricing_Rule_Group_Rule_Association__c
				where cspmb__pricing_rule__c = :prId
			)
		];
		if (prgList == null || prgList.isEmpty()) {
			return 'Error: Pricing Rule Group not defined.';
		}
		Id faId = prgList.get(0).csconta__Frame_Agreement__c;

		List<cspmb__Price_Item_Pricing_Rule_Association__c> pipraList = [
			select id
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__pricing_rule__c = :prId
			limit 1001
		];
		if (pipraList.size() > 1000) {
			UndoActivationQueueable undo = new UndoActivationQueueable(prId, faId);
			System.enqueueJob(undo);
			return 'In progress';
		} else {
			FrameAgreementActivation.pipraRemoval(prId);
			return FrameAgreementActivation.prRemoval(prId);
		}
	}

	global static String getAsyncUndoActivationStatus(Id faId) {
		Map<String, Object> responseMessage = new Map<String, String>();

		List<csconta__Frame_Agreement__c> fAgreements = [
			select csconta__status__c, async_job__c
			from csconta__Frame_Agreement__c
			where id = :faId
		];

		if (fAgreements?.isEmpty()) {
			responseMessage.put('status', 'Error');
			responseMessage.put('message', 'No Frame Agreement.');
			return Json.serialize(responseMessage);
		}

		Id jobId = fAgreements.get(0).async_job__c;
		if (jobId == null) {
			responseMessage.put('status', 'Error');
			responseMessage.put('message', 'Job id not defined.');
			return Json.serialize(responseMessage);
		}

		String jobMsg = FrameAgreementActivation.checkAsyncJob(jobID, 'UndoActivationQueueable');
		responseMessage = (Map<String, Object>) JSON.deserializeUntyped(jobMsg);
		if (responseMessage.get('status') == 'In Progress') {
			responseMessage.put('message', 'Activation undo is in progress.');
		}

		return Json.serialize(responseMessage);
	}
}