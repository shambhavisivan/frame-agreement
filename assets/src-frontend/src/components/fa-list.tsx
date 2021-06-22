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
	CSTooltip
} from '@cloudsense/cs-ui-components';
import { useAppSettings } from '../hooks/use-app-settings';
import { FieldMetadata, FrameAgreement } from '../datasources';
import { CsTableWrapper } from './cs-table-wrapper';
import { useFieldMetadata } from '../hooks/use-field-metadata';
import { useHistory } from 'react-router';
import { QueryStatus } from 'react-query';

const frameAgreementApiName = 'csconta__Frame_Agreement__c';

export function FrameAgreementList(): ReactElement {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { settings, status: settingStatus } = useAppSettings();
	const [activeTab, setActiveTab] = useState('');
	const { agreements: groupedAgreements = {}, status } = useFrameAgreements();
	const { metadata, metadataStatus } = useFieldMetadata(frameAgreementApiName);
	const history = useHistory();

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

		return data?.map((fa: FrameAgreement) => {
			return (
				<div key={fa.id}>
					<CSTableRow
						rowId={fa.id}
						onClick={(): void => history.push(`${history.location.pathname}/${fa.id}`)}
					>
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
									>
										{childFaPanel}
									</CSTableCell>
								);
							} else {
								return (
									<CSTableCell maxWidth={'50'} text={'-'}>
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

	//TODO: Should load labels from SF
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
