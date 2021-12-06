import React, { ReactElement, useContext } from 'react';
import { FrameAgreement } from '.';
import { registerApiEndpoint } from './register-apis';
import { useCustomLabels } from '../hooks/use-custom-labels';
import { store } from '../components/fa-details/details-page-provider';

export function RegisterApisWithStore(): ReactElement {
	const { activeFa } = useContext(store);
	const customLabels = useCustomLabels();

	const getActiveFrameAgreement = (): FrameAgreement => {
		if (!activeFa) {
			throw new Error(customLabels.noActiveFa);
		}
		return activeFa;
	};
	registerApiEndpoint('getActiveFrameAgreement', getActiveFrameAgreement);

	return <></>;
}
