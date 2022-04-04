import {
	AppSettings,
	Attachment,
	CommercialProductStandalone,
	CommercialProductData,
	FrameAgreement,
	FrameAgreementAttachment,
	AttachmentOriginalItems,
	Addon
} from '../datasources';
import { Deforcified } from '../datasources/deforcify';
import { remoteActions } from '../datasources';
import { QueryKeys, FA_STATUS_FIELD_NAME, PRODUCTS_CHUNK_SIZE } from '../app-constants';
import { QueryCache } from 'react-query';
import { deforcify } from '../datasources/deforcify';
import { DetailsState } from '../components/fa-details/details-page-provider';
import { FAMClientError } from '../error/fam-client-error-handler';
import { selectAttachment } from '../components/fa-details/negotiation/details-reducer';
import { usePublisher as publishEventData } from '../hooks/use-publisher-subscriber';
import { CSToastApi } from '@cloudsense/cs-ui-components';
import { forcify } from '../datasources/forcify';
import { usePublisher as callPublisher } from '../hooks/use-publisher-subscriber';
import { createAttExtended } from '../utils/helper-functions';

class AgreementService {
	private _settings: AppSettings;
	private _agreementList: FrameAgreement[];
	private _queryCache;
	private _customLabels: Deforcified<SfGlobal.CustomLabelsSf>;
	private _detailsPageProvider: DetailsState;
	private _itemIds: string[];

	public constructor(
		settings: AppSettings,
		agreementList: FrameAgreement[],
		queryCache: QueryCache,
		customLabels: Deforcified<SfGlobal.CustomLabelsSf>,
		detailsPageProvider: DetailsState,
		itemIds: string[]
	) {
		this._settings = settings;
		this._agreementList = agreementList;
		this._queryCache = queryCache;
		this._customLabels = customLabels;
		this._detailsPageProvider = detailsPageProvider;
		this._itemIds = itemIds;
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
				attachment,
				attachmentExtended: (this._getAttExtended(
					attachment
				) as unknown) as AttachmentOriginalItems
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
					attachment,
					attachmentExtended: (this._getAttExtended(
						attachment
					) as unknown) as AttachmentOriginalItems
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

	public saveFrameAgreement = async (frameAgreementId: string): Promise<FrameAgreement> => {
		const agreement = this._agreementList.find((fa) => fa.id === frameAgreementId);
		if (!agreement) {
			throw new FAMClientError(this._customLabels.incorrectFa);
		}

		const activeFrameAgreement: FrameAgreement | undefined = this._detailsPageProvider.activeFa;

		if (
			activeFrameAgreement &&
			this._detailsPageProvider.negotiation &&
			activeFrameAgreement.id === frameAgreementId
		) {
			await remoteActions.saveAttachment(
				frameAgreementId,
				selectAttachment(this._detailsPageProvider.negotiation)
			);
		}

		const forcifiedAgreement = (forcify(
			agreement,
			'csconta'
		) as unknown) as SfGlobal.FrameAgreement;

		await publishEventData('onBeforeSaveFrameAgreement', forcifiedAgreement);
		this._detailsPageProvider.dispatch({
			type: 'toggleDisableAgreementOperation',
			payload: true
		});

		const savedFrameAgreement = await remoteActions.upsertFrameAgreements(
			frameAgreementId,
			forcifiedAgreement
		);

		this._detailsPageProvider.dispatch({
			type: 'toggleDisableAgreementOperation',
			payload: false
		});
		await publishEventData(
			'onAfterSaveFrameAgreement',
			(forcify(savedFrameAgreement, 'csconta') as unknown) as SfGlobal.FrameAgreement
		);

		return savedFrameAgreement;
	};

	public addProducts = async (faId: string, productIds: string[]): Promise<void> => {
		let cpIds = await callPublisher<string[]>('onBeforeAddProducts', productIds);

		let commercialProductsList: CommercialProductStandalone[] = [];

		//change cp ids from length 15 to length 18
		if (cpIds.some((cpId) => cpId.length === 15)) {
			// Generate 15: 18 map
			const charMap = {} as Record<string, string>;
			commercialProductsList.forEach((cp) => {
				charMap[cp.id.substring(0, 15)] = cp.id;
			});

			cpIds = cpIds.map((cpId) => (cpId.length === 15 ? charMap[cpId] : cpId));
		}

		const cpIdsinStore = this._detailsPageProvider.negotiation.products
			? Object.keys(this._detailsPageProvider.negotiation.products)
			: [];

		const idsToLoad = [
			...cpIdsinStore,
			...cpIds.filter((cpId) => this._itemIds.includes(cpId))
		];

		for (let i = 0; i < idsToLoad.length; i += PRODUCTS_CHUNK_SIZE) {
			commercialProductsList = [
				...commercialProductsList,
				...(await remoteActions.queryProducts(
					idsToLoad.slice(i, i + PRODUCTS_CHUNK_SIZE),
					null,
					null,
					10,
					[]
				))
			];
		}

		const commercialProductsData = await remoteActions.getCommercialProductData(idsToLoad);

		this._detailsPageProvider.dispatch({
			type: 'addProducts',
			payload: {
				products: commercialProductsList,
				productsData: commercialProductsData || ({} as CommercialProductData)
			}
		});
		await callPublisher<string[]>('onAfterAddProducts', idsToLoad);
	};
	public removeProducts = async (faId: string, productIds: string[]): Promise<void> => {
		await publishEventData<string[]>('onBeforeDeleteProducts', productIds);

		const productIdsAfterDeletion = Object.keys(
			this._detailsPageProvider.negotiation.products
		).filter((pId) => !productIds.includes(pId));

		this._detailsPageProvider.dispatch({
			type: 'removeProducts',
			payload: { productIds: productIds }
		});

		await publishEventData<string[]>('onAfterDeleteProducts', productIdsAfterDeletion);
	};

	private _getAttExtended = async (attachment: Attachment): Promise<AttachmentOriginalItems> => {
		let productIds: string[] = [];
		if (attachment) {
			productIds = Object.keys(attachment.products || {});
		}

		let commercialProducts: CommercialProductStandalone[] = [];
		let productsData: CommercialProductData = {} as CommercialProductData;
		let standaloneAddons: Addon[] = [];

		const cachedCps: CommercialProductStandalone[] | undefined = this._queryCache.getQueryData([
			'commercialProducts',
			productIds,
			null,
			null,
			0,
			[]
		]);

		const cachedCpData: CommercialProductData | undefined = this._queryCache.getQueryData([
			'commercialProductData',
			productIds
		]);

		const cachedAddons: Addon[] | undefined = this._queryCache.getQueryData([
			QueryKeys.standaloneAddons
		]);

		commercialProducts = cachedCps
			? cachedCps
			: await remoteActions.queryProducts(productIds, null, null, 0, []);

		productsData = cachedCpData
			? cachedCpData
			: await remoteActions.getCommercialProductData(productIds);

		standaloneAddons = cachedAddons ? cachedAddons : await remoteActions.getStandaloneAddons();

		const attachmentExtended: AttachmentOriginalItems = createAttExtended(
			commercialProducts,
			productsData,
			standaloneAddons
		);
		return attachmentExtended;
	};
}

export { AgreementService };
