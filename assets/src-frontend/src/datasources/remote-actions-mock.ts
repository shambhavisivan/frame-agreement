import {
	AppSettings,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement
} from './interfaces';
import {
	mockCommercialProductData,
	mockCommercialProducts,
	mockAppSettings,
	mockFrameAgreements
} from './mock-data';
import type { RemoteActions } from './remote-actions-salesforce';

const FAKE_DELAY_MS = 500;

export const remoteActions: RemoteActions = {
	async getAppSettings(): Promise<AppSettings> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(mockAppSettings), FAKE_DELAY_MS);
		});
	},

	async getFrameAgreements(): Promise<FrameAgreement[]> {
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
			setTimeout(() => resolve(upsertedFa), FAKE_DELAY_MS);
		});
	},

	async saveAttachment(_faId: string, attachment: Attachment): Promise<string> {
		/* eslint-disable no-console */
		console.log(`Saving attachment:`, attachment);
		/* eslint-enable no-console */
		return new Promise((resolve) => {
			setTimeout(() => resolve(JSON.stringify(attachment)), FAKE_DELAY_MS);
		});
	}
};