import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';
import CommercialProductSkeleton from '../skeletons/CommercialProductSkeleton';

import Tabs from '../utillity/tabs/Tabs';
import Tab from '../utillity/tabs/Tab';

// import CommercialProductsTab from './CommercialProductsTab';

class FaTabs extends React.Component {
	constructor(props) {
		super(props);
	}

	async callTabHandler(handlerName, Id) {
		let result = null;
		if (handlerName && this.props.handlers.hasOwnProperty(handlerName)) {
			result = await this.props.handlers[handlerName](Id);
		}
		return result;
	}

	render() {
		let customTabs;

		if (this.props.settings.CustomTabsData.length) {
			customTabs = (
				<Tabs initial={0}>
					<Tab label={window.SF.labels.products_tab_title}>
						{this.props.loading ? (
							<CommercialProductSkeleton count={5} />
						) : (
							<React.Fragment>{this.props.children}</React.Fragment>
						)}
					</Tab>

					{this.props.settings.CustomTabsData.map(tab => {
						return (
							<Tab
								key={'tab-' + tab.container_id}
								label={tab.label}
								onEnter={() => {
									this.callTabHandler(tab.onEnter, tab.container_id);
								}}
							>
								<div
									key={tab.container_id}
									className="card products-card"
									id={tab.container_id}
								/>
							</Tab>
						);
					})}
				</Tabs>
			);
		} else {
			customTabs = <React.Fragment>{this.props.children}</React.Fragment>;
		}

		return customTabs;
	}
}

const mapStateToProps = state => {
	return {
		settings: state.settings,
		handlers: state.handlers
	};
};

const mapDispatchToProps = null;

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FaTabs);
