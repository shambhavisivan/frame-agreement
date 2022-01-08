import { AppSettings, Attachment, FrameAgreement, FrameAgreementAttachment } from '../datasources';
import { Deforcified } from '../datasources/deforcify';
import { remoteActions } from '../datasources';
import { QueryKeys, FA_STATUS_FIELD_NAME } from '../app-constants';
import { QueryCache } from 'react-query';
import { deforcify } from '../datasources/deforcify';
import { DetailsState } from '../components/fa-details/details-page-provider';
import { FAMClientError } from '../error/fam-client-error-handler';
import { selectAttachment } from '../components/fa-details/negotiation/details-reducer';
import { usePublisher as publishEventData } from '../hooks/use-publisher-subscriber';
import { CSToastApi } from '@cloudsense/cs-ui-components';

class AgreementService {
	private _settings: AppSettings;
	private _agreementList: FrameAgreement[];
	private _queryCache;
	private _customLabels: Deforcified<SfGlobal.CustomLabelsSf>;
	private _detailsPageProvider: DetailsState;

	public constructor(
		settings: AppSettings,
		agreementList: FrameAgreement[],
		queryCache: QueryCache,
		customLabels: Deforcified<SfGlobal.CustomLabelsSf>,
		detailsPageProvider: DetailsState
	) {
		this._settings = settings;
		this._agreementList = agreementList;
		this._queryCache = queryCache;
		this._customLabels = customLabels;
		this._detailsPageProvider = detailsPageProvider;
	}

	public getActiveFrameAgreement(): FrameAgreement {
		if (!this._detailsPageProvider.activeFa) {
			throw new Error(this._customLabels.noActiveFa);
		}
		return this._detailsPageProvider.activeFa;
	}

	public getFaAttachment = async (faId: string): Promise<Attachment> => {
		const attachment = await remoteActions.getAttachmentBody(faId);
		const activeFa = this.getActiveFrameAgreement();
		if (faId !== activeFa.id) {
			throw new Error(this._customLabels.notTheActiveFa);
		}
		this._queryCache.setQueryData([QueryKeys.faAttachment, faId], attachment);
		this._detailsPageProvider.dispatch({
			type: 'loadAttachment',
			payload: {
				attachment
			}
		});
		return attachment;
	};

	public updateFa = async (
		faId: string,
		field: keyof SfGlobal.FrameAgreement,
		value: SfGlobal.FrameAgreement[keyof SfGlobal.FrameAgreement]
	): Promise<void> => {
		const faFound = this._agreementList.find((fa) => fa.id === faId);
		if (!faFound) {
			throw new Error(this._customLabels.incorrectFa);
		}
		const sfData: Partial<SfGlobal.FrameAgreement> = { [field]: value };
		const faData: Partial<FrameAgreement> = deforcify(sfData);
		this._queryCache.setQueryData(
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

	public setStatusOfFrameAgreement = async (faId: string, newState: string): Promise<string> => {
		try {
			const activeFa = this.getActiveFrameAgreement();

			if (activeFa.id !== faId) {
				throw new Error(this._customLabels.notTheActiveFa);
			}
			/* eslint-disable @typescript-eslint/naming-convention */
			await remoteActions.upsertFrameAgreements(faId, {
				csconta__Status__c: newState
			});
			/* eslint-enable @typescript-eslint/naming-convention */
		} catch (error) {
			return (error as Error).message;
		}
		this.updateFa(faId, FA_STATUS_FIELD_NAME, newState);
		return 'Success';
	};

	public async validateFrameAgreementStatusConsistency(frameAgreementId: string): Promise<void> {
		if (!this._settings?.facSettings.activeStatusManagement) {
			return;
		}

		let cacheIndex = -1;
		const agreement = this._agreementList.find((fa: FrameAgreement, index: number) => {
			if (fa.id === frameAgreementId) {
				cacheIndex = index;
				return true;
			}
			return false;
		});

		if (!agreement) {
			throw new FAMClientError(this._customLabels.incorrectFa);
		}
		const facStatuses = this._settings?.facSettings.statuses;
		let updatedAgreement = agreement;

		//TODO: need to add approvalNeeded flag
		if (agreement.status && facStatuses) {
			if (
				facStatuses.requiresApprovalStatus &&
				(agreement.status === facStatuses.draftStatus ||
					agreement.status === facStatuses.approvedStatus)
			) {
				updatedAgreement = await remoteActions.upsertFrameAgreements(frameAgreementId, {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					csconta__Status__c: facStatuses.requiresApprovalStatus
				});
			} else if (
				facStatuses.draftStatus &&
				agreement.status === facStatuses?.requiresApprovalStatus
			) {
				updatedAgreement = await remoteActions.upsertFrameAgreements(frameAgreementId, {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					csconta__Status__c: facStatuses.draftStatus
				});
			}
		}

		this._agreementList[cacheIndex] = updatedAgreement;
		this._queryCache.setQueryData(QueryKeys.frameagreement, this._agreementList);
	}

	public refreshFrameAgreement = async (
		frameAgreementId: string,
		refreshAttachment = false
	): Promise<FrameAgreementAttachment> => {
		const frameAgreementAttachment = {} as FrameAgreementAttachment;
		const refreshedAgreement = await remoteActions.getFrameAgreement(frameAgreementId);

		if (!refreshedAgreement) {
			throw new FAMClientError('Invalid Framework Agreement Id');
		}
		await this._updateAgreementCache(refreshedAgreement);
		frameAgreementAttachment.frameAgreement = refreshedAgreement;

		if (refreshAttachment && this._detailsPageProvider.activeFa?.id === frameAgreementId) {
			const attachment = await remoteActions.getAttachmentBody(frameAgreementId);
			this._detailsPageProvider.dispatch({
				type: 'loadAttachment',
				payload: {
					attachment
				}
			});
			frameAgreementAttachment.attachment = attachment;
		}

		return frameAgreementAttachment;
	};

	private _updateAgreementCache = async (frameAgreement: FrameAgreement): Promise<void> => {
		this._queryCache.setQueryData(
			QueryKeys.frameagreement,
			(agreementList: FrameAgreement[] | undefined) => {
				if (agreementList && agreementList.length) {
					let cacheIndex = -1;
					agreementList.find((fa: FrameAgreement, index: number) => {
						if (fa.id === frameAgreement.id) {
							cacheIndex = index;
							return true;
						}
						return false;
					});
					if (cacheIndex >= 0) {
						agreementList[cacheIndex] = frameAgreement;
					}
				} else {
					agreementList = [];
					agreementList.push(frameAgreement);
					return agreementList;
				}
				return agreementList;
			}
		);
	};

	public submitForApproval = async (faId: string): Promise<boolean> => {
		const response = await remoteActions.submitForApproval(faId);
		if (response) {
			const appovalHistory = await remoteActions.getApprovalHistory(faId);
			this._queryCache.setQueryData([QueryKeys.approvalHistory, faId], appovalHistory);
			await this.refreshFrameAgreement(faId, true);
		}
		return response;
	};

	public activateFrameAgreement = async (frameAgreementId: string): Promise<void> => {
		const faFound = this._agreementList.find((fa) => fa.id === frameAgreementId);
		if (!faFound) {
			throw new FAMClientError(this._customLabels.incorrectFa);
		}

		if (
			this._detailsPageProvider.negotiation &&
			this._detailsPageProvider.activeFa?.id === frameAgreementId
		) {
			await remoteActions.saveAttachment(
				frameAgreementId,
				selectAttachment(this._detailsPageProvider.negotiation)
			);
		}

		await publishEventData(
			'onBeforeActivation',
			selectAttachment(this._detailsPageProvider.negotiation)
		);
		this._detailsPageProvider.dispatch({
			type: 'toggleDisableAgreementOperation',
			payload: true
		});
		const prgId = await remoteActions.activateFrameAgreement(frameAgreementId);
		this._detailsPageProvider.dispatch({
			type: 'toggleDisableAgreementOperation',
			payload: false
		});

		if (prgId) {
			CSToastApi.renderCSToast(
				{
					variant: 'success',
					text: this._customLabels.toastDecompositionTitleSuccess,
					detail: this._customLabels.toastDecompositionSuccess,
					closeButton: true
				},
				'top-center',
				3
			);
			await publishEventData('onAfterActivation', prgId);
		} else {
			CSToastApi.renderCSToast(
				{
					variant: 'error',
					text: this._customLabels.toastDecompositionTitleFailed,
					detail: this._customLabels.toastDecompositionFailed,
					closeButton: true
				},
				'top-center',
				3
			);
		}
	};
}

export { AgreementService };
