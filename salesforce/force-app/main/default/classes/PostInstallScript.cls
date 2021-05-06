global class PostInstallScript implements InstallHandler {
	public static final String FA_STANDARD_BUTTON_KEY = 'FA-Standard-buttons';
	public static final String FA_RELATED_LISTS_KEY = 'FA-Related-Lists';
	public static final String FA_HEADER_KEY = 'FA-Header';
	public static final String FA_CATEGORIZATION_KEY = 'FA-Categorization';
	public static final String FA_STANDARDPRICEBOOK_KEY = 'FA-StandardPricebook';
	public static final String FA_CUSTOM_BUTTONS_KEY = 'FA-Custom-Buttons';

	global void onInstall(InstallContext context) {
		if (!context.isUpgrade() && context.previousVersion() == null) {
			PostInstallScript.insertJsonDataConfigs();
			PostInstallScript.insertFacSetting(context.organizationId());
		}
	}

	private static csutil__JSON_Data__c populateJsonSetting(String key, String value) {
		return new csutil__JSON_Data__c (name = key, csutil__value__c = value);
	}

	private static csutil__JSON_Data__c populateStandardButtonSetting() {
		String value = '{"Save":["Draft","Requires Approval"],"SubmitForApproval":["Requires Approval"],"Approve":["Pending"],"Reject":["Pending"],"Recall":["Pending"],"Submit":["Approved","Draft"],"DeleteProducts":["Draft","Requires Approval"],"BulkNegotiate":["Draft","Requires Approval"],"AddProducts":["Draft","Requires Approval"],"DeleteOffers":["Draft","Requires Approval"],"BulkNegotiateOffers":["Draft","Requires Approval"],"AddOffers":["Draft","Requires Approval"],"NewVersion":["Active"],"Delta":["*"]}';
		return PostInstallScript.populateJsonSetting(PostInstallScript.FA_STANDARD_BUTTON_KEY, value);
	}

	private static csutil__JSON_Data__c populateRelatedListSetting() {
		String value = '[{"label":"Child FA","object":"csconta__Frame_Agreement__c","fa_lookup":"csconta__master_frame_agreement__c","columns":"Id, csconta__Agreement_Name__c"},{"label":"Pricing Rule Group","object":"cspmb__Pricing_Rule_Group__c","fa_lookup":"csconta__frame_agreement__c","columns":"Id, cspmb__always_applied__c, cspmb__description__c"}]';
		return PostInstallScript.populateJsonSetting(PostInstallScript.FA_RELATED_LISTS_KEY, value);
	}

	private static csutil__JSON_Data__c populateHeaderSetting() {
		String value = '[{"field":"csconta__Agreement_Name__c","readOnly":false,"label":"Agreement name","type":"text","grid":2},{"field":"csconta__Account__c","readOnly":false,"label":"Account","type":"lookup","grid":3,"lookupData":{"columns":["Name","Type"]}},{"field":"csconta__agreement_level__c","readOnly":false,"label":"Agreement Level","type":"picklist","grid":2}]';
		return PostInstallScript.populateJsonSetting(PostInstallScript.FA_HEADER_KEY, value);
	}

	private static List<csutil__JSON_Data__c> populateSettingsWithEmptyValue() {
		return new List<csutil__JSON_Data__c> {
			PostInstallScript.populateJsonSetting(PostInstallScript.FA_CATEGORIZATION_KEY, ''),
			PostInstallScript.populateJsonSetting(PostInstallScript.FA_STANDARDPRICEBOOK_KEY, ''),
			PostInstallScript.populateJsonSetting(PostInstallScript.FA_CUSTOM_BUTTONS_KEY, '')
		};
	}

	private static void insertJsonDataConfigs() {
		List<csutil__JSON_Data__c> jsonDataList = new List<csutil__JSON_Data__c>();
		jsonDataList.add(PostInstallScript.populateStandardButtonSetting());
		jsonDataList.add(PostInstallScript.populateHeaderSetting());
		jsonDataList.add(PostInstallScript.populateRelatedListSetting());
		jsonDataList.addAll(PostInstallScript.populateSettingsWithEmptyValue());

		insert jsonDataList;
	}

	private static void insertFacSetting(Id orgId) {
		Fac_Settings__c facSetting = Fac_Settings__c.getInstance(orgId);
		facSetting.SetupOwnerId = orgId;
		facSetting.account_fields__c = 'Name,Type';
		facSetting.active_status__c = 'Active';
		facSetting.approval_process_name__c = 'FA';
		facSetting.approvers_revise__c = false;
		facSetting.decimal_places__c = 2;
		facSetting.discount_as_price__c = false;
		facSetting.fa_editable_statuses__c = 'Draft, Requires Approval, Approved';
		facSetting.frame_agreement_fields__c = 'Id, csconta__Account__c';
		facSetting.new_frame_agreement__c = true;
		facSetting.product_chunk_size__c = 100;
		facSetting.requires_approval_status__c = 'Requires Approval';
		facSetting.standalone_addon_fields__c = 'Name, Id';
		facSetting.usage_type_fields__c = 'cspmb__unit_of_measure__c';
		facSetting.active_status_management__c = true;
		facSetting.approved_status__c = 'Approved';
		facSetting.closed_status__c = 'Replaced';
		facSetting.decomposition_chunk_size__c = 1000;
		facSetting.draft_status__c = 'Draft';
		facSetting.fa_number_prefix__c = 'FFF';
		facSetting.input_minmax_restriction__c = true;
		facSetting.price_item_fields__c = 'cspmb__Contract_Term__c, cspmb__Is_Active__c';
		facSetting.rcl_fields__c = 'cspmb__Currency_Code__c';
		facSetting.volume_fields_visibility__c = 'mv, mvp';
		facSetting.truncate_product_fields__c = true;
		facSetting.show_volume_fields__c = true;
		facSetting.dispatcher_service_url__c = 'https://cs-messaging-dispatcher-eu-dev.herokuapp.com';

		insert facSetting;
	}
}