global with sharing class API_1 {
	global static Map <String, Object> getDelta(Id fa1, Id fa2) {
		return FAMDelta.getDelta(fa1, fa2);
	}

	global static String activateFrameAgreement(String faId, Boolean isAsync) {
		Map<String, String> responseMessage = new Map<String, String>();
		responseMessage.put('status', 'Success');

		csconta__Frame_Agreement__c fa = [
			select id, async_job__c, csconta__status__c
			from csconta__Frame_Agreement__c
			where id = :faId
		];

		if (fa.csconta__status__c == 'Active') {
			responseMessage.put('status', 'Error');
			responseMessage.put('errorMessage', 'FA is already active.');
		} else if (fa.csconta__status__c == 'Replaced') {
			responseMessage.put('status', 'Error');
			responseMessage.put('errorMessage', 'FA was already activated and replaced.');
		}

		Map<String, Id> cprg = FrameAgreementActivation.createPricingRuleGroup(faId);
		responseMessage.put('prgId', cprg.get('prgId'));

		String data;
			try {
				data = FrameAgreementActivation.structureFAData(faId);
			} catch (Exception e) {
				responseMessage.put('status', 'Error');
				responseMessage.put('errorMessage', e.getMessage());
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
			}
		}
		return Json.serialize(responseMessage);
	}

	// returns In Progres, Error or Completed
	global static String getAsyncActivationStatus(String faId) {
		Map<String, String> responseMessage = new Map<String, String>();
		responseMessage.put('status', 'In Progress');
		responseMessage.put('message', 'FA activation is in progress.');

		csconta__Frame_Agreement__c fa = [
			select csconta__status__c, async_job__c
			from csconta__Frame_Agreement__c
			where id = :faId
		];

		if (fa == null) {
			responseMessage.put('status', 'Error');
			responseMessage.put('message', 'No Frame Agreement.');
			return Json.serialize(responseMessage);
		}

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

		AsyncapexJob aJob = [
			select id, apexClassId, status, extendedStatus
			from AsyncapexJob
			where id = :jobId
		];

		// if async activation was invoked more than 7 days, job is no longer in DB
		if (aJob == null) {
			responseMessage.put('status', 'Error');
			responseMessage.put('message', 'Job id not defined.');
			return Json.serialize(responseMessage);
		}
		ApexClass aClass = [
			select id, name
			from ApexClass
			where id = :aJob.apexClassId
		];
		system.debug(aClass);

		if (aClass.name == 'DecomposeAttachmentQueueable') {
			if (aJob.status == 'Failed' || aJob.status == 'Aborted') {
				responseMessage.put('status', 'Error');
				responseMessage.put('message', aJob.extendedStatus);
			}
		} else {
			responseMessage.put('status', 'Error');
			responseMessage.put('message', 'Wrong job id');
		}
		return Json.serialize(responseMessage);
	}
}