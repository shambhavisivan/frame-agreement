import { act, renderHook } from '@testing-library/react-hooks';
import React, { ReactElement } from 'react';
import { QueryCache } from 'react-query';
import { mockAppSettings } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-mock';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { QueryStatus, useAppSettings } from './use-app-settings';

describe('useAppSettings', () => {
	describe('within the AppSettingsProvider', () => {
		describe('without the settings preloaded', () => {
			const queryCache = new QueryCache();

			const getAppSettings = jest.fn(remoteActions.getAppSettings);

			const remoteActionsWithSpy = {
				...remoteActions,
				getAppSettings
			};

			test('returns settings and calls getAppSettings once - by AppSettingsProvider itself', async () => {
				expect(getAppSettings.mock.calls.length).toBe(0);

				const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
					<RemoteActionsProvider
						queryCache={queryCache}
						remoteActions={remoteActionsWithSpy}
					>
						{children}
					</RemoteActionsProvider>
				);

				const { result, waitFor } = renderHook(
					() => useAppSettings(remoteActionsWithSpy.getAppSettings),
					{
						wrapper
					}
				);

				await waitFor(() => {
					return result.current.status === QueryStatus.Success;
				});

				expect(result.current.settings).toEqual(mockAppSettings);
				expect(getAppSettings.mock.calls.length).toBe(1);
			});
		});

		describe('with the settings preloaded', () => {
			const queryCache = new QueryCache();

			const getAppSettings = jest.fn(remoteActions.getAppSettings);

			const remoteActionsWithSpy = {
				...remoteActions,
				getAppSettings
			};

			test('returns settings and calls getAppSettings only once - when preloading', async () => {
				act(() => {
					queryCache.prefetchQuery('appSettings', remoteActionsWithSpy.getAppSettings);
				});

				const expectedNumberOfCallsAfterPreloading = 1;
				expect(getAppSettings.mock.calls.length).toBe(expectedNumberOfCallsAfterPreloading);

				const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
					<RemoteActionsProvider
						queryCache={queryCache}
						remoteActions={remoteActionsWithSpy}
					>
						{children}
					</RemoteActionsProvider>
				);

				const { result, waitFor } = renderHook(
					() => useAppSettings(remoteActionsWithSpy.getAppSettings),
					{
						wrapper
					}
				);

				await waitFor(() => {
					return result.current.status === QueryStatus.Success;
				});

				expect(result.current.settings).toEqual(mockAppSettings);
				expect(getAppSettings.mock.calls.length).toBe(expectedNumberOfCallsAfterPreloading);
			});
		});

		describe('outside of the AppSettingsProvider', () => {
			describe('without the settings preloaded', () => {
				const getAppSettings = jest.fn(remoteActions.getAppSettings);

				const remoteActionsWithSpy = {
					...remoteActions,
					getAppSettings
				};

				test('returns settings and calls getAppSettings once', async () => {
					const { result, waitFor } = renderHook(() =>
						useAppSettings(remoteActionsWithSpy.getAppSettings)
					);

					await waitFor(() => {
						return result.current.status === QueryStatus.Success;
					});

					expect(result.current.settings).toEqual(mockAppSettings);
					expect(getAppSettings.mock.calls.length).toBe(1);
				});
			});
		});
	});
});
