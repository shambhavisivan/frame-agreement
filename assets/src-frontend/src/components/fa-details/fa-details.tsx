import React, { ReactElement, useEffect, useState } from 'react';
import { FieldMetadata, FormBuilderFieldMetadata, FrameAgreement } from '../../datasources';
import { QueryStatus, useFrameAgreements } from '../../hooks/use-frame-agreements';
import { LoadingFallback } from '../loading-fallback';
import { FaEditor } from './fa-editor';
import { CSCard, CSCardBody } from '@cloudsense/cs-ui-components';
import { ApprovalProcess } from './approval';
import { FaStatusContextProvider } from '../../providers/fa-status-provider';
import { DetailsProvider } from './details-page-provider';
import { DetailsHeader } from './details-header';
import { RegisterApisWithStore } from '../../datasources/register-apis-with-store';
import { CSForm, CSFormChangedFieldData, CSFormData } from '@cloudsense/cs-form-v2';
import { useFieldMetadata } from '../../hooks/use-field-metadata';
import { FA_API_NAME } from '../../app-constants';
import { generateCsformData, updateCsFormData } from '../../utils/cs-form-utils';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { usePickListOption } from '../../hooks/use-pick-list-option';
import { forcifyKeyName } from '../../datasources/forcify';
import { useAppSettings } from '../../hooks/use-app-settings';
import { evaluateConditionalExpression } from '../../utils/app-settings-config-utils';
import { deforcifyKeyName } from '../../datasources/deforcify';
import { FamWindow } from '../../datasources/register-apis';

interface FrameAgreementDetailsProps {
	agreementId: string;
}

declare const window: FamWindow;

export function FrameAgreementDetails({ agreementId }: FrameAgreementDetailsProps): ReactElement {
	const { agreementList = [], status: faStatus } = useFrameAgreements();
	const agreement: FrameAgreement | undefined = agreementList.find(
		(fa: FrameAgreement) => fa.id === agreementId
	);
	const { metadata = [], metadataStatus } = useFieldMetadata(FA_API_NAME);
	const labels = useCustomLabels();

	const { pickList = {}, pickListStatus } = usePickListOption(
		metadata
			.filter((meta) => meta.fieldType == 'PICKLIST' && meta.isUpdatable)
			.map((meta) => forcifyKeyName(meta.apiName, 'csconta'))
	);

	const { status, settings } = useAppSettings();

	const [faHeaderFields, setFaHeaderFields] = useState<CSFormData>([] as CSFormData);

	useEffect(() => {
		if (
			status === QueryStatus.Success &&
			pickListStatus === QueryStatus.Success &&
			metadataStatus === QueryStatus.Success
		) {
			enrichFormMetadata();
		}
	}, [metadata, pickList, settings]);

	const enrichFormMetadata = async (): Promise<void> => {
		const fieldMetadataMap =
			metadata.reduce(
				(accumulator, fieldMetadata) => {
					accumulator[fieldMetadata.apiName] = fieldMetadata;
					return accumulator;
				},
				{} as {
					[fieldName: string]: FieldMetadata;
				}
			) || {};

		const formBuilderMetadataList: Array<FormBuilderFieldMetadata> = [];

		settings?.headerData?.forEach((headerConfigData) => {
			const formBuilderMetadata = {
				...headerConfigData
			} as FormBuilderFieldMetadata;

			const settingsConfigField: string = deforcifyKeyName(formBuilderMetadata.field);
			const fieldMetadata: FieldMetadata | undefined = fieldMetadataMap[settingsConfigField];

			if (fieldMetadata) {
				let isVisible = true;

				if (formBuilderMetadata.visible !== undefined) {
					isVisible = evaluateConditionalExpression(
						formBuilderMetadata.visible,
						agreement
					);
				}

				if (isVisible) {
					formBuilderMetadata.field = fieldMetadata.apiName;

					if (formBuilderMetadata.readOnly !== undefined && fieldMetadata.isUpdatable) {
						formBuilderMetadata.readOnly = formBuilderMetadata.readOnly;
					} else {
						formBuilderMetadata.readOnly = fieldMetadata.isUpdatable;
					}
					formBuilderMetadata.type = fieldMetadata.fieldType;

					if (!formBuilderMetadata.label) {
						formBuilderMetadata.label = fieldMetadata.fieldLabel;
					}
					formBuilderMetadata.pickListData = pickList[settingsConfigField];

					if (
						fieldMetadata.fieldType === 'REFERENCE' &&
						formBuilderMetadata.lookupData &&
						fieldMetadata.referenceObjects
					) {
						formBuilderMetadata.lookupData.referenceField =
							fieldMetadata.referenceObjects[0];
					}

					if (agreement) {
						formBuilderMetadata.value =
							agreement[settingsConfigField as keyof FrameAgreement];
					}
					formBuilderMetadataList.push(formBuilderMetadata);
				}
			}
		});
		const headerFieldFormData: CSFormData = await generateCsformData({
			fieldMetadataList: formBuilderMetadataList,
			label: labels.frameAgreementsTitle
		});

		setFaHeaderFields(headerFieldFormData);
	};

	const updateFa = async (data: CSFormChangedFieldData): Promise<void> => {
		let headerFieldFormData = [...faHeaderFields];
		headerFieldFormData = updateCsFormData(headerFieldFormData, data);

		setFaHeaderFields(headerFieldFormData);

		const updateFrameAgreement = window?.FAM?.api?.updateFrameAgreement as (
			agreementId: string,
			fieldName: keyof SfGlobal.FrameAgreement,
			value: string | number
		) => Promise<void>;
		await updateFrameAgreement(
			agreement?.id as string,
			forcifyKeyName(data.fieldName, 'csconta') as keyof SfGlobal.FrameAgreement,
			data.value
		);
	};

	return (
		<div className="details-wrapper">
			<LoadingFallback status={faStatus}>
				<DetailsProvider agreement={agreement || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
					<FaStatusContextProvider faId={agreementId}>
						<DetailsHeader />
						<div className="field-wrapper">
							<CSForm
								data={faHeaderFields}
								columnNumber={12}
								locale={{
									numberLocale: {
										numLocale: 'fi-FI',
										options: {
											style: 'currency',
											currency: 'GBP'
										}
									}
								}}
								onFieldChange={updateFa}
							/>
						</div>
						<ApprovalProcess faId={agreementId} />
						Agreement ID: {agreementId}, name: {agreement?.name}
						<CSCard className="products-search-wrapper">
							<CSCardBody padding="0">
								<FaEditor agreement={agreement} />
							</CSCardBody>
						</CSCard>
					</FaStatusContextProvider>
				</DetailsProvider>
			</LoadingFallback>
		</div>
	);
}
