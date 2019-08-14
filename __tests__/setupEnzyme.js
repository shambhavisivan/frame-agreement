import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: false });

if (!window.FAM) {
	window.FAM = {
		api: {},
		subscribe: jest.fn()
	};
}
