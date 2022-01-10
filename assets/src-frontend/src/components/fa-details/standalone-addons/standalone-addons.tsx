import { CSButton } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useState } from 'react';
import { Addon } from '../../../datasources';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { useGetStandaloneAddons } from '../../../hooks/use-get-standalone-addons';
import { AddonGrid } from '../addon-grid';
import { store } from '../details-page-provider';
import { AddAddonsModal } from './add-addons-modal';

export function StandaloneAddons(): ReactElement {
	const { standaloneAddons } = useGetStandaloneAddons();
	const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
	const [openAddonModal, setOpenAddonModal] = useState(false);
	const labels = useCustomLabels();

	const toggleAddonsModal = (): void => setOpenAddonModal((prevState) => !prevState);
	const { dispatch } = useContext(store);

	const onAddAddons = (addOnList: Addon[]): void => {
		setSelectedAddons((prevState): Addon[] => [...prevState, ...addOnList]);
		dispatch({
			type: 'addAddonsToFa',
			payload: {
				addons: addOnList
			}
		});
	};

	const addOnModal = (
		<AddAddonsModal
			isModalOpen={openAddonModal}
			addOnList={standaloneAddons || []}
			onModalClose={toggleAddonsModal}
			onAddAddons={onAddAddons}
		/>
	);

	return (
		<>
			<AddonGrid addonList={selectedAddons || []} />
			{addOnModal}
			<CSButton label={labels.btnAddAddons} onClick={toggleAddonsModal} />
		</>
	);
}
