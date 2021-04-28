/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: ts throwing weird errors should remove eslint rule again.
export function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
	return fn as jest.MockedFunction<T>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
