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

export interface RemoteActions {
	getAppSettings(): Promise<AppSettings>;
}

export const remoteActions: RemoteActions = {
	async getAppSettings(): Promise<AppSettings> {
		/* eslint-disable deprecation/deprecation */
		const settings = await window.SF.invokeAction('getAppSettings', [window.SF.param.account]);
		/* eslint-enable deprecation/deprecation */

		return {
			account: {
				id: settings.account.Id,
				name: settings.account.Name
			},
			headerData: settings.HeaderData,
			customTabsData: settings.CustomTabsData,
			buttonCustomData: settings.ButtonCustomData,
			buttonStandardData: settings.ButtonStandardData,
			relatedListsData: settings.RelatedListsData,
			addonCategorizationData: settings.AddonCategorizationData,
			categorizationData: settings.CategorizationData,
			facSettings: settings.FACSettings
		};
	}
};
