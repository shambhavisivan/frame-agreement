public class DispatcherServiceController {
	private static final String AUTH_ENDPOINT = '/v1/auth/token';
	private static Fac_Settings__c facSettings = FrameRateManagerController.getFacSetting();

	public static DispatcherServiceController.DispatcherServiceToken getAuthorisationToken(String userAgent) {
		try {
			if (
				String.isBlank(facSettings.certificate_name__c) ||
				String.isBlank(facSettings.dispatcher_service_url__c)
			) {
				throw new FrameRateManagerController.ApplicationException('Certificate name/dispatcher url is empty in FAC setting');
			}

			csutil.DispatcherRequestUtil dispatcherRequestUtil = new csutil.DispatcherRequestUtil(
				facSettings.certificate_name__c, facSettings.dispatcher_service_url__c
			);
			Map<String, String> requestMap = new Map<String, String> {
				'User-Agent' => userAgent
			};
			HttpResponse response;
			if (!Test.isRunningTest()) {
				response = dispatcherRequestUtil.sendRequest(
					'POST',
					AUTH_ENDPOINT,
					Json.serialize(requestMap),
					UserInfo.getOrganizationId().substring(0, 15)
				);
			} else {
				HttpRequest req = new HttpRequest();
				String mockResponse = '{"token":"TOKEN","User-Agent":"cssmgnt","expires":"Today","issued":"Yes","message":"Token Generated","orgId":"123123213"}';
				SingleRequestMock mock = new SingleRequestMock(200, 'ok', mockResponse, null);
				response = mock.respond(req);
			}
			String processed = response.getBody().replace('User-Agent', 'userAgent');

			DispatcherServiceController.DispatcherServiceToken token = (
				(DispatcherServiceController.DispatcherServiceToken) Json.deserialize(
					processed, DispatcherServiceController.DispatcherServiceToken.class
				)
			);

			return token;
		} catch (Exception e) {
			throw new FrameRateManagerController.ApplicationException(e.getMessage());
		}

	}

	public class DispatcherServiceToken {
		public String token;
		public String userAgent;
		public String expires;
		public String issued;
		public String message;
		public String orgId;
	}
}