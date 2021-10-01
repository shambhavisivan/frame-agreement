import { capitalizeString, isNotUndefinedOrNull } from './app-utils';

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
});
