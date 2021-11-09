global class FaUninstallHandler implements UninstallHandler {

	global void onUninstall(UninstallContext ctx) {
		CronTrigger cronJob = [
			select id
			from cronTrigger
			where cronJobDetail.name = :PostInstallScript.FA_ATTACHMENT_CLEANUP_SCHEDULER
		];

		System.abortJob(cronJob.id);
	}
}