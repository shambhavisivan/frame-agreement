@isTest
public class FaAttachmentSchedulableCleanupTest {

	@isTest
	public static void testSchedulerJobScheduledProperlyForDailyRun() {
		Test.startTest();

		FaAttachmentSchedulableCleanup faAttachmentSchedulableCleanup = new FaAttachmentSchedulableCleanup();
		String cronjobFrequency = '0 0 0 * * ? *';
		String jobId = System.schedule(
			'CS Framework Agreement Attachment Cleanup Schedulable', cronjobFrequency, faAttachmentSchedulableCleanup
		);

		CronTrigger crontTrigger = [
			select
				id,
				cronExpression,
				timesTriggered,
				nextFireTime
		 	from cronTrigger
			where id = :jobId
		];

		System.assertEquals(cronjobFrequency, crontTrigger.cronExpression);

		// Verify the job has not run
		System.assertEquals(0, crontTrigger.timesTriggered);

		// Verify the next time the job will run
		Date tomorrow = Date.today().addDays(1);
		System.assertEquals(String.valueOf(tomorrow) + ' 00:00:00', String.valueOf(crontTrigger.nextFireTime));

		Test.stopTest();
	}
 }
