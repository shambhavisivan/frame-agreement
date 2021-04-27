import React, { Component } from "react";
import Pagination from "../utillity/Pagination";

export class OffersMetadata extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pagination: {
				page: 1,
				pageSize: 10,
			},
		};
	}
	render() {
		const { pagination } = this.state;
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						{window.SF.labels.cp_meta_header_attribute_name}
					</div>
					<div className="list-cell">
						{window.SF.labels.cp_meta_header_values}
					</div>
					<div className="list-cell">
						{window.SF.labels.cp_meta_header_read_only}
					</div>
					<div className="list-cell">
						{window.SF.labels.cp_meta_header_required}
					</div>
				</div>

				<div className="table-list">
					{this.props.data?.attributes ? (
						this.props.data.attributes.map((meta) => (
							<li key={meta.name} className="list-row">
								<div className="list-cell">{meta.name}</div>
								<div className="list-cell">
									{meta.values
										.flatMap((obj) => obj.value)
										.join(", ")}
								</div>
								<div className="list-cell">
									<input
										type={"checkbox"}
										checked={meta.readOnly ? "checked" : ""}
										readOnly
									/>
								</div>
								<div className="list-cell">
									<input
										type={"checkbox"}
										checked={meta.required ? "checked" : ""}
										readOnly
									/>
								</div>
							</li>
						))
					) : (
						<div className="add-product-box">
							<span className="box-header-1">
								{window.SF.labels.offers_no_metaData}
							</span>
						</div>
					)}
				</div>

				<Pagination
					totalSize={this.props.data?.length || 0}
					pageSize={pagination.pageSize}
					page={pagination.page}
					onPageSizeChange={(newPageSize) => {
						setPagination((pagination) => ({
							...pagination,
							pageSize: newPageSize,
							page: 1,
						}));
					}}
					onPageChange={(newPage) => {
						setPagination((pagination) => ({
							...pagination,
							page: newPage,
						}));
					}}
				/>
			</div>
		);
	}
}

