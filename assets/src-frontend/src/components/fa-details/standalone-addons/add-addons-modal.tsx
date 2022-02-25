import {
	CSButton,
	CSInputText,
	CSModal,
	CSModalBody,
	CSModalFooter,
	CSModalHeader
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useEffect, useState } from 'react';
import { Addon, SelectedAddons } from '../../../datasources';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { AddonGrid } from '../addon-grid';

type Props = {
	addOnList: Addon[];
	isModalOpen: boolean;
	onModalClose: () => void;
	onAddAddons: (addOnList: Addon[]) => void;
	onSelectAddonsFunc: (
		addOnList: Addon[],
		selectedAddons: SelectedAddons,
		updaterFunc: (val: SelectedAddons) => void
	) => void;
};

export function AddAddonsModal({
	addOnList,
	isModalOpen,
	onModalClose,
	onAddAddons,
	onSelectAddonsFunc
}: Props): ReactElement {
	const labels = useCustomLabels();
	const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});
	const [addOnsToLoad, setAddonsToLoad] = useState<Addon[]>([]);
	const [addonsAddedFromModal, setAddonsAddedFromModal] = useState<boolean>(false);

	useEffect(() => {
		if (addonsAddedFromModal) {
			setSelectedAddons({});
			setAddonsAddedFromModal(false);
		}
	}, [addonsAddedFromModal]);

	useEffect(() => {
		setAddonsToLoad(addOnList);
	}, [addOnList]);

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
					onSelectRow={(event, row): void =>
						onSelectAddonsFunc(row, selectedAddons, setSelectedAddons)
					}
				/>
			</CSModalBody>
			<CSModalFooter>
				<CSButton
					label={labels.btnAddAddons}
					disabled={!Object.values(selectedAddons)?.length}
					onClick={(): void => {
						onAddAddons(Object.values(selectedAddons));
						setAddonsAddedFromModal(true);
						onModalClose();
					}}
				/>
				<CSButton label={labels.btnClose} onClick={onModalClose} />
			</CSModalFooter>
		</CSModal>
	);
}
