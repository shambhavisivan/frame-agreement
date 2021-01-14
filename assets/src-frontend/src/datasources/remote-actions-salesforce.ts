import { deforcify } from './deforcify';
import {
	AppSettings,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement
} from './interfaces';

/* eslint-disable deprecation/deprecation */
const SF = window.SF;
/* eslint-enable deprecation/deprecation */

export interface RemoteActions {
	getAppSettings(): Promise<AppSettings>;
	getFrameAgreements(): Promise<FrameAgreement[]>;
	getCommercialProductData(ids: string[]): Promise<CommercialProductData>;
	getCommercialProducts(): Promise<CommercialProductStandalone[]>;
	upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement>
	): Promise<FrameAgreement>;
	saveAttachment(faId: string, attachment: Attachment): Promise<string>;
}

export const remoteActions: RemoteActions = {
	async getAppSettings(): Promise<AppSettings> {
		const settings = await SF.invokeAction('getAppSettings', [SF.param.account]);

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
		const agreements = await SF.actions.getFrameAgreements([SF.param.account]);

		return agreements.map(deforcify);
	},

	async getCommercialProductData(ids: string[]): Promise<CommercialProductData> {
		const commercialProductData = await SF.actions.getCommercialProductData([ids]);

		return deforcify(commercialProductData);
	},

	async getCommercialProducts(): Promise<CommercialProductStandalone[]> {
		const commercialProducts = await SF.actions.getCommercialProducts();

		return commercialProducts.map(deforcify);
	},

	async upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement>
	): Promise<FrameAgreement> {
		const frameAgreement = await SF.actions.upsertFrameAgreements([
			faId,
			JSON.stringify(fieldData)
		]);

		return deforcify(frameAgreement);
	},

	async saveAttachment(faId: string, attachment: Attachment): Promise<string> {
		return SF.actions.saveAttachment([faId, JSON.stringify(attachment)]);
	}
};
