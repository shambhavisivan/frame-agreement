public class AppUtilService {
	private static final String GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY = 'GLOBAL_SOBJECT_DESCRIBE';
	private static CacheService cacheServiceInstance = CacheService.getInstance();

	/**
	 * Sends a list of field metadata for the requested SObject Type
	 * @param sObjectType
	 * @return List<FieldMetadata>
	 */
	public static List<FieldMetadata> getFieldMetadata(String sobjectName) {
		if (cacheServiceInstance.get(GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY) == null) {
			cacheServiceInstance.put(GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY, Schema.getGlobalDescribe());
		}
		Map<String, Schema.SObjectType> globalSObjectDescribe =
			(Map<String, Schema.SObjectType>) cacheServiceInstance.get(GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY);
		Schema.SObjectType sObjectType = globalSObjectDescribe.get(sObjectName);
		Schema.DescribeSObjectResult sobjDescribe = sObjectType.getDescribe();
		List<FieldMetadata> fieldMetaDataList = new List<FieldMetadata>();

		for(Schema.SObjectField sObjField : sobjDescribe.fields.getMap().values()) {
			Schema.DescribeFieldResult fieldDescribe = sObjField.getDescribe();
			fieldMetaDataList.add(new FieldMetadata(fieldDescribe));
		}

		return fieldMetaDataList;
	}
}

