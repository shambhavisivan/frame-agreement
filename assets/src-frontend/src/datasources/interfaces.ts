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

export interface FrameAgreement {
	id: string;
	lastModifiedDate: number;
	name: string;
}
