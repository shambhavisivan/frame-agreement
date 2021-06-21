import { deforcify, deforcifyKeyName } from './deforcify';
import {
	AppSettings,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	UserLocaleInfo,
	FieldMetadata
} from './interfaces';
import { DispatcherToken } from '../datasources/graphql-endpoints/dispatcher-service';

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
	getDispatcherAuthToken(navigatorToken: string): Promise<DispatcherToken>;
	getUserLocale(): Promise<UserLocaleInfo>;
	getFieldMetadata(sObjectName: string): Promise<FieldMetadata[]>;
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
			defaultCatalogueId: settings.DefaultCatalogueId,
			customTabsData: settings.CustomTabsData,
			buttonCustomData: settings.ButtonCustomData,
			buttonStandardData: settings.ButtonStandardData,
			relatedListsData: settings.RelatedListsData,
			addonCategorizationData: settings.AddonCategorizationData,
			categorizationData: settings.CategorizationData,
			facSettings: { ...settings.FACSettings, draftStatus: settings.FACSettings.draft_status }
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
	},

	async getDispatcherAuthToken(
		userAgent: string = navigator.userAgent
	): Promise<DispatcherToken> {
		return await SF.invokeAction('getDispatcherAuthToken', [userAgent]);
	},

	async getUserLocale(): Promise<UserLocaleInfo> {
		const localeInfo = await SF.invokeAction('getUserLocale');
		return {
			userLocaleLang: localeInfo.userLocaleLang,
			userLocaleCountry: localeInfo.userLocaleCountry,
			decimalSeparator: localeInfo.decimalSeparator
		};
	},

	async getFieldMetadata(sObjectName: string): Promise<FieldMetadata[]> {
		const fieldMetadata: FieldMetadata[] = await SF.invokeAction('getFieldMetadata', [
			sObjectName
		]);
		return fieldMetadata.map((metaInf) => {
			if (metaInf.isCustom) {
				metaInf.apiName = deforcifyKeyName(metaInf.apiName);
			}
			return metaInf;
		});
	}
};
