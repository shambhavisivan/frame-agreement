import {
	CSButton,
	CSInputText,
	CSModal,
	CSModalBody,
	CSModalFooter,
	CSModalHeader
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useEffect, useState } from 'react';
import { Addon } from '../../../datasources';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { AddonGrid } from '../addon-grid';

type Props = {
	addOnList: Addon[];
	isModalOpen: boolean;
	onModalClose: () => void;
	onAddAddons: (addOnList: Addon[]) => void;
};

type SelectedAddons = {
	[id: string]: Addon;
};

export function AddAddonsModal({
	addOnList,
	isModalOpen,
	onModalClose,
	onAddAddons
}: Props): ReactElement {
	const labels = useCustomLabels();
	const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});
	const [addOnsToLoad, setAddonsToLoad] = useState<Addon[]>([]);

	useEffect(() => {
		setAddonsToLoad(addOnList);
	}, [addOnList]);

	const onSelectAddons = (addOnList: Addon[]): void => {
		const modifySelection = addOnList.reduce(
			(accumulator, currentAddon) => {
				if (!accumulator[currentAddon.id]) {
					accumulator[currentAddon.id] = currentAddon;
				} else {
					delete accumulator[currentAddon.id];
				}

				return accumulator;
			},
			{ ...selectedAddons }
		);

		setSelectedAddons({ ...modifySelection });
	};

	const onFilter = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
		if (value.length) {
			const filteredAddons = addOnsToLoad.filter((addon) => addon.name.includes(value));
			setAddonsToLoad(filteredAddons);
			return;
		}
		setAddonsToLoad(addOnList);
	};

	return (
		<CSModal
			visible={isModalOpen}
			outerClickClose
			size="medium"
			className="product-selection-modal"
		>
			<CSModalHeader title={labels.modalAddAddonsTitle} />
			<CSInputText
				label={labels.modalAddAddonsInputSearchPlaceholder}
				labelHidden
				placeholder={labels.modalAddAddonsInputSearchPlaceholder}
				onChange={onFilter}
			/>
			<CSModalBody padding="0">
				<AddonGrid
					addonList={addOnsToLoad}
					selectedAddonIds={Object.values(selectedAddons).map((addon) => addon.id)}
					onSelectRow={(event, row): void => onSelectAddons(row)}
				/>
			</CSModalBody>
			<CSModalFooter>
				<CSButton
					label={labels.btnAddAddons}
					disabled={!Object.values(selectedAddons)?.length}
					onClick={(): void => {
						onAddAddons(Object.values(selectedAddons));
						onModalClose();
					}}
				/>
				<CSButton label={labels.btnClose} onClick={onModalClose} />
			</CSModalFooter>
		</CSModal>
	);
}
