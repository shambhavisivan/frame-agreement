import React, { ReactNode } from 'react';
import { ReactElement } from 'react';
import { FA_API_NAME } from '../../../app-constants';
import {
	ChargeStatus,
	DeltaProduct,
	DeltaResult,
	DeltaStatus,
	ValueStatus,
	Volume
} from '../../../datasources';
import { Deforcified } from '../../../datasources/deforcify';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { useFieldMetadata } from '../../../hooks/use-field-metadata';
import { useGetDelta } from '../../../hooks/use-get-delta';
import { capitalizeString } from '../../app-utils';
import { LoadingFallback } from '../../loading-fallback';

export function DeltaView({
	sourceFaId,
	targetFaId
}: {
	sourceFaId: string;
	targetFaId: string;
}): ReactElement {
	const { deltaStatus, comparedAgreement } = useGetDelta(sourceFaId, targetFaId);
	const { metadata } = useFieldMetadata(FA_API_NAME);
	const labels = useCustomLabels();

	const pruneFaFields = (comparedAgreement: DeltaResult): Partial<DeltaResult> => {
		const { products, addons, ...prunedFa }: Partial<DeltaResult> = comparedAgreement;

		return prunedFa;
	};

	const getLabel = (apiName: string): string => {
		const metaInfo = metadata?.find((faMeta) => faMeta.apiName === apiName);

		return metaInfo?.fieldLabel || apiName;
	};

	const getStatusLabel = (prefix: string): string => {
		return labels[
			(`deltaStatus${capitalizeString(
				prefix
			)}` as unknown) as keyof Deforcified<SfGlobal.CustomLabelsSf>
		];
	};

	const formatProducts = (products: DeltaResult['products']): ReactElement => {
		const formatCharges = (chargeStatus: ChargeStatus): ReactNode => {
			const getValues = (valueStatus: ValueStatus): ValueStatus => {
				return {
					...valueStatus,
					status: getStatusLabel(valueStatus.status) as DeltaStatus
				};
			};
			const { oldValue: oneOffOld, newValue: oneOffNew, status: oneOffStatus } = getValues(
				chargeStatus.oneOff
			);
			const {
				oldValue: recurringOld,
				newValue: recurringNew,
				status: recurringStatus
			} = getValues(chargeStatus.recurring);

			return (
				<ul>
					<li>{`${labels.addonsHeaderOneOff} ${oneOffOld} -> ${oneOffNew}  ${oneOffStatus}`}</li>
					<li>
						{`${labels.addonsHeaderRecc} ${recurringOld} -> ${recurringNew}  ${recurringStatus}`}
					</li>
				</ul>
			);
		};

		const formatValue = (valueStatus: ValueStatus): string | null => {
			return valueStatus
				? `${valueStatus.oldValue} -> ${valueStatus.newValue} ${getStatusLabel(
						valueStatus.status
				  )}`
				: null;
		};

		return (
			<ul>
				{Object.keys(products).map((productId: string) => {
					if (typeof products[productId] === 'string') {
						// handles products or offers w/o charge info.
						return (
							<li>
								<span>{`${productId} :  `}</span>
								<span>
									{getStatusLabel((products[productId] as unknown) as string)}
								</span>
							</li>
						);
					} else {
						const product: DeltaProduct = (products[
							productId
						] as unknown) as DeltaProduct;
						return (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								{/* should be replaced with product name getDelta should be refactored to send product name */}
								<h2>{productId}</h2>
								{formatCharges(product.product)}
								<h3>{labels.productsCharges}</h3>
								{Object.keys(product.charges).map((chargeId) => {
									return (
										<div>
											<h3>{chargeId}</h3>
											{formatCharges(product.charges[chargeId])}
										</div>
									);
								})}
								<h3>{labels.addonLabel}</h3>
								{Object.keys(product.addons).map((addonId) => {
									return (
										<div>
											<h3>{addonId}</h3>
											{formatCharges(product.addons[addonId])}
										</div>
									);
								})}
								<h3>{labels.faVolume}</h3>
								<ul>
									{Object.keys(product.volume).map((volKey) => (
										<li>
											{`${volKey}  `}
											{formatValue(product.volume[volKey as keyof Volume])}
										</li>
									))}
								</ul>
								<h3>{labels.productsRates}</h3>
								<ul>
									{Object.keys(product.rateCard).map((rateCardId) => {
										return (
											<div>
												<h3>{rateCardId}</h3>
												{formatCharges(product.rateCard[rateCardId])}
											</div>
										);
									})}
								</ul>
							</div>
						);
					}
				})}
			</ul>
		);
	};

	return (
		<LoadingFallback status={deltaStatus}>
			<div style={{ display: 'flex', flexDirection: 'row', width: 'max-content' }}>
				<ul style={{ width: '50%' }}>
					<h2>{labels.deltaFaFields}</h2>
					{Object.keys(pruneFaFields(comparedAgreement || ({} as DeltaResult))).map(
						(key) => {
							const comparedField =
								comparedAgreement && comparedAgreement[key as keyof DeltaResult];
							return (
								<li>{`${getLabel(key)} : ${comparedField?.oldValue} -> ${
									comparedField?.newValue
								} : ${comparedField?.status}`}</li>
							);
						}
					)}
				</ul>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						padding: '3px',
						width: '50%'
					}}
				>
					<h2>{labels.productsTitle}</h2>
					<div>{formatProducts(comparedAgreement?.products || {})}</div>
				</div>
			</div>
		</LoadingFallback>
	);
}
