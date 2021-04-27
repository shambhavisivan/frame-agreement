global with sharing class API_1 {
	global static Map <String, Object> getDelta(Id fa1, Id fa2) {
		return FAMDelta.getDelta(fa1, fa2);
	}

	global static String activateFrameAgreement(String faId, Boolean isAsync) {
		Map<String, String> responseMessage = new Map<String, String>();
		responseMessage.put('status', 'Success');

		Map<String, Id> cprg = FrameAgreementActivation.createPricingRuleGroup(faId);
		responseMessage.put('prgId', cprg.get('prgId'));

		if (!isAsync) {
			String data;
			try {
				data = FrameAgreementActivation.structureFAData(faId);
			} catch (Exception e) {
				responseMessage.put('status', 'Error');
				responseMessage.put('errorMessage', e.getMessage());
				return JSON.serialize(responseMessage);
			}
			responseMessage.put('status', FrameAgreementActivation.decomposeAttachment(data, cprg.get('prId')));
		} else {
			// TODO
		}

		if (responseMessage.get('status') == 'Success') {
			responseMessage.put('status', FrameAgreementActivation.updateFAStatus(faId));
		}

		if (responseMessage.get('status') != 'Success') {
			responseMessage.put('errorMessage', responseMessage.get('status'));
			responseMessage.put('status', 'Error');
		}
		return JSON.serialize(responseMessage);
	}

	public static void getActivationStatus(String faId){
		// TODO
		// returns inProgress, error or completed
	}
}