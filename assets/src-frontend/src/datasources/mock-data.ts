import { commercialProducts, frameAgreements, productData } from '../local-server/local_data';
import { deforcify } from './deforcify';
import {
	AppSettings,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	UserLocaleInfo
} from './interfaces';
import { DispatcherToken } from '../datasources/graphql-endpoints/dispatcher-service';

export const mockAppSettings: AppSettings = {
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
	facSettings: {
		statuses: {
			draftStatus: 'Draft'
		}
	}
};

export const mockFrameAgreements: FrameAgreement[] = frameAgreements.map(deforcify);

export const mockCommercialProductData: CommercialProductData = {
	cpData: deforcify(productData)
};

export const mockCommercialProducts: CommercialProductStandalone[] = commercialProducts.map(
	deforcify
);

export const mockDispatcherAuthToken: DispatcherToken = {
	orgId: 'some-org-id',
	expires: new Date(new Date().getTime() + 10 * 60000).getTime(),
	userAgent: navigator.userAgent,
	token: 'testToken'
};

export const mockUserLocale: UserLocaleInfo = {
	userLocaleLang: 'en',
	userLocaleCountry: 'GB',
	decimalSeparator: '.'
};
