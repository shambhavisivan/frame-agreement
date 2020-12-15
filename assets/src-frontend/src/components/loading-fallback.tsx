import React, { PropsWithChildren, ReactElement } from 'react';
import { QueryStatus } from 'react-query';

export function LoadingFallback<T>({
	children,
	status
}: PropsWithChildren<T> & { status: QueryStatus }): ReactElement {
	if (status === QueryStatus.Loading) {
		return <span>Loading...</span>;
	}

	if (status === QueryStatus.Error) {
		return <span>Error</span>;
	}

	return <>{children}</>;
}
