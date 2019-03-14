import React, { Component } from 'react';
import './ExpandableArticle.css';

class ExpandableArticle extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expanded: false
		};
	}

	render() {
		return (
			<div
				className={
					'expandable-article' + (this.state.expanded ? ' expanded' : '')
				}
			>
				<span className="expandable-text">{this.props.children}</span>
				{this.props.children.length >= 100 && (
					<span
						className="expandable-more"
						onClick={() => {
							this.setState({ expanded: !this.state.expanded });
						}}
					>
						{this.state.expanded ? 'less' : 'more'}
					</span>
				)}
			</div>
		);
	}
}

export default ExpandableArticle;
