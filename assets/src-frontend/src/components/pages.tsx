import React, { ReactElement } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { FrameAgreementDetails } from './fa-details';
import { FrameAgreementList } from './fa-list';
import { NotFound } from './not-found';

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
				<Route path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}
