@isTest
private class CacheServiceTest {
	@isTest
	private static void testSetGetCache() {
		CacheService cacheServiceInstance = CacheService.getInstance();
		Test.startTest();
		cacheServiceInstance.put('store', 'sample cache string');
		String result = (String) cacheServiceInstance.get('store');
		Test.stopTest();

		System.assertEquals('sample cache string', result);
	}

	@isTest
	private static void testGetCacheToReturnNull() {
		CacheService cacheServiceInstance = CacheService.getInstance();
		Test.startTest();
		String result = (String) cacheServiceInstance.get('store');
		Test.stopTest();

		System.assertEquals(null, result);
	}
}