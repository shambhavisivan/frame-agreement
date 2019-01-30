import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const logger = store => next => action => {
  console.log('Action fired:', action);
  console.log('New state:', store.getState());
  return next(action);
};

const middleware = applyMiddleware(thunk, logger);

const store = createStore(rootReducer, middleware);

export default store;
