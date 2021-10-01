import React, { ReactElement, useEffect, useState } from 'react';
import { DiscountType } from '../../../datasources';
import { useAppSettings } from '../../../hooks/use-app-settings';
import { useUserLocale } from '../../../hooks/use-user-locale';
import { isNotUndefinedOrNull } from '../../app-utils';
import { LoadingFallback } from '../../loading-fallback';
import { Discount } from './discount-validator';
import { NegotiateDiff } from './negotiate-diff';
import { NegotiateLevel } from './negotiate-level';
import { NegotiateValue } from './negotiate-value';
import { Negotiable } from './negotiation-reducer';

export interface NegotiateInputProps {
	negotiable: Negotiable;
	discountType: DiscountType;
	discountLevels: Discount[];
	isThresholdViolated: boolean;
	onDiscountSelectionChanged: (discount: Discount) => void;
	onNegotiatedChanged: (value: number) => void;
}

export function NegotiateInput({
	negotiable,
	discountType,
	discountLevels,
	isThresholdViolated,
	onDiscountSelectionChanged,
	onNegotiatedChanged
}: NegotiateInputProps): ReactElement {
	const [isMinMaxEnabled, setMinMaxEnabled] = useState(true);
	const [isDiscountAsPriceEnabled, setDiscountAsPriceEnabled] = useState(false);

	const { settings } = useAppSettings();
	const { locale, status: localeStatus } = useUserLocale();

	useEffect(() => {
		setMinMaxEnabled(settings?.facSettings?.inputMinmaxRestriction || true);
		setDiscountAsPriceEnabled(settings?.facSettings?.discountAsPrice || false);
	}, [settings?.facSettings?.inputMinmaxRestriction, settings?.facSettings?.discountAsPrice]);

	const negotiatedDiffAmount =
		(negotiable?.original || 0) -
		(isNotUndefinedOrNull(negotiable?.negotiated)
			? (negotiable.negotiated as number)
			: negotiable?.original || 0);

	return (
		<div style={{ display: 'flex', margin: '2px' }}>
			<LoadingFallback status={localeStatus}>
				<div>
					<NegotiateValue
						negotiatedValue={
							isNotUndefinedOrNull(negotiable.negotiated)
								? (negotiable.negotiated as number)
								: isNotUndefinedOrNull(negotiable.original)
								? (negotiable.original as number)
								: 0
						}
						locale={locale}
						onNegotiatedChanged={onNegotiatedChanged}
						isEnabled={!discountLevels?.length}
						minValue={isMinMaxEnabled ? 0 : undefined}
						maxValue={
							isMinMaxEnabled
								? discountType === 'Amount'
									? negotiable.original
									: 100
								: undefined
						}
					/>
					{!!negotiatedDiffAmount && (
						<NegotiateDiff
							isThresholdViolated={isThresholdViolated}
							negotiable={negotiable}
						/>
					)}
				</div>
				{!!discountLevels?.length && (
					<div style={{ display: 'flex', alignItems: 'center', margin: '1px' }}>
						<NegotiateLevel
							originalAmount={negotiable?.original || 0}
							discounts={discountLevels}
							isDiscountAsPriceEnabled={isDiscountAsPriceEnabled}
							onDiscountSelectionChanged={onDiscountSelectionChanged}
							onDiscountCleared={(): void =>
								onNegotiatedChanged(negotiable?.original || 0)
							}
						/>
					</div>
				)}
			</LoadingFallback>
		</div>
	);
}
