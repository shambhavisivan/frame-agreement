import { Deforcified, deforcify } from '../datasources/deforcify';
import { CUSTOM_LABELS_MOCK } from '../datasources/mock-data';

export function useCustomLabels(): Deforcified<SfGlobal.CustomLabelsSf> {
	/* eslint-disable deprecation/deprecation */
	return window.SF?.labels
		? deforcify(window.SF?.labels)
		: process.env.NODE_ENV === 'development'
		? deforcify(CUSTOM_LABELS_MOCK)
		: ({} as Deforcified<SfGlobal.CustomLabelsSf>);
}
