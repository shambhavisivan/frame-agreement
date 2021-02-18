public class DispatcherServiceController {
	private static final String AUTH_ENDPOINT = '/v1/auth/token';
	private static Fac_Settings__c facSettings = FrameRateManagerController.getFacSetting();

	public static String getAuthorisationToken() {
		try {
			csutil.DispatcherRequestUtil dispatcherRequestUtil = new csutil.DispatcherRequestUtil(
				facSettings.certificate_name__c, facSettings.dispatcher_service_url__c
			);
			HttpResponse response;
			if (!Test.isRunningTest()) {
				response = dispatcherRequestUtil.sendRequest(
					'POST',
					AUTH_ENDPOINT,
					'{"User-Agent": "get-graphql-schema"}',
					UserInfo.getOrganizationId().substring(0, 15)
				);
			} else {
				HttpRequest req = new HttpRequest();
				String mockResponse = '{"token":"TOKEN","User-Agent":"cssmgnt","expires":"Today","issued":"Yes","message":"Token Generated","orgId":"123123213"}';
				SingleRequestMock mock = new SingleRequestMock(200, 'ok', mockResponse, null);
				response = mock.respond(req);
			}

			Map<String, Object> resJson = (Map<String,Object>) Json.deserializeUntyped(response.getBody());
			String token = (String) resJson.get('token');

			return token;
		} catch (Exception e) {
			throw new FrameRateManagerController.ApplicationException(e.getMessage());
		}

	}
}