import React, { Component } from 'react';
// import { connect } from "react-redux";

import Icon from '../utillity/Icon';

import Tabs from '../utillity/tabs/Tabs';
import Tab from '../utillity/tabs/Tab';

import Checkbox from '../utillity/inputs/Checkbox';

import ProductCharges from './ProductCharges';
import Addons from './Addons';
import Charges from './Charges';
import Rates from './Rates';

// import { getAddons, getRateCards } from "../../actions";

import './CommercialProduct.scss';

class CommercialProduct extends React.Component {
	constructor(props) {
		super(props);
		this.fields = [...this.props.fields];
		this.fields.unshift('Name');

		this.onExpandProduct = this.onExpandProduct.bind(this);

		this.productId = this.props.product.Id;

		this.state = {
			loading: false,
			open: false
		};
	}

	onExpandProduct() {
		this.setState({
			open: !this.state.open
		});
	}

	negotiateProduct(data) {
		console.log('On product:', this.productId);
		this.props.applyDiscountToFrameAgreement(this.productId, '_product', data);
	}

	render() {
		return (
			<div
				className={this.state.open ? 'product-open' : ''}
			>
				<div>
					<div className="commercial-product-checkbox-container">
						<Checkbox
							value={this.props.selected}
							onChange={() => {
								this.props.onSelect(this.props.product);
							}}
						/>
					</div>

					<div className="commercial-product-fields-container">
						<div
							className="commercial-product-fields"
							onClick={this.onExpandProduct}
						>
							{this.fields.map(pif => {
								return (
									<span key={'facp-' + this.props.product.Id + '-' + pif}>
										{this.props.product[pif] || '-'}
									</span>
								);
							})}
						</div>
					</div>
				</div>

				{this.state.open && (
					<div>
						<div className="commercial-product-description">
							<span>
								1600 AVAILABLE | £39 | Metus in vestibulum faucibus erat tortor
								et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit,
								cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum
								est, vel erat in venenatis vestibulum, sed nostra dui nonummy
								etiam eros, eget
							</span>
						</div>

						<Tabs>
							<Tab label="Add-Ons">
								<Addons
									attachment={this.props.attachment._addons || {}}
									addons={this.props.product._addons}
									onNegotiate={data => {
										this.props.onNegotiate('_addons', data);
									}}
								/>
							</Tab>
							<Tab
								label={
									'Charges' +
									(this.props.product._charges.length ? '' : ' (product)')
								}
							>
								{this.props.product._charges.length ? (
									<Charges
										attachment={this.props.attachment._charges || {}}
										onNegotiate={data => {
											this.props.onNegotiate('_charges', data);
										}}
										authLevel={this.props.product.cspmb__Authorization_Level__c}
										charges={this.props.product._charges}
									/>
								) : (
									<ProductCharges
										product={this.props.product}
										attachment={this.props.attachment._product || {}}
										onNegotiate={data => {
											this.props.onNegotiate('_product', data);
										}}
									/>
								)}
							</Tab>
							<Tab label="Rates">
								<Rates
									attachment={this.props.attachment._rateCards || {}}
									rateCards={this.props.product._rateCards}
									onNegotiate={data => {
										this.props.onNegotiate('_rateCards', data);
									}}
								/>
							</Tab>
						</Tabs>
					</div>
				)}
			</div>
		);
	}
}

// const mapStateToProps = state => {
//   return {};
// };

const mapDispatchToProps = {
	// applyDiscountToFrameAgreement
};

export default CommercialProduct;

// export default connect(
//     null,
//     mapDispatchToProps
//   )(CommercialProduct);
