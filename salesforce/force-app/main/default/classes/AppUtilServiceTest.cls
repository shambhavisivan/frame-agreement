@isTest
private class AppUtilServiceTest {
	@isTest
	static void testGetFieldMetadata() {
		Test.startTest();
		List<FieldMetadata> result = AppUtilService.getFieldMetadata('Account');
		Test.stopTest();

		System.assertNotEquals(null, result);
		System.assertEquals(
			Account.getSObjectType().getDescribe().fields.getMap().size(),
			result.size(),
			'Should be same always'
		);
	}
}