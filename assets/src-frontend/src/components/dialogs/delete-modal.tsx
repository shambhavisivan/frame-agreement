import {
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter,
	CSButton
} from '@cloudsense/cs-ui-components';
import React, { ReactElement } from 'react';

interface DeleteModalProps {
	isDeleteModalVisible: boolean;
	cancelHandler: () => void;
	confirmHandler: () => void;
}

export function DeleteModal(props: DeleteModalProps): ReactElement {
	return (
		<CSModal
			className="deleteModal"
			visible={props.isDeleteModalVisible}
			outerClickClose={true}
			onClose={props.cancelHandler}
		>
			<CSModalHeader title="Delete Products" />
			<CSModalBody className="modalBody">
				Are you sure you want to delete selected products?
			</CSModalBody>
			<CSModalFooter>
				<CSButton label="Cancel" onClick={props.cancelHandler} />
				<CSButton label="Delete Products" btnStyle="brand" onClick={props.confirmHandler} />
			</CSModalFooter>
		</CSModal>
	);
}
