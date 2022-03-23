import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useMemo, useRef } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { store } from './details-page-provider';
import { Negotiable, ChargeType } from './negotiation/details-reducer';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';
import { NegotiateInput } from './negotiation/negotiate-input';
import { Discount } from './negotiation/discount-validator';
import { useDiscountValidation } from '../../hooks/use-discount-validation';
import { useDiscountLevels } from '../../hooks/use-discount-levels';

type Props = {
	product: CommercialProductStandalone;
	oneOffChargeNegotiation: NegotiateProductActions['negotiateProductOneOff'];
	recurringChargeNegotiation: NegotiateProductActions['negotiateProductRecurring'];
};

type ProductNegotiationCharge = CommercialProductStandalone & {
	oneOffNeg: Negotiable['negotiated'];
	recurringNeg: Negotiable['negotiated'];
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

	const { validateProductThreshold } = useDiscountValidation();
	const { fetchValidProductDiscounts, applyProductDiscount } = useDiscountLevels();
	const currentChargeChanged = useRef<ChargeType | string>('');

	const evaluateThreshold = (chargeType: ChargeType): boolean => {
		const breachedThresholds = validateProductThreshold(product.id, 'products', chargeType);
		return breachedThresholds.length ? true : false;
	};

	const productWithNegotiation = useMemo((): ProductNegotiationCharge[] => {
		const productNegotiation = productState[product.id]?.product;

		const productNeg: ProductNegotiationCharge = {
			...product,
			oneOffNeg: productNegotiation?.oneOff?.negotiated,
			recurringNeg: productNegotiation?.recurring.negotiated
		};

		return [productNeg];
	}, [label.oneOffProduct, label.recurringProduct, product, productState]);

	const metadata = useMemo((): CSDataTableColumnInterface[] => {
		return [
			{
				key: label.productChargeHeaderName,
				render: (): ReactElement => <>{label.productLegacyChargeName}</>,
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
									discountLevels={fetchValidProductDiscounts(
										product.id,
										'products',
										'oneOff'
									)}
									isThresholdViolated={evaluateThreshold('oneOff')}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {
										currentChargeChanged.current = 'oneOff';
										const discountedValue = applyProductDiscount(
											product.id,
											'products',
											'oneOff',
											value
										);
										oneOffChargeNegotiation(discountedValue);
									}}
									onNegotiatedChanged={(value: number): void => {
										currentChargeChanged.current = 'oneOff';
										oneOffChargeNegotiation(value);
									}}
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
									discountLevels={fetchValidProductDiscounts(
										product.id,
										'products',
										'recurring'
									)}
									isThresholdViolated={evaluateThreshold('recurring')}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {
										currentChargeChanged.current = 'recurring';
										const discountedValue = applyProductDiscount(
											product.id,
											'products',
											'recurring',
											value
										);
										recurringChargeNegotiation(discountedValue);
									}}
									onNegotiatedChanged={(value): void => {
										currentChargeChanged.current = 'recurring';
										recurringChargeNegotiation(value);
									}}
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
