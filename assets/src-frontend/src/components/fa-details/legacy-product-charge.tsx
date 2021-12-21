import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useMemo } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { store } from './details-page-provider';
import { Negotiation } from './negotiation';
import { Negotiable } from './negotiation/details-reducer';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';

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
								<Negotiation
									negotiable={{
										negotiated: oneOffNegotiated,
										original: row.data?.oneOffCharge
									}}
									onNegotiatedChanged={(value): void =>
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
								<Negotiation
									negotiable={{
										negotiated: reccurringNeg,
										original: row.data?.recurringCharge
									}}
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
	}, []);

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
