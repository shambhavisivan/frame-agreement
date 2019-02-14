'use strict';
import store from '../../store';

let AuthLevels;

store.subscribe(() => {
  	AuthLevels = store.getState().settings.AuthLevels;
})

export const validateNegotiation = field => {
	console.log(AuthLevels);
	return true;
};

