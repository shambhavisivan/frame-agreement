import { FieldMetadata } from '../../datasources';

export function formatCellValue(value: unknown, type: FieldMetadata['fieldType']): unknown {
	if (!value) {
		return;
	}

	switch (type) {
		case 'DATETIME':
			return new Date(Number(value)).toLocaleString();
		case 'REFERENCE':
			const referenceField = value as { id: string };
			return referenceField?.id ? referenceField.id : '';
		default:
			return value ? value : '';
	}
}
