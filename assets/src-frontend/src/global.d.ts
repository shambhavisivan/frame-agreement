interface SF {
	params: VfParams;
	decodeEntities(): Record<string, unknown> | string;
	decodeObject(obj: Record<string, unknown>): Record<string, unknown>;
	// TODO: infer type dynamically from a RemoteAction
	invokeAction(
		remoteActionName: 'getAppSettings',
		parametersArr?: [string]
	): Promise<AppSettings>;
	param: {
		account: string;
	};
	apiSession: string;
	actions: RemoteActions;
	labels: Record<string, string>;
}

interface Window {
	/* eslint-disable @typescript-eslint/naming-convention */

	/**
	 * @deprecated
	 */
	SF: SF;
	/* eslint-enable @typescript-eslint/naming-convention */
}

type VfParams = {
	account: string;
};

interface RemoteActions {
	getAppSettings(paramsArray: [string]): Promise<AppSettings>;
	// TODO: define all actions
}

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: should be updated when the backend refactor is ready.
interface Account {
	Id: string;
	Name: string;
}

// TODO define the unknowns
interface AppSettings {
	account: Account;
	HeaderData: Record<string, unknown>;
	CustomTabsData: Record<string, unknown>;
	ButtonCustomData: Record<string, unknown>;
	ButtonStandardData: Record<string, unknown>;
	RelatedListsData: Record<string, unknown>;
	AddonCategorizationData: Record<string, unknown>;
	CategorizationData: Record<string, unknown>;
	FACSettings: Record<string, Record<string, unknown>>;
}
/* eslint-enable @typescript-eslint/naming-convention */
