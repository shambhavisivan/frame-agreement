import React, { ReactElement } from 'react';
import { Negotiation } from './negotiation';
import { RateCardLines, RateCards as IRateCards } from './negotiation/negotiation-reducer';

interface RateCardsProps {
	rateCards: IRateCards;
	negotiateRateCardLine: (rateCardId: string, rateCardLineId: string, value: number) => void;
}

export function RateCards({ rateCards, negotiateRateCardLine }: RateCardsProps): ReactElement {
	return (
		<table>
			<tbody>
				{Object.entries(rateCards).map(([rateCardId, rateCard]) => {
					return (
						<RateCard
							key={rateCardId}
							rateCardLines={rateCard.rateCardLines}
							rateCardId={rateCardId}
							onNegotiatedChanged={negotiateRateCardLine}
						/>
					);
				})}
			</tbody>
		</table>
	);
}

interface RateCardProps {
	rateCardLines: RateCardLines;
	rateCardId: string;
	onNegotiatedChanged: (rateCardId: string, rateCardLineId: string, value: number) => void;
}

function RateCard({ rateCardLines, rateCardId, onNegotiatedChanged }: RateCardProps): ReactElement {
	return (
		<>
			{Object.entries(rateCardLines).map(([rateCardLineId, rateCardLine]) => {
				return (
					<RateCardLineComponent
						key={rateCardLineId}
						name={rateCardLine.name || ''}
						rateCardId={rateCardId}
						rateCardLineId={rateCardLineId}
						value={rateCardLine}
						onNegotiatedChanged={(value: number): void =>
							onNegotiatedChanged(rateCardId, rateCardLineId, value)
						}
					/>
				);
			})}
		</>
	);
}

interface RateCardLineProps {
	rateCardId: string;
	rateCardLineId: string;
	name: string;
	value: {
		original: number | undefined;
		negotiated: number | undefined;
	};
	onNegotiatedChanged: (value: number) => void;
}

function RateCardLineComponent({
	rateCardId,
	rateCardLineId,
	name,
	value,
	onNegotiatedChanged
}: RateCardLineProps): ReactElement {
	return (
		<tr>
			<th>
				{name} ({rateCardId}/{rateCardLineId})
			</th>
			<th>
				<Negotiation negotiable={value} onNegotiatedChanged={onNegotiatedChanged} />
			</th>
		</tr>
	);
}
