import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const ignoredActions = ['ADD_TOAST', 'SHIFT_TOAST'];

const logger = store => next => action => {
	if (!ignoredActions.includes(action.type)) {
		console.log('%cAction fired:', 'color: #d81c2a', action);
	}
	window.react_logs.push(action.type);
	return next(action);
};

const middleware = applyMiddleware(thunk, logger);

const store = createStore(rootReducer, middleware);

export default store;
