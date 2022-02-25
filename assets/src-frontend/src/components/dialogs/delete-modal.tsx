import {
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter,
	CSButton
} from '@cloudsense/cs-ui-components';
import React, { ReactElement } from 'react';
import { TabNames } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';

interface DeleteModalProps {
	isDeleteModalVisible: boolean;
	activeTab: TabNames;
	cancelHandler: () => void;
	confirmHandler: () => void;
}

export function DeleteModal(props: DeleteModalProps): ReactElement {
	const labels = useCustomLabels();

	const getLabel = (type: string): string => {
		if (props.activeTab === TabNames.products) {
			return type === 'delete' ? labels.btnDeleteProducts : labels.productsTitle;
		} else if (props.activeTab === TabNames.addonSA) {
			return type === 'delete' ? labels.btnDeleteAddons : labels.addonLabel;
		} else {
			return type === 'delete' ? labels.btnDeleteOffers : labels.offersTabTitle;
		}
	};

	const getTitle = (type: string): string => {
		switch (type) {
			case 'delete':
				return getLabel(type);
			case 'item':
				return getLabel(type);
			default:
				return '';
		}
	};

	return (
		<CSModal
			className="deleteModal"
			visible={props.isDeleteModalVisible}
			outerClickClose={true}
			onClose={props.cancelHandler}
		>
			<CSModalHeader title={getTitle('delete')} />
			<CSModalBody className="modalBody">
				{`${labels.deletionConfirmation} ${getTitle('item').toLowerCase()}`}
			</CSModalBody>
			<CSModalFooter>
				<CSButton label="Cancel" onClick={props.cancelHandler} />
				<CSButton
					label={getTitle('delete')}
					btnStyle="brand"
					onClick={props.confirmHandler}
				/>
			</CSModalFooter>
		</CSModal>
	);
}
