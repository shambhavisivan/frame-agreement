import {
	Addon,
	Allowance,
	AppSettings,
	Attachment,
	CommercialProduct,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	RateCard,
	RateCardLine
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

const toFrameAgreement = (a: SfGlobal.FrameAgreement): FrameAgreement => ({
	id: a.Id,
	name: a.Name,
	lastModifiedDate: a.LastModifiedDate
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
		const agreements = await SF.actions.getFrameAgreements([SF.param.account]);

		return agreements.map(toFrameAgreement);
	},

	async getCommercialProductData(ids: string[]): Promise<CommercialProductData> {
		const commercialProductData = await SF.actions.getCommercialProductData([ids]);

		const toAddon = (addon: SfGlobal.Addon): Addon => ({
			id: addon.Id
		});

		const toRateCard = (rateCard: SfGlobal.RateCard): RateCard => ({
			id: rateCard.Id,
			name: rateCard.Name,
			rateCardLines: rateCard.rateCardLines.map(toRateCardLine),
			authId: rateCard.authId
		});

		const toRateCardLine = (rateCardLine: SfGlobal.RateCardLine): RateCardLine => ({
			id: rateCardLine.Id,
			name: rateCardLine.Name,
			rateValue: rateCardLine.cspmb__rate_value__c
		});

		const toAllowance = (allowance: SfGlobal.Allowance): Allowance => ({
			id: allowance.Id,
			name: allowance.Name
		});

		return {
			cpData: Object.fromEntries(
				Object.entries(commercialProductData.cpData).map(
					([sfId, value]: [string, SfGlobal.CommercialProduct]): [
						string,
						CommercialProduct
					] => {
						return [
							sfId,
							{
								addons: value.addons.map(toAddon),
								allowances: value.allowances.map(toAllowance),
								rateCards: value.rateCards.map(toRateCard)
							}
						];
					}
				)
			)
		};
	},

	async getCommercialProducts(): Promise<CommercialProductStandalone[]> {
		const commercialProducts = await SF.actions.getCommercialProducts();

		return commercialProducts.map((cp) => ({
			contractTerm: cp.cspmb__Contract_Term__c,
			id: cp.Id,
			isActive: cp.cspmb__Is_Active__c,
			name: cp.Name,
			oneOffCharge: cp.cspmb__One_Off_Charge__c,
			recurringCharge: cp.cspmb__Recurring_Charge__c
		}));
	},

	async upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement>
	): Promise<FrameAgreement> {
		const frameAgreement = await SF.actions.upsertFrameAgreements([
			faId,
			JSON.stringify(fieldData)
		]);

		return toFrameAgreement(frameAgreement);
	},

	async saveAttachment(faId: string, attachment: Attachment): Promise<string> {
		return SF.actions.saveAttachment([faId, JSON.stringify(attachment)]);
	}
};
