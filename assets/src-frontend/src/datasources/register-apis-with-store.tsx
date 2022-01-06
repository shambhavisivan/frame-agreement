import React, { ReactElement, useContext } from 'react';
import { FrameAgreement, AppSettings } from '.';
import { registerApiEndpoint } from './register-apis';
import { useCustomLabels } from '../hooks/use-custom-labels';
import { store } from '../components/fa-details/details-page-provider';
import { useQueryCache } from 'react-query';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { AgreementService } from '../service/agreementService';
import { useAppSettings } from '../hooks/use-app-settings';

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

	return <></>;
}
