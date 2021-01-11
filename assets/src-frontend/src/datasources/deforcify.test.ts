import { Deforcified, deforcify } from './deforcify';

/* eslint-disable @typescript-eslint/naming-convention */
interface SfTestInterface {
	Id: string;
	Name: string;
	cspmb__Authorization_Level__c: string;
	cspmb__One_Off_Charge__c: number;
	cspmb__Recurring_Charge__c: number;
	cspmb__Is_One_Off_Discount_Allowed__c: boolean;
	cspmb__Is_Recurring_Discount_Allowed__c: boolean;
	camelCased: boolean;
	cspmb__testArray1__r: {
		cscfga__One_Off_Charge__c: number;
		cscfga__Recurring_Charge__c: number;
	}[];
	cspmb__testArray2__r: {
		cscfga__One_Off_Charge__c: number;
		cscfga__Recurring_Charge__c: number;
	}[];
	cspmb__level1__r: {
		cscfga__One_Off_Charge__c: number;
		cscfga__Recurring_Charge__c: number;
		cscfga__level2__r: {
			cscfga__One_Off_Charge__c: number;
			cscfga__Recurring_Charge__c: number;
		};
	};
	keyValue: {
		[key: string]: {
			cscfga__One_Off_Charge__c: number;
			cscfga__Recurring_Charge__c: number;
		};
	};
}
/* eslint-enable @typescript-eslint/naming-convention */

describe('deforcify', () => {
	describe('recursive object with salesforce-secific key names with various package prefixes', () => {
		const testObject: SfTestInterface = {
			/* eslint-disable @typescript-eslint/naming-convention */
			Id: 'testId',
			Name: 'testName',
			cspmb__Recurring_Charge__c: 1,
			cspmb__One_Off_Charge__c: 2,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Is_One_Off_Discount_Allowed__c: false,
			camelCased: true,
			cspmb__Authorization_Level__c: 'test string',
			cspmb__testArray1__r: [],
			cspmb__testArray2__r: [
				{
					cscfga__One_Off_Charge__c: 1,
					cscfga__Recurring_Charge__c: 2
				}
			],
			cspmb__level1__r: {
				cscfga__One_Off_Charge__c: 1,
				cscfga__Recurring_Charge__c: 2,
				cscfga__level2__r: {
					cscfga__Recurring_Charge__c: 1,
					cscfga__One_Off_Charge__c: 2
				}
			},
			keyValue: {
				a1F1t0000001JBZEA2: {
					cscfga__Recurring_Charge__c: 1,
					cscfga__One_Off_Charge__c: 2
				}
			}
		};
		/* eslint-enable @typescript-eslint/naming-convention */

		const expected: Deforcified<SfTestInterface> = {
			id: 'testId',
			name: 'testName',
			recurringCharge: 1,
			oneOffCharge: 2,
			isRecurringDiscountAllowed: true,
			isOneOffDiscountAllowed: false,
			camelCased: true,
			authorizationLevel: 'test string',
			testArray1: [],
			testArray2: [
				{
					oneOffCharge: 1,
					recurringCharge: 2
				}
			],
			level1: {
				oneOffCharge: 1,
				recurringCharge: 2,
				level2: {
					recurringCharge: 1,
					oneOffCharge: 2
				}
			},
			keyValue: {
				a1F1t0000001JBZEA2: {
					recurringCharge: 1,
					oneOffCharge: 2
				}
			}
		};

		test('returns deforcified object', () => {
			const actual: Deforcified<SfTestInterface> = deforcify(testObject);

			expect(actual).toEqual(expected);
		});
	});
});
