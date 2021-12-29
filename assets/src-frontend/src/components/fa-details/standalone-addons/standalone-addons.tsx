import { CSButton } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useState } from 'react';
import { QueryStatus } from 'react-query';
import { Addon } from '../../../datasources';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { useGetStandaloneAddons } from '../../../hooks/use-get-standalone-addons';
import { AddonGrid } from '../addon-grid';
import { AddAddonsModal } from './add-addons-modal';

export function StandaloneAddons(): ReactElement {
	const { standaloneAddons, status } = useGetStandaloneAddons();
	const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
	const [openAddonModal, setOpenAddonModal] = useState(false);
	const labels = useCustomLabels();

	const toggleAddonsModal = (): void => setOpenAddonModal((prevState) => !prevState);

	const onAddAddons = (addOnList: Addon[]): void => {
		setSelectedAddons((prevState): Addon[] => [...prevState, ...addOnList]);
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
			{status === QueryStatus.Success && (
				<AddonGrid addonList={Object.values(selectedAddons) || []} />
			)}
			{addOnModal}
			<CSButton label={labels.btnAddAddons} onClick={toggleAddonsModal} />
		</>
	);
}
