import React, { ReactElement, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { LoadingFallback } from './loading-fallback';

import {
	CSTab,
	CSTabGroup,
	CSChip,
	CSTable,
	CSTableHeader,
	CSTableCell,
	CSTableBody,
	CSTableRow,
	CSDropdown,
	CSButton,
	CSInputSearch,
	CSTooltip,
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter
} from '@cloudsense/cs-ui-components';

export function FrameAgreementList(): ReactElement {
	const { url } = useRouteMatch();
	const { agreements = [], status } = useFrameAgreements();
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	const linkList = agreements.map((agreement) => {
		return (
			<span key={agreement.id}>
				<Link to={`${url}/${agreement.id}`}>{agreement.name}</Link>
				{agreement.agreementLevel === 'Master Agreement' ? (
					<CSTooltip
						iconColor="#c23934"
						position="right-bottom"
						variant="basic"
						maxWidth="25rem"
						padding="0"
						stickyOnClick
						content={
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
				)}
			</span>
		);
	});

	//TODO: Should load labels from SF
	return (
		<LoadingFallback status={status}>
			<div className="tabs-section-wrapper">
				<div className="tabs-search-wrapper">
					<CSTabGroup variant="large">
						<CSTab name="Pending" className="tab-active" active width="11rem">
							<CSChip text="79" variant="brand" />
						</CSTab>
						<CSTab name="Active" width="11rem">
							<CSChip text="12" variant="neutral" />
						</CSTab>
						<CSTab name="Associated" width="11rem">
							<CSChip text="44" variant="neutral" />
						</CSTab>
						<CSTab name="Cancelled" width="11rem">
							<CSChip text="7" variant="neutral" />
						</CSTab>
					</CSTabGroup>
					<CSInputSearch label="Type here" labelHidden placeholder="Quick search" />
				</div>
			</div>
			<div className="table-wrapper">
				<CSTable>
					<CSTableHeader>
						<CSTableCell text="" maxWidth="4rem" />
						<CSTableCell text="FA Name" />
						<CSTableCell text="Effective Start Date" />
						<CSTableCell text="Effective End Date" />
						<CSTableCell text="Description" />
						<CSTableCell text="" />
					</CSTableHeader>
					<CSTableBody>
						<CSTableRow>
							<CSTableCell maxWidth="4rem">
								<CSDropdown
									iconName="threedots_vertical"
									btnType="transparent"
									btnStyle="brand"
								>
									<CSButton label="Edit" iconName="edit" />
									<CSButton label="Clone" iconName="copy" />
									<CSButton label="Delete" iconName="delete" />
									<CSButton
										label="Accounts"
										onClick={(): void => setModalOpen(true)}
										iconName="people"
									/>
								</CSDropdown>
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
											<CSInputSearch
												label="Accounts"
												placeholder="Accounts"
											/>
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
										<CSButton
											label="Cancel"
											onClick={(): void => setModalOpen(false)}
										/>
										<CSButton label="Save" btnStyle="brand" />
									</CSModalFooter>
								</CSModal>
							</CSTableCell>
							<CSTableCell>{linkList[0]}</CSTableCell>
							<CSTableCell text="23.09.2020" />
							<CSTableCell text="22.09.2021" />
							<CSTableCell text="Text" />
							<CSTableCell text="" />
						</CSTableRow>
						<CSTableRow>
							<CSTableCell maxWidth="4rem">
								<CSDropdown
									iconName="threedots_vertical"
									btnType="transparent"
									btnStyle="brand"
								>
									<CSButton label="Edit" iconName="edit" />
									<CSButton label="Clone" iconName="copy" />
									<CSButton label="Delete" iconName="delete" />
									<CSButton label="Accounts" iconName="people" />
								</CSDropdown>
							</CSTableCell>
							<CSTableCell>{linkList[1]}</CSTableCell>
							<CSTableCell text="23.09.2020" />
							<CSTableCell text="22.09.2021" />
							<CSTableCell text="Text" />
							<CSTableCell>
								<CSDropdown
									position="top"
									iconName="change_record_type"
									padding="0"
								>
									<CSTable>
										<CSTableHeader>
											<CSTableCell text="Previous Versions" />
											<CSTableCell text="Date" />
											<CSTableCell text="Action" />
										</CSTableHeader>
										<CSTableBody>
											<CSTableRow>
												<CSTableCell>
													<a href="#">FA1231531351</a>
												</CSTableCell>
												<CSTableCell text="23.09.2020" />
												<CSTableCell>
													<CSButton label="Show delta" size="small" />
												</CSTableCell>
											</CSTableRow>
											<CSTableRow>
												<CSTableCell>
													<a href="#">FA1231531351</a>
												</CSTableCell>
												<CSTableCell text="23.09.2020" />
												<CSTableCell>
													<CSButton label="Show delta" size="small" />
												</CSTableCell>
											</CSTableRow>
											<CSTableRow>
												<CSTableCell>
													<a href="#">FA1231531351</a>
												</CSTableCell>
												<CSTableCell text="23.09.2020" />
												<CSTableCell>
													<CSButton label="Show delta" size="small" />
												</CSTableCell>
											</CSTableRow>
											<CSTableRow>
												<CSTableCell>
													<a href="#">FA1231531351</a>
												</CSTableCell>
												<CSTableCell text="23.09.2020" />
												<CSTableCell>
													<CSButton label="Show delta" size="small" />
												</CSTableCell>
											</CSTableRow>
										</CSTableBody>
									</CSTable>
								</CSDropdown>
							</CSTableCell>
						</CSTableRow>
						<CSTableRow>
							<CSTableCell maxWidth="4rem">
								<CSDropdown
									iconName="threedots_vertical"
									btnType="transparent"
									btnStyle="brand"
								>
									<CSButton label="Edit" iconName="edit" />
									<CSButton label="Clone" iconName="copy" />
									<CSButton label="Delete" iconName="delete" />
									<CSButton label="Accounts" iconName="people" />
								</CSDropdown>
							</CSTableCell>
							<CSTableCell>{linkList[2]}</CSTableCell>
							<CSTableCell text="23.09.2020" />
							<CSTableCell text="22.09.2021" />
							<CSTableCell text="Text" />
							<CSTableCell text="" />
						</CSTableRow>
						<CSTableRow>
							<CSTableCell maxWidth="4rem">
								<CSDropdown
									iconName="threedots_vertical"
									btnType="transparent"
									btnStyle="brand"
								>
									<CSButton label="Edit" iconName="edit" />
									<CSButton label="Clone" iconName="copy" />
									<CSButton label="Delete" iconName="delete" />
									<CSButton label="Accounts" iconName="people" />
								</CSDropdown>
							</CSTableCell>
							<CSTableCell>{linkList[3]}</CSTableCell>
							<CSTableCell text="23.09.2020" />
							<CSTableCell text="22.09.2021" />
							<CSTableCell text="Text" />
							<CSTableCell text="" />
						</CSTableRow>
					</CSTableBody>
				</CSTable>
			</div>
		</LoadingFallback>
	);
}
