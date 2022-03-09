import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useMemo } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { store } from './details-page-provider';
import { Negotiable } from './negotiation/details-reducer';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';
import { NegotiateInput } from './negotiation/negotiate-input';
import { Discount } from './negotiation/discount-validator';

type Props = {
	product: CommercialProductStandalone;
	oneOffChargeNegotiation: NegotiateProductActions['negotiateProductOneOff'];
	recurringChargeNegotiation: NegotiateProductActions['negotiateProductRecurring'];
};

type ProductNegotiationCharge = CommercialProductStandalone & {
	oneOffNeg: Negotiable['negotiated'];
	recurringNeg: Negotiable['negotiated'];
	chargeType: string;
};

export function LegacyProductCharge({
	product,
	oneOffChargeNegotiation,
	recurringChargeNegotiation
}: Props): ReactElement {
	const {
		negotiation: { products: productState }
	} = useContext(store);
	const label = useCustomLabels();

	const productWithNegotiation = useMemo((): ProductNegotiationCharge[] => {
		const productNegotiation = productState[product.id]?.product;

		const productOneOff: ProductNegotiationCharge = {
			...product,
			oneOffNeg: productNegotiation?.oneOff?.negotiated,
			chargeType: label.oneOffProduct,
			recurringCharge: undefined,
			recurringNeg: null
		};
		const productRecurring: ProductNegotiationCharge = {
			...product,
			oneOffNeg: null,
			oneOffCharge: undefined,
			recurringNeg: productNegotiation?.recurring.negotiated,
			chargeType: label.recurringProduct
		};

		return [productOneOff, productRecurring];
	}, [label.oneOffProduct, label.recurringProduct, product, productState]);

	const metadata = useMemo((): CSDataTableColumnInterface[] => {
		return [
			{
				key: label.productChargeHeaderName,
				render: (row): ReactElement => <>{row.data?.chargeType}</>,
				header: label.productChargeHeaderName
			},
			{
				key: label.productChargeHeaderOneOff,
				render: (row): ReactElement => <>{row.data?.oneOffCharge || 'N/A'}</>,
				header: label.productChargeHeaderOneOff
			},
			{
				key: label.productChargeHeaderOneOffNeg,
				render: (row): ReactElement => {
					const oneOffNegotiated =
						productState[product.id]?.product?.oneOff?.negotiated || 0;

					return (
						<>
							{row.data?.oneOffCharge && row.data.isOneOffDiscountAllowed ? (
								<NegotiateInput
									negotiable={{
										negotiated: oneOffNegotiated,
										original: row.data?.oneOffCharge
									}}
									discountType={row.data?.discountType}
									discountLevels={[] as Discount[]}
									isThresholdViolated={false}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value: number): void =>
										oneOffChargeNegotiation(value)
									}
								/>
							) : (
								'N/A'
							)}
						</>
					);
				},
				header: label.productChargeHeaderOneOffNeg
			},
			{
				key: label.productChargeHeaderRecc,
				render: (row): ReactElement => <>{row.data?.recurringCharge || 'N/A'}</>,
				header: label.productChargeHeaderRecc
			},
			{
				key: label.productChargeHeaderReccNeg,
				render: (row): ReactElement => {
					const reccurringNeg =
						productState[product.id]?.product?.recurring?.negotiated || 0;

					return (
						<>
							{row.data?.recurringCharge && row.data.isRecurringDiscountAllowed ? (
								<NegotiateInput
									negotiable={{
										negotiated: reccurringNeg,
										original: row.data?.recurringCharge
									}}
									discountType={row.data?.discountType}
									discountLevels={[] as Discount[]}
									isThresholdViolated={false}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void =>
										recurringChargeNegotiation(value)
									}
								/>
							) : (
								'N/A'
							)}
						</>
					);
				},
				header: label.productChargeHeaderReccNeg
			}
		];
	}, [productState]);

	return (
		<>
			<CSDataTable
				columns={metadata}
				rows={productWithNegotiation.map((row) => ({
					key: row.id,
					data: row
				}))}
			/>
		</>
	);
}
