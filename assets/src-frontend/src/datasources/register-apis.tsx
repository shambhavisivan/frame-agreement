import { CSToastApi, CSToastVariant } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useReducer } from 'react';
import { useQueryCache } from 'react-query';
import { Attachment, FrameAgreement, remoteActions } from '.';
import { QueryKeys } from '../app-constants';
import { detailsReducer, Negotiation } from '../components/fa-details/negotiation/details-reducer';
import { useCustomLabels } from '../hooks/use-custom-labels';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { useAppSettings } from '../hooks/use-app-settings';
import { deforcify } from './deforcify';

interface FamApi {
	getAttachment?: (faId: string) => Promise<Attachment>;
	updateFrameAgreement?: (
		faId: string,
		field: keyof SfGlobal.FrameAgreement,
		value: SfGlobal.FrameAgreement[keyof SfGlobal.FrameAgreement]
	) => Promise<void>;
	isAgreementEditable?: (faId: string) => Promise<boolean>;
	toast?: (type: CSToastVariant, title: string, message: string, timeout: number) => void;
	getActiveFrameAgreement?: () => FrameAgreement;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type FamWindow = Window & { FAM?: { api?: FamApi } };
declare const window: FamWindow;

export function registerApiEndpoint(name: keyof FamApi, endpoint: FamApi[keyof FamApi]): void {
	// eslint-disable-next-line no-console
	console.debug(`Registering API endpoint ${name}`);
	if (!window.FAM) {
		window.FAM = {};
	}
	if (!window.FAM.api) {
		window.FAM.api = {};
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	window.FAM.api[name] = endpoint as any;
}

export function RegisterApis(): ReactElement {
	const queryCache = useQueryCache();
	const { agreementList = [] } = useFrameAgreements();
	const customLabels = useCustomLabels();
	const { settings } = useAppSettings();
	const initialState: Negotiation = { negotiation: { products: {}, offers: {}, addons: {} } };
	const negotiationStateDispatch = useReducer(detailsReducer, initialState);
	const dispatch = negotiationStateDispatch[1];

	const getFaAttachment = async (faId: string): Promise<Attachment> => {
		const attachment = await remoteActions.getAttachmentBody(faId);
		queryCache.setQueryData([QueryKeys.faAttachment, faId], attachment);
		dispatch({
			type: 'loadAttachment',
			payload: {
				attachment
			}
		});
		return attachment;
	};
	registerApiEndpoint('getAttachment', getFaAttachment);

	const updateFa = async (
		faId: string,
		field: keyof SfGlobal.FrameAgreement,
		value: SfGlobal.FrameAgreement[keyof SfGlobal.FrameAgreement]
	): Promise<void> => {
		const faFound = agreementList.find((fa) => fa.id === faId);
		if (!faFound) {
			throw new Error(customLabels.incorrectFa);
		}
		const sfData: Partial<SfGlobal.FrameAgreement> = { [field]: value };
		const faData: Partial<FrameAgreement> = deforcify(sfData);
		queryCache.setQueryData(
			QueryKeys.frameagreement,
			(oldData: FrameAgreement[] | undefined) => {
				if (oldData && oldData?.length) {
					return oldData?.map((agreement) => {
						if (agreement.id === faId) {
							return { ...agreement, ...faData };
						}
						return agreement;
					});
				} else {
					return [];
				}
			}
		);
	};
	registerApiEndpoint('updateFrameAgreement', updateFa);

	const isAgreementEditable = async (faId: string): Promise<boolean> => {
		const facSettings = settings?.facSettings;
		const fa = agreementList.find((agreement) => agreement.id === faId);
		let isApprover = false;
		let isPending = false;
		const appovalHistory = await remoteActions.getApprovalHistory(faId);
		queryCache.setQueryData([QueryKeys.approvalHistory, faId], appovalHistory);
		if (appovalHistory) {
			isApprover = appovalHistory.isApprover;
			isPending = appovalHistory.isPending;
		}
		if (facSettings?.faEditableStatuses?.includes(fa?.status || '')) {
			return true;
		}
		if (isPending && isApprover && facSettings?.approversRevise) {
			return true;
		}
		return false;
	};
	registerApiEndpoint('isAgreementEditable', isAgreementEditable);

	const showToast = (
		type: CSToastVariant,
		title: string,
		message: string,
		timeout: number
	): void => {
		CSToastApi.renderCSToast(
			{
				variant: type,
				text: title,
				detail: message,
				closeButton: true
			},
			'top-right',
			timeout / 1000
		);
	};
	registerApiEndpoint('toast', showToast);

	return <></>;
}