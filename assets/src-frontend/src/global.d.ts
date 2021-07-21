interface Window {
	/* eslint-disable @typescript-eslint/naming-convention */

	/**
	 * @deprecated
	 */
	SF: SfGlobal.SF;
	/* eslint-enable @typescript-eslint/naming-convention */
}

namespace SfGlobal {
	type VfParams = {
		account: string;
	};

	/* eslint-disable @typescript-eslint/no-unused-vars */
	interface SF {
		/* eslint-enable @typescript-eslint/no-unused-vars */
		params: VfParams;
		decodeEntities(): Record<string, unknown> | string;
		decodeObject(obj: Record<string, unknown>): Record<string, unknown>;
		invokeAction<T extends keyof RemoteActions>(
			remoteActionName: T,
			...parametersArr: Parameters<RemoteActions[T]>
		): Promise<ReturnType<RemoteActions[T]>>;
		param: {
			account: string;
		};
		apiSession: string;
		actions: RemoteActions;
		labels: CustomLabelsSf;
		fieldLabels: Record<string, unknown>;
	}

	interface RemoteActions {
		getAppSettings(paramsArray: [string]): Promise<AppSettings>;
		// TODO: define all actions
		queryFrameAgreements(
			paramsArray: [string, string | null, string | null, number | null]
		): Promise<FrameAgreement[]>;
		getCommercialProductData(paramsArray: [string[]]): Promise<CommercialProductData>;
		getCommercialProducts(cpIds: [string[] | null]): Promise<CommercialProductStandalone[]>;
		getOffers(offerIds: [string[] | null]): Promise<CommercialProductStandalone[]>;
		getOfferData(paramsArray: [string[], string[]]): Promise<CommercialProductData>;
		upsertFrameAgreements(paramsArray: [string | null, string]): Promise<FrameAgreement>;
		saveAttachment(paramsArray: [string, string]): Promise<string>;
		getDispatcherAuthToken(userAgent: [string]): Promise<DispatcherToken>;
		getUserLocale(): Promise<UserLocaleInfo>;
		getFieldMetadata(sObjectName: [string]): Promise<FieldMetadata[]>;
		cloneFrameAgreement(faId: [string]): Promise<FrameAgreement>;
		deleteFrameAgreement(faId: [string]): Promise<string>;
		getApprovalHistory(faId: [string]): Promise<SfdcApprovalHistory>;
		approveRejectRecallRecord(paramsArray: [string, string, string]): Promise<boolean>;
		reassignApproval(paramsArray: [string, string]): Promise<void>;
	}

	// TODO define the unknowns
	interface AppSettings {
		account: {
			/* eslint-disable @typescript-eslint/naming-convention */
			Id: string;
			Name: string;
			/* eslint-enable @typescript-eslint/naming-convention */
		};
		/* eslint-disable @typescript-eslint/naming-convention */
		HeaderData: Record<string, unknown>;
		DefaultCatalogueId: string;
		CustomTabsData: Record<string, unknown>;
		ButtonCustomData: Record<string, unknown>;
		ButtonStandardData: Record<string, unknown>;
		RelatedListsData: Record<string, unknown>;
		AddonCategorizationData: Record<string, unknown>;
		CategorizationData: Record<string, unknown>;
		FACSettings: Record<string, FacSetting>;
		/* eslint-enable @typescript-eslint/naming-convention */
	}

	interface FrameAgreement {
		/* eslint-disable @typescript-eslint/naming-convention */
		Id: string;
		LastModifiedDate: number;
		Name: string;
		csconta__agreement_level__c: string;
		csconta__Status__c: string;
		csconta__Account__c: string;
		/* eslint-enable @typescript-eslint/naming-convention */
	}

	interface CommercialProductData {
		discLevels: DiscLevel[];
		discThresh: DiscThresh[];
		childUsageTypes: { [key: string]: ChildUsageType[] };
		cpData: CpData;
	}

	/* eslint-disable @typescript-eslint/naming-convention */
	interface ChildUsageType {
		Id: string;
		Name: string;
		cspmb__unit_of_measure__c: string;
	}

	interface CpData {
		[cpId: string]: CommercialProduct;
	}

	interface CommercialProduct {
		addons: Addon[];
		allowances: Allowance[];
		charges: unknown[];
		rateCards: RateCard[];
	}

	interface Addon {
		Id: string;
		cspmb__Price_Item__c: string;
		cspmb__Overrides_Add_On_Charges__c: boolean;
		cspmb__Add_On_Price_Item__c: string;
		cspmb__Add_On_Price_Item__r: CspmbAddOnPriceItemR;
		cspmb__One_Off_Charge__c: number;
		cspmb__Recurring_Charge__c: number;
	}

	interface CspmbAddOnPriceItemR {
		cspmb__Effective_Start_Date__c: number;
		Name: string;
		cspmb__Authorization_Level__c: string;
		cspmb__One_Off_Charge__c: number;
		cspmb__Recurring_Charge__c: number;
		cspmb__Is_One_Off_Discount_Allowed__c: boolean;
		cspmb__Is_Recurring_Discount_Allowed__c: boolean;
		Id: string;
	}

	interface Allowance {
		Id: string;
		Name: string;
		cspmb__amount__c: number;
		cspmb__priority__c: number;
		cspmb__usage_type__c: string;
		mainUsageType: MainUsageType;
	}

	interface MainUsageType {
		cspmb__unit_of_measure__c: string;
		Name: string;
		cspmb__type__c: string;
		Id: string;
		childUsageTypes: ChildUsageType[];
	}

	interface RateCard {
		authId?: string;
		Id: string;
		Name: string;
		rateCardLines: RateCardLine[];
	}

	interface RateCardLine {
		Id: string;
		Name: string;
		cspmb__Cap_Unit__c?: string;
		cspmb__rate_value__c: number;
		cspmb__usage_type__c: string;
		cspmb__Rate_Card__c: string;
		cspmb__Currency_Code__c: CspmbCurrencyCodeC;
		cspmb__usage_type__r: CspmbUsageTypeR;
		usageTypeName: string;
	}

	enum CspmbCurrencyCodeC {
		SampleCode = 'Sample Code'
	}

	interface CspmbUsageTypeR {
		Name: string;
		Id: string;
	}

	interface DiscLevel {
		addonId: string;
		discountLevel: DiscountLevel;
	}

	interface DiscountLevel {
		Id: string;
		Name: string;
		cspmb__Charge_Type__c: string;
		cspmb__Discount_Type__c: string;
		cspmb__Discount_Values__c: string;
	}

	interface DiscThresh {
		Id: string;
		Name: string;
		cspmb__Discount_Threshold__c: number;
		cspmb__Authorization_Level__c: string;
		cspmb__Discount_Type__c: string;
	}

	interface CommercialProductStandalone {
		Id: string;
		Name: string;
		cspmb__Contract_Term__c: string;
		cspmb__Is_Active__c: boolean;
		cspmb__Recurring_Charge__c: number | undefined;
		cspmb__One_Off_Charge__c: number | undefined;
	}

	interface CustomLabelsSf {
		alert_cloneFa_btn_action: string;
		alert_cloneFa_message: string;
		alert_cloneFa_title: string;
		alert_deleteAgreements_message: string;
		alert_deleteAgreements_title: string;
		btn_DeleteAgreements: string;
		filter_text_warning_message: string;
		approval_action_approve: string;
		approval_action_reassign: string;
		approval_action_recall: string;
		approval_action_reject: string;
		approval_message_placeholder: string;
		approval_message_title: string;
		approval_table_header_action: string;
		approval_table_header_actualApprover: string;
		approval_table_header_assignedTo: string;
		approval_table_header_comments: string;
		approval_table_header_date: string;
		approval_table_header_status: string;
		approval_title: string;
	}
	export interface SfdcProcessInstanceHistory {
		ProcessInstanceId: string;
		Id: string;
		ProcessNodeId?: string;
		TargetObjectId: string;
		ActorId: string;
		CreatedById: string;
		RemindersSent: number;
		IsDeleted: boolean;
		IsPending: boolean;
		StepStatus: string;
		OriginalActorId: string;
		Comments?: string;
		CreatedDate: number;
		ProcessNode?: {
			Name: string;
			Id: string;
		};
		Actor: {
			Name: string;
			Id: string;
		};
		OriginalActor: {
			Name: string;
			Id: string;
		};
	}

	export interface SfdcProcessInstance {
		Id: string;
		StepsAndWorkitems: SfdcProcessInstanceHistory[];
	}

	export interface SfdcApprovalHistory {
		isPending: boolean;
		isApprover: boolean;
		isAdmin: boolean;
		currentUser: string;
		listProcess: SfdcProcessInstance[];
	}

	/* eslint-enable @typescript-eslint/naming-convention */
}
