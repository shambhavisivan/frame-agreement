import { CSButton, CSDropdown } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useEffect, useState } from 'react';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { Discount } from './discount-validator';

export interface NegotiateLevelProps {
	originalAmount: number;
	discounts: Discount[];
	isDiscountAsPriceEnabled: boolean;
	onDiscountSelectionChanged: (discount: Discount) => void;
	onDiscountCleared: () => void;
}

export function NegotiateLevel({
	originalAmount,
	discounts,
	isDiscountAsPriceEnabled,
	onDiscountSelectionChanged,
	onDiscountCleared
}: NegotiateLevelProps): ReactElement {
	const [selectedDiscountIndex, setSelectedDiscountIndex] = useState<number | null>(null);
	const [discountLevels, setDiscountLevels] = useState<Discount[]>(discounts);
	const [displayDiscounts, setDisplayDiscounts] = useState<string[]>([]);
	const labels = useCustomLabels();

	useEffect(() => {
		let displayDiscounts: string[];
		if (isDiscountAsPriceEnabled) {
			displayDiscounts = discounts.map((discount) =>
				discount.discountType === 'Percentage'
					? `${(originalAmount * (100 - discount.discountValue)) / 100}`
					: `${originalAmount - discount.discountValue}`
			);
		} else {
			displayDiscounts = discounts.map((discount) =>
				discount.discountType === 'Percentage'
					? `-${discount.discountValue}%`
					: `-${discount.discountValue}`
			);
		}
		setDiscountLevels(discounts);
		setDisplayDiscounts(displayDiscounts);
	}, [isDiscountAsPriceEnabled, discounts, originalAmount]);

	const onSelectDiscount = (discountIndex: number): void => {
		setSelectedDiscountIndex(discountIndex);
		onDiscountSelectionChanged(discountLevels[discountIndex]);
	};

	const onClearDiscount = (): void => {
		setSelectedDiscountIndex(null);
		onDiscountCleared();
	};

	return (
		<div>
			<CSDropdown
				label={
					selectedDiscountIndex !== null
						? displayDiscounts[selectedDiscountIndex]
						: labels.dropdownNoSelection
				}
				iconPosition="right"
			>
				<CSButton label={labels.dropdownNoSelection} onClick={onClearDiscount} />
				{displayDiscounts?.map((discount, index) => (
					<CSButton
						key={String(index)}
						label={discount}
						onClick={(): void => onSelectDiscount(index)}
					/>
				))}
			</CSDropdown>
		</div>
	);
}
