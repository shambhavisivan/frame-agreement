import React, { ReactElement } from 'react';
import { useAppSettings } from '../hooks/use-app-settings';
import {
	CSButton,
	CSMainHeader,
	CSMainHeaderLeft,
	CSMainHeaderRight,
	CSMainHeaderIcon,
	CSIcon,
	CSDropdown
} from '@cloudsense/cs-ui-components';
import { FrameAgreement } from '../datasources';
import { useUpsertFrameAgreements } from '../hooks/use-upsert-frame-agreements';

export function Header(): ReactElement {
	const { settings } = useAppSettings();
	const { mutate } = useUpsertFrameAgreements();

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

		return upsertedFa as FrameAgreement;
	};

	return (
		<CSMainHeader maxWidth="1200px">
			<CSMainHeaderIcon>
				<CSIcon name="lead" origin="cs" frame color="#3cdbc0" />
			</CSMainHeaderIcon>
			<CSMainHeaderLeft
				subtitle="Frame Agreement Negotiation Console"
				title={settings?.account.name ? settings.account.name : ''}
			/>
			<CSMainHeaderRight>
				<CSDropdown
					label={'Add Agreements'}
					data-testid="cs-drop-down-test-id"
					btnStyle="brand"
				>
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
			</CSMainHeaderRight>
		</CSMainHeader>
	);
}
