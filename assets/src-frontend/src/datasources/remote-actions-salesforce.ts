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
	getCommercialProducts(cpIds: string[] | null): Promise<CommercialProductStandalone[]>;
	upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement | SfGlobal.FrameAgreement>
	): Promise<FrameAgreement>;
	saveAttachment(faId: string, attachment: Attachment): Promise<string>;
}

const toFrameAgreement = (sfFa: SfGlobal.FrameAgreement): FrameAgreement => ({
	id: sfFa.Id,
	name: sfFa.Name,
	lastModifiedDate: sfFa.LastModifiedDate,
	agreementLevel: sfFa.csconta__agreement_level__c
});

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
		const agreements = await SF.invokeAction('getFrameAgreements', [SF.param.account]);

		return agreements.map(toFrameAgreement);
	},

	async getCommercialProductData(ids: string[]): Promise<CommercialProductData> {
		const commercialProductData: SfGlobal.CommercialProductData = await SF.invokeAction(
			'getCommercialProductData',
			[ids]
		);

		return deforcify(commercialProductData);
	},

	async getCommercialProducts(cpIds: string[]): Promise<CommercialProductStandalone[]> {
		const commercialProducts: SfGlobal.CommercialProductStandalone[] = await SF.invokeAction(
			'getCommercialProducts',
			[cpIds]
		);

		return commercialProducts.map(deforcify);
	},

	async upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement>
	): Promise<FrameAgreement> {
		const frameAgreement = await SF.invokeAction('upsertFrameAgreements', [
			faId,
			JSON.stringify(fieldData)
		]);

		return deforcify(frameAgreement);
	},

	async saveAttachment(faId: string, attachment: Attachment): Promise<string> {
		return await SF.invokeAction('saveAttachment', [faId, JSON.stringify(attachment)]);
	}
};
