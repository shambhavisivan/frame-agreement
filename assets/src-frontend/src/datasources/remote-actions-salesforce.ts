import { AppSettings, FrameAgreement } from './interfaces';

export interface RemoteActions {
	getAppSettings(): Promise<AppSettings>;
	getFrameAgreements(): Promise<FrameAgreement[]>;
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
	},

	async getFrameAgreements(): Promise<FrameAgreement[]> {
		/* eslint-disable deprecation/deprecation */
		const agreements = await window.SF.actions.getFrameAgreements([window.SF.param.account]);
		/* eslint-enable deprecation/deprecation */

		return agreements.map(
			(a): FrameAgreement => ({
				id: a.Id,
				name: a.Name,
				lastModifiedDate: a.LastModifiedDate
			})
		);
	}
};
