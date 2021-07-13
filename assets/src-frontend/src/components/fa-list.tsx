import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { GroupedFrameAgreements, useFrameAgreements } from '../hooks/use-frame-agreements';
import { LoadingFallback } from './loading-fallback';

import {
	CSTab,
	CSTabGroup,
	CSChip,
	CSButton,
	CSInputSearch,
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter,
	CSTable,
	CSTableBody,
	CSTableCell,
	CSTableHeader,
	CSTableRow,
	CSTooltip,
	CSDropdown
} from '@cloudsense/cs-ui-components';
import { useAppSettings } from '../hooks/use-app-settings';
import { FieldMetadata, FrameAgreement } from '../datasources';
import { CsTableWrapper } from './cs-table-wrapper';
import { useFieldMetadata } from '../hooks/use-field-metadata';
import { useHistory } from 'react-router';
import { QueryStatus } from 'react-query';
import { useCloneFrameAgreement } from '../hooks/use-clone-frame-agreement';
import { ConfirmationModal } from './dialogs/confirmation-modal';
import { useDeleteFrameAgreement } from '../hooks/use-delete-frame-agreement';
import { useCustomLabels } from '../hooks/use-custom-labels';

const frameAgreementApiName = 'csconta__Frame_Agreement__c';

export function FrameAgreementList(): ReactElement {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { settings, status: settingStatus } = useAppSettings();
	const [activeTab, setActiveTab] = useState('');
	const [openCloneFaInfoDialog, setOpenCloneFaInfoDialog] = useState(false);
	const [selectedFrameAgreementId, setSelectedFrameAgreementId] = useState<FrameAgreement['id']>(
		''
	);
	const [openDeleteFaDialog, setOpenDeleteFaDialog] = useState<boolean>(false);
	const { agreements: groupedAgreements = [], status } = useFrameAgreements();
	const { metadata, metadataStatus } = useFieldMetadata(frameAgreementApiName);
	const { cloneFrameAgreement } = useCloneFrameAgreement();
	const { deleteFrameAgreement } = useDeleteFrameAgreement();
	const history = useHistory();
	const labels = useCustomLabels();

	useEffect(() => {
		if (status === QueryStatus.Success && settingStatus === QueryStatus.Success) {
			setActiveTab(settings?.facSettings.statuses.draftStatus || '');
		}
	}, [status, settingStatus, metadataStatus, settings?.facSettings.statuses.draftStatus]);

	const renderCustomRow = (data: FrameAgreement[], columns: FieldMetadata[]): ReactNode => {
		const isMaster = (agreementLevel: string): ReactNode =>
			agreementLevel === 'Master Agreement' ? (
				<CSTooltip
					iconColor="#c23934"
					position="right-bottom"
					variant="basic"
					maxWidth="25rem"
					padding="0"
					stickyOnClick
					content={
						// TODO: should reuse cstable to render dynamic child FAs.
						<CSTable>
							<CSTableHeader>
								<CSTableCell text="Member FAs" />
								<CSTableCell text="Effective Start Date" />
								<CSTableCell text="Effective End Date" />
							</CSTableHeader>
							<CSTableBody>
								<CSTableRow>
									<CSTableCell>
										<a href="#">FA1231531351</a>
									</CSTableCell>
									<CSTableCell text="23.09.2020" />
									<CSTableCell text="22.09.2021" />
								</CSTableRow>
								<CSTableRow>
									<CSTableCell>
										<a href="#">FA1231531351</a>
									</CSTableCell>
									<CSTableCell text="23.09.2020" />
									<CSTableCell text="22.09.2021" />
								</CSTableRow>
								<CSTableRow>
									<CSTableCell>
										<a href="#">FA1231531351</a>
									</CSTableCell>
									<CSTableCell text="23.09.2020" />
									<CSTableCell text="22.09.2021" />
								</CSTableRow>
								<CSTableRow>
									<CSTableCell>
										<a href="#">FA1231531351</a>
									</CSTableCell>
									<CSTableCell text="23.09.2020" />
									<CSTableCell text="22.09.2021" />
								</CSTableRow>
							</CSTableBody>
						</CSTable>
					}
				/>
			) : (
				''
			);

		const redirectToDetails = (faId: string): void => {
			history.push(`${history.location.pathname}/${faId}`);
		};

		const dropDown = (faId: string): ReactNode => (
			<CSDropdown iconName="threedots_vertical" btnType="transparent" btnStyle="brand">
				<CSButton
					label="Edit"
					iconName="edit"
					onClick={(): void => redirectToDetails(faId)}
				/>
				<CSButton
					label="Clone"
					iconName="copy"
					onClick={(): void => {
						setSelectedFrameAgreementId(faId);
						setOpenCloneFaInfoDialog(true);
					}}
				/>
				<CSButton
					label="Delete"
					iconName="delete"
					onClick={(): void => {
						setSelectedFrameAgreementId(faId);
						setOpenDeleteFaDialog(true);
					}}
				/>
			</CSDropdown>
		);

		return data?.map((fa: FrameAgreement) => {
			return (
				<div key={fa.id}>
					<CSTableRow rowId={fa.id}>
						{dropDown(fa.id)}
						{columns.map((col, index) => {
							const apiName: keyof FrameAgreement = (col.apiName as unknown) as keyof FrameAgreement;
							// should render only to the first cell
							const childFaPanel =
								index === 0 && fa.agreementLevel && isMaster(fa.agreementLevel);
							if (Object.keys(fa).includes(col.apiName)) {
								return (
									<CSTableCell
										maxWidth={'50'}
										text={fa[apiName] ? String(fa[apiName]) : '-'}
										onClick={(): void => redirectToDetails(fa.id)}
									>
										{childFaPanel}
									</CSTableCell>
								);
							} else {
								return (
									<CSTableCell
										maxWidth={'50'}
										text={'-'}
										onClick={(): void => redirectToDetails(fa.id)}
									>
										{childFaPanel}
									</CSTableCell>
								);
							}
						})}
					</CSTableRow>
				</div>
			);
		});
	};

	const cloneFaInfoModal = (
		<ConfirmationModal
			title={labels.alertCloneFaTitle}
			message={labels.alertCloneFaMessage}
			open={openCloneFaInfoDialog}
			onClose={(): void => setOpenCloneFaInfoDialog(false)}
			onConfirm={async (): Promise<void> => {
				selectedFrameAgreementId.length &&
					(await cloneFrameAgreement(selectedFrameAgreementId));
				setOpenCloneFaInfoDialog(false);
			}}
			confirmText={labels.alertCloneFaBtnAction}
		/>
	);

	const deleteFaInfoModal = (
		<ConfirmationModal
			title={labels.alertDeleteAgreementsTitle}
			message={labels.alertDeleteAgreementsMessage}
			open={openDeleteFaDialog}
			onClose={(): void => setOpenDeleteFaDialog(false)}
			onConfirm={async (): Promise<void> => {
				selectedFrameAgreementId.length &&
					(await deleteFrameAgreement(selectedFrameAgreementId));
				setOpenDeleteFaDialog(false);
			}}
			confirmText={labels.btnDeleteAgreements}
		/>
	);

	return (
		<LoadingFallback status={status}>
			<div className="tabs-section-wrapper">
				<div className="tabs-search-wrapper">
					<CSTabGroup variant="large">
						{settings?.facSettings?.statuses &&
							Object.values(settings.facSettings.statuses).map((status) => {
								const renderChip = (status: string): ReactElement | null => {
									const agreements = ((groupedAgreements as unknown) as GroupedFrameAgreements)[
										`${status}`
									];
									return (
										<CSChip
											text={String(
												agreements?.length ? agreements.length : 0
											)}
											variant="brand"
										/>
									);
								};
								return (
									status && (
										<CSTab
											key={status}
											name={status}
											className={status === activeTab ? 'tab-active' : ''}
											active={status === activeTab}
											width="11rem"
											onClick={(): void => setActiveTab(status)}
										>
											{renderChip(status)}
										</CSTab>
									)
								);
							})}
					</CSTabGroup>
					<CSInputSearch
						label="Type here"
						labelHidden
						placeholder="Quick search"
						width="13rem"
					/>
				</div>
			</div>
			{cloneFaInfoModal}
			{deleteFaInfoModal}
			<div className="table-wrapper">
				{activeTab.length && (
					<CsTableWrapper
						data={
							((groupedAgreements as unknown) as GroupedFrameAgreements)[
								`${activeTab}`
							]
						}
						columnMetadata={metadata as FieldMetadata[]}
						rowRenderer={renderCustomRow}
					/>
				)}
				<CSModal
					visible={modalOpen}
					onClose={(): void => setModalOpen(false)}
					outerClickClose
					size="xlarge"
				>
					<CSModalHeader title="Account Associations">
						<div className="account-details-wrapper">
							<span>FA-178923</span>
							<span>Test accout</span>
						</div>
					</CSModalHeader>
					<CSModalBody padding="2rem 1rem 0.75rem 1rem">
						<div className="accounts-wrapper">
							<CSInputSearch label="Accounts" placeholder="Accounts" />
						</div>
						<div className="buttons-wrapper">
							<CSButton
								label="hidden"
								labelHidden
								iconName="right"
								btnType="transparent"
								btnStyle="brand"
								size="small"
							/>
							<CSButton
								label="hidden"
								labelHidden
								iconName="left"
								btnType="transparent"
								btnStyle="brand"
								size="small"
							/>
						</div>
						<div className="account-associations-wrapper">
							<CSInputSearch label="Account Associations" />
						</div>
					</CSModalBody>
					<CSModalFooter>
						<CSButton label="Cancel" onClick={(): void => setModalOpen(false)} />
						<CSButton label="Save" btnStyle="brand" />
					</CSModalFooter>
				</CSModal>
			</div>
		</LoadingFallback>
	);
}
