import React, { createContext, ReactElement } from 'react';
import { FrameAgreement } from '../datasources';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { useUpsertFrameAgreements } from '../hooks/use-upsert-frame-agreements';

export const faStatusContext = createContext<{
	faStatus: string;
	setFaStatus: (faStatus: string) => Promise<FrameAgreement | unknown>;
}>({
	faStatus: '',
	setFaStatus: (faStatus: string): Promise<FrameAgreement | unknown> => Promise.resolve()
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const FaStatusProvider = faStatusContext.Provider;
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FaStatusConsumer = faStatusContext.Consumer;

export function FaStatusContextProvider({
	children,
	faId
}: {
	faId: string;
	children: (ReactElement | string | undefined)[];
}): ReactElement {
	const { agreementList } = useFrameAgreements();
	const frameAgreement = agreementList?.find((fa) => fa.id === faId);
	const { mutate } = useUpsertFrameAgreements();

	return (
		<FaStatusProvider
			value={{
				faStatus: frameAgreement?.status as string,
				setFaStatus: (agreementStatus: string): Promise<FrameAgreement | unknown> =>
					mutate({
						faId,
						fieldData: {
							// eslint-disable-next-line @typescript-eslint/naming-convention
							csconta__Status__c: agreementStatus
						}
					})
			}}
		>
			{children}
		</FaStatusProvider>
	);
}
