import thunk from 'redux-thunk';

import * as actions from '../src/actions/index';

import configureStore from 'redux-mock-store';
import { getInitStore, getFa } from './testUtils';

const mockStore = configureStore([thunk]);

describe('select_actions', () => {
	const store = mockStore(getInitStore());

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

	beforeEach(() => {
		// Runs before each test in the suite
		store.clearActions();
	});

	describe('actions', () => {
		it('should create an action using function that returns dispatch', () => {
			const expectedAction = {
				type: 'REGISTER_METHOD',
				payload: {
					name: 'testName',
					method: 'shouldBeAfunction'
				}
			};

			actions.registerMethod(expectedAction.payload.name, expectedAction.payload.method)(store.dispatch);
			expect(store.getActions()).toEqual([expectedAction]);
		});

		it('should call performAction without error', () => {
			// performAction
			return expect(actions.performAction('getFrameAgreements', [])).resolves.toBe('Success');
		});

		it('should call actions for creating custom rule group without error', () => {
			return actions
				.loadAccounts({ field: 'csconta__replaced_frame_agreement__c' })(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0]).toEqual({ ...actions._loadAccounts(), payload: { data: resp } });
					expect(resp.length).toEqual(33);
				});
		});

		describe('create pricing rule actions', () => {
			it('should be called without error (createPricingRuleGroup)', () => {
				return expect(actions.createPricingRuleGroup()).resolves.toBe('pricingRuleId');
			});

			it('should be called without error (decomposeAttachment)', () => {
				return expect(actions.decomposeAttachment()).resolves.toBe('Success');
			});

			it('should be called without error (undoDecomposition)', () => {
				return expect(actions.undoDecomposition()).resolves.toBe('Success');
			});
		});

		it('should call getApprovalHistory without an error', () => {
			return actions
				.getApprovalHistory('faId')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('GET_APPROVAL_HISTORY');
					expect(resp.currentUser).toEqual('0051t0000025wM9AAI');
				});
		});

		it('should call approveRejectRecallRecord without an error', () => {
			return expect(actions.approveRejectRecallRecord('recordId')).resolves.toBeTruthy();
		});

		it('should create an action setCustomData using function that returns dispatch', () => {
			const expectedAction = {
				type: 'SET_CD',
				payload: {
					faId: 'test_faId',
					data: 'test_data'
				}
			};

			actions.setCustomData(expectedAction.payload.faId, expectedAction.payload.data)(store.dispatch);
			expect(store.getActions()).toEqual([expectedAction]);
		});

		it('should create negotiate actions using dispatch methods', () => {
			const expectedAction_negotiate = {
				type: 'NEGOTIATE',
				payload: {
					faId: 'test_faId',
					priceItemId: 'test_priceItemId',
					type: 'test_type',
					data: 'test_data'
				}
			};

			const expectedAction_apiNegotiate = {
				type: 'NEGOTIATE_API',
				payload: {
					faId: 'test_faId',
					data: 'test_data'
				}
			};

			const expectedAction_bulkNegotiate = {
				type: 'NEGOTIATE_BULK',
				payload: {
					faId: 'test_faId',
					data: 'test_data'
				}
			};

			store.dispatch(actions.negotiate('test_faId', 'test_priceItemId', 'test_type', 'test_data'));
			store.dispatch(actions.apiNegotiate('test_faId', 'test_data'));
			store.dispatch(actions.bulkNegotiate('test_faId', 'test_data'));

			store.getActions();

			expect(store.getActions()).toEqual([expectedAction_negotiate, expectedAction_apiNegotiate, expectedAction_bulkNegotiate]);
		});

		it('should call getFrameAgreement without an error', () => {
			return actions
				.getFrameAgreement('a1t1t0000009wpQAAQ')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('GET_FA');
					expect(resp.Id).toEqual('a1t1t0000009wpQAAQ');
				});
		});

		it('should call refreshFrameAgreement without an error', () => {
			return actions
				.refreshFrameAgreement('a1t1t0000009wpQAAQ')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('REFRESH_FA');
					expect(resp.Id).toEqual('a1t1t0000009wpQAAQ');
				});
		});

		it('should call setFrameAgreementState without an error', () => {
			return actions
				.setFrameAgreementState('a1t1t0000009wpQAAQ', 'newStatus')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('GET_FA');
					expect(resp).toEqual('Success');
				});
		});

		it('should call createNewVersionOfFrameAgrement without an error', () => {
			return actions
				.createNewVersionOfFrameAgrement('a1t1t0000009wpQAAQ')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('NEW_VERSION');
					expect(resp.csconta__Agreement_Name__c.endsWith('_v2')).toBeTruthy();
				});
		});

		it('should call reassignApproval without an error', () => {
			return expect(actions.reassignApproval('recordId')).resolves.toBeTruthy();
		});

		it('should call submitForApproval without an error', () => {
			return expect(actions.submitForApproval('recordId')).resolves.toBeTruthy();
		});

		it('should create an action toggleFieldVisibility using function that returns dispatch', () => {
			const expectedAction = {
				type: 'TOGGLE_FIELD_VISIBILITY',
				payload: 'index'
			};

			store.dispatch(actions.toggleFieldVisibility(expectedAction.payload));
			expect(store.getActions()).toEqual([expectedAction]);
		});

		it('should create an action toggleFaFieldVisibility using function that returns dispatch', () => {
			const expectedAction = {
				type: 'TOGGLE_FA_FIELD_VISIBILITY',
				payload: 'index'
			};

			store.dispatch(actions.toggleFaFieldVisibility(expectedAction.payload));

			expect(store.getActions()).toEqual([expectedAction]);
		});

		it('should create an action out of several pure dispatch methods', () => {
			const expectedActionOrder = [
				'SET_VALIDATION',
				'VALIDATE_FA',
				'TOGGLE_MODALS',
				'REMOVE_TOAST',
				'CLEAR_TOAST_QUEUE',
				'ADD_TOAST',
				'RESET_NEGOTIATION',
				'UPDATE_FA'
			];

			store.dispatch(actions.setValidation());
			store.dispatch(actions.validateFrameAgreement());
			store.dispatch(actions._toggleModals());
			store.dispatch(actions._removeToast());
			store.dispatch(actions._clearToasts());
			store.dispatch(actions.addToast());
			store.dispatch(actions.resetNegotiation());
			store.dispatch(actions.updateFrameAgreement());

			expect(store.getActions().map(disp => disp.type)).toEqual(expectedActionOrder);
		});

		it('should create an getAppSettings action', () => {
			return actions
				.getAppSettings()(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('RECIEVE_SETTINGS');
					expect(resp.commercialProductCount).toEqual(10);
				});
		});

		it('should create an cloneFrameAgreement action', () => {
			return actions
				.cloneFrameAgreement('a1t1t0000009wpQAAQ')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('RECIEVE_CLONE_FA');
					expect(resp.csconta__Agreement_Name__c).toEqual('Frame Agreement - Test #1');
				});
		});

		it('should create an deleteFrameAgreement action', () => {
			return actions
				.deleteFrameAgreement('a1t1t0000009wpQAAQ')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('DELETE_FA');
					expect(resp).toEqual('Success');
				});
		});

		it('should create an getCommercialProductData action', () => {
			return actions
				.getCommercialProductData(['a1F1t0000001JBoEAM', 'a1F1t0000001JBZEA2', 'a1F1t0000001JBUEA2'])(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('RECIEVE_PRICE_ITEM_DATA');
					// expect(resp).toEqual(3);
				});
		});

		it('should create an addFaToMaster action', () => {
			return actions
				.addFaToMaster('a1t1t0000009wpQAAQ', ['a1t1t000000A0gJAAS'])(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('ADD_FA');
					expect(resp).toEqual(['a1t1t000000A0gJAAS']);
				});
		});

		it('should create an removeFaFromMaster action', () => {
			return actions
				.removeFaFromMaster('a1t1t0000009wpQAAQ', ['a1t1t000000A0gJAAS'])(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('REMOVE_FA');
					expect(resp).toEqual(['a1t1t000000A0gJAAS']);
				});
		});

		it('should create an addProductsToFa action', () => {
			return actions
				.addProductsToFa('a1t1t0000009wpQAAQ', ['a1F1t0000001JBjEAM'])(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('ADD_PRODUCTS');
					expect(resp).toEqual(['a1F1t0000001JBjEAM']);
				});
		});

		it('should create an removeProductsFromFa action', () => {
			return actions
				.removeProductsFromFa('a1t1t0000009wpQAAQ', ['a1F1t0000001JBjEAM'])(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('REMOVE_PRODUCTS');
					expect(resp).toEqual(['a1F1t0000001JBjEAM']);
				});
		});

		it('should create an filterCommercialProducts action', () => {
			return actions
				.filterCommercialProducts([])(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('FILTER_COMMERCIAL_PRODUCTS');
					expect(resp.length).toEqual(11);
				});
		});

		it('should create an getFrameAgreements action', () => {
			return actions
				.getFrameAgreements()(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('RECIEVE_FRAME_AGREEMENTS');
					expect(resp.length).toEqual(4);
				});
		});

		it('should create an getAttachment action', () => {
			return actions
				.getAttachment('a1t1t0000009wpQAAQ')(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('RECIEVE_GET_ATTACHMENT');
					expect(Object.keys(resp.products).length).toEqual(4);
				});
		});

		it('should create an saveFrameAgreement action', () => {
			return actions
				.saveFrameAgreement(getFa())(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('SAVE_FA');
					expect(resp[0].Id).toEqual('a1t1t0000009wpQAAQ');
				});
		});

		it('should create an createFrameAgreement action', () => {
			return actions
				.createFrameAgreement([])(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('CREATE_FA');
				});
		});

		it('should create an getCommercialProducts action', () => {
			return actions
				.getCommercialProducts()(store.dispatch)
				.then(resp => {
					const executed_actions = store.getActions();
					expect(executed_actions[0].type).toEqual('RECIEVE_COMMERCIAL_PRODUCTS');
					expect(resp.length).toEqual(11);
				});
		});
	});
});
