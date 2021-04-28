import React, { ReactElement, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { LoadingFallback } from './loading-fallback';
import { CSTab, CSTabGroup, CSChip } from '@cloudsense/cs-ui-components';
import { CSButton, CSDropdown } from '@cloudsense/cs-ui-components';
import { useAppSettings } from '../hooks/use-app-settings';
import { useUpsertFrameAgreements } from '../hooks/use-upsert-frame-agreements';
import { FrameAgreement } from '../datasources';

export function FrameAgreementList(): ReactElement {
	const { url } = useRouteMatch();
	const { agreements = [], status } = useFrameAgreements();
	const [faList, addFa] = useState(agreements);
	const { settings } = useAppSettings();
	const { mutate } = useUpsertFrameAgreements();

	useEffect(() => {
		if (status === 'success') {
			addFa(agreements);
		}
	}, [status, agreements]);

	const linkList = faList.map((agreement) => {
		return (
			<li key={agreement.id}>
				<Link to={`${url}/${agreement.id}`}>{agreement.name}</Link>
				<p>{agreement.agreementLevel === 'Master Agreement' ? 'Master' : ''}</p>
			</li>
		);
	});

	const createFa = async (isMaster: boolean): Promise<FrameAgreement> => {
		const newFa: Partial<SfGlobal.FrameAgreement> = {
			/* eslint-disable @typescript-eslint/naming-convention */
			csconta__agreement_level__c: isMaster ? 'Master Agreement' : 'Frame Agreement',
			csconta__Status__c: settings?.facSettings.statuses.draft_status as string,
			csconta__Account__c: settings?.account.id
			/* eslint-enable @typescript-eslint/naming-convention */
		};

		const upsertedFa = await mutate({
			faId: null,
			fieldData: newFa
		});

		if (upsertedFa) {
			addFa((prevState) => [...prevState, upsertedFa as FrameAgreement]);
			return upsertedFa as FrameAgreement;
		}

		return upsertedFa as FrameAgreement;
	};
	//TODO: Should load labels from SF
	return (
		<LoadingFallback status={status}>
			<div className="tabs-wrapper">
				<CSTabGroup variant="large">
					<CSTab name="Active" className="cs-tab-name-active" active>
						<CSChip text="79" variant="brand" />
					</CSTab>
					<CSTab name="Pending">
						<CSChip text="44" variant="neutral" />
					</CSTab>
				</CSTabGroup>
			</div>
			<div>
				<h2>Frame Agreements</h2>
				<CSDropdown label={'Add Agreements'} data-testid="cs-drop-down-test-id">
					<CSButton
						label="Master FA"
						onClick={(): Promise<
							FrameAgreement | SfGlobal.FrameAgreement | undefined
						> => createFa(true)}
					/>
					<CSButton
						label="FA"
						onClick={(): Promise<
							FrameAgreement | SfGlobal.FrameAgreement | undefined
						> => createFa(false)}
					/>
				</CSDropdown>
				<ul data-testid="fa-list-test-id">{linkList}</ul>
			</div>
		</LoadingFallback>
	);
}
