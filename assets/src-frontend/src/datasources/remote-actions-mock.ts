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
import {
	mockCommercialProductData,
	mockCommercialProducts,
	mockAppSettings,
	mockFrameAgreements,
	mockDispatcherAuthToken,
	mockUserLocale,
	faFieldMetadataMock,
	mockOffers,
	mockOfferData,
	attachment,
	DELTA_CALC_RESULT_MOCK,
	CP_FIELD_METADATA,
	ADDON_METADATA,
	lookupRecords,
	pickListOptions
} from './mock-data';
import type { RemoteActions } from './remote-actions-salesforce';
import { DispatcherToken } from '../datasources/graphql-endpoints/dispatcher-service';
import { deforcify, deforcifyKeyName } from './deforcify';
import { addons, approval } from '../local-server/local_data';
import { ADDON_API_NAME, CP_API_NAME } from '../app-constants';
import { LookupRecordParam, FieldPickList } from '.';

const FAKE_DELAY_MS = 500;

export const remoteActions: RemoteActions = {
	async getAppSettings(): Promise<AppSettings> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockAppSettings), FAKE_DELAY_MS);
		});
	},

	async queryFrameAgreements(): Promise<FrameAgreement[]> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockFrameAgreements), FAKE_DELAY_MS);
		});
	},

	async getCommercialProductData(ids: string[]): Promise<CommercialProductData> {
		const dataForIds = {
			...mockCommercialProductData,
			cpData: Object.fromEntries(
				Object.entries(mockCommercialProductData.cpData).filter(([key]) =>
					ids.includes(key)
				)
			)
		};

		return new Promise((resolve) => {
			setTimeout(() => resolve(dataForIds), FAKE_DELAY_MS);
		});
	},

	async getCommercialProducts(): Promise<CommercialProductStandalone[]> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockCommercialProducts), FAKE_DELAY_MS);
		});
	},

	async getOffers(): Promise<CommercialProductStandalone[]> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockOffers), FAKE_DELAY_MS);
		});
	},

	async getOfferData(ids: string[]): Promise<CommercialProductData> {
		const dataForIds = {
			...mockCommercialProductData,
			cpData: Object.fromEntries(
				Object.entries(mockOfferData.cpData).filter(([key]) => ids.includes(key))
			)
		};

		return new Promise((resolve) => {
			setTimeout(() => resolve(dataForIds), FAKE_DELAY_MS);
		});
	},

	async upsertFrameAgreements(
		faId: string | null,
		fieldData: Partial<FrameAgreement>
	): Promise<FrameAgreement> {
		const agreement = mockFrameAgreements.find((f) => f.id === faId) || mockFrameAgreements[0];

		const upsertedFa = { ...agreement, ...fieldData, id: faId || 'randomId' };

		/* eslint-disable no-console */
		console.log(`Upserted`, upsertedFa);
		/* eslint-enable no-console */
		return new Promise((resolve) => {
			setTimeout(() => resolve(deforcify(upsertedFa)), FAKE_DELAY_MS);
		});
	},

	async saveAttachment(_faId: string, attachment: Attachment): Promise<string> {
		/* eslint-disable no-console */
		console.log(`Saving attachment:`, attachment);
		/* eslint-enable no-console */
		return new Promise((resolve) => {
			setTimeout(() => resolve(JSON.stringify(attachment)), FAKE_DELAY_MS);
		});
	},

	async getDispatcherAuthToken(): Promise<DispatcherToken> {
		return Promise.resolve(mockDispatcherAuthToken);
	},

	async getUserLocale(): Promise<UserLocaleInfo> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockUserLocale), FAKE_DELAY_MS);
		});
	},

	async getFieldMetadata(sObjectName): Promise<FieldMetadata[]> {
		let fieldMetadata: FieldMetadata[];
		switch (sObjectName) {
			case CP_API_NAME:
				fieldMetadata = CP_FIELD_METADATA;
				break;
			case ADDON_API_NAME:
				fieldMetadata = ADDON_METADATA;
				break;
			default:
				fieldMetadata = faFieldMetadataMock;
		}
		const value: FieldMetadata[] = fieldMetadata.map((metaInf) => {
			metaInf.apiName = deforcifyKeyName(metaInf.apiName);
			return metaInf;
		});
		return Promise.resolve(value);
	},

	async cloneFrameAgreement(faId) {
		return Promise.resolve(mockFrameAgreements[0]);
	},

	async deleteFrameAgreement(faId) {
		return Promise.resolve('Success');
	},

	async getApprovalHistory(faId: string): Promise<ApprovalHistory> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(deforcify(approval)), FAKE_DELAY_MS);
		});
	},

	async approveRejectRecallRecord(
		faId: string,
		actionType: ApprovalActionType,
		comment: string
	): Promise<boolean> {
		return Promise.resolve(true);
	},

	async reassignApproval(faId: string, newApproverId: string): Promise<void> {
		return Promise.resolve();
	},

	async getAttachmentBody(faId: string): Promise<Attachment> {
		return Promise.resolve(attachment);
	},

	async getDelta(): Promise<DeltaResult> {
		return Promise.resolve(DELTA_CALC_RESULT_MOCK);
	},

	async filterCommercialProducts() {
		return mockCommercialProducts;
	},

	async queryAddons(
		priceItemId: string,
		lastRecordId: string | null,
		limit: number | null
	): Promise<Addon[]> {
		const mockaddons = addons.map(deforcify);

		return new Promise((resolve) => {
			setTimeout(() => resolve(mockaddons), FAKE_DELAY_MS);
		});
	},

	async getStandaloneAddons() {
		const mockaddons = addons.map(deforcify);

		return new Promise((resolve) => {
			setTimeout(() => resolve(mockaddons), FAKE_DELAY_MS);
		});
	},
	async getProductIds(filterIds: Array<string>, filterString: string | null): Promise<string[]> {
		return mockCommercialProducts.map((mockProduct) => mockProduct.id);
	},

	async queryProducts(
		priceItemIds: string[],
		filterFields: string | null,
		lastRecordId: string | null,
		queryLimit: number,
		alreadyAddedIds: string[]
	): Promise<CommercialProductStandalone[]> {
		return priceItemIds?.length
			? mockCommercialProducts.filter((mockProduct) =>
					alreadyAddedIds?.length
						? priceItemIds.includes(mockProduct.id) &&
						  !alreadyAddedIds.includes(mockProduct.id)
						: priceItemIds.includes(mockProduct.id)
			  )
			: mockCommercialProducts;
	},

	async getFrameAgreement(faId: string): Promise<FrameAgreement> {
		return Promise.resolve(mockFrameAgreements[0]);
	},

	async submitForApproval(faId: string): Promise<boolean> {
		return true;
	},

	async activateFrameAgreement(faId: string): Promise<string> {
		return Promise.resolve('prgId-1');
	},

	async getLookupRecords(params: LookupRecordParam): Promise<Array<Record<string, unknown>>> {
		return Promise.resolve(lookupRecords);
	},

	async getPicklistOptions(picklistFields: Array<string>): Promise<FieldPickList> {
		return Promise.resolve(pickListOptions);
	}
};
