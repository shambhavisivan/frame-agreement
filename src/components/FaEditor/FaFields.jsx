import React, { Component } from 'react';
import SFField from '../utillity/SFField';
import Icon from '../utillity/Icon';
import Shape from '../skeletons/Shape';

class FaFields extends React.Component {
	constructor(props) {
		super(props);
		// this.props.rows
		// this.props.onChange
		// this.props.fa
		// this.props.editable

		console.log(props.rows);
	}

	render() {
		let _faFields = '';
		if (this.props.rows.length) {
			_faFields = (
				<section className="card basket-details-card">
					{this.props.rows.map((row, i) => {
						return (
							<div className="basket-details-card__row" key={'header-row-' + i}>
								{row.map(f => {
									var editable = !f.readOnly && this.props.editable;
									return (
										<SFField
											editable={editable}
											onChange={this.props.onChange}
											key={f.field}
											field={f}
											value={this.props.fa[f.field] || ''}
										/>
									);
								})}
							</div>
						);
					})}
				</section>
			);
		}

		return _faFields;
	}
}

export default FaFields;
