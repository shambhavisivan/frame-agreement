import { capitalizeString, isNotUndefinedOrNull } from './app-utils';
import { CSToastApi, CSToastVariant } from '@cloudsense/cs-ui-components';
import { DEFAULT_TOAST_DURATION, DEFAULT_TOAST_LOCATION } from '../app-constants';
import { showToast, ToastPosition } from './app-utils';

describe('app-utils', () => {
	describe('test capitalize first letter', () => {
		test('should captitaze and return valid string', () => {
			const result = capitalizeString('lamborghini');

			expect(result).toEqual('Lamborghini');
		});

		test('should return undefined', () => {
			const result = capitalizeString('');

			expect(result).toBeUndefined();
		});

		test('should normalise string and capitalise first letter', () => {
			const result = capitalizeString('maHinDraThar');

			expect(result).toEqual('Mahindrathar');
		});
	});

	describe('isNotUndefinedOrNull', () => {
		test('should return true if the given number is not undefined or null', () => {
			const testNum = 100;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(true);
		});

		test('should return false if the given number is undefined', () => {
			const testNum = undefined;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(false);
		});

		test('should return false if the given number is null', () => {
			const testNum = null;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(false);
		});

		test('should return true if the given number is 0', () => {
			const testNum = 0;

			const result = isNotUndefinedOrNull(testNum);

			expect(result).toEqual(true);
		});
	});

	describe('toast', () => {
		const csToastApiSpy = jest.spyOn(CSToastApi, 'renderCSToast');
		test('should display the toast message without optional Params', async () => {
			const toastType: CSToastVariant = 'success';
			const title = 'Toast Title';

			showToast(toastType, title);

			expect(csToastApiSpy).toBeCalledWith(
				{ variant: toastType, text: title, detail: undefined, closeButton: true },
				DEFAULT_TOAST_LOCATION,
				DEFAULT_TOAST_DURATION
			);
		});

		test('should display the toast message with all optional Params', async () => {
			const toastType: CSToastVariant = 'success';
			const title = 'Toast Title';
			const optionalParams = {
				durationInSecond: 10,
				toastMessageDetail: 'Toast Message',
				showCloseButton: false,
				toastLocation: 'bottom-right' as ToastPosition
			};

			showToast(toastType, title, optionalParams);

			expect(csToastApiSpy).toBeCalledWith(
				{
					variant: toastType,
					text: title,
					detail: optionalParams.toastMessageDetail,
					closeButton: optionalParams.showCloseButton
				},
				optionalParams.toastLocation,
				optionalParams.durationInSecond
			);
		});

		test('should display the toast message with some optional Params', async () => {
			const toastType: CSToastVariant = 'success';
			const title = 'Toast Title';
			const durationAndLocationParams = {
				toastMessageDetail: 'Toast Message',
				durationInSecond: 10,
				toastLocation: 'bottom-right' as ToastPosition
			};

			showToast(toastType, title, durationAndLocationParams);

			expect(csToastApiSpy).toBeCalledWith(
				{
					variant: toastType,
					text: title,
					detail: durationAndLocationParams.toastMessageDetail,
					closeButton: true
				},
				durationAndLocationParams.toastLocation,
				durationAndLocationParams.durationInSecond
			);

			const durationAndCloseBUttonParams = {
				durationInSecond: 10,
				showCloseButton: false
			};

			showToast(toastType, title, durationAndCloseBUttonParams);

			expect(csToastApiSpy).toBeCalledWith(
				{
					variant: toastType,
					text: title,
					detail: undefined,
					closeButton: durationAndCloseBUttonParams.showCloseButton
				},
				DEFAULT_TOAST_LOCATION,
				durationAndCloseBUttonParams.durationInSecond
			);

			const positionAndCloseBUttonParams = {
				toastLocation: 'bottom-right' as ToastPosition,
				showCloseButton: false
			};

			showToast(toastType, title, positionAndCloseBUttonParams);

			expect(csToastApiSpy).toBeCalledWith(
				{
					variant: toastType,
					text: title,
					detail: undefined,
					closeButton: positionAndCloseBUttonParams.showCloseButton
				},
				positionAndCloseBUttonParams.toastLocation,
				DEFAULT_TOAST_DURATION
			);
		});
	});
});
