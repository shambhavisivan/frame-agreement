'use strict';

import 'babel-polyfill';
import { log } from './utils/shared-service';

const subscriptions = {};
const eventList = [
	'onLoad',
	'onFaSelect',
	'onBeforeAddProducts',
	'onBeforeDeleteProducts',
	'onAfterAddProducts',
	'onAfterDeleteProducts',
	'onBeforeSaveFrameAgreement',
	'onAfterSaveFrameAgreement',
	'onBeforeSubmit',
	'onAfterSubmit'
];

const subscribe = (eventType, callback) => {
	if (!eventList.includes(eventType)) {
		console.warn('Cannot find event:', eventType);
		return false;
	}
	subscriptions[eventType] = callback;

	return {
		unsubscribe: () => {
			delete subscriptions[eventType];
		}
	};
};
window.subscribe = subscribe;

export const publish = async (eventType, arg = null) => {
	log.green('Event triggered: ' + eventType);

	if (!subscriptions[eventType]) {
		return Promise.resolve(arg);
	}

	log.green('Subscriber found for event: ' + eventType);
	return await subscriptions[eventType](arg);
	// return await subscriptions[eventType].apply(null, arg);
};

export const initialiseApi = () => {
	window.FAC = {};
	window.FAC.api = {};
	window.FAC.eventList = eventList;
	window.FAC.subscribe = subscribe;
	window.FAC.api.invokeAction = window.SF.invokeAction.bind(window.SF);

	// FROM OTHER COMPONENTS
	// window.FAC.toaster = ToastsStore;
	// window.FAC.addProducts = this.onAddProducts.bind(this);
	// window.FAC.negotiate = this.onNegotiate.bind(this);
	// window.FAC.toast = this.props.createToast;
	// window.FAC.registerMethod = this.props.registerMethod;
	// window.FAC.getActiveFrameAgreement = () => this.state.activeFa;

	/*
        window.FAC.registerMethod("ActionFunction", () => {
             return new Promise(resolve => {
                 setTimeout(() => {resolve("ActionFunction result")}, 2000);
             });
        })
    */

	log.blue('FAC API initialised!');
};

/*********************************************************/
// subscribe("Test", (data) => Promise.resolve(data || "N/A"))

// subscribe("Test", (data) => {
//     return new Promise(resolve => {
//         resolve(data);
//     });
// })

// let a = await publish("Test", [1, 2, 3]);
// console.log(a)

/*********************************************************/

Object.defineProperty(Array.prototype, 'paginate', {
	value: function(page, pageSize) {
		if (!Array.isArray(this)) {
			return this;
		}
		page = page - 1 || 0;
		return this.slice(page * pageSize, page * pageSize + pageSize);
	}
});

// Object.defineProperty(Array.prototype, 'intercept', {
//     value: function(callback) {
//         if (!Array.isArray(this)) {
//         	return this;
//         }
//         callback(this.length);
//         return this;
//     }
// });
