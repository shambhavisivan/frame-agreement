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
	CSTableCell,
	CSTableRow,
	CSTooltip,
	CSDropdown,
	CSToastApi,
	CSTable,
	CSTableBody,
	CSTableHeader
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
import { formatCellValue } from './cs-table-wrapper/cell-formatter';
import { FIELD_METADATA_CHILD_FA } from '../app-constants';
import { DeltaModal, DeltaModalProps } from './dialogs/delta-modal';
import { FA_API_NAME } from '../app-constants';

export function FrameAgreementList(): ReactElement {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { settings, status: settingStatus } = useAppSettings();
	const [activeTab, setActiveTab] = useState('');
	const [openCloneFaInfoDialog, setOpenCloneFaInfoDialog] = useState(false);
	const [selectedFrameAgreementId, setSelectedFrameAgreementId] = useState<FrameAgreement['id']>(
		''
	);
	const [openDeleteFaDialog, setOpenDeleteFaDialog] = useState<boolean>(false);
	const [filterString, setFilterString] = useState('');
	const [deltaModalProps, setDeltaModalProps] = useState<Partial<DeltaModalProps>>({
		modalOpen: false
	});
	const { agreementList = [], status } = useFrameAgreements(
		filterString.length
			? {
					name: filterString,
					activeTab: activeTab
			  }
			: null
	);

	const [groupedAgreements, setGroupedFrameAgreements] = useState<GroupedFrameAgreements>({});
	const { metadata, metadataStatus } = useFieldMetadata(FA_API_NAME);
	const { cloneFrameAgreement } = useCloneFrameAgreement();
	const { deleteFrameAgreement } = useDeleteFrameAgreement();
	const history = useHistory();
	const labels = useCustomLabels();

	useEffect(() => {
		if (status === QueryStatus.Success && settingStatus === QueryStatus.Success) {
			setActiveTab(settings?.facSettings.statuses.draftStatus || '');

			const groupedResultsByStatus: GroupedFrameAgreements = agreementList
				?.filter((fa) => fa.status)
				.reduce((groupedFA, curentFA): GroupedFrameAgreements => {
					const faStatus = curentFA?.status;
					if (faStatus) {
						if (groupedFA[faStatus]) {
							groupedFA[faStatus].push(curentFA);
						} else {
							groupedFA[faStatus] = [curentFA];
						}
						return groupedFA;
					}
					return {} as GroupedFrameAgreements;
				}, {} as GroupedFrameAgreements);

			setGroupedFrameAgreements(groupedResultsByStatus);
		}
	}, [
		status,
		settingStatus,
		metadataStatus,
		settings?.facSettings.statuses.draftStatus,
		agreementList
	]);

	const renderChildFaRows = (
		data: FrameAgreement[],
		fieldMetadata: FieldMetadata[]
	): ReactNode => {
		return data?.map((fa: FrameAgreement) => {
			return (
				<CSTableRow>
					{fieldMetadata.map((col) => {
						const apiName: keyof FrameAgreement = (col.apiName as unknown) as keyof FrameAgreement;
						if (Object.keys(fa).includes(col.apiName)) {
							return (
								<CSTableCell
									maxWidth={'50'}
									text={
										fa[apiName]
											? String(formatCellValue(fa[apiName], col.fieldType))
											: '-'
									}
								></CSTableCell>
							);
						} else {
							return <CSTableCell maxWidth={'50'} text={'-'}></CSTableCell>;
						}
					})}
				</CSTableRow>
			);
		});
	};

	const renderCustomRow = (data: FrameAgreement[], columns: FieldMetadata[]): ReactNode => {
		const isMaster = (fa: FrameAgreement): ReactNode => {
			if (fa.agreementLevel === 'Master Agreement') {
				const childAgreements = Object.values(groupedAgreements)
					.flat()
					.filter((agreement) => agreement.masterFrameAgreement === fa.id);
				return (
					<div onMouseEnter={(): void => setSelectedFrameAgreementId(fa.id)}>
						<CSTooltip
							iconColor="#c23934"
							position="right-bottom"
							variant="basic"
							maxWidth="25rem"
							padding="5"
							stickyOnClick
							content={
								<CsTableWrapper
									columnMetadata={FIELD_METADATA_CHILD_FA}
									data={childAgreements}
									disableColumnChooser={true}
									rowRenderer={renderChildFaRows}
								/>
							}
						/>
					</div>
				);
			}
		};

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
						<CSTableCell className="row-editor" maxWidth="2.625rem">
							{dropDown(fa.id)}
						</CSTableCell>
						{columns.map((col, index) => {
							const apiName: keyof FrameAgreement = (col.apiName as unknown) as keyof FrameAgreement;
							// should render only to the first cell
							const childFaPanel = index === 0 && fa.agreementLevel && isMaster(fa);
							if (Object.keys(fa).includes(col.apiName)) {
								return (
									<CSTableCell
										maxWidth={'50'}
										text={
											fa[apiName]
												? String(
														formatCellValue(fa[apiName], col.fieldType)
												  )
												: '-'
										}
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
						<CSTableCell className="column-chooser-placeholder" maxWidth="2.625rem">
							{fa.replacedFrameAgreement && (
								<CSDropdown
									align="right"
									mode="custom"
									position="top"
									iconName="change_record_type"
									padding="0"
									dropdownClassName="delta-dropdown"
								>
									<CSTable>
										<CSTableHeader>
											<CSTableCell text="Previous Versions" />
											<CSTableCell text="Effective Start Date" />
											<CSTableCell text="Action" />
										</CSTableHeader>
										<CSTableBody>
											{Object.values(groupedAgreements)
												.flat()
												.filter(
													(faVal) =>
														faVal.id === fa.replacedFrameAgreement
												)
												.map((agreement) => (
													<CSTableRow>
														<CSTableCell>
															{agreement.agreementName}
														</CSTableCell>
														<CSTableCell>
															{agreement.effectiveStartDate}
														</CSTableCell>
														<CSTableCell>
															<CSButton
																label={labels.btnDelta}
																btnStyle={'brand'}
																onClick={(): void =>
																	setDeltaModalProps({
																		modalOpen: true,
																		faTargetId: agreement.id,
																		faSourceId: fa.id
																	})
																}
															/>
														</CSTableCell>
													</CSTableRow>
												))}
										</CSTableBody>
									</CSTable>
								</CSDropdown>
							)}
						</CSTableCell>
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

	const deltaModal = (
		<DeltaModal
			modalOpen={deltaModalProps.modalOpen || false}
			onClose={(): void => setDeltaModalProps({ modalOpen: false })}
			{...deltaModalProps}
		></DeltaModal>
	);

	return (
		<LoadingFallback status={status}>
			<div className="tabs-section-wrapper">
				<div className="tabs-search-wrapper">
					<CSTabGroup variant="large">
						{settings?.facSettings?.statuses &&
							Object.values(settings.facSettings.statuses).map((status) => {
								const renderChip = (): ReactElement | null => {
									const agreements = ((groupedAgreements as unknown) as GroupedFrameAgreements)[
										status
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
											{renderChip()}
										</CSTab>
									)
								);
							})}
					</CSTabGroup>
					<CSInputSearch
						label="search-input"
						value={filterString}
						autoFocus={true}
						labelHidden
						placeholder="Search agreements"
						width="13rem"
						onClearSearch={(): void => setFilterString('')}
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {
							if (event.key === 'Enter') {
								if (event.currentTarget?.value.length === 0) {
									setFilterString('');
								} else if (event.currentTarget?.value.length >= 3) {
									setFilterString(event.currentTarget?.value);
								} else {
									CSToastApi.renderCSToast(
										{
											variant: 'error',
											text: labels.filterTextWarningMessage,
											closeButton: true
										},
										'top-center',
										3
									);
								}
							}
						}}
					/>
				</div>
			</div>
			{cloneFaInfoModal}
			{deleteFaInfoModal}
			{deltaModal}
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
