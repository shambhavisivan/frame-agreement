import React, { Component } from 'react';

class Tabs extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			activeTabIndex: this.props.initial || 0
		};
		this.handleTabClick = this.handleTabClick.bind(this);
	}

	// Toggle currently active tab
	handleTabClick(i) {
		this.setState({
			activeTabIndex: i
		});

		if (this.props.onTabChange) {
			this.props.onTabChange(i);
		}
	}
	// Encapsulate <Tabs/> component API as props for <Tab/> children
	renderChildrenWithTabsApiAsProps() {
		return React.Children.map(this.props.children, (child, index) => {
			return React.cloneElement(child, {
				onClick: this.handleTabClick,
				tabIndex: index,
				isActive: index === this.state.activeTabIndex
			});
		});
	}

	// Render current active tab content
	renderActiveTabContent() {
		const { children } = this.props;
		const { activeTabIndex } = this.state;

		let _children = children.reduce((acc, iter) => {
			if (Array.isArray(iter)) {
				return [...acc, ...iter];
			} else {
				return [...acc, ...[iter]];
			}
		}, []);

		if (_children[activeTabIndex]) {
			return _children[activeTabIndex].props.children;
		}
	}

	render() {
		return (
			<div className="fa-tab-group-wrapper">
				<div className="fa-tab-group">
					<ul className="fa-tabs-primary">{this.renderChildrenWithTabsApiAsProps()}</ul>
				</div>
				<div className="fa-tab-content">{this.renderActiveTabContent()}</div>
			</div>
		);
	}
}

export default Tabs;
