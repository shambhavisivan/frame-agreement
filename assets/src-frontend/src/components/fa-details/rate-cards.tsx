import React, { ReactElement, useContext } from 'react';
import { Negotiation } from './negotiation';
import { RateCard as IRateCard } from '../../datasources';
import { store } from './details-page-provider';

interface RateCardsProps {
	rateCards: IRateCard[];
	productId: string;
	negotiateRateCardLine: (rateCardId: string, rateCardLineId: string, value: number) => void;
}

export function RateCards({
	rateCards,
	negotiateRateCardLine,
	productId
}: RateCardsProps): ReactElement {
	return (
		<table>
			<tbody>
				{rateCards.map(({ id, rateCardLines }) => {
					return (
						<RateCard
							key={id}
							rateCardLines={rateCardLines}
							rateCardId={id}
							onNegotiatedChanged={negotiateRateCardLine}
							productId={productId}
						/>
					);
				})}
			</tbody>
		</table>
	);
}

interface RateCardProps {
	rateCardLines: IRateCard['rateCardLines'];
	rateCardId: string;
	onNegotiatedChanged: (rateCardId: string, rateCardLineId: string, value: number) => void;
	productId: string;
}

function RateCard({
	rateCardLines,
	rateCardId,
	onNegotiatedChanged,
	productId
}: RateCardProps): ReactElement {
	return (
		<>
			{rateCardLines.map(({ id: rateCardLineId, rateValue, name }) => {
				return (
					<RateCardLineComponent
						key={rateCardLineId}
						name={name || ''}
						rateCardId={rateCardId}
						rateCardLineId={rateCardLineId}
						value={rateValue}
						onNegotiatedChanged={(value: number): void =>
							onNegotiatedChanged(rateCardId, rateCardLineId, value)
						}
						productId={productId}
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
	value: number;
	onNegotiatedChanged: (value: number) => void;
	productId: string;
}

function RateCardLineComponent({
	rateCardId,
	rateCardLineId,
	name,
	value,
	onNegotiatedChanged,
	productId
}: RateCardLineProps): ReactElement {
	const { negotiation } = useContext(store);
	return (
		<tr>
			<th>
				{name} ({rateCardId}/{rateCardLineId})
			</th>
			<th>
				<Negotiation
					negotiable={{
						original: value,
						negotiated:
							negotiation?.products[productId]?.rateCards[rateCardId]?.rateCardLines[
								rateCardLineId
							]?.negotiated
					}}
					onNegotiatedChanged={onNegotiatedChanged}
				/>
			</th>
		</tr>
	);
}
