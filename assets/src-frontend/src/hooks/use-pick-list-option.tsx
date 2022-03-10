import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { FieldPickList, remoteActions } from '../datasources';
import { useCustomLabels } from './use-custom-labels';

export function usePickListOption(
	sObjectNameList: Array<string>
): {
	pickListStatus: QueryStatus;
	pickList: FieldPickList | undefined;
} {
	const { data = {}, status } = useQuery(
		[QueryKeys.faFieldPickList, ...sObjectNameList],
		() => {
			return remoteActions.getPicklistOptions(sObjectNameList);
		},
		{
			enabled: sObjectNameList?.length > 0
		}
	);

	const labels = useCustomLabels();

	Object.keys(data).forEach((fieldName) => {
		if (data[fieldName]?.length) {
			data[fieldName] = [
				{
					label: labels.faNone,
					value: ''
				},
				...data[fieldName]
			];
		}
	});

	return {
		pickListStatus: status,
		pickList: data
	};
}
