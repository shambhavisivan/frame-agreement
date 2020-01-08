'use strict';

import 'babel-polyfill';
import { log } from './utils/shared-service';

export const subscriptions = {};

window.subscriptions = subscriptions;

const eventList = new Set([
	'onLoad',
	'onFaSelect',
	'onLoadCommercialProducts',
	'onFaUpdate',
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
	'onAfterSubmit',
	'onBeforeActivation',
	'onIframeClose'
]);

const dgEventPrefix = 'DGE_';
const dcEventPrefix = 'DCE_';

export const hasSubscription = event => {
	return subscriptions.hasOwnProperty(event);
};

const subscribe = (eventType, callback) => {
	if (
		!eventList.has(eventType) &&
		!eventType.startsWith(dgEventPrefix) &&
		!eventType.startsWith(dcEventPrefix)
	) {
		console.warn('Cannot find event:', eventType);
		return false;
	}

	if (!subscriptions.hasOwnProperty(eventType)) {
		subscriptions[eventType] = [];
	}

	let newIndex = subscriptions[eventType].push(callback) - 1;

	return {
		unsubscribe: () => {
			subscriptions[eventType].splice(newIndex, 1);
		}
	};
};

export const publish = async (eventType, arg = null) => {
	log.green('Event triggered: ' + eventType);

	if (!subscriptions[eventType] || !subscriptions[eventType].length) {
		return Promise.resolve(arg);
	}

	log.green('Subscriber found for event: ' + eventType);

	let _finalArg;
	// Idiomatic way
	let _promiseChain = subscriptions[eventType].reduce((chain, event) => {
		return chain.then(async r => {
			_finalArg = await event(r);
			return _finalArg;
		});
	}, Promise.resolve(arg));

	return _promiseChain.finally(r => {
		return r || _finalArg;
	});
};

export const initialiseApi = () => {
	window.FAM = {};
	window.FAM.api = {};
	window.FAM.eventList = Array.from(eventList);
	window.FAM.subscribe = subscribe;
	window.FAM.publish = publish;

	log.blue('FAC API initialised!');
};

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

Number.prototype.getDecimals = function() {
	if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
	return this.toString().split('.')[1].length || 0;
};

window.mandatory = function mandatory(funName) {
	throw new Error(
		funName
			? 'Missing parameter in function ' + funName + '!'
			: 'Missing parameter!'
	);
};

// ****************************************************************
// NON store actions (pure remote actions)
// ****************************************************************
export function performAction(className, params) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('performAction', [className, params]).then(
			response => {
				resolve(response);
				return response;
			}
		);
	});
}

export function createPricingRuleGroup(faId) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('createPricingRuleGroup', [faId]).then(prId => {
			resolve(prId);
			return prId;
		});
	});
}

export function decomposeAttachment(data, prId, faId) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('decomposeAttachment', [
			JSON.stringify(data),
			prId,
			faId
		]).then(message => {
			resolve(message);
			return message;
		});
	});
}

export function undoDecomposition(prId) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('undoDecomposition', [prId]).then(message => {
			resolve(message);
			return message;
		});
	});
}
export function approveRejectRecallRecord(recordId, comments, action) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('approveRejectRecallRecord', [
			recordId.slice(0, 15),
			comments,
			action
		]).then(response => {
			resolve(response);
			return response;
		});
	});
}

export function reassignApproval(recordId, newActorId) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('reassignApproval', [
			recordId.slice(0, 15),
			newActorId
		]).then(response => {
			resolve(response);
			return response;
		});
	});
}

export function submitForApproval(faId) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('submitForApproval', [faId.slice(0, 15)]).then(
			response => {
				resolve(response);
				return response;
			}
		);
	});
}
