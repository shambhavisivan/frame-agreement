import { Subscriber } from '../datasources';

import { FAMClientError } from '../error/fam-client-error-handler';

class PublisherSubscriber {
	private readonly _eventList: Set<string> = new Set<string>([
		'onLoad',
		'onFaSelect',
		'onLoadCommercialProducts',
		'onFaUpdate',
		'onBeforeAddProducts',
		'onBeforeCreateFrameAgreement',
		'onBeforeDeleteProducts',
		'onBeforeDeleteAddons',
		'onAfterAddProducts',
		'onAfterDeleteProducts',
		'onAfterDeleteAddons',
		'onBeforeSaveFrameAgreement',
		'onAfterSaveFrameAgreement',
		'onBeforeNegotiate',
		'onAfterNegotiate',
		'onBeforeBulkNegotiation',
		'onAfterBulkNegotiation',
		'onAfterActivation',
		'onBeforeSubmit',
		'onAfterSubmit',
		'onBeforeActivation',
		'onIframeClose',
		'onLoadOffers',
		'onBeforeAddOffers',
		'onBeforeDeleteOffers',
		'onAfterAddOffers',
		'onAfterDeleteOffers',
		'DCE_onLoadDiscountCodes',
		'DCE_onBeforeApplyCodes',
		'DCE_onApplyCodes',
		'DCE_onBeforeRemoveCodes',
		'DCE_onAfterRemoveCodes'
	]);

	private static _publisherSubscriber: PublisherSubscriber;

	private constructor() {
		Object.freeze(this._eventList);
	}

	public static getInstance(): PublisherSubscriber {
		if (!this._publisherSubscriber) {
			this._publisherSubscriber = new PublisherSubscriber();
		}
		return this._publisherSubscriber;
	}

	private _subscriptions: Map<string, Map<string, <T>(data: T) => Promise<T>>> = new Map<
		string,
		Map<string, <T>(data: T) => Promise<T>>
	>();

	public subscribe = (eventType: string, callback: <T>(data: T) => Promise<T>): Subscriber => {
		if (!this._eventList.has(eventType)) {
			throw new FAMClientError('Cannot find event:' + eventType);
		}

		if (!this._subscriptions.has(eventType)) {
			this._subscriptions.set(eventType, new Map<string, <T>(data: T) => Promise<T>>());
		}

		const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);

		this._subscriptions.get(eventType)?.set(uniqueId, callback);

		return {
			unsubscribe: (): void => {
				this._subscriptions.get(eventType)?.delete(uniqueId);
			}
		};
	};

	public publish = async <T>(eventType: string, dataToPublish: T): Promise<T> => {
		if (!this._eventList.has(eventType)) {
			return Promise.reject(new FAMClientError('Invalid Event type'));
		}

		if (!this._subscriptions.has(eventType) || !this._subscriptions.get(eventType)?.size) {
			return Promise.resolve(dataToPublish);
		}

		let finalArg: T;
		// Idiomatic way
		const promiseChain = Array.from(this._subscriptions.get(eventType)?.values() || []).reduce(
			async (chain: Promise<T>, event: (data: T) => Promise<T>) => {
				const callBackResponse = await chain;
				finalArg = await event(callBackResponse);
				return finalArg;
			},
			Promise.resolve(dataToPublish)
		);

		return promiseChain.then((r: T) => {
			return r || finalArg;
		});
	};
}

export { PublisherSubscriber };
