import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { CSInputNumber } from '@cloudsense/cs-ui-components';
import { FieldType, UserLocaleInfo } from '../../../datasources';

export interface NumberFieldDescriptor {
	status: 'visible' | 'mandatory' | 'enabled';
	fieldType?: FieldType;
	maxLength?: number;
	scale?: number;
	precision?: number;
	maxVal?: number;
	minVal?: number;
	locale?: UserLocaleInfo;
}

export function NumberField({
	value,
	descriptor,
	handleFieldChange,
	handleFieldBlur
}: {
	value: string;
	descriptor: NumberFieldDescriptor;
	handleFieldChange(newValue: string): void;
	handleFieldBlur(newValue: string): void;
}): ReactElement {
	const numberFormatter = useCallback(
		(unformattedValue: string): string => {
			const numberLocale = `${descriptor.locale?.userLocaleLang}-${descriptor.locale?.userLocaleCountry}`;
			const localeDecimalSeparator = descriptor.locale?.decimalSeparator;
			const f = new Intl.NumberFormat(numberLocale, {
				style: 'decimal',
				maximumFractionDigits: descriptor.scale,
				minimumFractionDigits: descriptor.scale
			});

			const replaceHelper = (): string => {
				if (localeDecimalSeparator === ',') {
					// replace remaining comma with a period;
					return unformattedValue.replace(/,/, '.');
				}
				return unformattedValue.replace(/[\s,]+/g, '');
			};
			const toFormat =
				typeof unformattedValue === 'string' ? replaceHelper() : unformattedValue;
			return f.format(Number(toFormat));
		},
		[descriptor]
	);

	const [isFormatterVisible, setFormatterVisible] = useState(true);

	const [inputValue, setInputValue] = useState(
		value && !Number.isNaN(value) ? numberFormatter(value) : ''
	);

	useEffect(() => {
		if (value !== inputValue && !Number.isNaN(inputValue)) {
			if (value && !Number.isNaN(value)) {
				setInputValue(numberFormatter(value));
			} else {
				setInputValue('');
			}
		}
	}, [inputValue, numberFormatter, value]);

	function handleBasicValidations(value: string): void {
		const inputVal = value;

		const onlyNumberCommasSpaces = /^(-{0,1}?\+{0,1}?)[0-9,.{0,1}\s]*$/;

		if (!onlyNumberCommasSpaces.test(inputVal)) {
			return;
		}

		const splittedValue: Array<string> = inputVal.split('.');
		if (splittedValue.length > 2) {
			return;
		} else {
			if (splittedValue.length === 2 && splittedValue[1].split(',').length > 1) {
				return;
			}
		}

		const isValid = validateByLocale(inputVal);
		if (!isValid) {
			return;
		}

		handleFieldChange(inputVal);
	}

	function validateByLocale(inputVal: string): boolean {
		const localeDecimalSeparator = descriptor.locale?.decimalSeparator || '.';
		const regex = new RegExp(`[${localeDecimalSeparator}]`, 'g');
		const numberOfSeparatorOccurrences = (inputVal.match(regex) || []).length;

		if (numberOfSeparatorOccurrences > 1) {
			return false;
		}

		// Can only have numbers after decimalSeparator
		if (numberOfSeparatorOccurrences === 1) {
			const decimalPart = inputVal.substring(
				inputVal.indexOf(localeDecimalSeparator) + 1,
				inputVal.length
			);

			if (decimalPart.length > 0 && !/[0-9]/.test(decimalPart)) {
				return false;
			}
		}
		// Integer part of number cant be bigger than (precision - scale)
		if (descriptor.precision && descriptor.scale) {
			const integerPartMaxLength = descriptor.precision - descriptor.scale;
			const stripAllNonSeparator = new RegExp(`[^\\d${localeDecimalSeparator}]`, 'g');
			const stripped = inputVal.replace(stripAllNonSeparator, '');
			if (numberOfSeparatorOccurrences === 1) {
				const separatorIndex = stripped.indexOf(localeDecimalSeparator);
				const subStrLength = stripped.substring(0, separatorIndex).length;
				if (subStrLength > integerPartMaxLength) {
					return false;
				}
			} else {
				if (stripped.length > integerPartMaxLength) {
					return false;
				}
			}
		}
		return true;
	}

	function handleFormattingOnBlur(value: string): void {
		if (value.length > 0) {
			if (value !== '-' && value !== '+') {
				const formattedValue = numberFormatter(value);
				setInputValue(formattedValue);
				const unformattedValueArray = formattedValue.split(
					descriptor.locale?.decimalSeparator || '.'
				);
				// removes non-numbers but escapes {-}
				unformattedValueArray[0] = unformattedValueArray[0].replace(/[^0-9-]+/g, '');

				handleFieldBlur(
					parseFloat(unformattedValueArray.join('.')).toFixed(descriptor.scale)
				);
			} else {
				handleFieldBlur(value);
			}
		}
	}

	const inputVal = isFormatterVisible ? inputValue : inputValue ? inputValue : '';

	const isReadOnly = descriptor.status === 'visible';

	return (
		<div>
			{isFormatterVisible ? (
				<CSInputNumber
					type="text"
					label="" // label is not required for this usecase
					value={inputVal}
					maxLength={20} // formatter does not support values with length > 20
					min={descriptor.minVal}
					max={descriptor.maxVal}
					required={descriptor.status === 'mandatory'}
					readOnly={isReadOnly}
					onFocus={(): void => {
						if (!isReadOnly) {
							setFormatterVisible(false);
						}
					}}
					title={value}
					labelHidden={true}
				/>
			) : (
				<CSInputNumber
					label=""
					type="text"
					value={inputVal}
					onChange={(val: string): void => handleBasicValidations(val)}
					required={descriptor.status === 'mandatory'}
					readOnly={isReadOnly}
					maxLength={20} // intl number formatter does not support values with length > 20
					onBlur={(e: React.ChangeEvent<HTMLInputElement>): void => {
						if (!isReadOnly) {
							handleFormattingOnBlur(e.target.value);
						}
					}}
					min={descriptor.minVal}
					max={descriptor.maxVal}
					title={value}
					labelHidden={true}
				/>
			)}
		</div>
	);
}
