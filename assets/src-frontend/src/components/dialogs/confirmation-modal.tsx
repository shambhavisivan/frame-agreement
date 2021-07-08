import {
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSButton,
	CSModalFooter
} from '@cloudsense/cs-ui-components';
import React, { ReactElement } from 'react';

export function ConfirmationModal({
	open,
	message,
	title,
	confirmText,
	onClose,
	onConfirm
}: {
	open: boolean;
	message: string;
	title: string;
	confirmText: string;
	onClose: () => void;
	onConfirm: () => void;
}): ReactElement {
	return (
		<CSModal visible={open} onClose={onClose} outerClickClose size="small">
			<CSModalHeader title={title}></CSModalHeader>
			<CSModalBody padding="2rem 1rem 0.75rem 1rem">{message}</CSModalBody>
			<CSModalFooter>
				<CSButton label={confirmText} btnStyle="initial" onClick={onConfirm} />
				<CSButton label="Cancel" btnStyle="brand" onClick={onClose} />
			</CSModalFooter>
		</CSModal>
	);
}
