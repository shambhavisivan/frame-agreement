import {
	CSButton,
	CSModal,
	CSModalHeader,
	CSModalBody,
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
		<CSModal
			visible={open}
			onClose={onClose}
			outerClickClose
			size="xsmall"
			className="confirmation-modal"
		>
			<CSModalHeader title={title} />
			<CSModalBody padding="1.5rem 1rem">
				<span>{message}</span>
			</CSModalBody>
			<CSModalFooter>
				<CSButton label="Cancel" onClick={onClose} />
				<CSButton label={confirmText} btnStyle="brand" onClick={onConfirm} />
			</CSModalFooter>
		</CSModal>
	);
}
