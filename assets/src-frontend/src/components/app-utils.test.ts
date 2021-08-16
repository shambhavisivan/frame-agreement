import { capitalizeString } from './app-utils';

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
