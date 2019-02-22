import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import {
	getFrameAgreements,
	getCommercialProducts,
	getAppSettings
} from './actions';
// import { editModalWidth } from "./actions";
import FaList from './components/FaList';
import FaEditor from './components/FaEditor';

import { withRouter } from 'react-router-dom';

class App extends Component {
	constructor(props) {
		super(props);

		this.props.getAppSettings().then(response => {
			window.SF.AuthLevels = response.AuthLevels;
			this.props.getFrameAgreements();
			this.props.getCommercialProducts();
		});
	}

	// <img className="icon-settings" src="http://www.vicksdesign.com/products/settings-machine-cog-gear-22-B1.png" />
	render() {
		return (
			this.props.initialised.fa_loaded &&
			this.props.initialised.cp_loaded &&
			this.props.initialised.settings_loaded && (
				<Switch>
					<Route exact path="/" component={FaList} />
					<Route exact path="/agreement" component={FaEditor} />
					<Route exact path="/agreement/:id" component={FaEditor} />
				</Switch>
			)
		);
	}
}

const mapDispatchToProps = {
	getFrameAgreements,
	getCommercialProducts,
	getAppSettings
};

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		initialised: state.initialised
	};
};

// export default App;
export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(App)
);
