import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import {
	CSButton,
	CSLookup,
	CSModal,
	CSModalBody,
	CSModalHeader
} from '@cloudsense/cs-ui-components';
import { QueryStatus, useFrameAgreements } from '../../hooks/use-frame-agreements';
import { FrameAgreement } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import JSONTree from 'react-json-tree';
import { useFieldMetadata } from '../../hooks/use-field-metadata';
import { FA_API_NAME, THEME_DELTA_MODAL } from '../../app-constants';

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

export function DeltaModal({
	modalOpen,
	onClose,
	faSourceId,
	faTargetId
}: DeltaModalProps): ReactElement {
	const { agreementList = [], status } = useFrameAgreements();
	const [sourceAgreement, setSourceAgreement] = useState<FrameAgreement | null>(null);
	const [targetAgreement, setTargetAgreement] = useState<FrameAgreement | null>(null);
	const labels = useCustomLabels();
	const { metadata } = useFieldMetadata(FA_API_NAME);

	useEffect(() => {
		if (status === QueryStatus.Success) {
			const sourceFa = agreementList.find((agreement) => agreement.id === faSourceId);
			setSourceAgreement(sourceFa || ({} as FrameAgreement) || null);
			const targetFa = agreementList.find((agreement) => agreement.id === faTargetId);
			setTargetAgreement(targetFa || ({} as FrameAgreement) || null);
		}
	}, [agreementList, faSourceId, status, faTargetId]);

	const findLabel = (apiName: string): string | undefined => {
		const metaInfo = metadata?.find((faMeta) => faMeta.apiName === apiName);

		return metaInfo?.fieldLabel;
	};

	return (
		<CSModal
			visible={modalOpen}
			onClose={(): void => onClose(false)}
			outerClickClose
			size="medium"
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
				<div>
					<CSLookup
						label={labels.sourceFa}
						fieldToBeDisplayed={DISPLAYED_FIELD}
						lookupColumns={AGREEMENT_LOOKUP_OPTIONS}
						lookupOptions={agreementList}
						mode="client"
						onSelectChange={(value): void => setSourceAgreement(value)}
						{...(sourceAgreement && { value: sourceAgreement })}
					/>
					<CSLookup
						label={labels.targetFa}
						fieldToBeDisplayed={DISPLAYED_FIELD}
						lookupColumns={AGREEMENT_LOOKUP_OPTIONS}
						lookupOptions={agreementList}
						mode="client"
						onSelectChange={(value): void => setTargetAgreement(value)}
						{...(targetAgreement && { value: targetAgreement })}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						flexWrap: 'wrap',
						flexFlow: 'column'
					}}
				>
					<div>
						{labels.sourceFa}
						<div>
							<JSONTree
								labelRenderer={([key]): ReactNode => (
									<strong>{findLabel(String([key]))}</strong>
								)}
								valueRenderer={(raw): ReactNode => <strong>{raw}</strong>}
								data={sourceAgreement}
								theme={THEME_DELTA_MODAL}
								invertTheme={false}
								hideRoot={true}
							/>
						</div>
					</div>
					<div>
						{labels.targetFa}
						<div>
							<JSONTree
								labelRenderer={([key]): ReactNode => (
									<strong>{findLabel(String([key]))}</strong>
								)}
								valueRenderer={(raw): ReactNode => <strong>{raw}</strong>}
								data={targetAgreement}
								theme={THEME_DELTA_MODAL}
								invertTheme={false}
								hideRoot={true}
							/>
						</div>
					</div>
				</div>
			</CSModalBody>
			<CSModalHeader>
				<CSButton label={labels.btnCalcDelta}></CSButton>
				<CSButton label={labels.btnClose} onClick={(): void => onClose(false)}></CSButton>
			</CSModalHeader>
		</CSModal>
	);
}