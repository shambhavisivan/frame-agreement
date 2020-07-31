import { connect } from 'react-redux';
import React, { Component } from 'react';

import RelatedListTable from './RelatedListTable';

const tryParse = entity => {
	try {
		entity = JSON.parse(entity);
	} catch (err) {}
	return entity;
};

class RelatedLists extends Component {
	constructor(props) {
		super(props);

		this.fa = this.props.frameAgreements[this.props.faId];
		this.relatedLists = this.fa._ui.relatedLists || [];
	}

	render() {
		return (
			<div className="card basket-details-card related-lists-container">
				{this.relatedLists.map((rl, i) => {
					return <RelatedListTable list={rl} key={'rl' + i} />;
				})}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RelatedLists);
