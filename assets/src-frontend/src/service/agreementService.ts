import { AppSettings, FrameAgreement } from '../datasources';
import { Deforcified } from '../datasources/deforcify';
import { remoteActions } from '../datasources';
import { QueryKeys, FA_STATUS_FIELD_NAME } from '../app-constants';
import { QueryCache } from 'react-query';
import { deforcify } from '../datasources/deforcify';
import { DetailsState } from '../components/fa-details/details-page-provider';

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
	public getActiveFrameAgreement = (): FrameAgreement => {
		if (!this._detailsPageProvider.activeFa) {
			throw new Error(this._customLabels.noActiveFa);
		}
		return this._detailsPageProvider.activeFa;
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
}

export { AgreementService };
