import React, { ReactElement } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { FrameAgreementDetails } from './frame-agreement-details';
import { FrameAgreementList } from './frame-agreement-list';

export function Pages(): ReactElement {
	return (
		<Router>
			<Switch>
				<Route path={`/agreement/:agreementId`}>
					<FrameAgreementDetails />
				</Route>
				<Route path="/agreement">
					<FrameAgreementList />
				</Route>
				<Redirect exact from="/" to="/agreement" />
				<Route path="*" component={(): ReactElement => <>'not found'</>} />
			</Switch>
		</Router>
	);
}
