import { Forcified, forcify } from './forcify';

interface TestInterface {
	id: string;
	name: string;
	authorizationLevel: string;
	oneOffCharge: number;
	recurringCharge: number;
	isOneOffDiscountAllowed: boolean;
	isRecurringDiscountAllowed: boolean;
	camelCased: boolean;
	testArray: {
		oneOffCharge: number;
		recurringCharge: number;
	}[];
	testObject: {
		oneOffCharge: number;
		recurringCharge: number;
	};
}

describe('forcify', () => {
	const testObject: TestInterface = {
		id: 'testId',
		name: 'testName',
		recurringCharge: 1,
		oneOffCharge: 2,
		authorizationLevel: 'test string',
		isRecurringDiscountAllowed: true,
		isOneOffDiscountAllowed: false,
		camelCased: true,
		testArray: [
			{
				oneOffCharge: 1,
				recurringCharge: 2
			}
		],
		testObject: {
			oneOffCharge: 1,
			recurringCharge: 2
		}
	};

	/* eslint-disable @typescript-eslint/naming-convention */
	const expected: Forcified<TestInterface> = {
		Id: 'testId',
		Name: 'testName',
		cspmb__Recurring_Charge__c: 1,
		cspmb__One_Off_Charge__c: 2,
		cspmb__Is_Recurring_Discount_Allowed__c: true,
		cspmb__Is_One_Off_Discount_Allowed__c: false,
		cspmb__Camel_Cased__c: true,
		cspmb__Authorization_Level__c: 'test string',
		cspmb__Test_Array__c: [
			{
				cspmb__One_Off_Charge__c: 1,
				cspmb__Recurring_Charge__c: 2
			}
		],
		cspmb__Test_Object__c: {
			cspmb__One_Off_Charge__c: 1,
			cspmb__Recurring_Charge__c: 2
		}
	};
	/* eslint-enable @typescript-eslint/naming-convention */

	test('should return forcified object', () => {
		const actual: Forcified<TestInterface> = forcify(testObject, 'cspmb');

		expect(actual).toEqual(expected);
	});
});
