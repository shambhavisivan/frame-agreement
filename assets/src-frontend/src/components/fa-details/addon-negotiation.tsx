import React, { ReactElement, useContext, useMemo } from 'react';
import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';
import { Addon, AddonType } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { store } from './details-page-provider';
import { NegotiateInput } from './negotiation/negotiate-input';
import { Discount } from './negotiation/discount-validator';
import { useDiscountValidation } from '../../hooks/use-discount-validation';
import { ChargeType, Negotiable, NegotiableCharges } from './negotiation/details-reducer';

type Props = {
	productId?: string;
	addons: Array<Addon>;
	addonNegotiations: {
		[addonId: string]: NegotiableCharges;
	};
	addonType: AddonType;
};

type AddonNegotiationCharge = Addon & {
	oneOffNeg: Negotiable['negotiated'];
	recurringNeg: Negotiable['negotiated'];
	chargeType: string;
};

export function AddonNegotiation({
	productId,
	addons,
	addonNegotiations,
	addonType
}: Props): ReactElement {
	const { dispatch } = useContext(store);
	const label = useCustomLabels();
	const { validateAddonThreshold } = useDiscountValidation();

	const evaluateThreshold = (
		addonId: string,
		referenceId: string,
		chargeType: ChargeType
	): boolean => {
		const breachedThresholds = validateAddonThreshold(
			addonId,
			referenceId,
			chargeType,
			addonType,
			productId
		);

		return breachedThresholds.length ? true : false;
	};

	const getReferenceId = (addon: Addon): string => {
		return addonType === 'COMMERCIAL_PRODUCT_ASSOCIATED'
			? (addon.commercialProductAssociationId as string)
			: addon.id;
	};

	const addonWithNegotiation = useMemo((): AddonNegotiationCharge[] => {
		return addons.reduce((addonAccumulator, addon) => {
			const referenceId: string = getReferenceId(addon);
			const productOneOff: AddonNegotiationCharge = {
				...addon,
				oneOffNeg: addonNegotiations?.[referenceId]?.oneOff?.negotiated,
				chargeType: label.oneOffProduct,
				recurringNeg: addonNegotiations?.[referenceId]?.recurring?.negotiated
			};
			addonAccumulator.push(productOneOff);

			return addonAccumulator;
		}, [] as AddonNegotiationCharge[]);
	}, [label.oneOffProduct, label.recurringProduct, addons, addonNegotiations]);

	const metadata = useMemo((): CSDataTableColumnInterface[] => {
		return [
			{
				key: label.addonsHeaderName,
				render: (row): ReactElement => <>{row.data?.name}</>,
				header: label.addonsHeaderName
			},
			{
				key: label.addonsHeaderOneOff,
				render: (row): ReactElement => <>{row.data?.oneOffCharge || 'N/A'}</>,
				header: label.addonsHeaderOneOff
			},
			{
				key: label.addonsHeaderOneOffNeg,
				render: (row): ReactElement => {
					const referenceId: string = getReferenceId(row.data as Addon);
					const oneOffNegotiated =
						addonNegotiations?.[referenceId]?.oneOff?.negotiated || 0;

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
									isThresholdViolated={evaluateThreshold(
										row.data.id as string,
										referenceId,
										'oneOff'
									)}
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void => {
										if (addonType === 'COMMERCIAL_PRODUCT_ASSOCIATED') {
											dispatch({
												type: 'negotiateProductAddonOneOff',
												payload: {
													itemType: 'products',
													productId: productId as string,
													productAddonAssociationId: referenceId,
													value
												}
											});
										} else if (addonType === 'STANDALONE') {
											dispatch({
												type: 'negotiateAddonOneOff',
												payload: {
													addonId: referenceId,
													value
												}
											});
										}
									}}
								/>
							) : (
								'N/A'
							)}
						</>
					);
				},
				header: label.addonsHeaderOneOffNeg
			},
			{
				key: label.addonsHeaderRecc,
				render: (row): ReactElement => <>{row.data?.recurringCharge || 'N/A'}</>,
				header: label.addonsHeaderRecc
			},
			{
				key: label.addonsHeaderReccNeg,
				render: (row): ReactElement => {
					const referenceId: string = getReferenceId(row.data as Addon);
					const reccurringNeg =
						addonNegotiations?.[referenceId]?.recurring?.negotiated || 0;

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
									isThresholdViolated={evaluateThreshold(
										row.data.id as string,
										referenceId,
										'oneOff'
									)}
									/*
									 * TODO: onDiscountSelectionChanged method implementation will be done in future.
									 * the same applies to other components where NegotiateInput has been used.
									 */
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void => {
										if (addonType === 'COMMERCIAL_PRODUCT_ASSOCIATED') {
											dispatch({
												type: 'negotiateProductAddonRecurring',
												payload: {
													itemType: 'products',
													productId: productId as string,
													productAddonAssociationId: referenceId,
													value
												}
											});
										} else if (addonType === 'STANDALONE') {
											dispatch({
												type: 'negotiateAddonRecurring',
												payload: {
													addonId: referenceId,
													value
												}
											});
										}
									}}
								/>
							) : (
								'N/A'
							)}
						</>
					);
				},
				header: label.addonsHeaderReccNeg
			}
		];
	}, [
		addons,
		label.productChargeHeaderName,
		label.productChargeHeaderOneOff,
		label.productChargeHeaderOneOffNeg,
		label.productChargeHeaderRecc,
		label.productChargeHeaderReccNeg
	]);

	return (
		<>
			<CSDataTable
				columns={metadata}
				rows={addonWithNegotiation.map((row) => ({
					key: row.id,
					data: row
				}))}
			/>
		</>
	);
}
