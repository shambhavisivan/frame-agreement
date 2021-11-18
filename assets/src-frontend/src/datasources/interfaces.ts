import { ChargeType } from '../components/fa-details/negotiation/details-reducer';
import { Deforcified } from './deforcify';

export interface Account {
	id: string;
	name: string;
}

export type FacSetting = {
	statuses: {
		draftStatus: string;
		activeStatus: string;
		closedStatus: string;
		approvedStatus: string;
		requiresApprovalStatus: string;
	};
	dispatcherServiceUrl: string;
	isPsEnabled: boolean;
	inputMinmaxRestriction: boolean;
	discountAsPrice: boolean;
	faEditableStatuses: string[];
	approversRevise: boolean;
	activeStatusManagement: boolean;
};

export interface AppSettings {
	account: Account;
	defaultCatalogueId: string;
	headerData: Record<string, unknown>;
	customTabsData: Record<string, unknown>;
	buttonCustomData: Record<string, unknown>;
	buttonStandardData: Deforcified<SfGlobal.StandardButtonData>;
	relatedListsData: Record<string, unknown>;
	addonCategorizationData: Record<string, unknown>;
	categorizationData: SfGlobal.CategorizationData[];
	facSettings: FacSetting;
}

export interface Attachment {
	custom?: string | Record<string, unknown>;
	products?: Products;
	offers?: Products;
	addons?: Addons;
}

export interface Addons {
	[addonId: string]: { oneOff?: number | null; recurring?: number | null };
}

export interface AttachmentProductNegotiation {
	volume?: Volume;
	product?: Product;
	rateCards?: RateCards;
	allowances?: Allowance;
	addons?: Addons;
	charges?: { [chargeId: string]: Product };
}

export interface Products {
	[productId: string]: AttachmentProductNegotiation;
}

export interface Product {
	recurring?: number | null;
	oneOff?: number | null;
}

export interface RateCards {
	[rateCardId: string]: { [rateCardLineId: string]: number };
}

export interface Volume {
	mv: number | null;
	mvp: number | null;
	muc: number | null;
	mucp: number | null;
}

export interface FrameAgreement {
	id: string;
	lastModifiedDate?: number;
	name: string;
	agreementLevel?: string;
	status?: string;
	replacedFrameAgreement?: string;
	agreementName?: string;
	effectiveStartDate?: number;
	masterFrameAgreement?: string;
}

export interface CommercialProduct {
	addons: Addon[];
	allowances?: Allowance[];
	rateCards: RateCard[];
	charges: Charge[];
}

export interface Charge {
	id: string;
	name: string;
	recurring: number;
	oneOff: number;
	chargeType: ChargeType;
}

export interface CommercialProductData {
	cpData: {
		[id: string]: CommercialProduct;
	};
	discThresh: DiscountThreshold[];
	discLevels: DiscLevelWrapper[];
}

export interface Addon {
	id: string;
	name: string;
	oneOffCharge?: number;
	recurringCharge?: number;
}

export interface Allowance {
	[allowanceId: string]: { value: number; name: string };
}

export interface RateCard {
	authId?: string;
	id: string;
	name: string;
	rateCardLines: RateCardLine[];
}

export interface RateCardLine {
	id: string;
	name: string;
	rateValue: number;
}

// TODO: find a better name for this - overloaded
export interface CommercialProductStandalone {
	id: string;
	name: string;
	contractTerm: string;
	isActive?: boolean;
	oneOffCharge?: number;
	recurringCharge?: number;
	isOneOffDiscountAllowed: boolean;
	isRecurringDiscountAllowed: boolean;
}

export interface UserLocaleInfo {
	userLocaleLang: string;
	userLocaleCountry: string;
	decimalSeparator: string;
	currency: string;
}

export type FieldType =
	| 'REFERENCE'
	| 'NUMBER'
	| 'DATE'
	| 'DATETIME'
	| 'STRING'
	| 'BOOLEAN'
	| 'ID'
	| 'PICKLIST'
	| 'DOUBLE';

export interface FieldMetadata {
	fieldLabel: string;
	apiName: string;
	isUpdatable: boolean;
	isCustom: boolean;
	scale: number;
	precision: number;
	fieldType: FieldType;
}

export interface ProcessInstanceHistory {
	processInstanceId: string;
	id: string;
	processNodeId?: string;
	targetObjectId: string;
	actorId: string;
	createdById: string;
	remindersSent: number;
	isDeleted: boolean;
	isPending: boolean;
	stepStatus: string;
	originalActorId: string;
	comments?: string;
	createdDate: number;
	processNode?: {
		name: string;
		id: string;
	};
	actor: {
		name: string;
		id: string;
	};
	originalActor: {
		name: string;
		id: string;
	};
}

export interface ProcessInstance {
	id: string;
	stepsAndWorkitems: ProcessInstanceHistory[];
}

export interface ApprovalHistory {
	isPending: boolean;
	isApprover: boolean;
	isAdmin: boolean;
	currentUser: string;
	listProcess: ProcessInstance[];
}

export enum ApprovalActionType {
	approve = 'Approve',
	reject = 'Reject',
	recall = 'Removed',
	reassign = 'Reassign'
}

export enum FaStatus {
	draft = 'draftStatus',
	active = 'activeStatus',
	closed = 'closedStatus',
	approved = 'approvedStatus',
	requiresApproval = 'requiresApprovalStatus'
}

export type DeltaStatus = 'changed' | 'unchanged';

export type ValueStatus = {
	newValue: string | number;
	oldValue: string | number;
	status: DeltaStatus;
};

export type ChargeStatus = {
	oneOff: ValueStatus;
	recurring: ValueStatus;
	status: DeltaStatus;
};

export interface DeltaResult {
	account: ValueStatus;
	agreementName: ValueStatus;
	status: ValueStatus;
	agreementLevel: ValueStatus;
	addons: { [key: string]: ChargeStatus };
	products: { [key: string]: DeltaProduct | 'removed' | 'added' };
}

type ChargeDeltaMap = {
	[sobjectId: string]: ChargeStatus;
};

export interface DeltaProduct {
	addons: ChargeDeltaMap;
	charges: ChargeDeltaMap;
	product: ChargeStatus;
	rateCard: ChargeDeltaMap;
	volume: { [key in keyof Volume]: ValueStatus };
}

export type DiscountType = 'Amount' | 'Percentage' | 'Nagative Line Item';
export interface DiscountThreshold {
	id: string;
	name: string;
	discountThresholdCode?: string;
	discountType: DiscountType;
	discountThreshold: number;
	authorizationLevel: string;
	profileName?: string;
}

export interface Volume {
	muc: number | null;
	mucp: number | null;
	mv: number | null;
	mvp: number | null;
}
export interface DiscountLevel {
	id: string;
	name: string;
	chargeType: string;
	discountType: DiscountType;
	discountValues?: string;
	discountIncrement?: string;
	minimumDiscountValue?: number;
	maximumDiscountValue?: number;
}

export interface DiscLevelWrapper {
	addonId?: string;
	discountLevel: DiscountLevel;
	priceItemId?: string;
}

export interface Subscriber {
	unsubscribe: () => void;
}

export interface FrameAgreementAttachment {
	frameAgreement: FrameAgreement;
	attachment?: Attachment;
}
