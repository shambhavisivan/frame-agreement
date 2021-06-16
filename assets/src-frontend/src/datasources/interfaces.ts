export interface Account {
	id: string;
	name: string;
}

export interface AppSettings {
	account: Account;
	headerData: Record<string, unknown>;
	customTabsData: Record<string, unknown>;
	buttonCustomData: Record<string, unknown>;
	buttonStandardData: Record<string, unknown>;
	relatedListsData: Record<string, unknown>;
	addonCategorizationData: Record<string, unknown>;
	categorizationData: Record<string, unknown>;
	facSettings: Record<string, Record<string, unknown>>;
}

export interface Attachment {
	custom: Addons;
	products: Products;
	addons: Addons;
}

interface Addons {}

export interface AttachmentProductNegotiation {
	volume: Volume;
	product: Product;
	rateCards: RateCards;
	allowances: Addons;
}

export interface Products {
	[productId: string]: AttachmentProductNegotiation;
}

interface Product {
	recurring?: number;
	oneOff?: number;
}

export interface RateCards {
	[rateCartId: string]: { [rateCardLineId: string]: number };
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
}

export interface CommercialProduct {
	addons: Addon[];
	allowances?: Allowance[];
	rateCards: RateCard[];
	charges: { id: string }[];
}

export interface CommercialProductData {
	cpData: {
		[id: string]: CommercialProduct;
	};
}

export interface Addon {
	id: string;
}

export interface Allowance {
	id: string;
	name: string;
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
}

export interface UserLocaleInfo {
	userLocaleLang: string;
	userLocaleCountry: string;
	decimalSeparator: string;
}
