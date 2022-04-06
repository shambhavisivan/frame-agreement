import {
	CSButton,
	CSChip,
	CSMainHeader,
	CSMainHeaderColor,
	CSMainHeaderIcon,
	CSMainHeaderLeft,
	CSMainHeaderRight
} from '@cloudsense/cs-ui-components';
import _ from 'lodash';
import React, { ReactElement, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { FrameAgreement, remoteActions } from '../../datasources';
import { useAppSettings } from '../../hooks/use-app-settings';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { useGetFaAttachment } from '../../hooks/use-get-fa-attachment';
import { useSaveAttachment } from '../../hooks/use-save-attachment';
import { isStandardButtonVisible } from '../../utils/app-settings-config-utils';
import { faStatusContext } from '../../providers/fa-status-provider';
import { ConfirmationModal } from '../dialogs/confirmation-modal';
import { store } from './details-page-provider';
import { selectAttachment } from './negotiation/details-reducer';
import { Deforcified } from '../../datasources/deforcify';
import { useApprovalHistory } from '../../hooks/use-approval-history';
import { showToast } from '../app-utils';
import { FA_STATUS_PENDING } from '../../app-constants';
import { publishEventData } from '../../utils/publisher-subscriber-utils';

interface DetailsHeaderProps {
	agreement?: FrameAgreement;
}

export function DetailsHeader({ agreement }: DetailsHeaderProps): ReactElement {
	const { negotiation, activeFa, disableAgreementOperations, dispatch } = useContext(store);
	const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
	const { settings } = useAppSettings();
	const { mutate: saveAttachment } = useSaveAttachment();
	const history = useHistory();
	const { attachment } = useGetFaAttachment(activeFa?.id || '');
	const label = useCustomLabels();
	const { faStatus } = useContext(faStatusContext);
	const { refetchApprovalHistory } = useApprovalHistory(agreement?.id || '');
	const { setFaStatus } = useContext(faStatusContext);

	const triggerSaveAttachment = (): void => {
		if (isAgreementNegotiated()) {
			disableAgreementOperation(true);
			saveAttachment({
				faId: activeFa?.id || '',
				attachment: selectAttachment(negotiation)
			}).finally(() => {
				disableAgreementOperation(false);
				showToast('success', label.toastSavedFa);
			});
		}
	};

	const triggerApproval = async (): Promise<void> => {
		if (!settings?.facSettings.approvalProcessName) {
			showToast('error', label.toastSubmitForApprovalConfigError, {
				toastMessageDetail: label.toastSubmitForApprovalConfigErrorMsg
			});
			return;
		}
		disableAgreementOperation(true);
		await saveAttachment({
			faId: agreement?.id || '',
			attachment: selectAttachment(negotiation)
		});
		await publishEventData('onBeforeSubmit', undefined);
		const approvalProcessResult = await remoteActions.submitForApproval(
			agreement?.id as string
		);

		if (approvalProcessResult) {
			showToast('success', label.toastSuccessTitle, {
				toastMessageDetail: label.toastSubmitForApprovalSuccess
			});
			setFaStatus(FA_STATUS_PENDING);
			refetchApprovalHistory();
			await publishEventData('onAfterSubmit', undefined);
		} else {
			showToast('error', label.toastFailedTitle, {
				toastMessageDetail: label.toastSubmitForApprovalFailed
			});
		}
		disableAgreementOperation(false);
	};

	const isAgreementNegotiated = (): boolean => {
		return !_.isEqualWith(attachment, selectAttachment(negotiation));
	};

	const disableAgreementOperation = (disable: boolean): void => {
		dispatch({
			type: 'toggleDisableAgreementOperation',
			payload: disable
		});
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

	const getHeaderColor = (): CSMainHeaderColor => {
		switch (faStatus) {
			case settings?.facSettings.statuses.requiresApprovalStatus:
				return 'error';
			case settings?.facSettings.statuses.draftStatus:
				return 'brand';
			case settings?.facSettings.statuses.closedStatus:
			case settings?.facSettings.statuses.activeStatus:
				return 'info';
			case settings?.facSettings.statuses.approvedStatus:
			case FA_STATUS_PENDING:
				if (settings?.facSettings.faEditableStatuses.includes(faStatus)) {
					return 'brand';
				} else {
					return 'info';
				}
			default:
				return 'neutral';
		}
	};

	const isButtonVisible = (
		buttonName: keyof Deforcified<SfGlobal.StandardButtonData>
	): boolean => {
		if (
			isStandardButtonVisible(
				settings?.buttonStandardData[buttonName],
				agreement || ({} as FrameAgreement)
			)
		) {
			if (agreement?.agreementLevel !== 'Master Agreement' && agreement?.status) {
				const facSettingsStatus = settings?.facSettings.statuses;
				switch (buttonName) {
					case 'submitForApproval':
						return agreement.status === facSettingsStatus?.requiresApprovalStatus;
					case 'newVersion':
						return agreement.status === facSettingsStatus?.activeStatus;
					case 'submit':
						return (
							agreement.status === facSettingsStatus?.draftStatus ||
							agreement.status === facSettingsStatus?.approvedStatus
						);
					case 'save':
						return (
							settings?.facSettings.faEditableStatuses.includes(agreement.status) ||
							false
						);
					case 'delta':
						return true;
					default:
						return false;
				}
			} else {
				switch (buttonName) {
					case 'save':
						return true;
					default:
						return false;
				}
			}
		}
		return false;
	};

	return (
		<>
			{confirmationModal}
			<CSMainHeader maxWidth="1200px" color={getHeaderColor()}>
				<CSMainHeaderIcon>
					<CSButton
						label="back"
						labelHidden
						btnType="transparent"
						btnStyle="initial"
						iconName="back"
						onClick={onTriggeringBack}
					/>
				</CSMainHeaderIcon>
				<CSMainHeaderLeft title={settings?.account.name ? settings.account.name : ''}>
					{faStatus && <CSChip text={faStatus} variant="neutral" />}
				</CSMainHeaderLeft>
				<CSMainHeaderRight>
					{isButtonVisible('delta') && (
						<CSButton disabled={disableAgreementOperations} label={label.btnDelta} />
					)}
					{isButtonVisible('submitForApproval') && (
						<CSButton
							disabled={disableAgreementOperations}
							label={label.btnSubmitForApproval}
							onClick={triggerApproval}
						/>
					)}
					{isButtonVisible('save') && (
						<CSButton
							disabled={!isAgreementNegotiated() || disableAgreementOperations}
							label={label.btnSave}
							onClick={triggerSaveAttachment}
						/>
					)}
					{isButtonVisible('newVersion') && (
						<CSButton
							disabled={disableAgreementOperations}
							label={label.btnNewVersion}
						/>
					)}
					{isButtonVisible('submit') && (
						<CSButton disabled={disableAgreementOperations} label={label.btnSubmit} />
					)}
				</CSMainHeaderRight>
			</CSMainHeader>
		</>
	);
}
