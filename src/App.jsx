import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import {
	getFrameAgreements,
	getCommercialProducts,
	getPicklistOptions,
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

		this.props.getAppSettings().then(
			response => {
				window.SF.AuthLevels = response.AuthLevels;

				let _promiseArray = [
					this.props.getFrameAgreements(),
					this.props.getCommercialProducts()
				];

				let picklists = response.HeaderData.filter(
					f => f.type === 'picklist'
				).map(f => f.field);

				if (picklists.length) {
					_promiseArray.push(this.props.getPicklistOptions(picklists));
				}

				Promise.all(_promiseArray).then(responseArr => {
					publish('onLoad', [responseArr]);
				});
			},
			reject => {
				console.warn(reject);
			}
		);

		this.landing = this.props.history.location.pathname === '/';
	}

	render() {
		let _loadingComponent;

		if (this.landing) {
			_loadingComponent = <LandingSkeleton count={5} />;
		} else {
			_loadingComponent = (
				<React.Fragment>
					<EditorSkeleton count={5} />
					<div className="skeleton-body--alt">
						<div className="skeleton-landing-cp">
							<CommercialProductSkeleton count={5} />
						</div>
					</div>
				</React.Fragment>
			);
		}

		const loaded =
			this.props.initialised.fa_loaded &&
			this.props.initialised.cp_loaded &&
			this.props.initialised.settings_loaded;

		return loaded ? (
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
	getPicklistOptions,
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
