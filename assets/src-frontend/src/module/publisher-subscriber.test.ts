import { CommercialProductStandalone } from '../datasources';
import { FAMClientError } from '../error/fam-client-error-handler';
import { PublisherSubscriber } from './publisher-subscriber';

let publisherSubscriber: PublisherSubscriber;

const commercialProducts: Array<CommercialProductStandalone> = [
	{
		id: 'a1F1t0000001JBoEAM',
		name: 'Mobile L_7',
		contractTerm: '12 Months',
		oneOffCharge: 60.2336,
		recurringCharge: 269.665423,
		isActive: true,
		isOneOffDiscountAllowed: true,
		isRecurringDiscountAllowed: true
	},
	{
		id: 'a1F1t0000001JBZEA2',
		name: 'Mobile L_4',
		contractTerm: '12 Months',
		oneOffCharge: 60.2336,
		recurringCharge: 269,
		isActive: true,
		isOneOffDiscountAllowed: true,
		isRecurringDiscountAllowed: true
	}
];

beforeAll(() => {
	publisherSubscriber = PublisherSubscriber.getInstance();
});

describe('Subscribe events', () => {
	test('PublisherSubscriber object should be singleton', async () => {
		const anotherPublisherSubscriber = PublisherSubscriber.getInstance();

		expect(publisherSubscriber).toBe(anotherPublisherSubscriber);
	});

	test('Should be able unsubscribe to the events which were subscribed', async () => {
		const eventType = 'onLoadOffers';
		let subscriptionCount = 0;
		const returnedSubscription = publisherSubscriber.subscribe(eventType, (data) => {
			return new Promise((resolve) => {
				subscriptionCount += 1;
				resolve(data);
			});
		});

		await publisherSubscriber.publish(eventType, commercialProducts);
		await publisherSubscriber.publish(eventType, commercialProducts);

		returnedSubscription.unsubscribe();

		await publisherSubscriber.publish(eventType, commercialProducts);

		expect(subscriptionCount).toEqual(2);
	});

	test('Should be able subscribe and unsubscribe to the same events x times', async () => {
		const eventType = 'onLoadOffers';
		let firstSubscriberCount = 0;
		let secondSubscriberCount = 0;
		let thirdSubscriberCount = 0;
		const returnedSubscription = publisherSubscriber.subscribe(eventType, (data) => {
			return new Promise((resolve) => {
				firstSubscriberCount += 1;
				resolve(data);
			});
		});
		const returnedSubscription2 = publisherSubscriber.subscribe(eventType, (data) => {
			return new Promise((resolve) => {
				secondSubscriberCount += 1;
				resolve(data);
			});
		});
		publisherSubscriber.subscribe(eventType, (data) => {
			return new Promise((resolve) => {
				thirdSubscriberCount += 1;
				resolve(data);
			});
		});

		await publisherSubscriber.publish(eventType, commercialProducts);

		expect(firstSubscriberCount).toEqual(1);
		expect(secondSubscriberCount).toEqual(1);
		expect(thirdSubscriberCount).toEqual(1);

		returnedSubscription.unsubscribe();
		await publisherSubscriber.publish(eventType, commercialProducts);

		expect(firstSubscriberCount).toEqual(1);
		expect(secondSubscriberCount).toEqual(2);
		expect(thirdSubscriberCount).toEqual(2);

		returnedSubscription2.unsubscribe();
		await publisherSubscriber.publish(eventType, commercialProducts);

		expect(firstSubscriberCount).toEqual(1);
		expect(secondSubscriberCount).toEqual(2);
		expect(thirdSubscriberCount).toEqual(3);
	});

	test('Error must be thrown when subscription is done to invalid event', () => {
		const subscribeError = (): void => {
			publisherSubscriber.subscribe('gibberishEvent', (data) => {
				return Promise.resolve(data);
			});
		};

		expect(subscribeError).toThrowError(FAMClientError);
	});
});

describe('Publish events', () => {
	test('Data should be published for valid events', async () => {
		const publishedData: Array<CommercialProductStandalone> = await publisherSubscriber.publish(
			'onLoadOffers',
			commercialProducts
		);

		expect(publishedData).toEqual(commercialProducts);
	});

	test('Error must be thrown when data is published for an invalid event', () => {
		const invalidEventPublishedData = (): Promise<Array<CommercialProductStandalone>> => {
			return publisherSubscriber.publish('gibberishEvent', commercialProducts);
		};
		expect(invalidEventPublishedData()).rejects.toThrow(FAMClientError);
	});

	test('Subscriber should receive the exact data published to the subscribed event', async () => {
		publisherSubscriber.subscribe('onLoadOffers', (data) => {
			return new Promise((resolve) => {
				expect(commercialProducts).toEqual(data);
				resolve(data);
			});
		});

		await publisherSubscriber.publish('onLoadOffers', commercialProducts);
	});

	test('Every Subscriber callback functions must be executed when the data is published', async () => {
		const eventType = 'onLoadOffers';
		let isSubscriber1DataReceived = false;
		let isSubscriber2DataReceived = false;
		publisherSubscriber.subscribe(eventType, (data) => {
			return new Promise((resolve) => {
				isSubscriber1DataReceived = true;
				resolve(data);
			});
		});
		publisherSubscriber.subscribe(eventType, (data) => {
			return new Promise((resolve) => {
				isSubscriber2DataReceived = true;
				resolve(data);
			});
		});
		await publisherSubscriber.publish(eventType, commercialProducts);

		expect(isSubscriber1DataReceived).toStrictEqual(true);
		expect(isSubscriber2DataReceived).toStrictEqual(true);
	});
});
