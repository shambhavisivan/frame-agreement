/*
  props.onActionTaken -> function
  props.faId -> string
*/
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { ApprovalProcess } from '../src/components/ApprovalProcess';
import { getMockStore, getInitStore, getFa } from './testUtils';

import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as actions from '../src/actions/index';

import { Provider } from 'react-redux';

function setupApp() {
	let _frameAgreements = getMockStore(['frameAgreements']);
	_frameAgreements.a1t1t0000009wpQAAQ = getFa();
	_frameAgreements = {..._frameAgreements, ['a1t1t0000009wpQAAQ']: {..._frameAgreements.a1t1t0000009wpQAAQ, _ui: {..._frameAgreements.a1t1t0000009wpQAAQ._ui, approval: {}}}}
	_frameAgreements.a1t1t0000009wpQAAQ._ui.approval.listProcess = [];

	const props = {
		faId: 'a1t1t0000009wpQAAQ',
		getApprovalHistory: actions.getApprovalHistory,
		refreshFrameAgreement: actions.refreshFrameAgreement,
		approveRejectRecallRecord: actions.approveRejectRecallRecord,
		reassignApproval: actions.reassignApproval,
		createToast: actions.createToast,
		frameAgreements:  _frameAgreements
	};

	const mockStore = configureStore();
	const store = mockStore(getInitStore());

	return actions
		.getApprovalHistory('a1t1t0000009wpQAAQ')(store.dispatch)
		.then(response => {
			const enzymeWrapper = shallow(<ApprovalProcess {...props} />);
			return enzymeWrapper;
		});
}

describe('FaEditor component', () => {
	beforeEach(() => {});

	it('should render without errors', () => {
		return setupApp().then(response => {

			const enzymeWrapper = response;
			const instance = enzymeWrapper.instance();
			instance.componentWillUpdate();

			instance.refreshApprovalHistory();

			instance.approvalAction();
			instance.approvalAction("Reassign");

			expect(enzymeWrapper.find('.header__title')).toBeTruthy();
			enzymeWrapper.find('.header__title').simulate('click');
			enzymeWrapper.update();
			expect(enzymeWrapper.state().open).toBe(true);




		});
	});
});
