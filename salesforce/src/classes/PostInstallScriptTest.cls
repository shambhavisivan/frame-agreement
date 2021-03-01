@IsTest
public class PostInstallScriptTest {
	@IsTest
	static void shouldInsertStandardButtonSetting() {
		PostInstallScript postInstallScriptCls = new PostInstallScript();

		Test.startTest();
		Test.testInstall(postInstallScriptCls, null);
		Test.stopTest();

		List<csutil__JSON_Data__c> jsonSettings = [
			select name, csutil__value__c
			from csutil__JSON_Data__c
			where name = :PostInstallScript.FA_STANDARD_BUTTON_KEY
		];
		Map<String, Object> deserilizedJson = (
			(Map<String, Object>) JSON.deserializeUntyped(jsonSettings[0]?.csutil__value__c)
		);

		System.assertEquals(jsonSettings.size(), 1);
		System.assertNotEquals(jsonSettings[0].csutil__value__c, null);
		System.assertEquals(deserilizedJson.get('Save'), new String[] {'Draft','Requires Approval'});
	}

	@IsTest
	static void shouldInsertFaRelatedList() {
		PostInstallScript postInstallScriptCls = new PostInstallScript();

		Test.startTest();
		Test.testInstall(postInstallScriptCls, null);
		Test.stopTest();

		List<csutil__JSON_Data__c> jsonSettings = [
			select name, csutil__value__c
			from csutil__JSON_Data__c
			where name = :PostInstallScript.FA_RELATED_LISTS_KEY
		];
		String expected = '[{"label":"Child FA","object":"csconta__Frame_Agreement__c","fa_lookup":"csconta__master_frame_agreement__c","columns":"Id, csconta__Agreement_Name__c"},{"label":"Pricing Rule Group","object":"cspmb__Pricing_Rule_Group__c","fa_lookup":"csconta__frame_agreement__c","columns":"Id, cspmb__always_applied__c, cspmb__description__c"}]';

		System.assertEquals(jsonSettings.size(), 1);
		System.assertEquals(jsonSettings[0].csutil__value__c, expected);
	}

	@IsTest
	static void shouldInsertHeaderSetting() {
		PostInstallScript postInstallScriptCls = new PostInstallScript();

		Test.startTest();
		Test.testInstall(postInstallScriptCls, null);
		Test.stopTest();

		List<csutil__JSON_Data__c> jsonSettings = [
			select name, csutil__value__c
			from csutil__JSON_Data__c
			where name = :PostInstallScript.FA_HEADER_KEY
		];
		String expected = '[{"field":"csconta__Agreement_Name__c","readOnly":false,"label":"Agreement name","type":"text","grid":2},{"field":"csconta__Account__c","readOnly":false,"label":"Account","type":"lookup","grid":3,"lookupData":{"columns":["Name","Type"]}},{"field":"csconta__agreement_level__c","readOnly":false,"label":"Agreement Level","type":"picklist","grid":2}]';

		System.assertEquals(jsonSettings.size(), 1);
		System.assertEquals(jsonSettings[0].csutil__value__c, expected);
	}

	@IsTest
	static void shouldInsertConfigsWithEmptyValues() {
		PostInstallScript postInstallScriptCls = new PostInstallScript();
		List<String> keysWithEmptyValues = new List<String> {
			PostInstallScript.FA_CATEGORIZATION_KEY,
			PostInstallScript.FA_STANDARDPRICEBOOK_KEY,
			PostInstallScript.FA_CUSTOM_BUTTONS_KEY
		};
		Test.startTest();
		Test.testInstall(postInstallScriptCls, null);
		Test.stopTest();

		List<csutil__JSON_Data__c> jsonSettings = [
			select name, csutil__value__c
			from csutil__JSON_Data__c
			where name in :keysWithEmptyValues
		];

		Integer index = 0;
		for (csutil__JSON_Data__c utilJson : jsonSettings) {
			System.assertEquals(utilJson.csutil__value__c, null);
			index++;
		}

		System.assertEquals(3, index);
	}

	@IsTest
	static void shouldInsertSampleFacSettings() {
		PostInstallScript postInstallScriptCls = new PostInstallScript();

		Test.startTest();
		Test.testInstall(postInstallScriptCls, null);
		Test.stopTest();

		Fac_Settings__c facSetting = Fac_Settings__c.getInstance(UserInfo.getUserId());
		System.assertEquals('Name,Type', facSetting.account_fields__c);
	}

	@IsTest
	static void shouldNotInsertConfigOnUpgrade() {
		PostInstallScript postInstallScriptCls = new PostInstallScript();

		Test.startTest();
		Test.testInstall(postInstallScriptCls, new Version(2, 23));
		Test.stopTest();

		Fac_Settings__c facSetting = Fac_Settings__c.getInstance(UserInfo.getUserId());
		System.assertEquals(null, facSetting.account_fields__c);

		List<csutil__JSON_Data__c> jsonSettings = [
			select name, csutil__value__c
			from csutil__JSON_Data__c
		];

		System.assertEquals(0, jsonSettings.size());
	}
}