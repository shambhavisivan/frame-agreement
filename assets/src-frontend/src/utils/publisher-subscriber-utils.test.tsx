import { publishEventData, subscribeEvent } from './publisher-subscriber-utils';

describe('usePublisherSubscriber', () => {
	test('PublisherSubscriber hooks should publish data and should be successfully received by subscriber', async () => {
		const eventType = 'onLoadOffers';
		let dataReceivedBySubscriber = false;

		const testData = 'some event data';

		subscribeEvent(eventType, (data) => {
			return new Promise((resolve) => {
				dataReceivedBySubscriber = true;
				resolve(data);
			});
		});

		await publishEventData(eventType, testData);

		expect(dataReceivedBySubscriber).toBe(true);
	});

	test('Subscriber should not receive data after unsubscribing', async () => {
		const eventType = 'onLoadOffers';
		let dataReceivedBySubscriber = false;

		const testData = 'some event data';

		const returnedSubscription = subscribeEvent(eventType, (data) => {
			return new Promise((resolve) => {
				dataReceivedBySubscriber = true;
				resolve(data);
			});
		});
		returnedSubscription.unsubscribe();

		await publishEventData(eventType, testData);

		expect(dataReceivedBySubscriber).toBe(false);
	});
});
