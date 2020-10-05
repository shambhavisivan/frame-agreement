global with sharing class FrameRateManagerController {

	public transient csutil.CustomResource[] commonContainerPageResources {
		get;
		private set;
	}
	public static final String FAC_ATTACHMENT_NAME = 'FrameAgreementAttachment';
	public static final String FAC_ATTACHMENT_DESC = 'Added products and negotiated data against Frame Agreement';
	public String accountId;
	public static final List <String> FA_FIELDS = new List <String>{
		'Id',
		'Name',
		'LastModifiedDate',
		'csconta__Account__r.Name',
		'csconta__Agreement_Name__c',
		'csconta__Pricing_Rule_Group__c',
		'csconta__Status__c',
		'csconta__Valid_From__c',
		'csconta__Valid_To__c',
		'csconta__replaced_by__c',
		'csconta__replaced_frame_agreement__c',
		'csconta__effective_end_date__c',
		'csconta__effective_start_date__c',
		'csconta__frame_agreement_number__c',
		'csconta__agreement_level__c'
	};

	global FrameRateManagerController() {
		accountId = ApexPages.currentPage().getParameters().get('account');
		if (accountId == null) {
			throw new InvalidParamException('Account Id not provided in URL.');
		}
		this.commonContainerPageResources = csutil.CustomResource.loadCustomResourceDescriptors('FAMeditor');
	}

	public class InvalidParamException extends Exception {
	}

	public class InvalidFieldTypeException extends Exception {
	}

	public class AgreementNotMasterException extends Exception {
	}

	public class ApplicationException extends Exception {
	}

	public static String getAccountId() {
		String accountId = null;

		try {
			accountId = ApexPages.currentPage().getParameters().get('account');
		} catch (Exception e) {

		}

		return accountId;
	}

	public static List<String> getUniqueListElements(List<String> originalList) {
		Set<String> inputSet = new Set<String>(originalList);
		return new List<String>(inputSet);
	}

	public static String getUserProfile() {
		Id profileId = userinfo.getProfileId();
		String profileName = [
			Select Name
			from Profile
			where Id = :profileId
		].Name;
		return profileName;
	}

	@TestVisible private static csutil__JSON_Data__c getHeaderData() {

		String profile = getUserProfile();

		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Header'
			and (csutil__profile_name__c = null OR csutil__profile_name__c = :profile)
			order by csutil__profile_name__c
				NULLS LAST
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	@TestVisible private static csutil__JSON_Data__c getCustomButtonData() {

		String profile = getUserProfile();

		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Custom-Buttons'
			and (csutil__profile_name__c = null OR csutil__profile_name__c = :profile)
			order by csutil__profile_name__c
				NULLS LAST
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	@TestVisible private static csutil__JSON_Data__c getStandardButtonData() {

		String profile = getUserProfile();

		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Standard-Buttons'
			and (csutil__profile_name__c = null OR csutil__profile_name__c = :profile)
			order by csutil__profile_name__c
				NULLS LAST
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	@TestVisible private static csutil__JSON_Data__c getCategorizationData() {
		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Categorization'
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	@TestVisible private static csutil__JSON_Data__c getAddonCategorizationData() {
		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Addon-Categorization'
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	@TestVisible private static csutil__JSON_Data__c getRelatedListsData() {
		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Related-Lists'
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	@TestVisible private static csutil__JSON_Data__c getCustomTabsData() {

		String profile = getUserProfile();

		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Custom-Tabs'
			and (csutil__profile_name__c = null OR csutil__profile_name__c = :profile)
			order by csutil__profile_name__c
				NULLS LAST
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	@TestVisible private static csutil__JSON_Data__c getStandardPricebook() {
		List <csutil__JSON_Data__c> json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-StandardPricebook'
		];

		if (json_data.isEmpty()) {
			return null;
		} else {
			return json_data[0];
		}
	}

	private static Fac_Settings__c getFacSetting() {
		return Fac_Settings__c.getInstance(UserInfo.getUserId());
	}

	@RemoteAction
	@TestVisible public static Map <String, Object> getAccountsInformation(String faId, String whereClause) {
		// NEED
		// count
		// initial labels for associations
		Map <String, Object> returnValues = new Map <String, Object> ();

		// Get accounts entangled with this fa

		// create property main account (account id, account name)
		csconta__frame_agreement__c activeFa = [
			select Id, csconta__Account__c
			from csconta__frame_agreement__c
			where Id = :faId
			limit 1
		];

		if (activeFa.csconta__Account__c != null) {
			Account mainAcc = [
				select Id, Name
				from Account
				where Id = :activeFa.csconta__Account__c
				limit 1
			];
			returnValues.put('main_account', mainAcc);
		}
		// create property for associations (id, account id, account name)
		List <csconta__Account_Frame_Agreement_Association__c> associatedAccounts = new List <csconta__Account_Frame_Agreement_Association__c> ();
		associatedAccounts = [
			select id, csconta__Account__r.Id, csconta__Account__r.Name
			from csconta__Account_Frame_Agreement_Association__c
			where csconta__Frame_Agreement__c = :faId
		];
		returnValues.put('associated_accounts', associatedAccounts);

		// Get count for accounts
		String query_count = 'select count() from Account';
		if (whereClause != null) {
			query_count = query_count + ' where ' + whereClause;

		}
		returnValues.put('count', database.countQuery(query_count));

		return returnValues;

	}

	@RemoteAction
	@TestVisible public static Map <String, List <Map<String, Object>>> getPicklistOptions(List <String> picklistFields) {
		List <Schema.PicklistEntry> ple = new List <Schema.PicklistEntry> ();
		String [] types = new String[]{
			'csconta__Frame_Agreement__c'
		};

		Schema.DescribeSobjectResult[] results = Schema.describeSObjects(types);

		Map<String, Schema.SObjectField> fieldOptions = results[0].fields.getMap();

		Map <String, List <Map<String, Object>>> optionMap = new Map <String, List <Map<String, Object>>>();

		for (String field : picklistFields) {

			ple = fieldOptions.get(field).getDescribe().getPicklistValues();

			List <Map<String, Object>> options = new List <Map<String, Object>> ();
			// getLabel=OptionA;getValue=OptionA
			for (Schema.PicklistEntry optionEntry : ple) {
				Map<String, Object> option = new Map<String, Object> ();
				option.put('label', optionEntry.getLabel());
				option.put('value', optionEntry.getValue());
				options.add(option);
			}

			optionMap.put(field, options);
		}

		return optionMap;
	}

	@RemoteAction
	@TestVisible public static Map <String, String> getFieldLabels(String target) {
		Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
		Schema.SObjectType leadSchema = schemaMap.get(target);
		Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();

		Map <String, String> resultMap = new Map <String, String>();

		for (String fieldName : fieldMap.keySet()) {
			resultMap.put(fieldName, fieldMap.get(fieldName).getDescribe().getLabel());
		}

		return resultMap;
	}

	@RemoteAction
	@TestVisible public static String deleteAccountAssociation(String assocId) {
		String result = 'Success';

		try {
			csconta__Account_Frame_Agreement_Association__c association = [
				select Id
				from csconta__Account_Frame_Agreement_Association__c
				where Id = :assocId
				limit 1
			];
			delete association;
		} catch (Exception e) {
			result = e.getMessage();
		}

		return result;

	}

	@RemoteAction
	@TestVisible public static csconta__Account_Frame_Agreement_Association__c addAccountAssociation(String faId, String accountId) {
		csconta__Account_Frame_Agreement_Association__c association;
		try {
			association = new csconta__Account_Frame_Agreement_Association__c (csconta__Account__c = accountId, csconta__Frame_Agreement__c = faId);
			insert association;
			association = [
				select id, csconta__Account__r.Id, csconta__Account__r.Name
				from csconta__Account_Frame_Agreement_Association__c
				where Id = :association.Id
			];
		} catch (Exception e) {
			// result = e.getMessage();
			system.debug(e.getMessage());
		}

		return association;
	}

	public static String getPointedObjectFromFa(String field) {
		Map <String, Object> returnValues = new Map <String, Object> ();
		String pointedObject = '';

		//***********************************************************************************
		String [] types = new String[]{
			'csconta__Frame_Agreement__c'
		};

		Schema.DescribeSobjectResult[] results = Schema.describeSObjects(types);

		for (Schema.DescribeSobjectResult res : results) {
			Map<String, Schema.SObjectField> fieldMap = res.fields.getMap();

			pointedObject = String.valueOf(fieldMap.get(field).getDescribe().getReferenceTo()[0]);

		}

		return pointedObject;
	}

	@RemoteAction
	@TestVisible public static Map <String, Object> getLookupInformation(String field, String column, String whereClause, String initValId) {
		Map <String, Object> returnValues = new Map <String, Object> ();

		String accountId = getAccountId();

		String pointedObject = getPointedObjectFromFa(field);
		//***********************************************************************************

		String query_count = 'select count() from  ' + pointedObject;
		if (whereClause != null) {
			query_count = query_count + ' where ' + whereClause;
		}

		if (initValId != null && initValId != '') {
			String query_init = 'select ' + column + ' from  ' + pointedObject + ' where id=:initValId limit 1';
			returnValues.put('initialLabel', database.query(query_init)[0].get(column));
		}

		system.debug(query_count);
		returnValues.put('count', database.countQuery(query_count));
		returnValues.put('object', pointedObject);


		return returnValues;

	}

	@RemoteAction
	@TestVisible public static List <Object> getLookupRecords(String jsonParameters) {
		String accountId = getAccountId();

		Map <String, Object> parameters = (Map <String, Object>) JSON.deserializeUntyped(jsonParameters);
		List <Object> returnValues = new List <Object> ();

		//***********************************
		String pointedObject = '';

		if (parameters.containsKey('pointedObject')) {
			// Supporting getting of records for known pointed object
			pointedObject = String.valueOf(parameters.get('pointedObject'));
		} else {
			pointedObject = getPointedObjectFromFa((String) parameters.get('field'));

		}
		//***********************************
		List <String> columnsParsed = new List <String> ();

		for (Object column : (List <Object>) parameters.get('columns')) {
			system.debug(String.valueOf(column));
			columnsParsed.add(String.valueOf(column));
		}

		columnsParsed.add('Id');
		List <String> uniqueList = getUniqueListElements(columnsParsed);

		//***********************************

		String query = 'select  ' + String.join(uniqueList, ',') + ' from  ' + pointedObject;

		// CONSTRUCT WHERE CLAUSE LIST
		List <String> whereClauses = new List <String> ();

		if (parameters.containsKey('whereClause') && parameters.get('whereClause') != null) {
			whereClauses.add((String) parameters.get('whereClause'));
		}

		if (parameters.containsKey('search') && parameters.get('search') != null) {
			whereClauses.add((String) parameters.get('search'));
		}

		if (parameters.containsKey('lastId') && parameters.get('lastId') != null) {
			String lastId = (String) parameters.get('lastId');
			whereClauses.add('id > :lastId');
		}

		String whereClause = '';
		if (whereClauses.size() > 0) {
			whereClause = ' where ';
			whereClause = whereClause + String.join(whereClauses, ' and ');
		}

		query = query + whereClause;
		query = query + ' order by id';
		query = query + ' limit ' + String.valueOf(parameters.get('offset'));

		system.debug(query);

		returnValues = database.query(query);

		return returnValues;

	}


	@TestVisible private static List <String> getCategorizationDataFields() {
		List <String> returnData = new List <String> ();
		csutil__JSON_Data__c json_data = getCategorizationData();

		List <Object> categorizationData = new List <Object>();

		if (json_data != null) {
			try {
				categorizationData = (List <Object>) JSON.deserializeUntyped(json_data.csutil__value__c);
			} catch (Exception e) {

			}
		}

		for (Object category : categorizationData) {
			Map <String, Object> categoryMap = (Map <String, Object>) category;
			String fieldName = (String) categoryMap.get('field');
			returnData.add(fieldName);
		}
		return returnData;

	}

	@TestVisible private static List <String> getFieldsFromJSONData() {

		csutil__JSON_Data__c json_data = getHeaderData();
		String data;

		if (json_data == null || json_data.csutil__value__c == null) {
			return new List <String> ();
		} else {
			data = json_data.csutil__value__c;
		}

		List <Object> listData = (List <Object>) JSON.deserializeUntyped(data);
		system.debug(listData);

		Set <String> fa_fields_set = new Set <String> ();
		fa_fields_set.addAll(FA_FIELDS);

		List <String> fields = new List <String> ();

		for (Object f : listData) {
			Map <String, Object> converted = (Map <String, Object>) f;
			String field = (String) converted.get('field');
			if (!fa_fields_set.contains(field)) {
				fields.add(field);
			}
		}

		return fields;
	}

	public static Map <String, Object> getCustomSettings() {
		Map <String, Object> settingMap = new Map <String, Object> ();
		Fac_Settings__c facSettings = getFacSetting();

		settingMap.put('price_item_fields', facSettings.get('price_item_fields__c'));
		settingMap.put('frame_agreement_fields', facSettings.get('frame_agreement_fields__c'));
		settingMap.put('truncate_product_fields', facSettings.get('truncate_product_fields__c'));
		settingMap.put('show_volume_fields', facSettings.get('show_volume_fields__c'));
		settingMap.put('product_chunk_size', facSettings.get('product_chunk_size__c'));
		settingMap.put('rcl_fields', facSettings.get('rcl_fields__c'));
		settingMap.put('account_fields', facSettings.get('account_fields__c'));
		settingMap.put('approvers_revise', facSettings.get('approvers_revise__c'));
		settingMap.put('volume_fields_visibility', facSettings.get('volume_fields_visibility__c'));
		settingMap.put('usage_type_fields__c', facSettings.get('usage_type_fields__c'));
		settingMap.put('decomposition_chunk_size', facSettings.get('decomposition_chunk_size__c'));
		settingMap.put('discount_as_price', facSettings.get('discount_as_price__c'));
		settingMap.put('active_status_management__c', facSettings.get('active_status_management__c'));
		settingMap.put('decimal_places', facSettings.get('decimal_places__c'));
		settingMap.put('new_frame_agreement', facSettings.get('new_frame_agreement__c'));
		settingMap.put('input_minmax_restriction', facSettings.get('input_minmax_restriction__c'));

		settingMap.put('fa_editable_statuses', facSettings.get('fa_editable_statuses__c'));

		Map <String, Object> statuses = new Map <String, Object> ();
		statuses.put('active_status', facSettings.get('active_status__c'));
		statuses.put('approved_status', facSettings.get('approved_status__c'));
		statuses.put('draft_status', facSettings.get('draft_status__c'));
		statuses.put('closed_status', facSettings.get('closed_status__c'));
		statuses.put('requires_approval_status', facSettings.get('requires_approval_status__c'));

		settingMap.put('statuses', statuses);

		return (settingMap);
	}


	public static String getFaPrefix() {
		Fac_Settings__c facSettings = getFacSetting();
		Object prefix = facSettings.get('fa_number_prefix__c');

		if (prefix == null) {
			return '';
		} else {
			return (String) prefix;
		}
	}

	public static String parseNumberFromName(String faName) {
		return  faName.split('-')[1];
	}

	@RemoteAction
	@AuraEnabled
	global static String performAction(String className, String params) {
		if (className == '') {
			System.debug('Class name not provided. Cannot find lookup value without it.');
			return '[]';
		}
		try {
			Type classType = Type.forName(className);
			RemoteActionDataProvider dataProvider = (RemoteActionDataProvider) classType.newInstance();
			Object data = dataProvider.performAction(params);
			return (String) data;
		} catch (Exception e) {
			return 'Error: ' + e.getMessage();
		}
	}

	@TestVisible public static Map < Id, List <PricingElementWrapper>> getPriceItemCharges(List <Id> priceItemIdList) {

		Map <Id, List <PricingElementWrapper>> cpId_peWrapper = new Map <Id, List <PricingElementWrapper>> ();
		// Get all pricing elements and their types labels for commercial product
		// Get all pricing element coorelated to this price item id along with the name of their pricing element type.
		// These are the charges defined for this price item.
		List <cspmb__Pricing_Element__c> priceElements = [
			select id, cspmb__commercial_product__c, cspmb__pricing_element_type__r.Name,
				cspmb__pricing_element_type__r.cspmb__label__c,
				cspmb__pricing_element_type__r.cspmb__type__c
			from cspmb__Pricing_Element__c
			where cspmb__commercial_product__c in:priceItemIdList
		];
		// Get Pricing Rule Group - Rule Association marked as standard pricebook
		csutil__JSON_Data__c standardPricebook = getStandardPricebook();

		if (standardPricebook == null || priceElements.isEmpty()) {
			// return new ProductPricebookCharges(priceItemId);
			return cpId_peWrapper;
		}


		Map <Id, Id> peId_cpId = new Map <Id, Id> ();

		// Create a map for getting the price element type label from price element id
		Map <Id, String> pricingElementLabels = new Map <Id, String> ();
		Map <Id, String> pricingElementTypes = new Map <Id, String> ();

		Set <Id> pricingElementIds = (new Map <Id, SObject> (priceElements)).keySet();

		for (cspmb__Pricing_Element__c pricingElement : priceElements) {
			String label = pricingElement.cspmb__pricing_element_type__r.cspmb__label__c;
			String type = pricingElement.cspmb__pricing_element_type__r.cspmb__type__c;

			if (label == null) {
				label = pricingElement.cspmb__pricing_element_type__r.Name;
			}

			pricingElementLabels.put(pricingElement.Id, label);
			pricingElementTypes.put(pricingElement.Id, type);
			peId_cpId.put(pricingElement.Id, pricingElement.cspmb__commercial_product__c);
		}
		// ***************************************************
		// Get all cspmb__Pricing_Rule_Group_Rule_Association__c associated with standard price book
		List <cspmb__Pricing_Rule_Group_Rule_Association__c> priceBookAssociations = [
			select id, cspmb__pricing_rule__c
			from cspmb__Pricing_Rule_Group_Rule_Association__c
			where Id = :standardPricebook.csutil__value__c
		];

		if (priceBookAssociations == null) {
			return cpId_peWrapper;
		}

		// Save id's of the pricing rules associated with this price book into the list
		List <Id> pricingRuleList = new List <Id> ();
		for (cspmb__Pricing_Rule_Group_Rule_Association__c prgra : priceBookAssociations) {
			pricingRuleList.add(prgra.cspmb__pricing_rule__c);
		}
		// ***************************************************
		// Use this list to query price item -> pricing rule
		// This is not the list of charges for given price item
		// On these sobjects you can find price rule, price element and price item
		List <cspmb__Price_Item_Pricing_Rule_Association__c> pipraList = [
			select id, cspmb__recurring_adjustment__c, cspmb__one_off_adjustment__c, cspmb__pricing_element__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__pricing_element__c in:pricingElementIds and cspmb__pricing_rule__c in:pricingRuleList
		];

		List <PricingElementWrapper> priceItemChargesData = new List <PricingElementWrapper> ();
		// for each pipra, create charges object
		for (cspmb__Price_Item_Pricing_Rule_Association__c pipra : pipraList) {

			Id priceItemId = peId_cpId.get(pipra.cspmb__pricing_element__c);

			PricingElementWrapper tempPipra = new PricingElementWrapper(pipra.cspmb__pricing_element__c, pricingElementLabels.get(pipra.cspmb__pricing_element__c), pipra.cspmb__recurring_adjustment__c, pipra.cspmb__one_off_adjustment__c, pricingElementTypes.get(pipra.cspmb__pricing_element__c));

			if (cpId_peWrapper.containsKey(priceItemId)) {
				// get rate card lines for this rate card
				List <PricingElementWrapper> tempPeList = cpId_peWrapper.get(priceItemId);
				tempPeList.add(tempPipra);
				cpId_peWrapper.put(priceItemId, tempPeList);
			} else {
				cpId_peWrapper.put(priceItemId, new List <PricingElementWrapper>{
					tempPipra
				});
			}

		}
		return cpId_peWrapper;
	}

	@RemoteAction
	@TestVisible public static Map <String, Object> getApprovalHistory(Id faId) {

		List <ProcessInstance> listProcess = [
			select Id, (
				select Id, ProcessNodeId,
					StepStatus, Comments, TargetObjectId, ActorId, CreatedById, IsDeleted, IsPending,
					OriginalActorId, ProcessInstanceId, RemindersSent, CreatedDate, Actor.Name,
					OriginalActor.Name, ProcessNode.Name
				from StepsAndWorkitems
				order by CreatedDate desc, Id desc
			)
			from ProcessInstance
			where TargetObjectId = :faId
			order by CreatedDate desc, Id desc
		];

		Map <String, Object> approvalProcess = new Map <String, Object> ();

		Id userId = UserInfo.getUserId();
		Boolean isApprover = false;
		Boolean isPending = false;
		Boolean isInitiator = false;
		Boolean userIsAdmin = isUserAdmin();
		Set <Id> userIsDelegatedApprover = isUserDelegate(userId);

		for (ProcessInstance pi : listProcess) {
			for (ProcessInstanceHistory piwi : pi.StepsAndWorkitems) {
				if (piwi.StepStatus == 'Pending') {
					if ((piwi.ActorId == userId || userIsDelegatedApprover.contains(piwi.ActorId) || userIsAdmin)) {
						isApprover = true;
						isPending = true;
					}
				}
			}
		}
		approvalProcess.put('isPending', isPending);
		approvalProcess.put('isApprover', isApprover);
		approvalProcess.put('isAdmin', userIsAdmin);
		approvalProcess.put('currentUser', userId);
		approvalProcess.put('listProcess', listProcess);

		return approvalProcess;
	}

	@RemoteAction
	@TestVisible public static Boolean approveRejectRecallRecord(Id recordId, String comments, String action) {
		if (comments == null) {
			comments = '';
		}

		Boolean isSuccess = false;

		List <ProcessInstanceWorkitem> pwi = [
			select Id, ActorId
			from ProcessInstanceWorkitem
			where ProcessInstance.TargetObjectId = :recordId
			and ProcessInstance.Status = 'Pending'
		];
		if (!pwi.isEmpty() && pwi.size() > 0) {
			try {
				Approval.ProcessWorkitemRequest workItemRequest = new Approval.ProcessWorkitemRequest();
				workItemRequest.setWorkItemId(pwi[0].Id);
				workItemRequest.setAction(action);
				workItemRequest.setComments(comments);
				Approval.ProcessResult result = Approval.process(workItemRequest);
				// String observable = action == 'Reject' ? 'AfterReject' : 'AfterApprove';
				// executeObservers(recordId, action, observable);
				isSuccess = result.isSuccess();
			} catch (Exception e) {
				throw new AuraHandledException(e.getMessage());
			}
		} else {
			isSuccess = true;
		}
		return isSuccess;
	}

	@RemoteAction
	@TestVisible public static void reassignApproval(Id recordId, Id newActorId) {
		List <ProcessInstanceWorkitem> pwi = [
			select Id, ActorId
			from ProcessInstanceWorkitem
			where ProcessInstance.TargetObjectId = :recordId
			and ProcessInstance.Status = 'Pending'
		];
		if (pwi != null && pwi.size() > 0) {
			pwi[0].ActorId = newActorId;
			update pwi;
		}
	}

	@RemoteAction
	@TestVisible public static Boolean submitForApproval(Id recordId) {
		Boolean isSuccess = false;
		try {
			Approval.ProcessSubmitRequest appReq = new Approval.ProcessSubmitRequest();
			appReq.setComments('Submitted frame agreement for approval. Please approve.');
			appReq.setObjectId(recordId);
			//Submit the approval request
			Fac_Settings__c facSettings = getFacSetting();
			appReq.setProcessDefinitionNameOrId((String) facSettings.get('approval_process_name__c'));
			appReq.setSkipEntryCriteria(true);
			Approval.ProcessResult result = Approval.process(appReq);
			System.debug('***Frame agreement is submitted for approval successfully: ' + result.isSuccess());
			isSuccess = result.isSuccess();
		} catch (System.DmlException ex) {
			//DML type to handle ALREADY_IN_PROCESS or DOES_NOT_MEET_CRITERIA
			System.debug('***dml exception: ' + ex.getDmlMessage(0));
		} catch (Exception ex) {
			System.debug('***exception: ' + ex.getMessage());
		}
		return isSuccess;
	}

	@TestVisible public static Boolean isUserAdmin() {
		Boolean userisAdminOrDelegatedApprover = false;
		Id userProfileId = UserInfo.getProfileId();
		List <Profile> profileNames = [
			select Name
			from Profile
			where Id = :userProfileId
			limit 1
		];
		String profileName = profileNames[0].Name;
		if (profileName == 'System Administrator') {
			userisAdminOrDelegatedApprover = true;
		}
		return userisAdminOrDelegatedApprover;
	}

	@TestVisible public static Set <Id> isUserDelegate(Id userId) {
		Set <Id> userQueues = new Set <Id> ();
		List <User> delegatedUserIds = [
			select Id
			from User
			where DelegatedApproverId = :userId
		];
		Set <Id> delegatedUserId = new Set <Id> ();
		delegatedUserId.add(userId);
		if (delegatedUserIds != null && !delegatedUserIds.isEmpty()) {
			for (User user : delegatedUserIds) {
				delegatedUserId.add(user.Id);
			}
		}
		List <GroupMember> groupMemberListDelegated = [
			select Group.Id
			from GroupMember
			where UserOrGroupId in:delegatedUserId
			and
			Group.Type = 'Queue'
		];
		for (GroupMember gm : groupMemberListDelegated) {
			userQueues.add(gm.Group.Id);
		}
		for (User user : delegatedUserIds) {
			userQueues.add(user.Id);
		}
		return userQueues;
	}

	@RemoteAction
	public static Map <String, Object> getAppSettings(Id accountId) {

		Map <String, Object> appSettings = new Map <String, Object> ();

		Account acc;
		try {
			acc = [
				select Id, Name
				from Account
				where Id = :accountId
			];
		} catch (QueryException e) {
			throw new ApplicationException('Cannot find account with Id:' + accountId);
		}

		List <Object> headerData = new List <Object> ();
		List <Object> buttonCustom = new List <Object> ();
		Map <String, Object> buttonStandard = new Map <String, Object> ();
		List <Object> addonCategorizationData = new List <Object> ();
		List <Object> categorizationData = new List <Object> ();
		List <Object> relatedData = new List <Object> ();
		List <Object> customTabs = new List <Object> ();

		csutil__JSON_Data__c header_data = getHeaderData();
		csutil__JSON_Data__c button_custom = getCustomButtonData();
		csutil__JSON_Data__c button_standard = getStandardButtonData();
		csutil__JSON_Data__c categorization_data = getCategorizationData();
		csutil__JSON_Data__c addon_categorization_data = getAddonCategorizationData();
		csutil__JSON_Data__c custom_tabs = getCustomTabsData();
		csutil__JSON_Data__c related_lists = getRelatedListsData();

		if (header_data != null && header_data.csutil__value__c != null) {
			headerData = (List <Object>) JSON.deserializeUntyped(header_data.csutil__value__c);
		}

		if (button_custom != null && button_custom.csutil__value__c != null) {
			buttonCustom = (List <Object>) JSON.deserializeUntyped(button_custom.csutil__value__c);
		}

		if (button_standard != null && button_standard.csutil__value__c != null) {
			buttonStandard = (Map <String, Object>) JSON.deserializeUntyped(button_standard.csutil__value__c);
		}

		if (categorization_data != null && categorization_data.csutil__value__c != null) {
			categorizationData = (List <Object>) JSON.deserializeUntyped(categorization_data.csutil__value__c);
		}

		if (addon_categorization_data != null && addon_categorization_data.csutil__value__c != null) {
			addonCategorizationData = (List <Object>) JSON.deserializeUntyped(addon_categorization_data.csutil__value__c);
		}

		if (related_lists != null && related_lists.csutil__value__c != null) {
			relatedData = (List <Object>) JSON.deserializeUntyped(related_lists.csutil__value__c);
		}

		if (custom_tabs != null && custom_tabs.csutil__value__c != null) {
			customTabs = (List <Object>) JSON.deserializeUntyped(custom_tabs.csutil__value__c);
		}

		appSettings.put('account', acc);
		appSettings.put('HeaderData', headerData);
		appSettings.put('CustomTabsData', customTabs);
		appSettings.put('ButtonCustomData', buttonCustom);
		appSettings.put('ButtonStandardData', buttonStandard);
		appSettings.put('RelatedListsData', relatedData);
		appSettings.put('AddonCategorizationData', addonCategorizationData);
		appSettings.put('CategorizationData', categorizationData);
		appSettings.put('FACSettings', getCustomSettings());

		return appSettings;
	}

	@RemoteAction
	public static List <cspmb__Add_On_Price_Item__c> getStandaloneAddons() {
		return getStandaloneAddons_p(new List<Id>());
	}

	public static List <cspmb__Add_On_Price_Item__c> getStandaloneAddons_p(List<Id> addonIds) {
		List <String> addonMandatoryFields = new List <String> {
			'Id',
			'Name',
			'cspmb__One_Off_Charge__c',
			'cspmb__Recurring_Charge__c',
			'cspmb__Is_One_Off_Discount_Allowed__c',
			'cspmb__Is_Recurring_Discount_Allowed__c',
			'cspmb__Authorization_Level__c'
		};

		Fac_Settings__c facSettings = FrameRateManagerController.getFacSetting();
		String addFields = (String) facSettings.get('standalone_addon_fields__c');

		List <String> addFieldsArr = new List <String>();

		if (!String.isBlank(addFields)) {
			addFieldsArr = addFields.replaceAll('\\s+','').split(',');
		}

		addFieldsArr.addAll(addonMandatoryFields);

		addFieldsArr = getUniqueListElements(addFieldsArr);

		String query = 'select  ' + String.join(addFieldsArr, ',') + ' from cspmb__Add_On_Price_Item__c ';
		// ADD ACTIVE CLAUSE
		query += 'where cspmb__Is_Active__c = true ';
		// ADD START DATE CHECK CLAUSE
		query += 'and (cspmb__Effective_Start_Date__c = null OR (cspmb__Effective_Start_Date__c != null and cspmb__Effective_Start_Date__c < TODAY)) ';
		// ADD END DATE CHECK CLAUSE
		query += 'and (cspmb__Effective_End_Date__c = null OR (cspmb__Effective_End_Date__c != null and cspmb__Effective_End_Date__c > TODAY)) ';

		if (!addonIds.isEmpty()) {
			query += 'and Id in :addonIds ';
		}

		// LIMIT QUERY RESULTS
		query += 'limit 50000';

		List <cspmb__Add_On_Price_Item__c> addonList = database.query(query);
		return addonList;
	}

	@RemoteAction
	// public static List <cspmb__Price_Item__c> getCommercialProducts(Integer pageNum) {
	public static List <cspmb__Price_Item__c> getCommercialProducts(List <String> priceItemIds) {
		if (priceItemIds == null || priceItemIds.isEmpty()) {
			priceItemIds = new List <String> ();
		}
		return getCommercialProducts_p(priceItemIds);
	}

	private static List <cspmb__Price_Item__c> getCommercialProducts_p(List <Id> priceItemIds) {

		List <String> standardFields = new List <String>{
			'Id',
			'Name',
			'cspmb__Effective_Start_Date__c',
			'cspmb__Effective_End_Date__c',
			'cspmb__Is_One_Off_Discount_Allowed__c',
			'cspmb__Is_Recurring_Discount_Allowed__c',
			'cspmb__Recurring_Charge__c',
			'cspmb__One_Off_Charge__c',
			'cspmb__Authorization_Level__c',
			'cspmb__Is_Authorization_Required__c',
			'cspmb__Price_Item_Description__c'
		};

		Fac_Settings__c facSettings = getFacSetting();
		String csFields = (String) facSettings.get('rcl_fields__c');
		List <String> csFieldsArr = new List <String> ();

		if (!String.isBlank(csFields)) {
			csFieldsArr = csFields.replaceAll('\\s+','').split(',');
		}

		List <String> categorizationFields = getCategorizationDataFields();


		List <String> fieldsArr = new List <String> ();
		fieldsArr.addAll(standardFields);
		fieldsArr.addAll(csFieldsArr);
		fieldsArr.addAll(categorizationFields);

		// Remove duplicates
		List <String> uniqueList = getUniqueListElements(fieldsArr);

		String query = 'select  ' + String.join(uniqueList, ',') + ' from cspmb__Price_Item__c ';
		// DD ACCOUNT NULL CLAUSE
		query += 'where cspmb__Account__c = null ';
		// ADD ACTIVE CLAUSE
		query += 'and cspmb__Is_Active__c = true ';
		// ADD START DATE CHECK CLAUSE
		query += 'and (cspmb__Effective_Start_Date__c = null OR (cspmb__Effective_Start_Date__c != null and cspmb__Effective_Start_Date__c < TODAY)) ';
		// ADD END DATE CHECK CLAUSE
		query += 'and (cspmb__Effective_End_Date__c = null OR (cspmb__Effective_End_Date__c != null and cspmb__Effective_End_Date__c > TODAY)) ';

		if (!priceItemIds.isEmpty()) {
			query += 'and Id in :priceItemIds ';
		}

		query += 'limit 50000';

		List <cspmb__Price_Item__c> cpList = database.query(query);
		return cpList;
	}

	@RemoteAction
	public static Map <String, Map<String, Object>> findReplacementCommercialProduct(List <Id> priceItemIds) {
		// Map old cp Id: replacement cp
		Map <String, Map<String, Object>> returnMap = new Map <String, Map<String, Object>>();

		List <String> standardFields = new List <String>{
			'Id',
			'Name',
			'cspmb__Effective_Start_Date__c',
			'cspmb__Effective_End_Date__c',
			'cspmb__Price_Item_Code__c',
			'cspmb__Current_Version__c'
		};

		// Get information on old commercial products (mainly for price item code)
		String query_old = 'select  ' + 
			String.join(standardFields, ',') +
			' from cspmb__Price_Item__c' +
			' where Id in :priceItemIds';

		List <cspmb__Price_Item__c> oldProducts = database.query(query_old);

		// if products are removed, no additional searching is required.
		// FAM will remove them from the FA
		if (oldProducts.isEmpty()) {
			return returnMap;
		}

		Map <String, Id> codeMap = new Map <String, Id>();
		List <String> codeList = new List <String>();

		for (cspmb__Price_Item__c cp : oldProducts) {
			if (cp.cspmb__Price_Item_Code__c != null) {
				codeMap.put(cp.cspmb__Price_Item_Code__c, cp.Id);
				codeList.add(cp.cspmb__Price_Item_Code__c);
			}
		}

		// if codeList is empty then none of the old products have price item code
		// which means they cannot be tracked further
		if (codeList.isEmpty()) {
			return returnMap;
		}

		String query_new = 'select  ' + String.join(standardFields, ',') + ' from cspmb__Price_Item__c ';
		// ADD ACTIVE CLAUSE
		query_new += 'where cspmb__Is_Active__c = true ';
		// ADD START DATE CHECK CLAUSE
		query_new += 'and (cspmb__Effective_Start_Date__c = null OR (cspmb__Effective_Start_Date__c != null and cspmb__Effective_Start_Date__c < TODAY)) ';
		// ADD END DATE CHECK CLAUSE
		query_new += 'and (cspmb__Effective_End_Date__c = null OR (cspmb__Effective_End_Date__c != null and cspmb__Effective_End_Date__c > TODAY)) ';
		
		query_new += 'and cspmb__Price_Item_Code__c in :codeList ';

		query_new += 'limit 50000';

		List <cspmb__Price_Item__c> cpListNew = database.query(query_new);

		// If no products have been found using old price item code list
		// then no (valid) replacement have been made
		if (cpListNew.isEmpty()) {
			return returnMap;
		}
		//*******************************************************************
		String query_addons_assoc = 'select Id, cspmb__Price_Item__c, cspmb__Add_On_Price_Item__c ';
		query_addons_assoc += 'from cspmb__Price_Item_Add_On_Price_Item_Association__c ';
		query_addons_assoc += 'where cspmb__Price_Item__c in :priceItemIds ';
		query_addons_assoc += 'limit 50000';
		//*******************************************************************
		String query_rate_card_assoc = 'select Id, cspmb__Price_Item__c, cspmb__Rate_Card__c ';
		query_rate_card_assoc += 'from cspmb__Price_Item_Rate_Card_Association__c ';
		query_rate_card_assoc += 'where cspmb__Price_Item__c in :priceItemIds ';
		query_rate_card_assoc += 'limit 50000';
		//*******************************************************************

		List <cspmb__Price_Item_Add_On_Price_Item_Association__c> expiredCpAdd = database.query(query_addons_assoc);
		Map <Id, Map<Id, String>> expiredCpAddMap = new Map <Id, Map<Id, String>>();

		List <cspmb__Price_Item_Rate_Card_Association__c> expiredCpRc = database.query(query_rate_card_assoc);
		Map <Id, List <String>> expiredCpRcMap = new Map <Id, List <String>>();

		for (cspmb__Price_Item_Add_On_Price_Item_Association__c priap : expiredCpAdd) {

			Map<Id, String> tempCpIdAddonMap = new Map<Id, String>();
			if (expiredCpAddMap.containsKey(priap.cspmb__Price_Item__c)) {
				tempCpIdAddonMap = expiredCpAddMap.get(priap.cspmb__Price_Item__c);
			}

			tempCpIdAddonMap.put(priap.cspmb__Add_On_Price_Item__c, priap.Id);
			expiredCpAddMap.put(priap.cspmb__Price_Item__c, tempCpIdAddonMap);

		}

		for (cspmb__Price_Item_Rate_Card_Association__c pirca : expiredCpRc) {
			if (expiredCpRcMap.containsKey(pirca.cspmb__Price_Item__c)) {
				List <Id> tempCpIdList = expiredCpRcMap.get(pirca.cspmb__Price_Item__c);
				tempCpIdList.add(pirca.cspmb__Rate_Card__c);
				expiredCpRcMap.put(pirca.cspmb__Price_Item__c, tempCpIdList);
			} else {
				expiredCpRcMap.put(pirca.cspmb__Price_Item__c, new List<Id>{
					pirca.cspmb__Rate_Card__c
				});
			}
		}

		for (cspmb__Price_Item__c cp : cpListNew) {
			String oldCpId = codeMap.get(cp.cspmb__Price_Item_Code__c);
			// returnMap.put(codeMap.get(cp.cspmb__Price_Item_Code__c), cp);
			Map<Id, String> addonsUsedByOldCp = expiredCpAddMap.get(oldCpId);
			List <String> rcUsedByOldCp = expiredCpRcMap.get(oldCpId);

			Map<String, Object> replacementInfo = new Map<String, Object>();
			replacementInfo.put('addon_vs_addon_assoc', addonsUsedByOldCp);
			replacementInfo.put('rc', rcUsedByOldCp);
			replacementInfo.put('new_cp', cp);

			returnMap.put(oldCpId, replacementInfo);
		}

		return returnMap;
	}

	@RemoteAction
	public static List <cspmb__Price_Item__c> filterCommercialProducts(String filterData) {
		String selectClause = 'Id';
		String whereClause = '';

		List <Object> categorizationData;
		categorizationData = (List <Object>) JSON.deserializeUntyped(filterData);

		//*******************************************************************
		// Create list to hold fields: [values]
		Map < String, List <String>> categoryQueryMap = new Map < String, List <String>> ();

		//*******************************************************************
		// Iterate JSON Data, check if the field exists in schema. If so append it to query

		for (Object category : categorizationData) {
			// category.get('field');
			Map <String, Object> categoryMap = (Map <String, Object>) category;
			String fieldName = (String) categoryMap.get('field');

			List <String> valuesList = new List <String> ();

			List <Object> valuesObjArr = (List <Object>) categoryMap.get('values');

			for (Object valueObj : valuesObjArr) {
				valuesList.add((String) valueObj);
			}

			categoryQueryMap.put(fieldName, valuesList);

			if (!valuesList.isEmpty()) {
				selectClause += ',' + fieldName;

				String operator = '';

				if (String.isEmpty(whereClause)) {
					operator = ' where ';
				} else {
					operator = ' or ';
				}

				whereClause += operator + fieldName + ' in :valuesList';
			}
		}

		String query = 'select ' + selectClause + ' from cspmb__Price_Item__c ' + whereClause + ' limit 50000';

		List <SObject> results = Database.query(query);
		Set <Id> resultIds = (new Map <Id, SObject> (results)).keySet();

		return getCommercialProducts_p(new List <Id> (resultIds));
	}

	@RemoteAction
	public static List <cspmb__Add_On_Price_Item__c> filterStandaloneAddons(String filterData) {
		String selectClause = 'Id';
		String whereClause = '';

		List <Object> categorizationData;
		categorizationData = (List <Object>) JSON.deserializeUntyped(filterData);

		//*******************************************************************
		// Create list to hold fields: [values]
		Map < String, List <String>> categoryQueryMap = new Map < String, List <String>> ();

		//*******************************************************************
		// Iterate JSON Data, check if the field exists in schema. If so append it to query

		for (Object category : categorizationData) {
			// category.get('field');
			Map <String, Object> categoryMap = (Map <String, Object>) category;
			String fieldName = (String) categoryMap.get('field');

			List <String> valuesList = new List <String> ();

			List <Object> valuesObjArr = (List <Object>) categoryMap.get('values');

			for (Object valueObj : valuesObjArr) {
				valuesList.add((String) valueObj);
			}

			categoryQueryMap.put(fieldName, valuesList);

			if (!valuesList.isEmpty()) {
				selectClause += ',' + fieldName;

				String operator = '';

				if (String.isEmpty(whereClause)) {
					operator = ' where ';
				} else {
					operator = ' or ';
				}

				whereClause += operator + fieldName + ' in :valuesList';
			}
		}

		String query = 'select ' + selectClause + ' from cspmb__Add_On_Price_Item__c ' + whereClause + ' limit 50000';

		List <SObject> results = Database.query(query);
		Set <Id> resultIds = (new Map <Id, SObject> (results)).keySet();

		return getStandaloneAddons_p(new List <Id> (resultIds));
	}

	@RemoteAction
	public static List <cspmb__Discount_Threshold__c> getDiscountThresholds(List <Id> addonIdList, List <Id> cpIdList, List <Id> rcIdList) {
		// Get all auth levels from these addons and cp
		List <Id> authlevelList = new List <Id>();
		List <cspmb__price_item__c> cpList = [
			Select Id, cspmb__Authorization_Level__c
			from cspmb__price_item__c
			where Id in :cpIdList and cspmb__Authorization_Level__c != null
		];
		List <cspmb__Add_On_Price_Item__c> addonList = [
			Select Id, cspmb__Authorization_Level__c
			from cspmb__Add_On_Price_Item__c
			where Id in :addonIdList and cspmb__Authorization_Level__c != null
		];
		List <cspmb__Rate_Card__c> rcList = [
			Select Id, cspmb__Authorization_Level__c
			from cspmb__Rate_Card__c
			where Id in :rcIdList and cspmb__Authorization_Level__c != null
		];

		for (cspmb__price_item__c cp : cpList) {
			authlevelList.add(cp.cspmb__Authorization_Level__c);
		}

		for (cspmb__Add_On_Price_Item__c add : addonList) {
			authlevelList.add(add.cspmb__Authorization_Level__c);
		}

		for (cspmb__Rate_Card__c rc : rcList) {
			authlevelList.add(rc.cspmb__Authorization_Level__c);
		}

		// get discount thresholds for these auth levels
		List <cspmb__Discount_Threshold__c> dcList = [
			select Id, Name, cspmb__Discount_Threshold__c, cspmb__Authorization_Level__c, cspmb__Discount_Type__c
			from cspmb__Discount_Threshold__c
			where cspmb__Authorization_Level__c in :authlevelList
		];
		return dcList;
	}

	@RemoteAction
	public static List <DiscountLevelWrapper> getDiscountevels(List <Id> addonIdList, List <Id> cpIdList) {

		List <DiscountLevelWrapper> discountList = new List <DiscountLevelWrapper> ();

		List <cspmb__Discount_Association__c> discountAssocArr = new List <cspmb__Discount_Association__c> ();

		String assocQuery = 'select Id, cspmb__Add_On_Price_Item__c, cspmb__Discount_Level__c, cspmb__Price_Item__c,' +
			'cspmb__Discount_Level__r.Id, cspmb__Discount_Level__r.Name, cspmb__Discount_Level__r.cspmb__Charge_Type__c,' +
			'cspmb__Discount_Level__r.cspmb__Discount_Increment__c, cspmb__Discount_Level__r.cspmb__Discount_Level_Code__c,' +
			'cspmb__Discount_Level__r.cspmb__Discount_Type__c, cspmb__Discount_Level__r.cspmb__Discount_Values__c,' +
			'cspmb__Discount_Level__r.cspmb__Maximum_Discount_Value__c, cspmb__Discount_Level__r.cspmb__Minimum_Discount_Value__c ' +
			'from cspmb__Discount_Association__c where cspmb__Discount_Level__c != null';

		List <String> whereClauses = new List <String>();

		if (addonIdList != null && !addonIdList.isEmpty()) {
			whereClauses.add('cspmb__Add_On_Price_Item__c in :addonIdList');
		}

		if (cpIdList != null && !cpIdList.isEmpty()) {
			whereClauses.add('cspmb__Price_Item__c in :cpIdList');
		}

		if (whereClauses.size() == 2) {
			assocQuery += ' and (' + String.join(whereClauses, ' or ') + ')';
		}

		if (whereClauses.size() == 1) {
			assocQuery += ' and (' + whereClauses[0] + ')';
		}

		discountAssocArr = database.query(assocQuery);

		for (cspmb__Discount_Association__c assoc : discountAssocArr) {
			discountList.add(new DiscountLevelWrapper(assoc.cspmb__Price_Item__c, assoc.cspmb__Add_On_Price_Item__c, assoc.cspmb__Discount_Level__r));
		}

		return discountList;

	}

	public static List <DiscountLevelWrapper> getAddonDiscountevels() {

		List <DiscountLevelWrapper> discountList = new List <DiscountLevelWrapper> ();

		List <cspmb__Discount_Association__c> discountAssocArr = new List <cspmb__Discount_Association__c> ();

		String assocQuery = 'select Id, cspmb__Add_On_Price_Item__c, cspmb__Discount_Level__c, cspmb__Price_Item__c,' +
			'cspmb__Discount_Level__r.Id, cspmb__Discount_Level__r.Name, cspmb__Discount_Level__r.cspmb__Charge_Type__c,' +
			'cspmb__Discount_Level__r.cspmb__Discount_Increment__c, cspmb__Discount_Level__r.cspmb__Discount_Level_Code__c,' +
			'cspmb__Discount_Level__r.cspmb__Discount_Type__c, cspmb__Discount_Level__r.cspmb__Discount_Values__c,' +
			'cspmb__Discount_Level__r.cspmb__Maximum_Discount_Value__c, cspmb__Discount_Level__r.cspmb__Minimum_Discount_Value__c ' +
			'from cspmb__Discount_Association__c where cspmb__Discount_Level__c != null and cspmb__Add_On_Price_Item__c != null';

		discountAssocArr = database.query(assocQuery);

		for (cspmb__Discount_Association__c assoc : discountAssocArr) {
			discountList.add(new DiscountLevelWrapper(assoc.cspmb__Price_Item__c, assoc.cspmb__Add_On_Price_Item__c, assoc.cspmb__Discount_Level__r));
		}

		return discountList;

	}

	@RemoteAction
	public static Map <String, Object> getAddonDiscountInformation() {

		Map <String, Object> addonDiscInfo = new Map <String, Object>();

		List <Id> authlevelList = new List<Id>();

		List <cspmb__Add_On_Price_Item__c> addonList = [
			Select Id, cspmb__Authorization_Level__c
			from cspmb__Add_On_Price_Item__c
			where cspmb__Authorization_Level__c != null
		];

		for (cspmb__Add_On_Price_Item__c add : addonList) {
			authlevelList.add(add.cspmb__Authorization_Level__c);
		}

		List <cspmb__Discount_Threshold__c> dcList = [
			select Id, Name, cspmb__Discount_Threshold__c, cspmb__Authorization_Level__c, cspmb__Discount_Type__c
			from cspmb__Discount_Threshold__c
			where cspmb__Authorization_Level__c in :authlevelList
		];        

		addonDiscInfo.put('discLevels', getAddonDiscountevels());
		addonDiscInfo.put('dcList', dcList);

		return addonDiscInfo;

	}



	@RemoteAction
	public static List <Map <String, Object>> getRelatedLists(Id faId) {
		List <Map <String, Object>> resultList = new List <Map <String, Object>> ();

		List <Object> relatedData = new List <Object> ();

		csutil__JSON_Data__c related_lists = getRelatedListsData();
		String data;

		if (related_lists == null || related_lists.csutil__value__c == null) {
			//
		} else {
			relatedData = (List <Object>) JSON.deserializeUntyped(related_lists.csutil__value__c);
		}

		for (Object relatedListObject : relatedData) {

			Map<String, Object> relatedList = (Map<String, Object>) relatedListObject;
			Map <String, Object> relatedStructure = new Map <String, Object>();

			String query = 'select ';
			query += (String) relatedList.get('columns');
			query += ' from ' + (String) relatedList.get('object');
			query += ' where ' + (String) relatedList.get('fa_lookup') + ' = :faId';
			query += ' limit 50000';

			system.debug(query);

			relatedStructure.put('label', (String) relatedList.get('label'));
			relatedStructure.put('object', (String) relatedList.get('object'));
			relatedStructure.put('columns', (String) relatedList.get('columns'));
			relatedStructure.put('records', database.query(query));

			resultList.add(relatedStructure);
		}

		return resultList;

	}

	@RemoteAction
	public static Map <String, Object> getCommercialProductData(List <String> priceItemIdList) {
		Map <Id, cpData> cpDataMap = new Map <Id, cpData> ();

		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> addons = getAddons(priceItemIdList);
		// Get addonIds for discount levels
		// These are the addons that we need to load beside cp
		Map <Id, List <RateCard>> rateCards = getRateCards(priceItemIdList);
		// got ratecards, load auth lv for them
		List <Id> addonIdList = getAddonIdsForCp(priceItemIdList);
		List <Id> rcIdList = getRateCardIdsForCp(priceItemIdList);
		List <DiscountLevelWrapper> discountLevels = getDiscountevels(addonIdList, priceItemIdList);


		List <cspmb__Discount_Threshold__c> discountThresholds = getDiscountThresholds(addonIdList, priceItemIdList, rcIdList);

		Map <Id, List <PricingElementWrapper>> charges = getPriceItemCharges(priceItemIdList);

		AllowancesWrapper allowanceUtStructure = getAllowances(priceItemIdList);
		Map <Id, List <cspmb__Allowance__c>> allowances = allowanceUtStructure.allowanceMap;


		for (String priceItemId : priceItemIdList) {
			List <cspmb__Price_Item_Add_On_Price_Item_Association__c> this_addons = addons.get(priceItemId);
			if (this_addons == null) {
				this_addons = new List <cspmb__Price_Item_Add_On_Price_Item_Association__c> ();
			}

			List <PricingElementWrapper> this_charges = charges.get(priceItemId);
			if (this_charges == null) {
				this_charges = new List <PricingElementWrapper> ();
			}

			List <RateCard> this_rateCards = rateCards.get(priceItemId);
			if (this_rateCards == null) {
				this_rateCards = new List <RateCard> ();
			}

			List <cspmb__Allowance__c> this_allowances = allowances.get(priceItemId);

			if (this_allowances == null) {
				this_allowances = new List <cspmb__Allowance__c> ();
			}

			cpDataMap.put(priceItemId, new cpData(this_addons, this_charges, this_rateCards, this_allowances));
		}

		Map <String, Object> collectiveCpData = new Map <String, Object>();
		collectiveCpData.put('discLevels', discountLevels);
		collectiveCpData.put('discThresh', discountThresholds);
		collectiveCpData.put('childUsageTypes', allowanceUtStructure.childUsageTypes);
		collectiveCpData.put('cpData', cpDataMap);

		return collectiveCpData;
	}

	public static Map <Id, List <RateCard>> getRateCards(List <Id> priceItemIdList) {
		// contains end result, mapping price item ids to their rate cards
		Map <Id, List <RateCard>> prId_RateCards = new Map <Id, List <RateCard>> ();

		if (priceItemIdList.isEmpty()) {
			return prId_RateCards;
		}

		// contains information about which rate card belongs to which price item (rateCardId: priceItemId)
		Map < Id, List<Id>> rateCard_priceItemMap = new Map < Id, List<Id>> ();
		// contains list of rate card ids to be loaded
		List <Id> rateCardIdList = new List <Id> ();

		List <cspmb__Price_Item_Rate_Card_Association__c> rateCardAssocList = [
			select Id, cspmb__Rate_Card__r.Id, cspmb__Price_Item__c
			from cspmb__Price_Item_Rate_Card_Association__c
			where cspmb__Price_Item__c in :priceItemIdList
		];

		for (cspmb__Price_Item_Rate_Card_Association__c pirca : rateCardAssocList) {

			// rateCard_priceItemMap.put(pirca.cspmb__Rate_Card__r.Id, pirca.cspmb__Price_Item__c);

			if (rateCard_priceItemMap.containsKey(pirca.cspmb__Rate_Card__r.Id)) {
				List <Id> tempCpIdList = rateCard_priceItemMap.get(pirca.cspmb__Rate_Card__r.Id);
				tempCpIdList.add(pirca.cspmb__Price_Item__c);
				rateCard_priceItemMap.put(pirca.cspmb__Rate_Card__r.Id, tempCpIdList);
			} else {
				rateCard_priceItemMap.put(pirca.cspmb__Rate_Card__r.Id, new List<Id>{
					pirca.cspmb__Price_Item__c
				});
			}

			rateCardIdList.add(pirca.cspmb__Rate_Card__r.Id);
		}
		// ***************************************************
		// contains information about which rate card has which rate card lines (rateCardId: rateCardLineList)
		Map <Id, List <cspmb__Rate_Card_Line__c>> rcId_rateCardLineList = new Map < Id, List <cspmb__Rate_Card_Line__c>> ();
		// list of loaded/relevant rate card lines
		List <cspmb__Rate_Card_Line__c> rateCardLines = getRateCardLines(rateCardIdList);

		for (cspmb__Rate_Card_Line__c rcl : rateCardLines) {

			// mechanism populating list inside map, handles first occurence
			if (rcId_rateCardLineList.containsKey(rcl.cspmb__Rate_Card__c)) {
				// get rate card lines for this rate card
				List <cspmb__Rate_Card_Line__c> tempRclList = rcId_rateCardLineList.get(rcl.cspmb__Rate_Card__c);
				tempRclList.add(rcl);
				rcId_rateCardLineList.put(rcl.cspmb__Rate_Card__c, tempRclList);
			} else {
				rcId_rateCardLineList.put(rcl.cspmb__Rate_Card__c, new List <cspmb__Rate_Card_Line__c>{
					rcl
				});
			}

		}
		// ***************************************************
		// list of loaded/relevant rate cards
		List <cspmb__Rate_Card__c> rateCardList = new List <cspmb__Rate_Card__c> ();
		rateCardList = [
			select Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Rate_Card_Code__c, cspmb__Authorization_Level__c, cspmb__Is_Authorization_Required__c
			from cspmb__Rate_Card__c
			where cspmb__Is_Active__c = true
			and Id IN:rateCardIdList
		];

		// ***************************************************
		List <RateCard> rateCardModelList = new List <RateCard> ();
		for (cspmb__Rate_Card__c rc : rateCardList) {

			Boolean start_invalid = rc.cspmb__Effective_Start_Date__c != null && date.today() < rc.cspmb__Effective_Start_Date__c;
			Boolean end_invalid = rc.cspmb__Effective_End_Date__c != null && date.today() > rc.cspmb__Effective_End_Date__c;

			if (!(start_invalid || end_invalid)) {
				List <cspmb__Rate_Card_Line__c> rclList = new List <cspmb__Rate_Card_Line__c> ();

				if (rcId_rateCardLineList.containsKey(rc.Id)) {
					// get list of rate card lines for this rate card
					rclList = rcId_rateCardLineList.get(rc.Id);
				}

				rateCardModelList.add(new RateCard(rc, rclList));
			}
		}
		// ***************************************************
		for (RateCard rc : rateCardModelList) {

			List <Id> corespondingPriceItemIds = rateCard_priceItemMap.get(rc.Id);

			for (Id cpId : corespondingPriceItemIds) {

				if (!prId_RateCards.containsKey(cpId)) {
					prId_RateCards.put(cpId, new List <RateCard> ());
				}

				List <RateCard> tempRcList = prId_RateCards.get(cpId);
				tempRcList.add(rc);
				prId_RateCards.put(cpId, tempRcList);

			}


		}
		// ***************************************************
		return prId_RateCards;
	}

	public static AllowancesWrapper getAllowances(List <Id> priceItemIdList) {

		List <String> standardFields = new List <String>{
			'Id',
			'Name'
		};

		Fac_Settings__c facSettings = getFacSetting();
		String utFields = (String) facSettings.get('usage_type_fields__c');
		List <String> utFieldsArr = new List <String> ();

		if (!String.isBlank(utFields)) {
			utFieldsArr = utFields.split(',');
		}

		List <String> fieldsArr = new List <String> ();
		fieldsArr.addAll(standardFields);
		fieldsArr.addAll(utFieldsArr);

		// Remove duplicates
		List <String> uniqueUtFieldList = getUniqueListElements(fieldsArr);

		List <cspmb__Commercial_Product_Allowance_Assoc__c> cpaaList = new List <cspmb__Commercial_Product_Allowance_Assoc__c> ();
		cpaaList = [
			select Id, cspmb__allowance__c, cspmb__commercial_product__c
			from cspmb__Commercial_Product_Allowance_Assoc__c
			where cspmb__commercial_product__c in :priceItemIdList
		];

		List <String> allowIdList = new List <String>();

		for (cspmb__Commercial_Product_Allowance_Assoc__c cpaa : cpaaList) {
			allowIdList.add(cpaa.cspmb__allowance__c);
		}

		// Get allowances
		// ********************************************************************
		Map<Id, cspmb__Allowance__c> allowanceMap = new Map<Id, cspmb__Allowance__c>([
			select Id, Name, cspmb__amount__c, cspmb__priority__c, cspmb__usage_type__c, cspmb__usage_type__r.cspmb__unit_of_measure__c,
				cspmb__usage_type__r.name, cspmb__usage_type__r.cspmb__type__c
			from cspmb__Allowance__c
			where Id in :allowIdList
		]);
		// ********************************************************************

		// Extract parent usage types from allowances
		List <String> mainUtIdList = new List <String>();

		for (cspmb__Allowance__c al : allowanceMap.values()) {
			if (al.cspmb__usage_type__c != null) {
				mainUtIdList.add(al.cspmb__usage_type__c);
			}
		}

		// Find child usage types

		List <cspmb__Usage_Type_Grouping__c> usageGroupingList = [
			Select Id, cspmb__child_usage_type__c, cspmb__parent_usage_type__c
			from cspmb__Usage_Type_Grouping__c
			where cspmb__parent_usage_type__c in :mainUtIdList
		];

		Map <Id, Set<Id>> mapChildParentSet = new Map <Id, Set<Id>>();
		Map <Id, Id> mapChildParentUt = new Map <Id, Id>();

		List <String> childUtIdList = new List <String>();
		for (cspmb__Usage_Type_Grouping__c utg : usageGroupingList) {
			childUtIdList.add(utg.cspmb__child_usage_type__c);

			// mapChildParentUt.put(utg.cspmb__child_usage_type__c, utg.cspmb__parent_usage_type__c);

			if (mapChildParentSet.containsKey(utg.cspmb__child_usage_type__c)) {
			 Set <Id> tempSet = mapChildParentSet.get(utg.cspmb__child_usage_type__c);
			 tempSet.add(utg.cspmb__parent_usage_type__c);
			 mapChildParentSet.put(utg.cspmb__child_usage_type__c, tempSet);
			} else {
			 mapChildParentSet.put(utg.cspmb__child_usage_type__c, new Set<Id>{utg.cspmb__parent_usage_type__c});
			}

		}

		// Get all child ut mapped by Id

		Map<Id, List<cspmb__Usage_Type__c>> childUtMap = new Map<Id, List<cspmb__Usage_Type__c>>();
		// [
		//         select Id, Name, cspmb__unit_of_measure__c
		//         from cspmb__Usage_Type__c
		//         where Id in :childUtIdList
		// ]);

		String ut_query = 'select ' + String.join(uniqueUtFieldList, ',') + ' from cspmb__Usage_Type__c where Id in :childUtIdList';

		for (cspmb__Usage_Type__c ut : database.query(ut_query)) {

			Set <Id> parentIds = mapChildParentSet.get(ut.Id);

			for (Id parentId : parentIds) {
				if (childUtMap.containsKey(parentId)) {
					List <cspmb__Usage_Type__c> tempSet = childUtMap.get(parentId);
					tempSet.add(ut);
					childUtMap.put(parentId, tempSet);
				} else {
					childUtMap.put(parentId, new List<cspmb__Usage_Type__c>{ut});
				}
			}

		}


		// ********************************************************************

		// Map<Id, cspmb__Allowance__c> allowanceMap = new Map<Id, cspmb__Allowance__c>([
		//         select Id, Name, cspmb__amount__c, cspmb__priority__c, cspmb__usage_type__c, cspmb__usage_type__r.cspmb__unit_of_measure__c
		//         from cspmb__Allowance__c
		//         where Id in :allowList
		// ]);

		Map <Id, List <cspmb__Allowance__c>> allowanceCpMap = new Map <Id, List <cspmb__Allowance__c>>();

		for (cspmb__Commercial_Product_Allowance_Assoc__c cpallow : cpaaList) {

			if (allowanceCpMap.containsKey(cpallow.cspmb__commercial_product__c)) {
				// Get existing list
				List <cspmb__Allowance__c> tempAllowList = allowanceCpMap.get(cpallow.cspmb__commercial_product__c);
				// add to that list
				tempAllowList.add(allowanceMap.get(cpallow.cspmb__allowance__c));
				// put it back, what a dumb language
				allowanceCpMap.put(cpallow.cspmb__commercial_product__c, tempAllowList);

			} else {
				// Put new list with item already in there
				allowanceCpMap.put(cpallow.cspmb__commercial_product__c, new List <cspmb__Allowance__c>{
					allowanceMap.get(cpallow.cspmb__allowance__c)
				});
			}

		}

		return new AllowancesWrapper(childUtMap, allowanceCpMap);

	}

	public static List <cspmb__Rate_Card_Line__c> getRateCardLines(List <String> rateCardLinesIdList) {

		List <String> standardFields = new List <String>{
			'Id',
			'Name',
			'cspmb__Cap_Unit__c',
			'cspmb__rate_value__c',
			'cspmb__usage_type__r.Name',
			'cspmb__Rate_Card__c'
		};

		Fac_Settings__c facSettings = getFacSetting();
		String csFields = (String) facSettings.get('rcl_fields__c');
		List <String> csFieldsArr = new List <String> ();

		if (!String.isBlank(csFields)) {
			csFieldsArr = csFields.split(',');
		}

		List <String> fieldsArr = new List <String> ();
		fieldsArr.addAll(standardFields);
		fieldsArr.addAll(csFieldsArr);

		// Remove duplicates
		List <String> uniqueList = getUniqueListElements(fieldsArr);


		String query = 'select ' + String.join(uniqueList, ',') + ' from cspmb__Rate_Card_Line__c where cspmb__Rate_Card__c in :rateCardLinesIdList and cspmb__Is_Active__c = true';
		List <cspmb__Rate_Card_Line__c> rateCardLines = new List <cspmb__Rate_Card_Line__c> ();
		rateCardLines = database.query(query);

		return rateCardLines;
	}

	public static Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> getAddons(List <Id> priceItemIdList) {
		// contains end result, mapping price item ids to their addons
		Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> prId_addons = new Map <Id, List <cspmb__Price_Item_Add_On_Price_Item_Association__c>> ();

		List <cspmb__Price_Item_Add_On_Price_Item_Association__c> priceItemAddonAssociations = [
					select Id, cspmb__Price_Item__c, cspmb__Overrides_Add_On_Charges__c, cspmb__effective_end_date__c,
					cspmb__effective_start_date__c, cspmb__Add_On_Price_Item__r.cspmb__Effective_End_Date__c,
					cspmb__Add_On_Price_Item__r.cspmb__Effective_Start_Date__c, cspmb__One_Off_Charge__c, cspmb__Recurring_Charge__c,
					cspmb__Add_On_Price_Item__c, cspmb__Add_On_Price_Item__r.Name, cspmb__Add_On_Price_Item__r.cspmb__Authorization_Level__c,
					cspmb__Add_On_Price_Item__r.cspmb__One_Off_Charge__c, cspmb__Add_On_Price_Item__r.cspmb__Recurring_Charge__c,
					cspmb__Add_On_Price_Item__r.cspmb__Is_One_Off_Discount_Allowed__c, cspmb__Add_On_Price_Item__r.cspmb__Is_Recurring_Discount_Allowed__c
					from cspmb__Price_Item_Add_On_Price_Item_Association__c
					where cspmb__Price_Item__c in: priceItemIdList and cspmb__Add_On_Price_Item__r.cspmb__Is_Active__c = true
				];

		List <cspmb__Price_Item_Add_On_Price_Item_Association__c> filteredPriceItemAddonAssociations = new List <cspmb__Price_Item_Add_On_Price_Item_Association__c> ();

		for (cspmb__Price_Item_Add_On_Price_Item_Association__c addonAsson : priceItemAddonAssociations) {

			Date effectiveStartDate = addonAsson.cspmb__Add_On_Price_Item__r.cspmb__Effective_Start_Date__c;
			Date effectiveEndDate = addonAsson.cspmb__Add_On_Price_Item__r.cspmb__Effective_End_Date__c;

			Boolean start_invalid = effectiveStartDate != null && Date.today() < effectiveStartDate;
			Boolean end_invalid = effectiveEndDate != null && Date.today() > effectiveEndDate;

			Boolean start_invalid_assoc = addonAsson.cspmb__effective_start_date__c != null && date.today() < addonAsson.cspmb__effective_start_date__c;
			Boolean end_invalid_assoc = addonAsson.cspmb__effective_end_date__c != null && date.today() > addonAsson.cspmb__effective_end_date__c;

			if (addonAsson.cspmb__Overrides_Add_On_Charges__c == false) {
				addonAsson.cspmb__One_Off_Charge__c = addonAsson.cspmb__Add_On_Price_Item__r.cspmb__One_Off_Charge__c;
				addonAsson.cspmb__Recurring_Charge__c = addonAsson.cspmb__Add_On_Price_Item__r.cspmb__Recurring_Charge__c;
			}

			if (!(start_invalid || end_invalid) && !(start_invalid_assoc || end_invalid_assoc)) {
				filteredPriceItemAddonAssociations.add(addonAsson);
			}
		}

		for (cspmb__Price_Item_Add_On_Price_Item_Association__c addonAsson: filteredPriceItemAddonAssociations) {
			if (prId_addons.containsKey(addonAsson.cspmb__Price_Item__c)) {
				// get addons lines for this price item
				List <cspmb__Price_Item_Add_On_Price_Item_Association__c> tempAddList = prId_addons.get(addonAsson.cspmb__Price_Item__c);
				tempAddList.add(addonAsson);
				prId_addons.put(addonAsson.cspmb__Price_Item__c, tempAddList);
			} else {
				prId_addons.put(addonAsson.cspmb__Price_Item__c, new List <cspmb__Price_Item_Add_On_Price_Item_Association__c> {
					addonAsson
				});
			}
		}

		return prId_addons;
	}

	public static List <Id> getAddonIdsForCp(List <Id> priceItemIdList) {
		List <cspmb__Price_Item_Add_On_Price_Item_Association__c> priceItemAddonAssociations = [
			select Id, cspmb__Add_On_Price_Item__c, cspmb__Price_Item__c
			from cspmb__Price_Item_Add_On_Price_Item_Association__c
			where cspmb__Price_Item__c in :priceItemIdList and cspmb__Add_On_Price_Item__r.cspmb__Is_Active__c = true
		];

		List <Id> addonIdList = new List <Id>();
		for (cspmb__Price_Item_Add_On_Price_Item_Association__c addonAssoc : priceItemAddonAssociations) {
			addonIdList.add(addonAssoc.cspmb__Add_On_Price_Item__c);
		}

		return addonIdList;
	}

	public static List <Id> getRateCardIdsForCp(List <Id> priceItemIdList) {
		List <cspmb__Price_Item_Rate_Card_Association__c> priceItemRcAssociation = [
			select Id, cspmb__Rate_Card__c, cspmb__Price_Item__c
			from cspmb__Price_Item_Rate_Card_Association__c
			where cspmb__Price_Item__c in :priceItemIdList and cspmb__Rate_Card__r.cspmb__Is_Active__c = true
		];

		List <Id> rcIdList = new List <Id>();
		for (cspmb__Price_Item_Rate_Card_Association__c rcAsssoc : priceItemRcAssociation) {
			rcIdList.add(rcAsssoc.cspmb__Rate_Card__c);
		}

		return rcIdList;
	}

	@RemoteAction
	public static List <csconta__Frame_Agreement__c> getFrameAgreements(String accountId) {
		List <csconta__Frame_Agreement__c> faList = new List <csconta__Frame_Agreement__c> ();

		// Test validity of Id
		Id accId;
		try {
			accId = (Id) accountId;
		} catch (Exception e) {
		}

		if (accId == null) {
			return faList;
		}
		// ******************************************************
		// Get association accounts
		List <AggregateResult> aggFa = [
			select count(id), csconta__Frame_Agreement__c
			from csconta__Account_Frame_Agreement_Association__c
			where csconta__Account__c = :accountId
			group by csconta__Frame_Agreement__c
		];
		List <String> junctionFaIdList = new List <String>();

		for (AggregateResult fa : aggFa) {
			junctionFaIdList.add((String) fa.get('csconta__Frame_Agreement__c'));
		}

		// ******************************************************
		List <String> conjoined_fields = new List <String> ();
		conjoined_fields.addAll(FA_FIELDS);
		conjoined_fields.addAll(getFieldsFromJSONData());

		String query = 'select ' + String.join(conjoined_fields, ', ') + ' from csconta__Frame_Agreement__c';

		query = query + ' where csconta__Account__c = :accId or Id in :junctionFaIdList';
		query = query + ' order by LastModifiedDate DESC';

		return database.query(query);
	}

	@RemoteAction
	public static String addFaToMaster(String faId, List <String> faIds) {
		// Check if fa is master

		csconta__Frame_Agreement__c master = getFrameAgreement(faId);

		if (master.csconta__agreement_level__c != 'Master Agreement') {
			throw new AgreementNotMasterException('Frame agreement ' + faId + ' is not of level "Master Agreement" and may not recieve children.');
		}

		List <csconta__Frame_Agreement__c> faList = new List <csconta__Frame_Agreement__c> ();
		faList = [
			select Id, csconta__master_frame_agreement__c
			from csconta__Frame_Agreement__c
			where Id in :faIds
		];

		// Test validity of Id
		for (csconta__Frame_Agreement__c fa : faList) {
			fa.csconta__master_frame_agreement__c = faId;
			fa.csconta__agreement_level__c = 'Frame Agreement';
		}

		upsert faList;
		return 'Success';
	}

	@RemoteAction
	public static String removeFaFromMaster(String faId, List <String> faIds) {

		List <csconta__Frame_Agreement__c> faList = new List <csconta__Frame_Agreement__c> ();
		faList = [
			select Id, csconta__master_frame_agreement__c
			from csconta__Frame_Agreement__c
			where Id in :faIds
		];

		// Test validity of Id
		for (csconta__Frame_Agreement__c fa : faList) {
			fa.csconta__master_frame_agreement__c = null;
			fa.csconta__agreement_level__c = 'Frame Agreement';
		}

		upsert faList;
		return 'Success';
	}

	@RemoteAction
	public static csconta__Frame_Agreement__c getFrameAgreement(Id faId) {
		List <String> conjoined_fields = new List <String> ();
		conjoined_fields.addAll(FA_FIELDS);
		conjoined_fields.addAll(getFieldsFromJSONData());
		String query = 'select ' + String.join(conjoined_fields, ', ') + ' from csconta__Frame_Agreement__c where Id = :faId limit 1';

		csconta__Frame_Agreement__c returnFa = null;
		try {
			returnFa = database.query(query);
		} catch (Exception e) {

		}

		return returnFa;
	}

	@RemoteAction
	public static String setFrameAgreementState(Id faId, String status) {
		String retString = 'Success';
		try {
			csconta__Frame_Agreement__c fa = [
				select Id, csconta__effective_start_date__c
				from csconta__Frame_Agreement__c
				where Id = :faId
				limit 1
			];
			fa.csconta__Status__c = status;
			update fa;

		} catch (QueryException e) {
			retString = e.getMessage();
		}

		return retString;
	}

	@RemoteAction
	public static String deleteFrameAgreement(Id faId) {
		String retString = 'Success';
		try {
			csconta__Frame_Agreement__c fa = new csconta__Frame_Agreement__c(id = faId);
			delete fa;
		} catch (DmlException e) {
			retString = e.getMessage();
		}
		return retString;
	}

	@RemoteAction
	public static csconta__Frame_Agreement__c cloneFrameAgreement(Id faId) {


		List <String> conjoined_fields = new List <String> ();
		conjoined_fields.addAll(FA_FIELDS);
		conjoined_fields.addAll(getFieldsFromJSONData());

		String query = 'select ' + String.join(conjoined_fields, ', ') + ' from csconta__Frame_Agreement__c  where Id = :faId';

		csconta__Frame_Agreement__c original;
		try {
			original = database.query(query);
		} catch (QueryException e) {
			return null;
		}

		csconta__Frame_Agreement__c cloned = original.clone(false, false, false, false);
		cloned.csconta__Status__c = 'Draft';
		cloned.csconta__replaced_frame_agreement__c = null;
		cloned.csconta__replaced_by__c = null;
		insert cloned;

		Fac_Settings__c facSettings = getFacSetting();
		String prefix = getFaPrefix();

		cloned.csconta__frame_agreement_number__c = prefix + parseNumberFromName(original.Name);
		update cloned;

		Attachment originalAttachment = getAttachment(faId);


		if (originalAttachment != null) {
			// pCreateAttachment(Id parentId, String name, String description, Blob body, String content)
			pCreateAttachment(cloned.Id, FAC_ATTACHMENT_NAME, FAC_ATTACHMENT_DESC, originalAttachment.Body, 'text/plain');
		}

		// Close associated accounts
		// csconta__Account_Frame_Agreement_Association__c

		Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe().get('csconta__Account_Frame_Agreement_Association__c').getDescribe().fields.getMap();

		List <String> assocFieldList = new List <String> ();

		for (String s : objectFields.keySet()) {
			assocFieldList.add(s);
		}

		String query_assoc = 'Select ' + String.join(assocFieldList, ',');
		query_assoc += ' from csconta__Account_Frame_Agreement_Association__c';
		query_assoc += ' where csconta__Frame_Agreement__c = :faId';

		// List <csconta__Account_Frame_Agreement_Association__c> originalAccountAssoc = [
		//  select id, csconta__Account__c, csconta__Frame_Agreement__c
		//  from csconta__Account_Frame_Agreement_Association__c
		//  where csconta__Frame_Agreement__c = :faId
		// ];

		List <csconta__Account_Frame_Agreement_Association__c> clonedList = new List <csconta__Account_Frame_Agreement_Association__c>();

		for (csconta__Account_Frame_Agreement_Association__c oas : database.query(query_assoc)) {
			//clonedList.add(new csconta__Account_Frame_Agreement_Association__c(csconta__Account__c = oas.csconta__Account__c, csconta__Frame_Agreement__c = cloned.Id));
			csconta__Account_Frame_Agreement_Association__c clonedAssoc = oas.clone(false, true, false, false);
			clonedAssoc.csconta__Frame_Agreement__c = cloned.Id;
			clonedList.add(clonedAssoc);
		}

		insert clonedList;


		List <csutil__JSON_Data__c> jsonData = [
			select id, name, csutil__value__c
			from csutil__JSON_Data__c
			where name = 'FA-Clone-Observer'
		];
		if (!jsonData.isEmpty()) {
			Map<String, String> cloneObserverPayload = new Map<String, String>();
			cloneObserverPayload.put('sourceId', faId);
			cloneObserverPayload.put('targetId', cloned.id);
			String result = performAction(jsonData[0].csutil__value__c, JSON.serialize(cloneObserverPayload));
			if (result.contains('Error')) {
				return null;
			}
		}

		return getFrameAgreement(cloned.Id);
	}

	/**
	* Clones existing FA, sets clones status to draft and lookup to replaced fa
	* @param faId Id of FA to be cloned
	* @return cloned FA
	*/
	@RemoteAction
	public static csconta__Frame_Agreement__c createNewVersionOfFrameAgreement(Id faId) {
		system.debug('createNewVersionOfFrameAgreement ' + faId);
		csconta__Frame_Agreement__c original = getFrameAgreement(faId);

		if (original == null) {
			throw new InvalidParamException('Cannot find frame agreement with Id:' + faId);
		}

		csconta__Frame_Agreement__c clonedFa = cloneFrameAgreement(faId);

		Fac_Settings__c facSettings = getFacSetting();
		clonedFa.csconta__Status__c = (String) facSettings.get('draft_status__c');
		clonedFa.csconta__replaced_frame_agreement__c = faId;

		// String attachmentBody = getAttachmentBody(faId);
		// saveAttachment(clonedFa.Id, attachmentBody);

		original.csconta__replaced_by__c = clonedFa.Id;
		original.csconta__effective_end_date__c = datetime.now();

		clonedFa.csconta__frame_agreement_number__c = original.csconta__frame_agreement_number__c;
		clonedFa.csconta__effective_end_date__c = null;

		update original;
		update clonedFa;

		return clonedFa;
	}

	@RemoteAction
	public static csconta__Frame_Agreement__c upsertFrameAgreements(Id faId, String fieldData) {
		// String fieldData = '{"csconta__Status__c": "Active", "csconta__Agreement_Name__c": "test"}';

		Map <String, Object> dataMap = (Map <String, Object>) JSON.deserializeUntyped(fieldData);

		Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
		Schema.SObjectType leadSchema = schemaMap.get('csconta__Frame_Agreement__c');
		Map <String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();

		csconta__Frame_Agreement__c fa;
		if (faId == null) {
			fa = new csconta__Frame_Agreement__c();
		} else {
			fa = new csconta__Frame_Agreement__c(
				Id = faId
			);
		}

		for (String key : dataMap.keySet()) {

			if (fieldMap.get(key) == null) {
				system.debug(Logginglevel.WARN, '' + key + ' not valid field on csconta__Frame_Agreement__c');
				continue;
			}

			String dataType = String.valueOf(fieldMap.get(key).getDescribe().getType());

			if (dataMap.get(key) == null) {
				fa.put(key, null);
			} else if (fieldMap.get(key).getDescribe().isCalculated()) {
				// fa.put(key, dataMap.get(key));
				// formula, do not update
			} else if (dataType == 'Date') {
				DateTime a = DateTime.newInstance((Long) dataMap.get(key));
				Date dateConvert = Date.newinstance(a.year(), a.month(), a.day());
				fa.put(key, dateConvert);
			} else if (dataType == 'Datetime') {
				DateTime a = DateTime.newInstance((Long) dataMap.get(key));
				fa.put(key, a);
			}
			//else if (dataType == 'String') {
			//     fa.put(key, dataMap.get(key));
			// } else if (dataType == 'Long') {
			//     fa.put(key, dataMap.get(key));
			// } else if (dataType == 'Decimal') {
			//     fa.put(key, dataMap.get(key));
			// } else if (dataType == 'Boolean') {
			//     fa.put(key, dataMap.get(key));
			// } else if (dataType == 'Picklist') {
			//     fa.put(key, dataMap.get(key));
			// } else if (dataType == 'Double') {
			//     fa.put(key, dataMap.get(key));
			// } else if (dataType == 'Textarea') {
			//     fa.put(key, dataMap.get(key));
			else {
				fa.put(key, dataMap.get(key));
			}
		}

		upsert fa;

		fa = getFrameAgreement(fa.Id);
		if (fa.csconta__replaced_frame_agreement__c == null) {

			//ac_settings__c facSettings = Fac_Settings__c.getInstance(UserInfo.getUserId());
			String prefix = getFaPrefix();

			fa.csconta__frame_agreement_number__c = prefix + parseNumberFromName(fa.Name);
			update fa;
		}

		return fa;
	}

	@RemoteAction
	public static List <cspmb__Pricing_Element__c> getPricingElements(String priceItemId) {

		List <Id> priceElementIdList = new List <Id> ();
		Map < Id, cspmb__Price_Item_Pricing_Rule_Association__c > pricingElementObj = new Map < Id, cspmb__Price_Item_Pricing_Rule_Association__c > ();

		for (cspmb__Price_Item_Pricing_Rule_Association__c pipra : [
			select Id, cspmb__pricing_element__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :priceItemId
		]) {
			priceElementIdList.add(pipra.cspmb__pricing_element__c);
			pricingElementObj.put(pipra.cspmb__pricing_element__c, pipra);
		}

		List <cspmb__Pricing_Element__c> pricingElList = new List <cspmb__Pricing_Element__c> ();

		pricingElList = [
			select Id, Name, cspmb__effective_end_date__c, cspmb__pricing_element_type__c, cspmb__effective_start_date__c,
				cspmb__pricing_element_type__r.cspmb__type__c, cspmb__pricing_element_type__r.cspmb__key_definition__c, cspmb__pricing_element_type__r.cspmb__code__c
			from cspmb__Pricing_Element__c
			where Id
				IN:priceElementIdList
		];

		List <cspmb__Pricing_Element__c> filteredPricingElements = new List <cspmb__Pricing_Element__c> ();

		for (cspmb__Pricing_Element__c pricingElement : pricingElList) {

			Boolean start_invalid = pricingElement.cspmb__effective_start_date__c != null && date.today() < pricingElement.cspmb__effective_start_date__c;
			Boolean end_invalid = pricingElement.cspmb__effective_end_date__c != null && date.today() > pricingElement.cspmb__effective_end_date__c;

			if (!(start_invalid || end_invalid)) {
				filteredPricingElements.add(pricingElement);
			}
		}
		return filteredPricingElements;
	}

	//******************************************* ATTACHMENT *******************************************
	@RemoteAction
	public static String saveAttachment(Id faId, String attachmentBody) {

		Attachment returnAttachment;
		Attachment attachment = getAttachment(faId);

		if (attachment == null) {
			returnAttachment = createAttachment(faId, FAC_ATTACHMENT_NAME, FAC_ATTACHMENT_DESC, attachmentBody, 'text/plain');
		} else {
			returnAttachment = updateAttachment(attachment, attachmentBody);
		}

		return returnAttachment.Body.toString();
	}

	@RemoteAction
	public static Attachment getAttachment(Id parentId) {
		List <Attachment> attachment = [
			select
				Id,
				Name,
				ParentId,
				Body
			from
				Attachment
			where
			ParentId = :parentId
			and
			Name like:FAC_ATTACHMENT_NAME
			limit 1
		];

		if (attachment.size() > 0) {
			return attachment[0];
		} else {
			return null;
		}
	}

	@RemoteAction
	public static String getAttachmentBody(Id parentId) {
		List <Attachment> attachment = [
			select
				Id,
				Name,
				Body,
				ParentId
			from
				Attachment
			where
			ParentId = :parentId
			and
			Name like:FAC_ATTACHMENT_NAME
			limit 1
		];

		if (attachment.size() > 0) {
			return EncodingUtil.base64Encode(attachment[0].Body);
		} else {
			return null;
		}
	}

	public static Attachment createAttachment(Id parentId, String name, String description, String body, String content) {
		return pCreateAttachment(parentId, name, description, Blob.valueOf(body), content);
	}

	private static Attachment pCreateAttachment(Id parentId, String name, String description, Blob body, String content) {
		Attachment newAttach = new Attachment(
			ParentId = parentId,
			Body = body,
			Description = description,
			ContentType = content,
			Name = name
		);
		insert newAttach;
		return newAttach;
	}

	public static Attachment updateAttachment(Attachment attach, String newBody) {
		attach.Body = Blob.valueOf(newBody);
		update attach;
		return attach;
	}
	//******************************************* ATTACHMENT END *******************************************

	/**
	* Decomposition 1/2 create pricing rule, pricing rule group and
	* association between them.
	* @return pricing rule Id
	*/
	@RemoteAction
	public static Id createPricingRuleGroup(Id faId) {
		Integer prg_count = database.countQuery('select count() from cspmb__Pricing_Rule_Group__c');
		String rgc = 'FAM ' + String.valueOfGmt(datetime.now()) + '___' + prg_count;
		csconta__Frame_Agreement__c fa = [
			select id, name, csconta__effective_start_date__c,
				csconta__effective_end_date__c, csconta__frame_agreement_number__c
			from csconta__Frame_Agreement__c
			where id = :faId
			limit 1
		];

		cspmb__Pricing_Rule_Group__c prg = new cspmb__Pricing_Rule_Group__c(
			cspmb__description__c = 'Auto generated from FA decomposition.',
			cspmb__pricing_rule_group_code__c = rgc,
			csconta__frame_agreement__c = faId,
			cspmb__effective_start_date__c = fa.csconta__effective_start_date__c,
			cspmb__effective_end_date__c = fa.csconta__effective_end_date__c
		);
		insert prg;

		cspmb__pricing_rule__c pr = new cspmb__pricing_rule__c(
			cspmb__description__c = 'Auto generated from FA decomposition.',
			cspmb__pricing_rule_code__c = rgc,
			cspmb__effective_end_date__c = fa.csconta__effective_end_date__c,
			cspmb__effective_start_date__c = fa.csconta__effective_start_date__c
		);
		insert pr;

		cspmb__Pricing_Rule_Group_Rule_Association__c prgra = new cspmb__Pricing_Rule_Group_Rule_Association__c(
			cspmb__pricing_rule__c = pr.Id,
			cspmb__pricing_rule_group__c = prg.Id
		);
		insert prgra;

		return pr.Id;
	}
	
	/**
	* Decomposition 2/2 create pipra for every charge in attachment and associate it with appropriate record
	* @param data formatted fa attachment
	* @param prId pricing rule Id from createPricingRuleGroup()
	* @param faId frame agreement Id
	* @return result message
	*/
	@RemoteAction
	public static String decomposeAttachment(String data, Id prId, Id faId) {

		String retString = 'Success';

		List <Object> categorizationData;
		List <cspmb__Price_Item_Pricing_Rule_Association__c> pipraList = new List <cspmb__Price_Item_Pricing_Rule_Association__c>();

		categorizationData = (List <Object>) JSON.deserializeUntyped(data);
		system.debug('***********data**************');
		system.debug(categorizationData);

		for (Object item : categorizationData) {
			try {
				Map <String, Object> categoryMap = (Map <String, Object>) item;

				String cpId = (String) categoryMap.get('cpId');
				String cpaoaId = (String) categoryMap.get('cpaoaId');
				String peId = (String) categoryMap.get('peId');
				String addonId = (String) categoryMap.get('addonId');

				Decimal recurring = (Decimal) categoryMap.get('recurring');
				Decimal oneOff = (Decimal) categoryMap.get('oneOff');

				cspmb__Price_Item_Pricing_Rule_Association__c pipra = new cspmb__Price_Item_Pricing_Rule_Association__c(cspmb__target_price__c = 'Sales', cspmb__recurring_adjustment_type__c = 'Price Override', cspmb__one_off_adjustment_type__c = 'Price Override', cspmb__pricing_rule__c = prId);

				if (cpId != null) {
					pipra.cspmb__price_item__c = cpId;
				}

				if (cpaoaId != null) {
					pipra.cspmb__price_item_add_on_association__c = cpaoaId;
				}

				if (peId != null) {
					pipra.cspmb__pricing_element__c = peId;
				}

				if (addonId != null) {
					pipra.cspmb__add_on__c = addonId;
				}

				if (recurring != null) {
					pipra.cspmb__recurring_adjustment__c = recurring;
				}

				if (oneOff != null) {
					pipra.cspmb__one_off_adjustment__c = oneOff;
				}
				system.debug(pipra);
				pipraList.add(pipra);
				system.debug('pipraList *** ' + pipraList);

			} catch (Exception e) {
				retString = e.getMessage();
			}
		}

		if (retString == 'Success') {
			try {
				insert pipraList;
				Fac_Settings__c facSettings = getFacSetting();
				// Set active status to FA, and if its replacing another fa, set its effective start date
				csconta__Frame_Agreement__c fa = [
					select Id, csconta__Status__c, csconta__replaced_frame_agreement__c
					from csconta__Frame_Agreement__c
					where Id = :faId
					limit 1
				];
				fa.csconta__Status__c = (String) facSettings.get('active_status__c');
				update fa;

				// If this was a version of another fa we need to set the original to replaced/closed
				if (fa.csconta__replaced_frame_agreement__c != null) {
					fa.csconta__effective_start_date__c = datetime.now();
					csconta__Frame_Agreement__c original = [
						select Id, csconta__Status__c
						from csconta__Frame_Agreement__c
						where Id = :fa.csconta__replaced_frame_agreement__c
						limit 1
					];
					if (original != null) {
						original.csconta__Status__c = (String) facSettings.get('closed_status__c');
						original.csconta__replaced_by__c = faId;
						update original;
					}
				}

				update fa;
			} catch (Exception e) {
				retString = e.getMessage();
			}
		}


		return retString;

	}

	/**
	* Delete all pipras created for given pricing rule id
	* @param prId pricing rule Id for deleting
	* @return result message
	*/
	@RemoteAction
	public static String undoDecomposition(Id prId) {

		String retString = 'Success';

		// delete 10000 pipras with prId from parameter (ment do be done recursively)
		List <cspmb__Price_Item_Pricing_Rule_Association__c> pipraList = [
			select Id
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__pricing_rule__c = :prId
			limit 10000
		];

		if (!pipraList.isEmpty()) {
			delete pipraList;
		}

		// Delete pricing rule and pricing rule group with their association
		cspmb__Pricing_Rule_Group_Rule_Association__c prgra = [
			select Id, cspmb__pricing_rule_group__c, cspmb__pricing_rule__c
			from cspmb__Pricing_Rule_Group_Rule_Association__c
			where cspmb__pricing_rule__c = :prId
			limit 1
		];

		if (prgra != null) {
			cspmb__Pricing_Rule_Group__c prg = [
				select Id
				from cspmb__Pricing_Rule_Group__c
				where Id = :prgra.cspmb__pricing_rule_group__c
				limit 1
			];
			cspmb__pricing_rule__c pr = [
				select Id
				from cspmb__pricing_rule__c
				where Id = :prgra.cspmb__pricing_rule__c
				limit 1
			];

			delete prgra;
			delete prg;
			delete pr;
		}


		return retString;
	}

	@RemoteAction
	public static Map <String, Object> getDelta(Id faId1, Id faId2) {
		return API_1.getDelta(faId1, faId2);
	}


	//******************************************* DECOMPOSITION END ***************************************

	// WRAPPERS
	public class RateCard {
		public Id Id {
			get;
			set;
		}
		public String Name {
			get;
			set;
		}
		public String authId {
			get;
			set;
		}
		public List <cspmb__Rate_Card_Line__c> rateCardLines {
			get;
			set;
		}

		public RateCard(cspmb__Rate_Card__c rateCard, List < cspmb__Rate_Card_Line__c > rateCardLines) {
			this.Id = rateCard.Id;
			this.Name = rateCard.Name;
			this.authId = rateCard.cspmb__Authorization_Level__c;
			this.rateCardLines = rateCardLines;
		}
	}

	public class cpData {
		public List <cspmb__Price_Item_Add_On_Price_Item_Association__c> addons {
			get;
			set;
		}
		public List <PricingElementWrapper> charges {
			get;
			set;
		}
		public List <RateCard> rateCards {
			get;
			set;
		}
		public List <cspmb__Allowance__c> allowances {
			get;
			set;
		}

		public cpData(List <cspmb__Price_Item_Add_On_Price_Item_Association__c> addonList, List <PricingElementWrapper> charges, List <RateCard> rateCardList, List <cspmb__Allowance__c> allowances) {
			this.addons = addonList;
			this.charges = charges;
			this.rateCards = rateCardList;
			this.allowances = allowances;
		}
	}

	public class DiscountLevelWrapper {

		public Id priceItemId {
			get;
			set;
		}
		public Id addonId {
			get;
			set;
		}
		public cspmb__Discount_Level__c discountLevel {
			get;
			set;
		}

		public DiscountLevelWrapper(Id priceItemId, Id addonId, cspmb__Discount_Level__c discountLevel) {
			this.priceItemId = priceItemId;
			this.addonId = addonId;
			this.discountLevel = discountLevel;
		}
	}

	public class AllowancesWrapper {

		public Map<Id, List<cspmb__Usage_Type__c>> childUsageTypes {
			get {
				return childUsageTypes;
			}
			set;
		}
		public Map <Id, List <cspmb__Allowance__c>> allowanceMap {
			get;
			set;
		}

		public AllowancesWrapper(Map<Id, List<cspmb__Usage_Type__c>> childUsageTypes, Map <Id, List <cspmb__Allowance__c>> allowanceMap) {
			this.childUsageTypes = childUsageTypes;
			this.allowanceMap = allowanceMap;
		}
	}

	public class PricingElementWrapper {
		public Id Id {
			get;
			set;
		}
		public String Name {
			get;
			set;
		}
		public Decimal recurring {
			get;
			set;
		}
		public Decimal oneOff {
			get;
			set;
		}
		public String chargeType {
			get;
			set;
		}

		public PricingElementWrapper(Id pricingElementId, String typeLabel, Decimal recurring, Decimal oneOff, String chargeType) {
			this.Id = pricingElementId;
			this.Name = typeLabel;
			this.recurring = recurring;
			this.oneOff = oneOff;
			this.chargeType = chargeType;
		}
	}

}