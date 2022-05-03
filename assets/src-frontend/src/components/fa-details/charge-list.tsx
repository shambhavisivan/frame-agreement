import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useMemo } from 'react';
import { Charge, ChargeT } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { store } from './details-page-provider';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';
import { NegotiateInput } from './negotiation/negotiate-input';
import { Discount } from './negotiation/discount-validator';
import { useDiscountValidation } from '../../hooks/use-discount-validation';

interface ChargeProp {
	chargeList: Charge[];
	productId: string;
	negotiateOneOffCharge: NegotiateProductActions['negotiateAdvancedOneOffCharge'];
	negotiateRecurringCharge: NegotiateProductActions['negotiateAdvancedRecurringCharge'];
}

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

	const { validateProductThresholdForAdvancedCharges } = useDiscountValidation();

	const evaluateThreshold = (charge: ChargeT): boolean => {
		const breachedThresholds = validateProductThresholdForAdvancedCharges(productId, charge);

		return breachedThresholds.length ? true : false;
	};

	const createData = useMemo((): ChargeT[] => {
		const charges = products[productId]?.charges || {};
		return chargeList.reduce((result, charge): ChargeT[] => {
			const { id, name, chargeType, oneOff, recurring } = charge;
			const chargeDetails = charges[id] || {};

			if (!chargeDetails) {
				return result;
			}
			const negotiatedOneOffCharge = charges[id]?.oneOff?.negotiated || null;
			const negotiatedRecurring = charges[id]?.recurring?.negotiated || null;

			result.push({
				id: id,
				name: name,
				chargeType: chargeType.toLowerCase().startsWith('recurring')
					? 'recurring'
					: 'oneOff',
				oneOff: {
					original: oneOff,
					negotiated: negotiatedOneOffCharge
				},
				recurring: {
					original: recurring,
					negotiated: negotiatedRecurring
				}
			});
			return result;
		}, [] as ChargeT[]);
	}, [JSON.stringify(chargeList), productId, JSON.stringify(products[productId].charges)]);

	const metadata = useMemo((): CSDataTableColumnInterface[] => {
		return [
			{
				key: label.chargesHeaderName,
				render: (row): ReactElement => <>{row.data?.name || 'N/A'}</>,
				header: label.chargesHeaderName
			},
			{
				key: label.chargesHeaderOneOff,
				render: (row): ReactElement => <>{row.data?.oneOff.original || 'N/A'}</>,
				header: label.chargesHeaderOneOff
			},
			{
				key: label.chargesHeaderNeg,
				render: (row): ReactElement => {
					const oneOffNegotiated = row?.data?.oneOff?.negotiated || 0;
					return (
						<>
							{row.data?.oneOff.original ? (
								<NegotiateInput
									negotiable={{
										negotiated: oneOffNegotiated,
										original: row.data?.oneOff?.original
									}}
									discountType={row.data?.discountType}
									discountLevels={[] as Discount[]}
									isThresholdViolated={evaluateThreshold(
										(row.data as ChargeT) || ({} as ChargeT)
									)}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void => {
										negotiateOneOffCharge(value, row.data?.id);
									}}
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
				render: (row): ReactElement => <>{row.data?.recurring.original || 'N/A'}</>,
				header: label.chargesHeaderRecc
			},
			{
				key: label.chargesHeaderReccNeg,
				render: (row): ReactElement => {
					const reccurringNeg = row?.data?.recurring?.negotiated || 0;
					return (
						<>
							{row.data?.recurring.original ? (
								<NegotiateInput
									negotiable={{
										negotiated: reccurringNeg,
										original: row.data?.recurring?.original
									}}
									discountType={row.data?.discountType}
									discountLevels={[] as Discount[]}
									isThresholdViolated={evaluateThreshold(
										//'recurring',
										(row.data as ChargeT) || ({} as ChargeT)
									)}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void => {
										negotiateRecurringCharge(value, row.data?.id);
									}}
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
	}, [JSON.stringify(products[productId].charges)]);

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
