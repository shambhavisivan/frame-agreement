public class CacheService {
	private Map<String, Object> cacheMap;
	private static CacheService instance;

	private CacheService() {
		cacheMap = new Map<String, Object>();
	}

	public static CacheService getInstance() {
		if (instance == null) {
			return new CacheService();
		}

		return instance;
	}

	public void put(String key, Object cacheObject){
		cacheMap.put(key, cacheObject);
	}

	public Object get(String key) {
		return cacheMap.get(key);
	}
}