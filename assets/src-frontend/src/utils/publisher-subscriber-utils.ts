import { Subscriber } from '../datasources';
import { PublisherSubscriber } from '../module/publisher-subscriber';

export function subscribeEvent(
	eventType: string,
	callback: <T>(data: T) => Promise<T>
): Subscriber {
	const publisherSubscriber: PublisherSubscriber = PublisherSubscriber.getInstance();
	return publisherSubscriber.subscribe(eventType, callback);
}

export async function publishEventData<T>(eventType: string, dataToPublish: T): Promise<T> {
	const publisherSubscriber: PublisherSubscriber = PublisherSubscriber.getInstance();
	return await publisherSubscriber.publish(eventType, dataToPublish);
}
