import React, { ReactElement, useContext, useMemo } from 'react';
import { RateCard as IRateCard, Allowance } from '../../datasources';
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
	allowances?: Allowance[];
	productId: string;
	negotiateRateCardLine: (rateCardId: string, rateCardLineId: string, value: number) => void;
}

type RCLAllowanceRowData = {
	rcName: string | null;
	rcId: string | null;
	itemId: string;
	itemName: string;
	rateValue: number;
	negValue: number;
	usageType: string;
	authId?: string;
};

type RCHeader = { [id: string]: RCLAllowanceRowData[] | RCLAllowanceRowData };

export function RateCards({
	rateCards,
	allowances,
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

		const allowanceRows = allowances?.reduce((alRows, allowance) => {
			alRows[allowance.id] = {
				rcName: null,
				rcId: null,
				itemId: allowance.id,
				itemName: allowance.name,
				rateValue: allowance.amount,
				negValue: negotiation?.products[productId]?.allowances?.[allowance.id].value || 0,
				usageType: allowance.usageType.name,
				authId: ''
			};
			return alRows;
		}, {} as RCHeader);

		const allRows = { ...rcRows, ...allowanceRows };
		return allRows;
	}, [negotiation.products[productId].rateCards, negotiation.products[productId].allowances]);

	const createColumns = (): CSDataTableColumnInterface[] => {
		return [
			{
				key: 'Item Name',
				render: (row): ReactElement => (
					<>
						{Array.isArray(row.data)
							? row.data?.[0].rcName || 'N/A'
							: row.data?.itemName || 'N/A'}
					</>
				),
				header: 'Item Name'
			},
			{
				key: 'Original Value',
				render: (row): ReactElement => (
					<>{!Array.isArray(row.data) ? row.data?.rateValue || 'N/A' : ''}</>
				),
				header: 'Original Value'
			},
			{
				key: 'Negotiated Value',
				render: (row): ReactElement => {
					return <>{!Array.isArray(row.data) ? 'Not Applicable' : ''}</>;
				},
				header: 'Negotiated Value'
			},
			{
				key: 'Usage Type',
				render: (row): ReactElement => (
					<>{!Array.isArray(row.data) ? row.data?.usageType || 'N/A' : ''}</>
				),
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
			return Array.isArray(row?.data) ? (
				<>
					<CSDataTable
						columns={createRCLColumns()}
						rows={row?.data?.map((rcl: RCLAllowanceRowData) => ({
							key: rcl?.itemId,
							data: rcl
						}))}
					/>
				</>
			) : (
				((undefined as unknown) as ReactElement)
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
