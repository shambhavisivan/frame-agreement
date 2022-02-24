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

	@isTest
	static void testLookupFieldMetadata() {
		Test.startTest();
		List<FieldMetadata> result = AppUtilService.getFieldMetadata('csconta__Frame_Agreement__c');
		Test.stopTest();

		Map<String, FieldMetadata> fieldMetaDataMap = new Map<String, FieldMetadata>();

		for (FieldMetadata field: result) {
			if (field.referenceObjects != null && field.fieldType == Schema.DisplayType.REFERENCE) {
				fieldMetaDataMap.put(field.apiName, field);
			}
		}

		for (Schema.SObjectField sObjField : csconta__Frame_Agreement__c.getSObjectType().getDescribe()
				.fields.getMap().values()) {
			Schema.DescribeFieldResult fieldDescribe = sObjField.getDescribe();

			if (fieldDescribe.getType() == Schema.DisplayType.REFERENCE) {
				FieldMetadata field = fieldMetaDataMap.get(fieldDescribe.getLocalName());
				System.assertEquals(field.referenceObjects.size(), fieldDescribe.getReferenceTo().size());

				for (Schema.SObjectType reference: fieldDescribe.getReferenceTo()) {
					System.assert(field.referenceObjects.contains(reference.getDescribe().getName()),
						'The reference field types must be populated with reference object it is pointing to');
				}
			}
		}
	}
}