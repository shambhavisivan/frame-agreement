import { deforcify, deforcifyKeyName } from './deforcify';
import {
	AppSettings,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	UserLocaleInfo,
	FieldMetadata,
	ApprovalHistory,
	ApprovalActionType,
	DeltaResult,
	Addon
} from './interfaces';
import { DispatcherToken } from '../datasources/graphql-endpoints/dispatcher-service';

/* eslint-disable deprecation/deprecation */
const SF = window.SF;
/* eslint-enable deprecation/deprecation */

export interface RemoteActions {
	getAppSettings(): Promise<AppSettings>;
	queryFrameAgreements(filterString: string): Promise<FrameAgreement[]>;
	getCommercialProductData(ids: string[]): Promise<CommercialProductData>;
	getCommercialProducts(cpIds: string[] | null): Promise<CommercialProductStandalone[]>;
	getOffers(offerIds: string[] | null): Promise<CommercialProductStandalone[]>;
	getOfferData(ids: string[], addonIds: string[] | null): Promise<CommercialProductData>;
	upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement | SfGlobal.FrameAgreement>
	): Promise<FrameAgreement>;
	saveAttachment(faId: string, attachment: Attachment): Promise<string>;
	getDispatcherAuthToken(navigatorToken: string): Promise<DispatcherToken>;
	getUserLocale(): Promise<UserLocaleInfo>;
	getFieldMetadata(sObjectName: string): Promise<FieldMetadata[]>;
	cloneFrameAgreement(faId: string): Promise<FrameAgreement>;
	deleteFrameAgreement(faId: string): Promise<string>;
	getApprovalHistory(faId: string): Promise<ApprovalHistory>;
	approveRejectRecallRecord(
		faId: string,
		actionType: ApprovalActionType,
		comment: string
	): Promise<boolean>;
	reassignApproval(faId: string, newApproverId: string): Promise<void>;
	getAttachmentBody(faId: string): Promise<Attachment>;
	getDelta(sourceFaId: string, targetFaId: string): Promise<DeltaResult>;
	filterCommercialProducts(filterData: string): Promise<CommercialProductStandalone[]>;
	queryAddons(
		priceItemId: string,
		lastRecordId: string | null,
		limit: number | null
	): Promise<Addon[]>;
	getStandaloneAddons(): Promise<Addon[]>;
	getProductIds(filterIds: Array<string>, filterString: string | null): Promise<string[]>;
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
			defaultCatalogueId: settings.DefaultCatalogueId,
			customTabsData: settings.CustomTabsData,
			buttonCustomData: settings.ButtonCustomData,
			buttonStandardData: settings.ButtonStandardData,
			relatedListsData: settings.RelatedListsData,
			addonCategorizationData: settings.AddonCategorizationData,
			categorizationData: settings.CategorizationData,
			facSettings: {
				statuses: {
					draftStatus: settings.FACSettings.statuses.draft_status as string,
					activeStatus: settings.FACSettings.statuses.active_status as string,
					closedStatus: settings.FACSettings.statuses.closed_status as string,
					approvedStatus: settings.FACSettings.statuses.approved_status as string,
					requiresApprovalStatus: settings.FACSettings.statuses
						.requires_approval_status as string
				},
				dispatcherServiceUrl: settings.FACSettings.dispatcherServiceUrl,
				isPsEnabled: settings.FACSettings.isPsEnabled,
				inputMinmaxRestriction: settings.FACSettings.input_minmax_restriction,
				discountAsPrice: settings.FACSettings.discount_as_price
			}
		};
	},

	async queryFrameAgreements(filter: string | null = null): Promise<FrameAgreement[]> {
		const agreements = await SF.invokeAction('queryFrameAgreements', [
			SF.param.account,
			filter,
			null,
			null
		]);

		return agreements?.map(deforcify);
	},

	async getCommercialProductData(ids: string[]): Promise<CommercialProductData> {
		const commercialProductData: SfGlobal.CommercialProductData = await SF.invokeAction(
			'getCommercialProductData',
			[ids, []]
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

	async getOffers(offerIds: string[]): Promise<CommercialProductStandalone[]> {
		const offers: SfGlobal.CommercialProductStandalone[] = await SF.invokeAction(
			'getCommercialProducts',
			[offerIds]
		);

		return offers.map(deforcify);
	},

	async getOfferData(ids: string[], addonIds: string[]): Promise<CommercialProductData> {
		const offerData: SfGlobal.CommercialProductData = await SF.invokeAction('getOfferData', [
			ids,
			addonIds
		]);

		return deforcify(offerData);
	},

	async upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement>
	): Promise<FrameAgreement> {
		const frameAgreement = await SF.invokeAction('upsertFrameAgreements', [
			faId,
			JSON.stringify(fieldData),
			[]
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
		return await SF.invokeAction('getUserLocale');
	},

	async getFieldMetadata(sObjectName: string): Promise<FieldMetadata[]> {
		const fieldMetadata: FieldMetadata[] = await SF.invokeAction('getFieldMetadata', [
			sObjectName
		]);
		return fieldMetadata.map((metaInf) => {
			metaInf.apiName = deforcifyKeyName(metaInf.apiName);
			return metaInf;
		});
	},

	async cloneFrameAgreement(faId: string): Promise<FrameAgreement> {
		const clonedFrameAgreement: SfGlobal.FrameAgreement = await SF.invokeAction(
			'cloneFrameAgreement',
			[faId, []]
		);
		return deforcify(clonedFrameAgreement);
	},

	async deleteFrameAgreement(faId: string): Promise<string> {
		return await SF.invokeAction('deleteFrameAgreement', [faId]);
	},

	async getApprovalHistory(faId: string): Promise<ApprovalHistory> {
		const approvalHistory = await SF.invokeAction('getApprovalHistory', [faId]);
		return deforcify(approvalHistory);
	},

	async approveRejectRecallRecord(
		faId: string,
		actionType: ApprovalActionType,
		comment = ''
	): Promise<boolean> {
		return await SF.invokeAction('approveRejectRecallRecord', [faId, comment, actionType]);
	},

	async reassignApproval(faId: string, newApproverId: string): Promise<void> {
		return await SF.invokeAction('reassignApproval', [faId, newApproverId]);
	},

	async getAttachmentBody(faId: string) {
		try {
			const attachmentBlob = await SF.invokeAction('getAttachmentBody', [faId]);
			const decodedString = atob(attachmentBlob);

			return JSON.parse(decodedString) as Attachment;
		} catch (error) {
			throw new Error(error.message);
		}
	},

	async getDelta(sourceFaId: string, targetFaId: string): Promise<DeltaResult> {
		const deltaResult = await SF.invokeAction('getDelta', [sourceFaId, targetFaId]);

		return deforcify(deltaResult);
	},

	async filterCommercialProducts(filterData: string): Promise<CommercialProductStandalone[]> {
		const filteredCp = await SF.invokeAction('filterCommercialProducts', [filterData]);

		return filteredCp.map(deforcify);
	},

	async queryAddons(priceItemId, lastRecordId, limit): Promise<Addon[]> {
		const addonsList: SfGlobal.Addon[] = await SF.invokeAction('queryAddons', [
			priceItemId,
			lastRecordId,
			limit
		]);

		return addonsList.map(deforcify);
	},

	async getStandaloneAddons(): Promise<Addon[]> {
		const sfAddons = await SF.invokeAction('getStandaloneAddons');

		return sfAddons.map(deforcify);
	},

	async getProductIds(filterIds: Array<string>, filterString: string | null): Promise<string[]> {
		const cpIds = await SF.invokeAction('getProductIds', [filterIds, filterString]);

		return cpIds;
	}
};
