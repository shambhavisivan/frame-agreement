import React, { ReactElement, useState } from 'react';
import { FrameAgreement } from '../../datasources';

interface FaJsonInputProps {
	agreement: Partial<FrameAgreement>;
	setFaDetails: (details: Partial<FrameAgreement>) => void;
}

export function FaJsonInput({ agreement, setFaDetails }: FaJsonInputProps): ReactElement {
	const [input, setInput] = useState(JSON.stringify(agreement));

	const onInputUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;
		setInput(value);
		try {
			setFaDetails(JSON.parse(value));
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn(`Cannot parse ${value} as JSON`);
		}
	};

	return (
		<input
			type="text"
			value={input}
			onChange={onInputUpdate}
			style={{ width: '100%', height: '10vh' }}
		/>
	);
}
