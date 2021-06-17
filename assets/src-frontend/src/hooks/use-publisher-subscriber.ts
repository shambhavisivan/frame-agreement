import { Subscriber } from '../datasources';
import { PublisherSubscriber } from '../module/publisher-subscriber';

export function useSubscriber(eventType: string, callback: <T>(data: T) => Promise<T>): Subscriber {
	const publisherSubscriber: PublisherSubscriber = PublisherSubscriber.getInstance();
	return publisherSubscriber.subscribe(eventType, callback);
}

export function usePublisher<T>(eventType: string, dataToPublish: T): Promise<T> {
	const publisherSubscriber: PublisherSubscriber = PublisherSubscriber.getInstance();
	return publisherSubscriber.publish(eventType, dataToPublish);
}
