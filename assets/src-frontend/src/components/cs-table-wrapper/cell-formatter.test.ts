import { formatCellValue } from './cell-formatter';

describe('test cell-formatter', () => {
	test('should format datetime cell value to locale string', () => {
		const value = formatCellValue(1626780105000, 'DATETIME');

		// normalise date for comparision as locale date might vary between envionments.
		expect(new Date(value as string).toDateString()).toEqual(
			new Date('7/20/2021, 12:21:45').toDateString()
		);
	});

	test('should send id for lookup data', () => {
		const value = formatCellValue({ id: 'some-id' }, 'REFERENCE');

		expect(value).toEqual('some-id');
	});

	test('should return undefined if the value is undefined/null', () => {
		const value = formatCellValue(null, 'REFERENCE');

		expect(value).toBeUndefined();
	});
});
