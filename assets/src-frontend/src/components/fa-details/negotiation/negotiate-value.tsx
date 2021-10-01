import React, { ReactElement, useEffect, useState } from 'react';
import { UserLocaleInfo } from '../../../datasources';
import { NumberField, NumberFieldDescriptor } from './number-field';

export interface NegotiateValueProps {
	locale: UserLocaleInfo | undefined;
	isEnabled: boolean;
	negotiatedValue: number;
	minValue: number | undefined;
	maxValue: number | undefined;
	onNegotiatedChanged: (value: number) => void;
}

export function NegotiateValue({
	locale,
	isEnabled,
	negotiatedValue,
	minValue,
	maxValue,
	onNegotiatedChanged
}: NegotiateValueProps): ReactElement {
	const [input, setInput] = useState(String(negotiatedValue));
	const [inputEnabled, setInputEnabled] = useState(true);

	const onInputUpdate = (value: string): void => {
		setInput(value);
	};

	const onInputSave = (value: string): void => {
		if (Number.isNaN(value)) {
			setInput(String(negotiatedValue));
			// TODO: Add log mechanism
		} else if (minValue !== undefined && Number(value) < minValue) {
			setInput(String(negotiatedValue));
			// TODO: Add log mechanism
		} else if (maxValue !== undefined && Number(value) > maxValue) {
			setInput(String(negotiatedValue));
			// TODO: Add log mechanism
		} else {
			setInput(value);
			onNegotiatedChanged(Number(value));
		}
	};

	useEffect(() => {
		setInput(String(negotiatedValue));
	}, [negotiatedValue]);

	useEffect(() => {
		if (isEnabled) {
			setInputEnabled(true);
		} else {
			setInputEnabled(false);
		}
	}, [isEnabled]);

	const descriptor: NumberFieldDescriptor = {
		status: inputEnabled ? 'enabled' : 'visible',
		fieldType: 'STRING',
		locale,
		maxVal: maxValue,
		minVal: minValue
	};
	return (
		<div style={{ display: 'flex' }}>
			<NumberField
				value={input}
				descriptor={descriptor}
				handleFieldChange={onInputUpdate}
				handleFieldBlur={onInputSave}
			></NumberField>
		</div>
	);
}
