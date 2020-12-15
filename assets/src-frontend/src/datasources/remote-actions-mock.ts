import { mockFrameAgreements } from './mock-data';
import type { RemoteActions } from './remote-actions-salesforce';
import { AppSettings, FrameAgreement } from './interfaces';

const FAKE_DELAY_MS = 100;

const mockAppSettings: AppSettings = {
	account: {
		id: 'mockID',
		name: 'mockName'
	},
	headerData: {},
	customTabsData: {},
	buttonCustomData: {},
	buttonStandardData: {},
	relatedListsData: {},
	addonCategorizationData: {},
	categorizationData: {},
	facSettings: {}
};

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
	}
};
