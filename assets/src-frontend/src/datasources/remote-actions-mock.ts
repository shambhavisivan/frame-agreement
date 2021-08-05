import {
	AppSettings,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	UserLocaleInfo,
	FieldMetadata,
	ApprovalHistory,
	ApprovalActionType
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
	mockOfferData
} from './mock-data';
import type { RemoteActions } from './remote-actions-salesforce';
import { DispatcherToken } from '../datasources/graphql-endpoints/dispatcher-service';
import { deforcify, deforcifyKeyName } from './deforcify';
import { approval } from '../local-server/local_data';

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
		const value: FieldMetadata[] = faFieldMetadataMock.map((metaInf) => {
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
	}
};
