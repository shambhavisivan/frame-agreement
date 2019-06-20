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
	'onBeforeNegotiate',
	'onAfterNegotiate',
	'onBeforeBulkNegotiation',
	'onAfterBulkNegotiation',
	'onBeforeSubmit',
	'onAfterSubmit'
];

const subscribe = (eventType, callback) => {
	if (!eventList.includes(eventType)) {
		console.warn('Cannot find event:', eventType);
		return false;
	}

	if (!subscriptions.hasOwnProperty(eventType)) {
		subscriptions[eventType] = [];
	}

	subscriptions[eventType].push(callback);

	return {
		unsubscribe: () => {
			delete subscriptions[eventType];
		}
	};
};

export const publish = async (eventType, arg = null) => {
	log.green('Event triggered: ' + eventType);

	if (!subscriptions[eventType] || !subscriptions[eventType].length) {
		return Promise.resolve(arg);
	}

	log.green('Subscriber found for event: ' + eventType);

	// let _promise = subscriptions[eventType]();

	// Promise.all(subscriptions[eventType].map(e => e())).then(r => {

	// })

	subscriptions[eventType].forEach(e => {
		e(arg);
	});

	// return await subscriptions[eventType].apply(null, arg);
};

export const initialiseApi = () => {
	window.FAM = {};
	window.FAM.api = {};
	window.FAM.eventList = eventList;
	window.FAM.subscribe = subscribe;
	window.FAM.api.invokeAction = window.SF.invokeAction.bind(window.SF);

	// FROM OTHER COMPONENTS
	// window.FAM.toaster = ToastsStore;
	// window.FAM.addProducts = this.onAddProducts.bind(this);
	// window.FAM.negotiate = this.onNegotiate.bind(this);
	// window.FAM.toast = this.props.createToast;
	// window.FAM.registerMethod = this.props.registerMethod;
	// window.FAM.getActiveFrameAgreement = () => this.state.activeFa;

	/*
        window.FAM.registerMethod("ActionFunction", () => {
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

Object.defineProperty(Array.prototype, 'chunk', {
	value: function(chunkSize) {
		var array = this;
		return [].concat.apply(
			[],
			array.map(function(elem, i) {
				return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
			})
		);
	}
});

window.mandatory = function mandatory(funName) {
	throw new Error(
		funName
			? 'Missing parameter in function ' + funName + '!'
			: 'Missing parameter!'
	);
};

// Object.defineProperty(Array.prototype, 'intercept', {
//     value: function(callback) {
//         if (!Array.isArray(this)) {
//         	return this;
//         }
//         callback(this.length);
//         return this;
//     }
// });
// ******************** Custom tabs example **************************
// [
//   {
//     "label": "Custom tab",
//     "container_id": "customTab1",
//     "onEnter": "customTabEnter"
//   }
// ]

// subscribe('onLoad', data => {
// 	return new Promise(resolve => {
// 		window.FAM.registerMethod('customTabEnter', id => {
// 			return new Promise(resolve => {
// 				setTimeout(() => {
// 					// ****************************
// 					console.log('Entered tab with id:' + id);
// 					document.getElementById(id).innerHTML =
// 						'<h1>Some Title</h1><span>test</span>';
// 					// ****************************
// 					resolve();
// 				});
// 			});
// 		});
// 		resolve(data);
// 	});
// });
