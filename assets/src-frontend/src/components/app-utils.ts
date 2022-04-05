import { CSToastApi, CSToastVariant } from '@cloudsense/cs-ui-components';
import { DEFAULT_TOAST_DURATION, DEFAULT_TOAST_LOCATION } from '../app-constants';

type CapitalizeString<T extends string> = Capitalize<Lowercase<T>>;
export type ToastPosition =
	| 'top-left'
	| 'top-right'
	| 'top-center'
	| 'bottom-left'
	| 'bottom-right';

export function capitalizeString<T extends string>(
	inputString: T
): CapitalizeString<T> | undefined {
	if (!inputString) {
		return;
	}
	const stringVal = inputString.toLowerCase(); // normalise input to lower case.
	return `${stringVal[0].toLocaleUpperCase()}${stringVal.slice(1)}` as CapitalizeString<T>;
}

export function isNotUndefinedOrNull(value: number | null | undefined): boolean {
	return value !== undefined && value !== null;
}

export function showToast(
	variantType: CSToastVariant,
	toastMessageTitle: string,
	optionalParams?: {
		toastMessageDetail?: string;
		durationInSecond?: number;
		showCloseButton?: boolean;
		toastLocation?: ToastPosition;
	}
): void {
	CSToastApi.renderCSToast(
		{
			variant: variantType,
			text: toastMessageTitle,
			detail: optionalParams?.toastMessageDetail,
			closeButton:
				optionalParams?.showCloseButton !== undefined
					? optionalParams?.showCloseButton
					: true
		},
		optionalParams?.toastLocation ? optionalParams?.toastLocation : DEFAULT_TOAST_LOCATION,
		optionalParams?.durationInSecond ? optionalParams?.durationInSecond : DEFAULT_TOAST_DURATION
	);
}
