import React, { Component } from "react";
import { truncateCPField } from "../../../utils/shared-service";
import Pagination from "../../utillity/Pagination";

class DGTargets extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = {
			page: 1
		};
	}

	render() {
		let fields = [...new Set(this.props.fields)];

		return (
			<div className='dg-results-container'>
				<div className='fa-modal-product-list-header'>
					<div className='header-th'>Name</div>
					{fields.map(f => {
						return (
							<div key={f} className='header-th'>
								<span>{truncateCPField(f)}</span>
							</div>
						);
					})}
				</div>
				<div className='fa-modal-product-list'>
					{this.props.results.paginate(this.state.page, 10).map(record => {
						return (
							<div key={record.Id} className='product-row'>
								<span>{record.Name}</span>
								{fields.map(f => {
									return <span key={record.Id + "-" + f}>{record[f] || "-"}</span>;
								})}
							</div>
						);
					})}

					{!this.props.results.length ? <div className='product-row'>No targets found for this group!</div> : ""}
				</div>
				<div className='pagination-container'>
					<Pagination
						totalSize={this.props.results.length}
						pageSize={10}
						page={this.state.page}
						onPageChange={newPage => {
							this.setState({
								page: newPage
							});
						}}
					/>
				</div>
			</div>
		);
	}
}

export default DGTargets;
