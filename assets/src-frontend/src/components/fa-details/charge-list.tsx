import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useMemo } from 'react';
import { Charge } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { store } from './details-page-provider';
import { Negotiable } from './negotiation/details-reducer';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';
import { NegotiateInput } from './negotiation/negotiate-input';
import { Discount } from './negotiation/discount-validator';

interface ChargeProp {
	chargeList: Charge[];
	productId: string;
	negotiateOneOffCharge: NegotiateProductActions['negotiateAdvancedOneOffCharge'];
	negotiateRecurringCharge: NegotiateProductActions['negotiateAdvancedRecurringCharge'];
}
// type for storing charge and negotiation information.
type ChargeT = Charge & {
	oneOffNeg: Negotiable['negotiated'];
	recurringNeg: Negotiable['negotiated'];
};

export function ChargeList({
	chargeList,
	productId,
	negotiateOneOffCharge,
	negotiateRecurringCharge
}: ChargeProp): ReactElement {
	const {
		negotiation: { products }
	} = useContext(store);
	const label = useCustomLabels();

	const createData = useMemo((): ChargeT[] => {
		const charges = products[productId]?.charges || {};
		return chargeList.reduce((result, charge): ChargeT[] => {
			const { id } = charge;
			const chargeDetails = charges[id] || {};

			if (!chargeDetails) {
				return result;
			}
			const negotiatedOneOffCharge = charges[id]?.oneOff?.negotiated || null;
			const negotiatedRecurring = charges[id]?.recurring?.negotiated || null;

			result.push({
				...charge,
				...{
					oneOffNeg: negotiatedOneOffCharge,
					recurringNeg: negotiatedRecurring
				}
			});
			return result;
		}, [] as ChargeT[]);
	}, [chargeList, productId, products, products[productId].charges]);

	const metadata = useMemo((): CSDataTableColumnInterface[] => {
		return [
			{
				key: label.chargesHeaderName,
				render: (row): ReactElement => <>{row.data?.name || 'N/A'}</>,
				header: label.chargesHeaderName
			},
			{
				key: label.chargesHeaderOneOff,
				render: (row): ReactElement => <>{row.data?.oneOff || 'N/A'}</>,
				header: label.chargesHeaderOneOff
			},
			{
				key: label.chargesHeaderNeg,
				render: (row): ReactElement => {
					const negotiatedCharge = products[productId].charges;
					let oneOffNegotiated;
					if (
						row.data?.oneOff &&
						negotiatedCharge &&
						Object.values(negotiatedCharge || {}).length
					) {
						oneOffNegotiated = negotiatedCharge[row?.data?.id]?.oneOff?.negotiated || 0;
					}

					return (
						<>
							{row.data?.oneOff ? (
								<NegotiateInput
									negotiable={{
										negotiated: oneOffNegotiated,
										original: row.data?.oneOff
									}}
									discountType={row.data?.discountType}
									discountLevels={[] as Discount[]}
									isThresholdViolated={false}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void =>
										negotiateOneOffCharge(value, row.data?.id)
									}
								/>
							) : (
								'N/A'
							)}
						</>
					);
				},
				header: label.chargesHeaderNeg
			},
			{
				key: label.chargesHeaderRecc,
				render: (row): ReactElement => <>{row.data?.recurring || 'N/A'}</>,
				header: label.chargesHeaderRecc
			},
			{
				key: label.chargesHeaderReccNeg,
				render: (row): ReactElement => {
					const negotiatedCharge = products[productId].charges;
					let reccurringNeg;
					if (
						row.data?.recurring &&
						negotiatedCharge &&
						Object.values(negotiatedCharge || {}).length
					) {
						reccurringNeg = negotiatedCharge[row?.data?.id]?.recurring?.negotiated || 0;
					}
					return (
						<>
							{row.data?.recurring ? (
								<NegotiateInput
									negotiable={{
										negotiated: reccurringNeg,
										original: row.data?.recurring
									}}
									discountType={row.data?.discountType}
									discountLevels={[] as Discount[]}
									isThresholdViolated={false}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void =>
										negotiateRecurringCharge(value, row.data?.id)
									}
								/>
							) : (
								'N/A'
							)}
						</>
					);
				},
				header: label.chargesHeaderReccNeg
			}
		];
	}, []);

	return (
		<div>
			<CSDataTable
				columns={metadata}
				rows={createData.map((row) => ({
					key: row.id,
					data: row
				}))}
			/>
		</div>
	);
}
