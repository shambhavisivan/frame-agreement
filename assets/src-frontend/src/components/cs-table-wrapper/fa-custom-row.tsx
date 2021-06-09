import { CSTableRow, CSTableCell } from '@cloudsense/cs-ui-components';
import React, { ReactNode } from 'react';
import { ColumnMetadata } from '.';
import { FrameAgreement } from '../../datasources';

/**
 * Initial version of custom row to show frame agreements.
 */
export const renderCustomRow = (data: FrameAgreement[], columns: ColumnMetadata[]): ReactNode => {
	return data.map((fa: FrameAgreement) => {
		return (
			<div>
				<CSTableRow>
					{columns.map((col) => {
						if (Object.keys(fa).includes(col.apiName)) {
							return (
								<CSTableCell
									maxWidth={'50'}
									text={fa[col.apiName] ? String(fa[col.apiName]) : '-'}
								></CSTableCell>
							);
						}
					})}
				</CSTableRow>
			</div>
		);
	});
};
