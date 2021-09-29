public class AppUtilService {
	private static final String GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY = 'GLOBAL_SOBJECT_DESCRIBE';
	private static CacheService cacheServiceInstance = CacheService.getInstance();

	/**
	 * Sends a list of field metadata for the requested SObject Type
	 * @param sObjectType
	 * @return List<FieldMetadata>
	 */
	public static List<FieldMetadata> getFieldMetadata(String sobjectName) {
		Schema.DescribeSObjectResult sobjDescribe = getSobjectDescribe(sObjectName);
		List<FieldMetadata> fieldMetaDataList = new List<FieldMetadata>();

		for(Schema.SObjectField sObjField : sobjDescribe.fields.getMap().values()) {
			Schema.DescribeFieldResult fieldDescribe = sObjField.getDescribe();
			fieldMetaDataList.add(new FieldMetadata(fieldDescribe));
		}

		return fieldMetaDataList;
	}

	public static Schema.DescribeSObjectResult getSobjectDescribe(String sobjectName) {
		if (cacheServiceInstance.get(GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY) == null) {
			cacheServiceInstance.put(GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY, Schema.getGlobalDescribe());
		}
		Map<String, Schema.SObjectType> globalSObjectDescribe =
			(Map<String, Schema.SObjectType>) cacheServiceInstance.get(GLOBAL_SOBJECT_DESCRIBE_CACHE_KEY);
		Schema.SObjectType sObjectType = globalSObjectDescribe.get(sObjectName);
		Schema.DescribeSObjectResult sobjDescribe = sObjectType.getDescribe();

		return sobjDescribe;
	}

	public static List<String> getFAFieldList() {
		Schema.DescribeSObjectResult faSobjectDescribe = AppUtilService.getSobjectDescribe(
			'csconta__Frame_Agreement__c'
		);

		return new List<String>(faSobjectDescribe.fields.getMap().keySet());
	}

	public static List<String> getSObjectFields(String sObjectName) {
		Schema.DescribeSObjectResult faSobjectDescribe = AppUtilService.getSobjectDescribe(sObjectName);
		return new List<String>(faSobjectDescribe.fields.getMap().keySet());
	}

	public static String getFilterClause(String filterFields) {

		Map<String, Object> filterFieldsMap =  new Map<String, Object>();
		String whereClause = '(';
		if (String.isNotBlank(filterFields)) {
			filterFieldsMap = (Map<String, Object>) Json.deserializeUntyped(filterFields);

			Integer index = 1;
			for (String key : filterFieldsMap.keySet()) {
				if (index == filterFieldsMap.keySet().size()) {
					whereClause += key + ' like \'%' + filterFieldsMap.get(key) + '%\'';
				} else {
					whereClause += key + ' like \'%' + filterFieldsMap.get(key) + '%\' and ';
				}
				index++;
			}
			whereClause+= ')';
		} else {
			whereClause = '';
		}
		return whereClause;
	}
}

