import {
	CSButton,
	CSMainHeader,
	CSMainHeaderLeft,
	CSMainHeaderRight,
	CSToastApi
} from '@cloudsense/cs-ui-components';
import _ from 'lodash';
import React, { ReactElement, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { FrameAgreement } from '../../datasources';
import { useAppSettings } from '../../hooks/use-app-settings';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { useGetFaAttachment } from '../../hooks/use-get-fa-attachment';
import { useSaveAttachment } from '../../hooks/use-save-attachment';
import { isStandardButtonVisible } from '../app-utils';
import { faStatusContext } from '../../providers/fa-status-provider';
import { ConfirmationModal } from '../dialogs/confirmation-modal';
import { store } from './details-page-provider';
import { selectAttachment } from './negotiation/details-reducer';

export function DetailsHeader(): ReactElement {
	const { negotiation, activeFa } = useContext(store);
	const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
	const { settings } = useAppSettings();
	const { mutate } = useSaveAttachment();
	const history = useHistory();
	const { attachment } = useGetFaAttachment(activeFa?.id || '');
	const label = useCustomLabels();
	const { faStatus } = useContext(faStatusContext);

	const saveAttachment = (): void => {
		if (isAgreementNegotiated()) {
			mutate({ faId: activeFa?.id || '', attachment: selectAttachment(negotiation) }).finally(
				() =>
					CSToastApi.renderCSToast(
						{
							variant: 'success',
							text: label.toastSavedFa,
							closeButton: true
						},
						'top-center',
						3
					)
			);
		}
	};

	const isAgreementNegotiated = (): boolean => {
		return !_.isEqualWith(attachment, selectAttachment(negotiation));
	};

	const confirmationModal = (
		<ConfirmationModal
			open={openConfirmationModal}
			message={label.modalUnsavedChangesAlert}
			title={''}
			confirmText={label.btnOk}
			onClose={(): void => setOpenConfirmationModal(false)}
			onConfirm={(): void => history.goBack()}
		/>
	);

	const onTriggeringBack = (): void => {
		if (isAgreementNegotiated()) {
			setOpenConfirmationModal(true);
			return;
		}
		history.goBack();
	};

	return (
		<>
			{confirmationModal}
			<CSMainHeader maxWidth="1200px">
				<CSMainHeaderLeft title={settings?.account.name ? settings.account.name : ''}>
					<CSButton label={'< back'} onClick={onTriggeringBack} />
					{faStatus && faStatus}
				</CSMainHeaderLeft>
				<CSMainHeaderRight>
					{isStandardButtonVisible(
						settings?.buttonStandardData.save,
						activeFa || ({} as FrameAgreement)
					) && (
						<CSButton
							disabled={!isAgreementNegotiated()}
							label={label.btnSave}
							onClick={saveAttachment}
						/>
					)}
				</CSMainHeaderRight>
			</CSMainHeader>
		</>
	);
}
