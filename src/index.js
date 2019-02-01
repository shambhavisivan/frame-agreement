import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import App from './App';
import store from './store';

import sharedService from './utils/shared-service';

import './index.scss';
import './_temp.scss';

function _initialiseFAM() {
  window.redux_store = store;
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>,
    document.getElementById('fam')
  );
}

window.initialiseFAM = _initialiseFAM.bind(this);
_initialiseFAM();
module.hot.accept();
