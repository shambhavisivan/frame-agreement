import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { isNotUndefinedOrNull } from '../../app-utils';
import { convertAmountToPercent } from './discount-validator';
import { Negotiable } from './negotiation-reducer';

export interface NegotiateDiffProps {
	isThresholdViolated: boolean;
	negotiable: Negotiable;
}

export function NegotiateDiff({
	isThresholdViolated,
	negotiable
}: NegotiateDiffProps): ReactElement {
	const [showPercent, setShowPercent] = useState(false);

	const createNegotiateDiffText = useCallback((): string => {
		const original = negotiable?.original || 0;
		const negotiated = isNotUndefinedOrNull(negotiable?.negotiated)
			? (negotiable.negotiated as number)
			: negotiable?.original || 0;
		if (showPercent) {
			return `${convertAmountToPercent(original, negotiated - original)}%`;
		} else {
			return `${negotiated - original}`;
		}
	}, [negotiable, showPercent]);

	const [negotiationText, setNegotiationText] = useState(`${createNegotiateDiffText()}`);

	useEffect((): void => {
		setNegotiationText(`${createNegotiateDiffText()}`);
	}, [createNegotiateDiffText, negotiable]);

	const onDiffClick = (): void => {
		setShowPercent(!showPercent);
	};

	const style = {
		color: isThresholdViolated ? 'red' : 'green',
		marginLeft: '5px'
	};

	return (
		<div style={{ display: 'flex' }} onClick={onDiffClick}>
			<div>{`negotiated `} </div>
			<div style={style}>{negotiationText}</div>
		</div>
	);
}
