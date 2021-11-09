@isTest
public class FaUninstallHandlerTest {

	@isTest
	static void testSchedulerJobDeletionAfterUninstall() {
		PostInstallScript postInstallScriptCls = new PostInstallScript();

		Test.startTest();
		Test.testInstall(postInstallScriptCls, null);
		Test.testUninstall(new FaUninstallHandler());
		Test.stopTest();

		List<CronTrigger> cronTriggers = [
			select id
			from cronTrigger
			where cronJobDetail.name = :PostInstallScript.FA_ATTACHMENT_CLEANUP_SCHEDULER
		];

		System.assert(cronTriggers == null || cronTriggers.isEmpty());
	}
}