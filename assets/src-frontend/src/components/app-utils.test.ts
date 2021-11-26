import { FrameAgreement } from '../datasources';
import {
	capitalizeString,
	isNotUndefinedOrNull,
	isStandardButtonVisible,
	parseConditionalExpression,
	ParsedCondition
} from './app-utils';

describe('app-utils', () => {
	describe('test capitalize first letter', () => {
		test('should captitaze and return valid string', () => {
			const result = capitalizeString('lamborghini');

			expect(result).toEqual('Lamborghini');
		});

		test('should return undefined', () => {
			const result = capitalizeString('');

			expect(result).toBeUndefined();
		});

		test('should normalise string and capitalise first letter', () => {
			const result = capitalizeString('maHinDraThar');

			expect(result).toEqual('Mahindrathar');
		});
	});

	describe('isNotUndefinedOrNull', () => {
		test('should return true if the given number is not undefined or null', () => {
			const testNum = 100;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(true);
		});

		test('should return false if the given number is undefined', () => {
			const testNum = undefined;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(false);
		});

		test('should return false if the given number is null', () => {
			const testNum = null;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(false);
		});

		test('should return true if the given number is 0', () => {
			const testNum = 0;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(true);
		});
	});

	describe('parseContionalString', () => {
		test('should parse the given input string', () => {
			const expected: ParsedCondition = {
				components: [
					{
						comparison: '==',
						field: 'show_bulk_boolean__c',
						value: 'true'
					},
					{
						comparison: '!=',
						field: 'csconta__Status__c',
						value: 'Active'
					}
				],
				operators: ['&&']
			};

			const response = parseConditionalExpression(
				'show_bulk_boolean__c == true && csconta__Status__c != Active'
			);

			expect(response).toEqual(expected);
		});

		test('throw exception when input string is empty', () => {
			let message = '';

			try {
				parseConditionalExpression('');
				expect(false).toEqual(true);
			} catch (error) {
				message = (error as Error).message;
			}

			expect(message).toEqual('conditionalString is empty');
		});
	});

	describe('isStandardButtonVisible', () => {
		test('to find if the mathching status is avaialble', () => {
			const result = isStandardButtonVisible(['Draft', 'Active'], {
				id: 'some-id',
				status: 'Draft'
			} as FrameAgreement);

			expect(result).toBeTruthy();
		});

		test('to find if the condition matches the fa fieldvalue condition', () => {
			const result = isStandardButtonVisible(
				'csfam__Status__c == Draft && csfam__Agreement_Name__c == sample-fa',
				{
					id: 'some-id',
					status: 'Draft',
					agreementName: 'sample-fa'
				} as FrameAgreement
			);

			expect(result).toBeTruthy();
		});

		test('should return true if the OR case passes', () => {
			const result = isStandardButtonVisible(
				'csfam__Status__c == Draft || csfam__Agreement_Name__c == sample-fa',
				{
					id: 'some-id',
					status: 'Draft',
					agreementName: 'sample-fa'
				} as FrameAgreement
			);

			expect(result).toBeTruthy();
		});

		test('should return false if the AND case fails', () => {
			const result = isStandardButtonVisible(
				'csfam__Status__c == Active && csfam__Agreement_Name__c == sample-fa',
				{
					id: 'some-id',
					status: 'Draft',
					agreementName: 'sample-fa'
				} as FrameAgreement
			);

			expect(result).toBeFalsy();
		});

		test('should return true if string has only astreik {*} symbol', () => {
			const result = isStandardButtonVisible('*', {
				id: 'some-id',
				status: 'Draft',
				agreementName: 'sample-fa'
			} as FrameAgreement);

			expect(result).toBeTruthy();
		});

		test('should return true if array has only astreik {*} symbol, legacy', () => {
			const result = isStandardButtonVisible(['*'], {
				id: 'some-id',
				status: 'Draft',
				agreementName: 'sample-fa'
			} as FrameAgreement);

			expect(result).toBeTruthy();
		});

		test('should return false if input is undefined', () => {
			const result = isStandardButtonVisible(undefined, {
				id: 'some-id',
				status: 'Draft',
				agreementName: 'sample-fa'
			} as FrameAgreement);

			expect(result).toBeFalsy();
		});
	});
});
