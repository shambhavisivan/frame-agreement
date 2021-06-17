import { usePublisher, useSubscriber } from './use-publisher-subscriber';

describe('usePublisherSubscriber', () => {
	test('PublisherSubscriber hooks should publish data and should be successfully received by subscriber', async () => {
		const eventType = 'onLoadOffers';
		let dataReceivedBySubscriber = false;

		const testData = 'some event data';

		useSubscriber(eventType, (data) => {
			return new Promise((resolve) => {
				dataReceivedBySubscriber = true;
				resolve(data);
			});
		});

		await usePublisher(eventType, testData);

		expect(dataReceivedBySubscriber).toBe(true);
	});

	test('Subscriber should not receive data after unsubscribing', async () => {
		const eventType = 'onLoadOffers';
		let dataReceivedBySubscriber = false;

		const testData = 'some event data';

		const returnedSubscription = useSubscriber(eventType, (data) => {
			return new Promise((resolve) => {
				dataReceivedBySubscriber = true;
				resolve(data);
			});
		});
		returnedSubscription.unsubscribe();

		await usePublisher(eventType, testData);

		expect(dataReceivedBySubscriber).toBe(false);
	});
});
