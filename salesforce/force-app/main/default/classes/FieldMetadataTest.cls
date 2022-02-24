@isTest
private class FieldMetadataTest {
	@isTest
	static void testFieldMetadataGeneration() {
		Schema.DescribeSObjectResult sobjDescribe = csconta__Frame_Agreement__c.getSObjectType().getDescribe();
		Map<String, FieldMetadata> fieldMetaDataMap = new Map<String, FieldMetadata>();

		Test.startTest();
		for(Schema.SObjectField sObjField : sobjDescribe.fields.getMap().values()) {
			Schema.DescribeFieldResult fieldDescribe = sObjField.getDescribe();
			fieldMetaDataMap.put(fieldDescribe.getLocalName(), new FieldMetadata(fieldDescribe));
		}
		Test.stopTest();

		for(Schema.SObjectField sObjField : sobjDescribe.fields.getMap().values()) {
			Schema.DescribeFieldResult fieldDescribe = sObjField.getDescribe();
			FieldMetaData fieldMetaData = fieldMetaDataMap.get(fieldDescribe.getLocalName());
			System.assertEquals(fieldMetaData.apiName, fieldDescribe.getLocalName());
			System.assertEquals(fieldMetaData.fieldLabel, fieldDescribe.getLabel());
			System.assertEquals(fieldMetaData.isUpdatable, fieldDescribe.isUpdateable());
			System.assertEquals(fieldMetaData.isCustom, fieldDescribe.isCustom());
			System.assertEquals(fieldMetaData.scale, fieldDescribe.getScale());
			System.assertEquals(fieldMetaData.precision, fieldDescribe.getPrecision());
			System.assertEquals(fieldMetaData.fieldType, fieldDescribe.getType());

			if (fieldDescribe.getType() == Schema.DisplayType.REFERENCE) {
				System.assertEquals(fieldMetaData.referenceObjects.size(), fieldDescribe.getReferenceTo().size());

				for (Schema.SObjectType reference: fieldDescribe.getReferenceTo()) {
					System.assert(fieldMetaData.referenceObjects.contains(reference.getDescribe().getName()),
						'The reference field types must be populated with reference object it is pointing to');
				}
			}
		}
	}
}