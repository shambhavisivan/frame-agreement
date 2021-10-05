import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import {
	CSButton,
	CSLookup,
	CSModal,
	CSModalBody,
	CSModalHeader,
	CSModalFooter,
	CSDataTableRowInterface
} from '@cloudsense/cs-ui-components';
import { QueryStatus, useFrameAgreements } from '../../../hooks/use-frame-agreements';
import { FrameAgreement, Products } from '../../../datasources';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import JSONTree from 'react-json-tree';
import { useFieldMetadata } from '../../../hooks/use-field-metadata';
import { FA_API_NAME, THEME_DELTA_MODAL } from '../../../app-constants';
import { useGetFaAttachment } from '../../../hooks/use-get-fa-attachment';
import { DeltaView } from './delta-view';

export interface ModalProps {
	modalOpen: boolean;
	onClose: (onClose: boolean) => void;
}

export interface DeltaModalProps extends ModalProps {
	faTargetId?: string;
	faSourceId?: string;
}

type AgreementLookupOption = {
	key: keyof FrameAgreement;
	label: string;
};

const AGREEMENT_LOOKUP_OPTIONS: AgreementLookupOption[] = [
	{ key: 'agreementName', label: 'Agreement Name' }
];

const DISPLAYED_FIELD: AgreementLookupOption['key'] = 'agreementName';
interface FaDeltaView extends FrameAgreement {
	products?: Products;
}

export function DeltaModal({
	modalOpen,
	onClose,
	faSourceId,
	faTargetId
}: DeltaModalProps): ReactElement {
	const { agreementList = [], status } = useFrameAgreements();
	const [sourceAgreement, setSourceAgreement] = useState<Partial<FaDeltaView> | null>(null);
	const [targetAgreement, setTargetAgreement] = useState<Partial<FaDeltaView> | null>(null);
	const [isDeltaView, setDeltaView] = useState(false);
	const labels = useCustomLabels();
	const { metadata } = useFieldMetadata(FA_API_NAME);
	const {
		attachment: sourceAttachment,
		attachmentStatus: sourceAttachmentStatus
	} = useGetFaAttachment(sourceAgreement?.id ? sourceAgreement.id : '');

	const {
		attachment: targetAttachment,
		attachmentStatus: targetAttachmentStatus
	} = useGetFaAttachment(targetAgreement?.id ? targetAgreement.id : '');

	useEffect(() => {
		const formatFa = (frameAgreement: FrameAgreement | undefined): Partial<FaDeltaView> => {
			return {
				...frameAgreement,
				...{ products: sourceAttachment?.products }
			};
		};
		if (status === QueryStatus.Success) {
			const sourceFa = agreementList.find((agreement) => agreement.id === faSourceId);
			setSourceAgreement(formatFa(sourceFa) || null);
			const targetFa = agreementList.find((agreement) => agreement.id === faTargetId);
			setTargetAgreement(formatFa(targetFa) || null);
		}
	}, [
		agreementList,
		faSourceId,
		status,
		faTargetId,
		targetAttachmentStatus,
		sourceAttachmentStatus,
		sourceAttachment?.products,
		targetAttachment?.products
	]);

	const findLabel = (apiName: string): string | undefined => {
		const metaInfo = metadata?.find((faMeta) => faMeta.apiName === apiName);

		return metaInfo?.fieldLabel || apiName;
	};

	const faSelectionView: ReactElement = (
		<>
			<div className="lookups-wrapper">
				<CSLookup
					label={labels.sourceFa}
					fieldToBeDisplayed={DISPLAYED_FIELD}
					lookupColumns={AGREEMENT_LOOKUP_OPTIONS}
					lookupOptions={agreementList}
					mode="client"
					onSelectChange={(value): void =>
						setSourceAgreement(
							((value as CSDataTableRowInterface)
								?.data as unknown) as Partial<FaDeltaView>
						)
					}
					{...(sourceAgreement && {
						value: {
							key: sourceAgreement?.id,
							data: sourceAgreement
						} as CSDataTableRowInterface
					})}
					columns={[{ key: 'agreementName' }]}
					options={(agreementList as unknown) as CSDataTableRowInterface[]}
				/>
				<CSLookup
					label={labels.targetFa}
					fieldToBeDisplayed={DISPLAYED_FIELD}
					lookupColumns={AGREEMENT_LOOKUP_OPTIONS}
					lookupOptions={agreementList}
					mode="client"
					onSelectChange={(value): void =>
						setTargetAgreement(
							((value as CSDataTableRowInterface)
								?.data as unknown) as Partial<FaDeltaView>
						)
					}
					{...(targetAgreement && {
						value: {
							key: targetAgreement?.id,
							data: sourceAgreement
						} as CSDataTableRowInterface
					})}
					columns={[{ key: 'agreementName' }]}
					options={(agreementList as unknown) as CSDataTableRowInterface[]}
				/>
			</div>
			<div className="agreements-wrapper">
				<div className="source-agreement-wrapper">
					{sourceAgreement ? (
						<JSONTree
							labelRenderer={([key]): ReactNode => (
								<strong>{findLabel(String([key]))}:</strong>
							)}
							valueRenderer={(raw): ReactNode => <>{raw}</>}
							data={sourceAgreement}
							theme={THEME_DELTA_MODAL}
							invertTheme={true}
							hideRoot={true}
						/>
					) : (
						<p className="modal-notice">
							Select a source agreement value in the lookup
						</p>
					)}
				</div>
				<div className="target-agreement-wrapper">
					{targetAgreement ? (
						<JSONTree
							labelRenderer={([key]): ReactNode => (
								<strong>{findLabel(String([key]))}:</strong>
							)}
							valueRenderer={(raw): ReactNode => <>{raw}</>}
							data={targetAgreement}
							theme={THEME_DELTA_MODAL}
							invertTheme={true}
							hideRoot={true}
						/>
					) : (
						<p className="modal-notice">
							Select a Target Agreement value in the lookup
						</p>
					)}
				</div>
			</div>
		</>
	);

	const onClickCalculateDelta = useCallback((): void => setDeltaView((prevState) => !prevState), [
		[setDeltaView]
	]);

	return (
		<CSModal
			visible={modalOpen}
			onClose={(): void => onClose(false)}
			outerClickClose
			closeButton
			size="large"
			className="delta-modal"
		>
			<CSModalHeader title={labels.deltaTitle}></CSModalHeader>
			<CSModalBody
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: 'fit-content',
					width: 'fit-content'
				}}
			>
				{isDeltaView ? (
					<div>
						{sourceAgreement?.id && targetAgreement?.id && (
							<DeltaView
								sourceFaId={sourceAgreement?.id}
								targetFaId={targetAgreement.id}
							/>
						)}
					</div>
				) : (
					faSelectionView
				)}
			</CSModalBody>
			<CSModalFooter>
				<CSButton label={labels.btnClose} onClick={(): void => onClose(false)} />
				<CSButton
					btnStyle="brand"
					label={isDeltaView ? `< ${labels.btnDeltaSwitchFa}` : labels.btnCalcDelta}
					onClick={onClickCalculateDelta}
				/>
			</CSModalFooter>
		</CSModal>
	);
}
