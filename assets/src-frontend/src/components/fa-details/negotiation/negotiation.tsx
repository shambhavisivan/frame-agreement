import { CSInputText } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useState } from 'react';
import { Negotiable } from './details-reducer';

export function Negotiation({
	negotiable,
	onNegotiatedChanged
}: {
	negotiable: Negotiable | undefined;
	onNegotiatedChanged: (value: number) => void;
}): ReactElement {
	const [input, setInput] = useState(negotiable?.negotiated || negotiable?.original || 0);

	const onInputUpdate = (value: string): void => {
		setInput(Number(value));

		onNegotiatedChanged(Number(value));
	};

	return (
		<table>
			<tbody>
				<tr>
					<td>
						<CSInputText
							value={String(input)}
							onBlur={(event: React.FocusEvent<HTMLInputElement>): void => {
								!Number.isNaN(event.target.value) &&
									onInputUpdate(event.target.value);
							}}
							label={'negotiated'}
							onChange={(event): void => setInput(Number(event?.target?.value))}
						></CSInputText>
					</td>
				</tr>
			</tbody>
		</table>
	);
}
