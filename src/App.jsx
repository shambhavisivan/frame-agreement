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
import Icon from './components/utillity/Icon';

import LandingSkeleton from './components/skeletons/LandingSkeleton';
import EditorSkeleton from './components/skeletons/EditorSkeleton';
import CommercialProductSkeleton from './components/skeletons/CommercialProductSkeleton';

import { withRouter } from 'react-router-dom';

import { publish } from './api';

class App extends Component {
	constructor(props) {
		super(props);

		this.props.getAppSettings().then(response => {
			window.SF.AuthLevels = response.AuthLevels;
			Promise.all([
				this.props.getFrameAgreements(),
				this.props.getCommercialProducts()
			]).then(responseArr => {
				publish('onLoad', [responseArr]);
			});
		});

		this.landing = this.props.history.location.pathname === '/';
	}

	render() {
		let _loadingComponent;

		if (this.landing) {
			_loadingComponent = <LandingSkeleton count={5} />;
		} else {
			_loadingComponent = (
				<React.Fragment>
					<EditorSkeleton count={5} />;
					<div className="skeleton-landing-cp">
						<CommercialProductSkeleton count={5} />
					</div>
				</React.Fragment>
			);
		}

		const loading =
			this.props.initialised.fa_loaded &&
			this.props.initialised.cp_loaded &&
			this.props.initialised.settings_loaded;

		return loading ? (
			<div className="fa-app-wrapper">
				<Switch>
					<Route exact path="/" component={FaList} />
					<Route exact path="/agreement" component={FaEditor} />
					<Route exact path="/agreement/:id" component={FaEditor} />
				</Switch>
			</div>
		) : (
			_loadingComponent
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
