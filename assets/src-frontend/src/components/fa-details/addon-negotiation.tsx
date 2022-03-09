import React, { ReactElement, useContext, useMemo } from 'react';
import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';
import { Addon } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { store } from './details-page-provider';
import { NegotiateInput } from './negotiation/negotiate-input';
import { Discount } from './negotiation/discount-validator';

type Props = {
	addon: Addon;
};

export function AddonNegotiation({ addon }: Props): ReactElement {
	const {
		negotiation: { addons },
		dispatch
	} = useContext(store);
	const label = useCustomLabels();

	const metadata = useMemo((): CSDataTableColumnInterface[] => {
		return [
			{
				key: label.addonsHeaderName,
				render: (row): ReactElement => <>{row.data?.name}</>,
				header: label.productChargeHeaderName
			},
			{
				key: label.addonsHeaderOneOff,
				render: (row): ReactElement => <>{row.data?.oneOffCharge || 'N/A'}</>,
				header: label.addonsHeaderOneOff
			},
			{
				key: label.addonsHeaderOneOffNeg,
				render: (row): ReactElement => {
					const oneOffNegotiated = addons[addon.id]?.oneOff?.negotiated || 0;

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
									onNegotiatedChanged={(value): void =>
										dispatch({
											type: 'negotiateAddonOneOff',
											payload: {
												addonId: addon.id,
												value
											}
										})
									}
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
					const reccurringNeg = addons[addon.id]?.recurring?.negotiated || 0;

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
									/*
									 * TODO: onDiscountSelectionChanged method implementation will be done in future.
									 * the same applies to other components where NegotiateInput has been used.
									 */
									//eslint-disable-next-line @typescript-eslint/no-empty-function
									onDiscountSelectionChanged={(value: Discount): void => {}}
									onNegotiatedChanged={(value): void =>
										dispatch({
											type: 'negotiateAddonRecurring',
											payload: {
												addonId: addon.id,
												value
											}
										})
									}
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
		addon.id,
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
				rows={[
					{
						key: addon.id,
						data: addon
					}
				]}
			/>
		</>
	);
}
