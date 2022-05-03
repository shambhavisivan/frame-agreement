import React, { ReactElement, useContext, useMemo } from 'react';
import { RateCard as IRateCard } from '../../datasources';
import { store } from './details-page-provider';
import { NegotiateInput } from './negotiation/negotiate-input';
import { Discount } from './negotiation/discount-validator';
import {
	CSDataTable,
	CSDataTableColumnInterface,
	CSDataTableRowWithMetaInterface
} from '@cloudsense/cs-ui-components';
import { useDiscountValidation } from '../../hooks/use-discount-validation';

interface RateCardsProps {
	rateCards: IRateCard[];
	productId: string;
	negotiateRateCardLine: (rateCardId: string, rateCardLineId: string, value: number) => void;
}

type RCLRowData = {
	rcName: string | null;
	rcId: string | null;
	itemId: string;
	itemName: string;
	rateValue: number;
	negValue: number;
	usageType: string;
	authId?: string;
};

type RCHeader = { [id: string]: RCLRowData[] };

export function RateCards({
	rateCards,
	negotiateRateCardLine,
	productId
}: RateCardsProps): ReactElement {
	const { negotiation } = useContext(store);
	const { validateRateCardLineThreshold } = useDiscountValidation();

	const evaluateThreshold = (
		rateCardId: string,
		rateCardLineId: string,
		authId: string
	): boolean => {
		const breachedThresholds = validateRateCardLineThreshold(
			productId,
			rateCardId,
			rateCardLineId,
			authId
		);

		return breachedThresholds.length ? true : false;
	};

	const createRCRows = useMemo((): RCHeader => {
		const rcRows = rateCards.reduce((result, rc) => {
			result[rc.id] = rc.rateCardLines.map((rcl) => {
				return {
					rcName: rc.name,
					rcId: rc.id,
					itemId: rcl.id,
					itemName: rcl.name,
					rateValue: rcl.rateValue,
					negValue:
						negotiation?.products[productId]?.rateCards[rc.id]?.rateCardLines[rcl.id]
							?.negotiated || 0,
					usageType: rcl.name,
					authId: rc.authId
				};
			});
			return result;
		}, {} as RCHeader);

		return rcRows;
	}, [negotiation.products[productId].rateCards]);

	const createColumns = (): CSDataTableColumnInterface[] => {
		return [
			{
				key: 'Item Name',
				render: (row): ReactElement => <>{row.data?.[0].rcName || 'N/A'}</>,
				header: 'Item Name'
			},
			{
				key: 'Original Value',
				render: (row): ReactElement => <>{''}</>,
				header: 'Original Value'
			},
			{
				key: 'Negotiated Value',
				render: (row): ReactElement => {
					return <>{''}</>;
				},
				header: 'Negotiated Value'
			},
			{
				key: 'Usage Type',
				render: (row): ReactElement => <>{''}</>,
				header: 'Usage Type'
			}
		];
	};

	const createRCLColumns = (): CSDataTableColumnInterface[] => {
		return [
			{
				key: 'Item Name',
				render: (row): ReactElement => <>{row.data?.itemName || 'N/A'}</>
			},
			{
				key: 'Original Value',
				render: (row): ReactElement => <>{row.data?.rateValue || 'N/A'}</>
			},
			{
				key: 'Negotiated Value',
				render: (row): ReactElement => {
					return (
						<>
							{row.data?.rateValue ? (
								<NegotiateInput
									negotiable={{
										original: row.data?.rateValue,
										negotiated: row.data?.negValue
									}}
									discountType="Amount"
									discountLevels={[] as Discount[]}
									isThresholdViolated={evaluateThreshold(
										row.data?.rcId,
										row.data?.itemId,
										row.data?.authId
									)}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(discount: Discount): void => {}}
									onNegotiatedChanged={(value: number): void =>
										negotiateRateCardLine(
											row.data?.rcId as string,
											row.data?.itemId,
											value
										)
									}
								/>
							) : (
								'N/A'
							)}
						</>
					);
				}
			},
			{
				key: 'Usage Type',
				render: (row): ReactElement => <>{row.data?.usageType || 'N/A'}</>
			}
		];
	};

	const getRateCardLines = (row: CSDataTableRowWithMetaInterface): ReactElement => {
		{
			return (
				<>
					<CSDataTable
						columns={createRCLColumns()}
						rows={row?.data?.map((rcl: RCLRowData) => ({
							key: rcl?.itemId,
							data: rcl
						}))}
					/>
				</>
			);
		}
	};

	return (
		<>
			<CSDataTable
				columns={createColumns()}
				rows={Object.entries(createRCRows).map(([id, rowData]) => ({
					key: id,
					data: rowData
				}))}
				collapsible={true}
				subsectionRender={getRateCardLines}
			/>
		</>
	);
}
