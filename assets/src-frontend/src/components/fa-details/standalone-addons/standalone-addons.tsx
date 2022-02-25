import { CSButton } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useState, useMemo } from 'react';
import { Addon } from '../../../datasources';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { useGetStandaloneAddons } from '../../../hooks/use-get-standalone-addons';
import { AddonGrid } from '../addon-grid';
import { store } from '../details-page-provider';
import { AddAddonsModal } from './add-addons-modal';
import { TabNames, SelectedAddons } from '../../../datasources';
import { DeleteModal } from '../../dialogs/delete-modal';

interface StandaloneAddonProps {
	activeTab: TabNames;
}

type TransformedAddons = { [id: string]: Addon };
export function StandaloneAddons(props: StandaloneAddonProps): ReactElement {
	const { standaloneAddons } = useGetStandaloneAddons();
	const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});
	const [openAddonModal, setOpenAddonModal] = useState(false);
	const labels = useCustomLabels();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

	const toggleAddonsModal = (): void => setOpenAddonModal((prevState) => !prevState);
	const {
		dispatch,
		negotiation: { addons }
	} = useContext(store);

	const onSelectAddons = (
		addOnList: Addon[],
		selectedValues: SelectedAddons,
		updaterFunc: (val: SelectedAddons) => void
	): void => {
		const modifySelection = addOnList.reduce(
			(accumulator, currentAddon) => {
				if (!accumulator[currentAddon.id]) {
					accumulator[currentAddon.id] = currentAddon;
				} else {
					delete accumulator[currentAddon.id];
				}

				return accumulator;
			},
			{ ...selectedValues }
		);

		updaterFunc({ ...modifySelection });
	};

	const onAddAddons = (addOnList: Addon[]): void => {
		dispatch({
			type: 'addAddonsToFa',
			payload: {
				addons: addOnList
			}
		});
	};

	const transformStandAloneAddons = useMemo((): TransformedAddons => {
		return (standaloneAddons || []).reduce((result, currentAddon) => {
			result[currentAddon.id] = currentAddon;
			return result;
		}, {} as TransformedAddons);
	}, [standaloneAddons]);

	const updateAddonsAdded = useMemo((): Addon[] => {
		const addonsToBeAddedToFa: Addon[] = [];
		if (Object.keys(transformStandAloneAddons).length) {
			Object.keys(addons || {}).forEach((addonId) => {
				addonsToBeAddedToFa.push(transformStandAloneAddons[addonId]);
			});
		}

		return addonsToBeAddedToFa;
	}, [addons, transformStandAloneAddons]);

	const isDisabled = (): boolean => {
		return Object.keys(selectedAddons).length ? false : true;
	};

	const filterUnusedAddons = (): Addon[] => {
		const storeAddOnIds = Object.keys(addons || {});
		return storeAddOnIds.length
			? standaloneAddons?.filter((ao) => !storeAddOnIds.includes(ao.id)) || []
			: [];
	};

	const addOnModal = (
		<AddAddonsModal
			isModalOpen={openAddonModal}
			addOnList={filterUnusedAddons()}
			onModalClose={toggleAddonsModal}
			onAddAddons={onAddAddons}
			onSelectAddonsFunc={onSelectAddons}
		/>
	);

	const deleteAddonCancelHandler = (): void => {
		setIsDeleteModalOpen(false);
		//TODO: to be implemented
	};
	const deleteAddonConfirmationHandler = (): void => {
		setIsDeleteModalOpen(false);
		//TODO: to be implemented
	};

	const deletionModal = (
		<DeleteModal
			isDeleteModalVisible={isDeleteModalOpen}
			confirmHandler={deleteAddonConfirmationHandler}
			cancelHandler={deleteAddonCancelHandler}
			activeTab={props.activeTab}
		/>
	);

	return (
		<>
			{updateAddonsAdded.length && (
				<AddonGrid
					addonList={updateAddonsAdded || []}
					isCollapsible={true}
					onSelectRow={(event, row): void =>
						onSelectAddons(row, selectedAddons, setSelectedAddons)
					}
					selectedAddonIds={Object.values(selectedAddons).map((addon) => addon.id)}
				/>
			)}
			{addOnModal}
			{isDeleteModalOpen && deletionModal}
			{props.activeTab === TabNames.addonSA && (
				<CSButton size="large" label={labels.btnAddAddons} onClick={toggleAddonsModal} />
			)}
			{props.activeTab === TabNames.addonSA && (
				<CSButton
					label={labels.btnDeleteAddons}
					size="large"
					onClick={(): void => setIsDeleteModalOpen(true)}
					disabled={isDisabled()}
				/>
			)}
		</>
	);
}
