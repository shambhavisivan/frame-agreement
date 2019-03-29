global with sharing class FrameRateManagerController {

	public transient csutil.CustomResource[] commonContainerPageResources {
		get;
		private set;
	}
	public static final String FAC_ATTACHMENT_NAME = 'FrameAgreementAttachment';
	public static final String FAC_ATTACHMENT_DESC = 'Added products and negotiated data against Frame Agreement';
	public static final Integer ITEMS_PER_PAGE = 20;
	public static final List < String > FA_FIELDS = new List < String >{
		'Id',
		'Name',
		'LastModifiedDate',
		'csconta__Account__r.Name',
		'csconta__Agreement_Name__c',
		'csconta__Pricing_Rule_Group__c',
		'csconta__Status__c',
		'csconta__Valid_From__c',
		'csconta__Valid_To__c',
		'csconta__replaced_frame_agreement__c',
		'csconta__effective_end_date__c',
		'csconta__effective_start_date__c'
	};


	global FrameRateManagerController() {
		this.commonContainerPageResources = csutil.CustomResource.loadCustomResourceDescriptors('FAMeditor');
	}

	@TestVisible private static csutil__JSON_Data__c getHeaderData() {
		csutil__JSON_Data__c json_data;
		try {
			json_data = [
				select csutil__value__c
				from csutil__JSON_Data__c
				where Name = 'FA-Header'
				limit 1
			];
		}
		catch (System.QueryException e) {

		}
		return json_data;
	}

	@TestVisible private static csutil__JSON_Data__c getCustomButtonData() {
		csutil__JSON_Data__c json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Custom-Buttons'
			limit 1
		];
		return json_data;
	}

	@TestVisible private static csutil__JSON_Data__c getStandardButtonData() {
		csutil__JSON_Data__c json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Standard-Buttons'
			limit 1
		];
		return json_data;
	}

	@TestVisible private static csutil__JSON_Data__c getCategorizationData() {
		csutil__JSON_Data__c json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-Categorization'
			limit 1
		];
		return json_data;
	}

	@TestVisible public static String getStandardPricebook() {
		csutil__JSON_Data__c json_data = [
			select csutil__value__c
			from csutil__JSON_Data__c
			where Name = 'FA-StandardPricebook'
			limit 1
		];
		if (json_data != null) {
			return (String) json_data.csutil__value__c;
		} else {
			return null;
		}
	}


	@TestVisible private static List < String > getCategorizationDataFields() {
		List < String > returnData = new List < String > ();
		csutil__JSON_Data__c json_data = getCategorizationData();

		List < Object > categorizationData;
		categorizationData = (List < Object >) JSON.deserializeUntyped(json_data.csutil__value__c);

		for (Object category : categorizationData) {
			Map < String, Object > categoryMap = (Map < String, Object >) category;
			String fieldName = (String) categoryMap.get('field');
			returnData.add(fieldName);
		}
		return returnData;

	}

	@TestVisible private static List < String > getFieldsFromJSONData() {

		csutil__JSON_Data__c json_data = getHeaderData();
		String data;

		if (json_data == null) {
			return new List < String > ();
		} else {
			data = json_data.csutil__value__c;
		}

		List < Object > listData = (List < Object >) JSON.deserializeUntyped(data);
		system.debug(listData);

		Set < String > fa_fields_set = new Set < String > ();
		fa_fields_set.addAll(FA_FIELDS);

		List < String > fields = new List < String > ();

		for (Object f : listData) {
			Map < String, Object > converted = (Map < String, Object >) f;
			String field = (String) converted.get('field');
			if (!fa_fields_set.contains(field)) {
				fields.add(field);
			}
		}

		return fields;
	}

	@TestVisible public static Map < String, Object > getCustomSettings() {
		Map < String, Object > settingMap = new Map < String, Object > ();
		csfam__fac_settings__c FACSettings = csfam__fac_settings__c.getInstance(UserInfo.getUserId());

		settingMap.put('price_item_fields', FACSettings.get('csfam__price_item_fields__c'));
		settingMap.put('truncate_product_fields', FACSettings.get('csfam__truncate_product_fields__c'));
		settingMap.put('show_volume_fields', FACSettings.get('csfam__show_volume_fields__c'));
		settingMap.put('rcl_fields', FACSettings.get('csfam__rcl_fields__c'));

		settingMap.put('fa_editable_statuses', FACSettings.get('csfam__fa_editable_statuses__c'));

		Map < String, Object > statuses = new Map < String, Object > ();
		statuses.put('active_status', FACSettings.get('csfam__active_status__c'));
		statuses.put('approved_status', FACSettings.get('csfam__approved_status__c'));
		statuses.put('draft_status', FACSettings.get('csfam__draft_status__c'));
		statuses.put('closed_status', FACSettings.get('csfam__closed_status__c'));
		statuses.put('decomposition_chunk_size', FACSettings.get('csfam__decomposition_chunk_size__c'));
		statuses.put('requires_approval_status', FACSettings.get('csfam__requires_approval_status__c'));

		settingMap.put('statuses', statuses);

		return (settingMap);
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
			Object data = dataProvider.getData(params);
			return JSON.serialize(data);
		} catch (Exception e) {
			return 'Error: ' + e.getMessage();
		}
	}

	@RemoteAction
	@TestVisible public static ProductPricebookCharges getPriceItemCharges(String priceItemId) {
		// Get all pricing elements and their types labels for commercial product
		// Get all pricing element coorelated to this price item id along with the name of their pricing element type.
		// These are the charges defined for this price item.
		List < cspmb__Pricing_Element__c > priceElements = [select id, cspmb__pricing_element_type__r.Name, cspmb__pricing_element_type__r.cspmb__label__c, cspmb__pricing_element_type__r.cspmb__type__c from cspmb__Pricing_Element__c where cspmb__commercial_product__c = :priceItemId];
		// Get Pricing Rule Group - Rule Association marked as standard pricebook
		String standardPricebook = getStandardPricebook();
		system.debug('***************standardPricebook' + standardPricebook);

		// Create a map for getting the price element type label from price element id
		Map < Id, String > pricingElementLabels = new Map < Id, String > ();
		Map < Id, String > pricingElementTypes = new Map < Id, String > ();

		for (cspmb__Pricing_Element__c pricingElement : priceElements) {
			String label = pricingElement.cspmb__pricing_element_type__r.cspmb__label__c;
			String type = pricingElement.cspmb__pricing_element_type__r.cspmb__type__c;
			if (label == null) {
				label = pricingElement.cspmb__pricing_element_type__r.Name;
			}
			pricingElementLabels.put(pricingElement.Id, label);
			pricingElementTypes.put(pricingElement.Id, type);
		}

		// Get all cspmb__Pricing_Rule_Group_Rule_Association__c associated with standard price book
		List < cspmb__Pricing_Rule_Group_Rule_Association__c > priceBookAssociations = [
			select id, cspmb__pricing_rule__c
			from cspmb__Pricing_Rule_Group_Rule_Association__c
			where Id = :standardPricebook
		];
		// where cspmb__Pricing_Rule_Group__r.csfam__standard_price_book__c = true // REMOVE -> csfam__standard_price_book__c

		// Save id's of the pricing rules associated with this price book into the list
		List < Id > pricingRuleList = new List < Id > ();
		for (cspmb__Pricing_Rule_Group_Rule_Association__c prgra : priceBookAssociations) {
			pricingRuleList.add(prgra.cspmb__pricing_rule__c);
		}

		// Use this list to query price item -> pricing rule
		// This is not the list of charges for given price item
		// On these sobjects you can find price rule, price element and price item
		List < cspmb__Price_Item_Pricing_Rule_Association__c > pipraList = [
			select id, cspmb__recurring_adjustment__c, cspmb__one_off_adjustment__c, cspmb__pricing_element__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :priceItemId and cspmb__pricing_rule__c in:pricingRuleList
		];


		List < PricingElementWrapper > priceItemChargesData = new List < PricingElementWrapper > ();
		// for each pipra, create charges object
		for (cspmb__Price_Item_Pricing_Rule_Association__c pipra : pipraList) {
			priceItemChargesData.add(new PricingElementWrapper(pipra.cspmb__pricing_element__c, pricingElementLabels.get(pipra.cspmb__pricing_element__c), pipra.cspmb__recurring_adjustment__c, pipra.cspmb__one_off_adjustment__c, pricingElementTypes.get(pipra.cspmb__pricing_element__c)));
		}
		// create new structure to map price item to charges object
		ProductPricebookCharges priceItemData = new ProductPricebookCharges(priceItemId, priceItemChargesData);

		return priceItemData;
	}

	@RemoteAction
	@TestVisible public static Map <String, Object> getApprovalHistory(Id faId) {

		List < ProcessInstance > listProcess = [
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

		Map < String, Object > approvalProcess = new Map < String, Object > ();

		Id userId = UserInfo.getUserId();
		Boolean isApprover = false;
		Boolean isInitiator = false;
		Boolean userIsAdmin = isUserAdmin();
		Set < Id > userIsDelegatedApprover = isUserDelegate(userId);

		for (ProcessInstance pi : listProcess) {
			for (ProcessInstanceHistory piwi : pi.StepsAndWorkitems) {
				if (piwi.StepStatus == 'Pending') {
					if ((piwi.ActorId == userId || userIsDelegatedApprover.contains(piwi.ActorId) || userIsAdmin)) {
						isApprover = true;
					}
					if ((piwi.ActorId == userId || userIsDelegatedApprover.contains(piwi.ActorId) || userIsAdmin)) {
						isApprover = true;
					}
				}
			}
		}
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

		List < ProcessInstanceWorkitem > pwi = [
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
				String commentAction = '';
				if (action == 'Reject') {
					commentAction = ' Rejected';
				} else if (action == 'Removed') {
					commentAction = ' Recalled';
				} else if (action == 'Approve') {
					commentAction = ' Approved';
				}
				workItemRequest.setComments(comments + commentAction + ' by User: ' + UserInfo.getName());
				Approval.ProcessResult result = Approval.process(workItemRequest);
				// String observable = action == 'Reject' ? 'AfterReject' : 'AfterApprove';
				// executeObservers(recordId, action, observable);
				isSuccess = result.isSuccess();
			}
			catch (Exception e) {
				throw new AuraHandledException(e.getMessage());
			}
		} else {
			isSuccess = true;
		}
		return isSuccess;
	}

	@RemoteAction
	@TestVisible public static void reassignApproval(Id recordId, Id newActorId) {
		List < ProcessInstanceWorkitem > pwi = [
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
			csfam__fac_settings__c FACSettings = csfam__fac_settings__c.getInstance(UserInfo.getUserId());
			appReq.setProcessDefinitionNameOrId((String) FACSettings.get('csfam__approval_process_name__c'));
			appReq.setSkipEntryCriteria(true);
			Approval.ProcessResult result = Approval.process(appReq);
			System.debug('***Frame agreement is submitted for approval successfully: ' + result.isSuccess());
			isSuccess = result.isSuccess();
		}
		catch (System.DmlException ex) {
			//DML type to handle ALREADY_IN_PROCESS or DOES_NOT_MEET_CRITERIA
			System.debug('***dml exception: ' + ex.getDmlMessage(0));
		}
		catch (Exception ex) {
			System.debug('***exception: ' + ex.getMessage());
		}
		return isSuccess;
	}

	@TestVisible public static Boolean isUserAdmin() {
		Boolean userisAdminOrDelegatedApprover = false;
		Id userProfileId = UserInfo.getProfileId();
		List < Profile > profileNames = [select Name from Profile where Id = :userProfileId limit 1];
		String profileName = profileNames[0].Name;
		if (profileName == 'System Administrator') {
			userisAdminOrDelegatedApprover = true;
		}
		return userisAdminOrDelegatedApprover;
	}

	@TestVisible public static Set < Id > isUserDelegate(Id userId) {
		Set < Id > userQueues = new Set < Id > ();
		List < User > delegatedUserIds = [select Id from User where DelegatedApproverId = :userId];
		Set < Id > delegatedUserId = new Set < Id > ();
		delegatedUserId.add(userId);
		if (delegatedUserIds != null && !delegatedUserIds.isEmpty()) {
			for (User user : delegatedUserIds) {
				delegatedUserId.add(user.Id);
			}
		}
		List < GroupMember > groupMemberListDelegated = [
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
	public static Map < String, Object > getAppSettings() {
		Map < String, Object > count = new Map < String, Object > ();

		String cp_query = 'select count() from cspmb__Price_Item__c ';
		// ADD ACCOUNT NULL CLAUSE
		cp_query += 'where cspmb__Account__c = null ';
		// ADD ACTIVE
		cp_query += 'and cspmb__Is_Active__c = true ';
		// ADD START DATE CHECK CLAUSE
		cp_query += 'and (cspmb__Effective_Start_Date__c = null OR (cspmb__Effective_Start_Date__c != null and cspmb__Effective_Start_Date__c < TODAY)) ';
		// ADD END DATE CHECK CLAUSE
		cp_query += 'and (cspmb__Effective_End_Date__c = null OR (cspmb__Effective_End_Date__c != null and cspmb__Effective_End_Date__c > TODAY))';

		Integer cp_count = database.countQuery(cp_query);
		Integer fa_count = database.countQuery('select count() from csconta__Frame_Agreement__c');

		List < Object > headerData = new List < Object > ();
		List < Object > buttonCustom = new List < Object > ();
		Map < String, Object > buttonStandard = new Map < String, Object > ();
		List < Object > categorizationData = new List < Object > ();

		csutil__JSON_Data__c header_data = getHeaderData();
		csutil__JSON_Data__c button_custom = getCustomButtonData();
		csutil__JSON_Data__c button_standard = getStandardButtonData();
		csutil__JSON_Data__c categorization_data = getCategorizationData();

		if (header_data != null) {
			headerData = (List < Object >) JSON.deserializeUntyped(header_data.csutil__value__c);
		}

		if (button_custom != null) {
			buttonCustom = (List < Object >) JSON.deserializeUntyped(button_custom.csutil__value__c);
		}

		if (button_standard != null) {
			buttonStandard = (Map < String, Object >) JSON.deserializeUntyped(button_standard.csutil__value__c);
		}

		if (categorization_data != null) {
			categorizationData = (List < Object >) JSON.deserializeUntyped(categorization_data.csutil__value__c);
		}

		count.put('commercialProductCount', cp_count);
		count.put('frameAgreementsCount', fa_count);
		count.put('itemsPerPage', ITEMS_PER_PAGE);
		count.put('HeaderData', headerData);
		count.put('ButtonCustomData', buttonCustom);
		count.put('ButtonStandardData', buttonStandard);
		count.put('CategorizationData', categorizationData);
		count.put('FACSettings', getCustomSettings());
		count.put('AuthLevels', getAuthorizationLevels());
		count.put('DiscLevels', getDiscountevels());

		return count;
	}

	@RemoteAction
	// public static List < cspmb__Price_Item__c > getCommercialProducts(Integer pageNum) {
	public static List < cspmb__Price_Item__c > getCommercialProducts(List < String > priceItemIds) {
		if (priceItemIds == null || priceItemIds.isEmpty()) {
			priceItemIds = new List < String > ();
		}
		return getCommercialProducts_p(priceItemIds);
	}

	private static List < cspmb__Price_Item__c > getCommercialProducts_p(List < Id > priceItemIds) {

		List < String > standardFields = new List < String >{
			'Id',
			'Name',
			'cspmb__Effective_Start_Date__c',
			'cspmb__Effective_End_Date__c',
			'cspmb__Recurring_Charge__c',
			'cspmb__One_Off_Charge__c',
			'cspmb__Authorization_Level__c',
			'cspmb__Is_Authorization_Required__c',
			'cspmb__Price_Item_Description__c'
		};

		csfam__fac_settings__c FACSettings = csfam__fac_settings__c.getInstance(UserInfo.getUserId());
		String csFields = (String) FACSettings.get('csfam__price_item_fields__c');
		List < String > csFieldsArr = new List < String > ();

		if (!String.isBlank(csFields)) {
			csFieldsArr = csFields.split(',');
		}

		String categorizationFieldsString = '';
		List < String > categorizationFields = getCategorizationDataFields();


		List < String > fieldsArr = new List < String > ();
		fieldsArr.addAll(standardFields);
		fieldsArr.addAll(csFieldsArr);
		fieldsArr.addAll(categorizationFields);

		// Remove duplicates

		Set < String > uniqueSet = new Set < String > ();
		List < String > uniqueList = new List < String > ();
		uniqueSet.addAll(fieldsArr);
		uniqueList.addAll(uniqueSet);

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
		// ADD limit CLAUSE
		// query += 'limit ' + ITEMS_PER_PAGE + ' OFFSET ' + ((pageNum - 1) * ITEMS_PER_PAGE);
		query += 'limit 50000';

		List < cspmb__Price_Item__c > cpList = database.query(query);
		return cpList;
	}

	@RemoteAction
	public static List < cspmb__Price_Item__c > filterCommercialProducts(String filterData) {
		String selectClause = 'Id';
		String whereClause = '';

		List < Object > categorizationData;
		categorizationData = (List < Object >) JSON.deserializeUntyped(filterData);

		//*******************************************************************
		// Create list to hold fields: [values]
		Map < String, List < String >> categoryQueryMap = new Map < String, List < String >> ();

		//*******************************************************************
		// Iterate JSON Data, check if the field exists in schema. If so append it to query

		for (Object category : categorizationData) {
			// category.get('field');
			Map < String, Object > categoryMap = (Map < String, Object >) category;
			String fieldName = (String) categoryMap.get('field');

			List < String > valuesList = new List < String > ();

			List < Object > valuesObjArr = (List < Object >) categoryMap.get('values');

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

		List < SObject > results = Database.query(query);
		Set < Id > resultIds = (new Map < Id, SObject > (results)).keySet();

		return getCommercialProducts_p(new List < Id > (resultIds));
	}

	@RemoteAction
	public static List < cspmb__Discount_Threshold__c > getAuthorizationLevels() {
		return [select Id, Name, cspmb__Discount_Threshold__c, cspmb__Authorization_Level__c, cspmb__Discount_Type__c from cspmb__Discount_Threshold__c];
	}

	@RemoteAction
	public static List < DiscountLevelWrapper > getDiscountevels() {

		List < DiscountLevelWrapper > discountList = new List < DiscountLevelWrapper > ();

		List < cspmb__Discount_Association__c > discountAssocArr = new List < cspmb__Discount_Association__c > ();
		discountAssocArr = [
			select Id, cspmb__Add_On_Price_Item__c, cspmb__Discount_Level__c, cspmb__Price_Item__c
			from cspmb__Discount_Association__c
			where cspmb__Discount_Level__c != null
			and (cspmb__Add_On_Price_Item__c != null OR cspmb__Price_Item__c != null)
		];


		for (cspmb__Discount_Association__c assoc : discountAssocArr) {

			cspmb__Discount_Level__c discount = [
				select Id, Name, cspmb__Charge_Type__c, cspmb__Discount_Increment__c, cspmb__Discount_Level_Code__c, cspmb__Discount_Type__c, cspmb__Discount_Values__c, cspmb__Maximum_Discount_Value__c, cspmb__Minimum_Discount_Value__c
				from cspmb__Discount_Level__c
				where Id = :assoc.cspmb__Discount_Level__c
				limit 1
			];

			discountList.add(new DiscountLevelWrapper(assoc.cspmb__Price_Item__c, assoc.cspmb__Add_On_Price_Item__c, assoc.cspmb__Discount_Level__c, discount));
		}

		return discountList;
	}

	@RemoteAction
	public static Map < Id, cpData > getCommercialProductData(List < Id > priceItemIdList) {
		Map < Id, cpData > cpDataMap = new Map < Id, cpData > ();

		for (Id priceItemId : priceItemIdList) {
			cpDataMap.put(priceItemId, new cpData(priceItemId, getAddons(priceItemId), getPriceItemCharges(priceItemId), getRateCards(priceItemId)));
		}

		return cpDataMap;
	}


	public static List < RateCard > getRateCards(String priceItemId) {

		List < Id > rateCardIdList = new List < Id > ();
		Map < Id, cspmb__Price_Item_Rate_Card_Association__c > rateCardAssObj = new Map < Id, cspmb__Price_Item_Rate_Card_Association__c > ();

		for (cspmb__Price_Item_Rate_Card_Association__c pirca : [
			select Id, cspmb__Rate_Card__r.Id
			from cspmb__Price_Item_Rate_Card_Association__c
			where cspmb__Price_Item__c = :priceItemId
		]) {
			rateCardIdList.add(pirca.cspmb__Rate_Card__r.Id);
			rateCardAssObj.put(pirca.cspmb__Rate_Card__r.Id, pirca);
		}

		List < cspmb__Rate_Card__c > rateCardList = new List < cspmb__Rate_Card__c > ();
		rateCardList = [select Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Rate_Card_Code__c, cspmb__Authorization_Level__c, cspmb__Is_Authorization_Required__c from cspmb__Rate_Card__c where cspmb__Is_Active__c = true and Id IN:rateCardIdList];

		List < RateCard > rateCardsList = new List < RateCard > ();

		for (cspmb__Rate_Card__c rcl : rateCardList) {

			Boolean start_invalid = rcl.cspmb__Effective_Start_Date__c != null && date.today() < rcl.cspmb__Effective_Start_Date__c;
			Boolean end_invalid = rcl.cspmb__Effective_End_Date__c != null && date.today() > rcl.cspmb__Effective_End_Date__c;

			if (!(start_invalid || end_invalid)) {
				rateCardsList.add(new RateCard(rcl, getRateCardLines(rcl.Id)));
			}
		}
		return rateCardsList;
	}


	public static List < cspmb__Price_Item_Add_On_Price_Item_Association__c > getAddons(String priceItemId) {

		List < cspmb__Price_Item_Add_On_Price_Item_Association__c > priceItemAddonAssociations = [
			select Id, cspmb__Price_Item__c, cspmb__Price_Item__r.cspmb__Effective_End_Date__c, cspmb__Price_Item__r.cspmb__Effective_Start_Date__c,
				cspmb__One_Off_Charge__c, cspmb__Recurring_Charge__c, cspmb__Add_On_Price_Item__c, cspmb__Add_On_Price_Item__r.Name, cspmb__Add_On_Price_Item__r.cspmb__Authorization_Level__c, cspmb__Add_On_Price_Item__r.cspmb__One_Off_Charge__c,
				cspmb__Add_On_Price_Item__r.cspmb__Recurring_Charge__c
			from cspmb__Price_Item_Add_On_Price_Item_Association__c
			where cspmb__Price_Item__c = :priceItemId
		];


		List < cspmb__Price_Item_Add_On_Price_Item_Association__c > filteredPriceItemAddonAssociations = new List < cspmb__Price_Item_Add_On_Price_Item_Association__c > ();

		for (cspmb__Price_Item_Add_On_Price_Item_Association__c addonAsson : priceItemAddonAssociations) {

			Boolean start_invalid = addonAsson.cspmb__Price_Item__r.cspmb__Effective_Start_Date__c != null && date.today() < addonAsson.cspmb__Price_Item__r.cspmb__Effective_Start_Date__c;
			Boolean end_invalid = addonAsson.cspmb__Price_Item__r.cspmb__Effective_End_Date__c != null && date.today() > addonAsson.cspmb__Price_Item__r.cspmb__Effective_End_Date__c;

			if (!(start_invalid || end_invalid)) {
				filteredPriceItemAddonAssociations.add(addonAsson);
			}
		}

		return filteredPriceItemAddonAssociations;
	}

	@RemoteAction
	public static List < csconta__Frame_Agreement__c > getFrameAgreements() {
		List < csconta__Frame_Agreement__c > faList = new List < csconta__Frame_Agreement__c > ();

		List < String > conjoined_fields = new List < String > ();
		conjoined_fields.addAll(FA_FIELDS);
		conjoined_fields.addAll(getFieldsFromJSONData());

		String query = 'select ' + String.join(conjoined_fields, ', ') + ' from csconta__Frame_Agreement__c order by LastModifiedDate DESC';

		return database.query(query);
	}

	@RemoteAction
	public static csconta__Frame_Agreement__c getFrameAgreement(Id faId) {
		List < csconta__Frame_Agreement__c > faList = new List < csconta__Frame_Agreement__c > ();

		List < String > conjoined_fields = new List < String > ();
		conjoined_fields.addAll(FA_FIELDS);
		conjoined_fields.addAll(getFieldsFromJSONData());

		String query = 'select ' + String.join(conjoined_fields, ', ') + ' from csconta__Frame_Agreement__c where Id = :faId limit 1';

		return database.query(query);
	}

	@RemoteAction
	public static String setFrameAgreementState(Id faId, String status) {
		String retString = 'Success';
		try {
			csconta__Frame_Agreement__c fa = [select Id, csconta__replaced_frame_agreement__c,csconta__effective_start_date__c from csconta__Frame_Agreement__c where Id = :faId limit 1];
			fa.csconta__Status__c = status;
			update fa;

		}
		catch (QueryException e) {
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
		}
		catch (DmlException e) {
			retString = e.getMessage();
		}
		return retString;
	}

	@RemoteAction
	public static csconta__Frame_Agreement__c cloneFrameAgreement(Id faId) {

		List < String > conjoined_fields = new List < String > ();
		conjoined_fields.addAll(FA_FIELDS);
		conjoined_fields.addAll(getFieldsFromJSONData());

		String query = 'select ' + String.join(conjoined_fields, ', ') + ' from csconta__Frame_Agreement__c  where Id = :faId';

		csconta__Frame_Agreement__c original;
		try {
			original = database.query(query);
		}
		catch (QueryException e) {
			return null;
		}

		csconta__Frame_Agreement__c cloned = original.clone(false, false, false, false);
		cloned.csconta__Status__c = 'Draft';
		cloned.csconta__replaced_frame_agreement__c = null;
		insert cloned;

		Attachment originalAttachment = getAttachment(faId);


		if (originalAttachment == null) {

		} else {
			// pCreateAttachment(Id parentId, String name, String description, Blob body, String content)
			pCreateAttachment(cloned.Id, FAC_ATTACHMENT_NAME, FAC_ATTACHMENT_DESC, originalAttachment.Body, 'text/plain');
		}

		List<csutil__JSON_Data__c> jsonData = [
			select id, name, csutil__value__c
			from csutil__JSON_Data__c
			where name = 'FA-Clone-Observer'
		];
		if (!jsonData.isEmpty()) {
			String result = performAction(jsonData[0].csutil__value__c, faId);
			if (result.contains('Error')) {
				return null;
			}
		}

		return cloned;
	}

	/**
	* Clones existing FA, sets clones status to draft and lookup to replaced fa
	* @param faId Id of FA to be cloned
	* @return cloned FA
	*/
	@RemoteAction
	public static csconta__Frame_Agreement__c createNewVersionOfFrameAgrement(Id faId) {
		csconta__Frame_Agreement__c clonedFa = cloneFrameAgreement(faId);

		csfam__fac_settings__c FACSettings = csfam__fac_settings__c.getInstance(UserInfo.getUserId());
		clonedFa.csconta__Status__c = (String) FACSettings.get('csfam__draft_status__c');
		clonedFa.csconta__replaced_frame_agreement__c = faId;
		update clonedFa;

		try {
			csconta__Frame_Agreement__c original = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where Id = :faId limit 1];
			original.csconta__effective_end_date__c = datetime.now();
			update original;
		}
		catch (QueryException e) {

		}
		catch (NullPointerException e) {

		}

		return clonedFa;

	}

	@RemoteAction
	public static csconta__Frame_Agreement__c upsertFrameAgreements(Id faId, String fieldData) {
		// String fieldData = '{"csconta__Status__c": "Active", "csconta__Agreement_Name__c": "test"}';

		Map < String, Object > dataMap = (Map < String, Object >) JSON.deserializeUntyped(fieldData);

		Map < String, Schema.SObjectType > schemaMap = Schema.getGlobalDescribe();
		Schema.SObjectType leadSchema = schemaMap.get('csconta__Frame_Agreement__c');
		Map < String, Schema.SObjectField > fieldMap = leadSchema.getDescribe().fields.getMap();

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
			} else if (dataType == 'Date') {
				DateTime a = DateTime.newInstance((Long) dataMap.get(key));
				Date dateConvert = Date.newinstance(a.year(), a.month(), a.day());
				fa.put(key, dateConvert);
			} else if (dataType == 'Datetime') {
				DateTime a = DateTime.newInstance((Long) dataMap.get(key));
				fa.put(key, a);
				// } else if (dataType == 'Integer') {
				//     fa.put(key, dataMap.get(key));
				// } else if (dataType == 'String') {
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
			} else {
				fa.put(key, dataMap.get(key));
			}
		}

		upsert fa;
		return fa;
	}

	@RemoteAction
	public static List < cspmb__Pricing_Element__c > getPricingElements(String priceItemId) {

		List < Id > priceElementIdList = new List < Id > ();
		Map < Id, cspmb__Price_Item_Pricing_Rule_Association__c > pricingElementObj = new Map < Id, cspmb__Price_Item_Pricing_Rule_Association__c > ();

		for (cspmb__Price_Item_Pricing_Rule_Association__c pipra : [
			select Id, cspmb__pricing_element__c
			from cspmb__Price_Item_Pricing_Rule_Association__c
			where cspmb__price_item__c = :priceItemId
		]) {
			priceElementIdList.add(pipra.cspmb__pricing_element__c);
			pricingElementObj.put(pipra.cspmb__pricing_element__c, pipra);
		}

		List < cspmb__Pricing_Element__c > pricingElList = new List < cspmb__Pricing_Element__c > ();

		pricingElList = [
			select Id, Name, cspmb__effective_end_date__c, cspmb__pricing_element_type__c, cspmb__effective_start_date__c,
				cspmb__pricing_element_type__r.cspmb__type__c, cspmb__pricing_element_type__r.cspmb__key_definition__c, cspmb__pricing_element_type__r.cspmb__code__c
			from cspmb__Pricing_Element__c
			where Id
				IN:priceElementIdList
		];

		List < cspmb__Pricing_Element__c > filteredPricingElements = new List < cspmb__Pricing_Element__c > ();

		for (cspmb__Pricing_Element__c pricingElement : pricingElList) {

			Boolean start_invalid = pricingElement.cspmb__effective_start_date__c != null && date.today() < pricingElement.cspmb__effective_start_date__c;
			Boolean end_invalid = pricingElement.cspmb__effective_end_date__c != null && date.today() > pricingElement.cspmb__effective_end_date__c;

			if (!(start_invalid || end_invalid)) {
				filteredPricingElements.add(pricingElement);
			}
		}
		return filteredPricingElements;
	}


	public static List < cspmb__Rate_Card_Line__c > getRateCardLines(String rateCardId) {


		List < String > standardFields = new List < String >{
			'Id',
			'Name',
			'cspmb__Cap_Unit__c',
			'cspmb__rate_value__c',
			'cspmb__Rate_Card__c'
		};

		csfam__fac_settings__c FACSettings = csfam__fac_settings__c.getInstance(UserInfo.getUserId());
		String csFields = (String) FACSettings.get('csfam__rcl_fields__c');
		List < String > csFieldsArr = new List < String > ();

		if (!String.isBlank(csFields)) {
			csFieldsArr = csFields.split(',');
		}

		List < String > fieldsArr = new List < String > ();
		fieldsArr.addAll(standardFields);
		fieldsArr.addAll(csFieldsArr);

		// Remove duplicates

		Set < String > uniqueSet = new Set < String > ();
		List < String > uniqueList = new List < String > ();
		uniqueSet.addAll(fieldsArr);
		uniqueList.addAll(uniqueSet);


		String query = 'select ' + String.join(uniqueList, ',') + ' from cspmb__Rate_Card_Line__c where cspmb__Rate_Card__c = :rateCardId and cspmb__Is_Active__c = true';
		List < cspmb__Rate_Card_Line__c > rateCardLines = new List < cspmb__Rate_Card_Line__c > ();
		rateCardLines = database.query(query);

		return rateCardLines;
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
		List < Attachment > attachment = [
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
		List < Attachment > attachment = [
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
	public static Id createPricingRuleGroup() {

		Integer prg_count = database.countQuery('select count() from cspmb__Pricing_Rule_Group__c');
		String rgc = 'FAM ' + String.valueOfGmt(datetime.now()) + '___' + prg_count;

		cspmb__Pricing_Rule_Group__c prg = new cspmb__Pricing_Rule_Group__c(cspmb__description__c = 'Auto generated from FA decomposition.', cspmb__pricing_rule_group_code__c = rgc);
		insert prg;

		cspmb__pricing_rule__c pr = new cspmb__pricing_rule__c(cspmb__description__c = 'Auto generated from FA decomposition.');
		insert pr;

		cspmb__Pricing_Rule_Group_Rule_Association__c prgra = new cspmb__Pricing_Rule_Group_Rule_Association__c(cspmb__pricing_rule__c = pr.Id, cspmb__pricing_rule_group__c = prg.Id);
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

		List < Object > categorizationData;
		List < cspmb__Price_Item_Pricing_Rule_Association__c > pipraList = new List < cspmb__Price_Item_Pricing_Rule_Association__c >();

		categorizationData = (List < Object >) JSON.deserializeUntyped(data);

		for (Object item : categorizationData) {
			try {
				Map < String, Object > categoryMap = (Map < String, Object >) item;

				String cpId = (String) categoryMap.get('cpId');
				String cpaoaId = (String) categoryMap.get('cpaoaId');
				String peId = (String) categoryMap.get('peId');

				Decimal recurring = (Decimal) categoryMap.get('recurring');
				Decimal oneOff = (Decimal) categoryMap.get('oneOff');

				cspmb__Price_Item_Pricing_Rule_Association__c pipra = new cspmb__Price_Item_Pricing_Rule_Association__c(cspmb__target_price__c = 'Sales', cspmb__pricing_rule__c = prId);

				if (cpId != null) {
					pipra.cspmb__price_item__c = cpId;
				}

				if (cpaoaId != null) {
					pipra.cspmb__price_item_add_on_association__c = cpaoaId;
				}

				if (peId != null) {
					pipra.cspmb__pricing_element__c = peId;
				}

				if (recurring != null) {
					pipra.cspmb__recurring_adjustment__c = recurring;
				}

				if (oneOff != null) {
					pipra.cspmb__one_off_adjustment__c = oneOff;
				}

				pipraList.add(pipra);

			}
			catch (Exception e) {
				retString = e.getMessage();
			}
		}

		if (retString == 'Success') {
			try {
				insert pipraList;
				csfam__fac_settings__c FACSettings = csfam__fac_settings__c.getInstance(UserInfo.getUserId());

				// Set active status to FA, and if its replacing another fa, set its effective start date
				csconta__Frame_Agreement__c fa = [select Id, csconta__Status__c, csconta__replaced_frame_agreement__c from csconta__Frame_Agreement__c where Id = :faId limit 1];
				fa.csconta__Status__c = (String) FACSettings.get('csfam__active_status__c');
				update fa;

				// If this was a version of another fa we need to set the original to replaced/closed
				if (fa.csconta__replaced_frame_agreement__c != null) {
					fa.csconta__effective_start_date__c = datetime.now();
					csconta__Frame_Agreement__c original = [select Id, csconta__Status__c from csconta__Frame_Agreement__c where Id = :fa.csconta__replaced_frame_agreement__c limit 1];
					if (original != null) {
						original.csconta__Status__c = (String) FACSettings.get('csfam__closed_status__c');
						update original;
					}
				}

				update fa;
			}
			catch (Exception e) {
				retString = e.getMessage();
			}
		}


		return retString;

	}

	@RemoteAction
	public static String undoDecomposition(Id prId) {

		String retString = 'Success';

		// delete 10000 pipras with prId from parameter (ment do be done recursively)
		List < cspmb__Price_Item_Pricing_Rule_Association__c > pipraList = [select Id from cspmb__Price_Item_Pricing_Rule_Association__c where cspmb__pricing_rule__c = :prId limit 10000];

		if (!pipraList.isEmpty()) {
			delete pipraList;
		}

		// Delete pricing rule and pricing rule group with their association
		cspmb__Pricing_Rule_Group_Rule_Association__c prgra = [select Id, cspmb__pricing_rule_group__c, cspmb__pricing_rule__c from cspmb__Pricing_Rule_Group_Rule_Association__c where cspmb__pricing_rule__c = :prId limit 1];

		if (prgra != null) {
			cspmb__Pricing_Rule_Group__c prg = [select Id from cspmb__Pricing_Rule_Group__c where Id = :prgra.cspmb__pricing_rule_group__c limit 1];
			cspmb__pricing_rule__c pr = [select Id from cspmb__pricing_rule__c where Id = :prgra.cspmb__pricing_rule__c limit 1];

			delete prgra;
			delete prg;
			delete pr;
		}


		return retString;
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
		public List < cspmb__Rate_Card_Line__c > rateCardLines {
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
		public Id Id {
			get;
			set;
		}
		public List < cspmb__Price_Item_Add_On_Price_Item_Association__c > addons {
			get;
			set;
		}
		public ProductPricebookCharges charges {
			get;
			set;
		}
		public List < RateCard > rateCards {
			get;
			set;
		}

		public cpData(Id priceItemId, List < cspmb__Price_Item_Add_On_Price_Item_Association__c > addonList, ProductPricebookCharges charges, List < RateCard > rateCardList) {
			this.Id = priceItemId;
			this.addons = addonList;
			this.charges = charges;
			this.rateCards = rateCardList;
		}
	}

	public class ProductPricebookCharges {
		public Id priceItemId {
			get;
			set;
		}
		public List < PricingElementWrapper > charges {
			get;
			set;
		}

		public ProductPricebookCharges(Id priceItemId, List < PricingElementWrapper > charges) {
			this.priceItemId = priceItemId;
			this.charges = charges;
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
		public Id levelId {
			get;
			set;
		}
		public cspmb__Discount_Level__c discountLevel {
			get;
			set;
		}

		public DiscountLevelWrapper(Id priceItemId, Id addonId, Id levelId, cspmb__Discount_Level__c discountLevel) {
			this.priceItemId = priceItemId;
			this.addonId = addonId;
			this.levelId = levelId;
			this.discountLevel = discountLevel;
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