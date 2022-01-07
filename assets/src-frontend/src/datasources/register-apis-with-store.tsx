import React, { ReactElement, useContext } from 'react';
import { FrameAgreement, AppSettings, Attachment } from '.';
import { registerApiEndpoint } from './register-apis';
import { useCustomLabels } from '../hooks/use-custom-labels';
import { store } from '../components/fa-details/details-page-provider';
import { useQueryCache } from 'react-query';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { AgreementService } from '../service/agreementService';
import { useAppSettings } from '../hooks/use-app-settings';
import { forcify } from './forcify';

export function RegisterApisWithStore(): ReactElement {
	const queryCache = useQueryCache();
	const detailsPageProvider = useContext(store);
	const customLabels = useCustomLabels();
	const { agreementList = [] } = useFrameAgreements();
	const { settings = {} as AppSettings } = useAppSettings();

	const agreementService: AgreementService = new AgreementService(
		settings,
		agreementList,
		queryCache,
		customLabels,
		detailsPageProvider
	);

	const getFaAttachment = async (faId: string): Promise<Attachment> => {
		return await agreementService.getFaAttachment(faId);
	};
	registerApiEndpoint('getAttachment', getFaAttachment);

	const getActiveFrameAgreement = (): FrameAgreement => {
		return agreementService.getActiveFrameAgreement();
	};
	registerApiEndpoint('getActiveFrameAgreement', getActiveFrameAgreement);

	const updateFa = async (
		faId: string,
		field: keyof SfGlobal.FrameAgreement,
		value: SfGlobal.FrameAgreement[keyof SfGlobal.FrameAgreement]
	): Promise<void> => {
		await agreementService.updateFa(faId, field, value);
	};
	registerApiEndpoint('updateFrameAgreement', updateFa);

	const setStatusOfFrameAgreement = async (faId: string, newState: string): Promise<string> => {
		const faStatusUpdateStatus = await agreementService.setStatusOfFrameAgreement(
			faId,
			newState
		);
		return faStatusUpdateStatus;
	};
	registerApiEndpoint('setStatusOfFrameAgreement', setStatusOfFrameAgreement);

	const validateStatusConsistency = async (frameAgreementId: string): Promise<void> => {
		await agreementService.validateFrameAgreementStatusConsistency(frameAgreementId);

		return;
	};
	registerApiEndpoint('validateStatusConsistency', validateStatusConsistency);

	const refreshFa = async (
		frameAgreementId: string,
		refreshAttachment = false
	): Promise<SfGlobal.FrameAgreementAttachment> => {
		const refreshedAgreementAttachment = await agreementService.refreshFrameAgreement(
			frameAgreementId,
			refreshAttachment
		);
		const forcifiedRefreshedAgreementAttachment: SfGlobal.FrameAgreementAttachment = {
			frameAgreement: (forcify(
				refreshedAgreementAttachment.frameAgreement,
				'csconta'
			) as unknown) as SfGlobal.FrameAgreement,
			attachment: refreshedAgreementAttachment.attachment
		};

		return forcifiedRefreshedAgreementAttachment;
	};
	registerApiEndpoint('refreshFa', refreshFa);

	const setCustomData = async (
		faId: string,
		data: string | Record<string, unknown>
	): Promise<void> => {
		const activeFa = getActiveFrameAgreement();
		if (faId !== activeFa.id) {
			throw new Error(customLabels.notTheActiveFa);
		}

		detailsPageProvider.dispatch({
			type: 'setCustomData',
			payload: {
				data
			}
		});
	};
	registerApiEndpoint('setCustomData', setCustomData);

	const getCustomData = async (
		faId: string
	): Promise<string | Record<string, unknown> | undefined> => {
		const activeFa = getActiveFrameAgreement();
		if (faId !== activeFa.id) {
			throw new Error(customLabels.notTheActiveFa);
		}

		return detailsPageProvider.negotiation.custom;
	};
	registerApiEndpoint('getCustomData', getCustomData);
	const submitForApproval = async (faId: string): Promise<boolean> => {
		const result = await agreementService.submitForApproval(faId);
		return result;
	};
	registerApiEndpoint('submitForApproval', submitForApproval);

	const activateFrameAgreement = async (frameAgreementId: string): Promise<void> => {
		await agreementService.activateFrameAgreement(frameAgreementId);
	};
	registerApiEndpoint('activateFrameAgreement', activateFrameAgreement);

	const saveFrameAgreement = async (
		frameAgreementId: string
	): Promise<SfGlobal.FrameAgreement> => {
		const savedFrameAgreement = await agreementService.saveFrameAgreement(frameAgreementId);

		return (forcify(savedFrameAgreement, 'csconta') as unknown) as SfGlobal.FrameAgreement;
	};
	registerApiEndpoint('saveFrameAgreement', saveFrameAgreement);

	return <></>;
}
