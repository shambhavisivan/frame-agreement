import React, { Component } from 'react';
import { connect } from 'react-redux';

import Pagination from '../utillity/Pagination';
import UsageType from '../utillity/UsageType';
import Icon from '../utillity/Icon';

export class Allowances extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			pagination: {
				page: 1,
				pageSize: 10
			},
			openUt: null
		};
	}

	render() {
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">Name</div>
					<div className="list-cell">Priority</div>
					<div className="list-cell">Amount</div>
					<div className="list-cell">Usage Types</div>
				</div>

				<ul className="table-list">
					{this.props.data
						.paginate(
							this.state.pagination.page,
							this.state.pagination.pageSize
						)
						.map(allowance => {
							return (
								<li key={allowance.Id} className="list-row">
									<div className="list-cell">
										<Icon name="priority" width="14" color="#ccc" />
										{allowance.Name}
									</div>

									<div className="list-cell">
										{allowance.hasOwnProperty('cspmb__priority__c')
											? allowance.cspmb__priority__c
											: 'N/A'}
									</div>

									<div className="list-cell negotiable">
										{allowance.hasOwnProperty('cspmb__amount__c')
											? allowance.cspmb__amount__c
											: 'N/A'}
									</div>

									<div className="list-cell negotiable">
										<UsageType
											open={allowance.Id === this.state.openUt}
											onOpen={() => {
												this.setState({
													openUt:
														this.state.openUt === allowance.Id
															? null
															: allowance.Id
												});
											}}
											allowance={allowance}
											fields={
												this.props.settings.FACSettings.usage_type_fields__c
											}
										/>
									</div>
								</li>
							);
						})}
				</ul>

				<Pagination
					totalSize={this.props.data.length}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: {
								...this.state.pagination,
								pageSize: newPageSize,
								page: 1
							}
						});
					}}
					onPageChange={newPage => {
						this.setState({
							pagination: { ...this.state.pagination, page: newPage }
						});
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		settings: state.settings
	};
};

export default connect(
	mapStateToProps,
	null
)(Allowances);
