import React, { ReactElement } from 'react';
import { HashRouter as Router, Redirect, Route, Switch, useParams } from 'react-router-dom';
import { FrameAgreementDetails } from './fa-details';
import { FrameAgreementList } from './fa-list';
import { NotFound } from './not-found';

type ParseRouteParameters<Route> = Route extends `${string}/:${infer Param}/${infer Rest}`
	? { [Entry in Param | keyof ParseRouteParameters<`/${Rest}`>]: string }
	: Route extends `${string}/:${infer Param}`
	? { [Entry in Param]: string }
	: Record<string, unknown>;

type FaDetailsRoute = `/agreement/:agreementId`;
type FaListRoute = `/agreement`;

const frameAgreementDetailsRoute: FaDetailsRoute = '/agreement/:agreementId';
const frameAgreementListRoute: FaListRoute = '/agreement';

export function Pages(): ReactElement {
	return (
		<Router>
			<Switch>
				<Route path={frameAgreementDetailsRoute}>
					<FrameAgreementDetailsPage />
				</Route>
				<Route path={frameAgreementListRoute}>
					<FrameAgreementListPage />
				</Route>
				<Redirect exact from="/" to="/agreement" />
				<Route path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}

function FrameAgreementDetailsPage(): ReactElement {
	const { agreementId } = useParams<ParseRouteParameters<FaDetailsRoute>>();

	return <FrameAgreementDetails agreementId={agreementId} />;
}

function FrameAgreementListPage(): ReactElement {
	return <FrameAgreementList />;
}
