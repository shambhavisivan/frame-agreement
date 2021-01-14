import React, { ReactElement, useState } from 'react';

export function Negotiation({
	negotiable,
	onNegotiatedChanged
}: {
	negotiable: { original: number | undefined; negotiated: number | undefined };
	onNegotiatedChanged: (value: number) => void;
}): ReactElement {
	const [input, setInput] = useState(String(negotiable.negotiated || negotiable.original));

	const onInputUpdate = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
		setInput(value);

		if (!Number.isNaN(value)) {
			onNegotiatedChanged(Number(value));
		}
	};

	return (
		<table>
			<tbody>
				<tr>
					<td>{negotiable.original}</td>
					<td>
						<input type="number" value={input} onChange={onInputUpdate} />
					</td>
				</tr>
			</tbody>
		</table>
	);
}
