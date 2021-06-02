import React, { Component } from "react";

import * as Constants from "~/src/utils/constants";
import { convertMillisToLocaleDateString } from "../../utils/shared-service";
import Icon from "./Icon";

class ProductRow extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const fields = Object.keys(this.props.product);
		const fieldToRender = fields.find(
			(fieldName) =>
				fieldName.toLowerCase() === this.props.fieldName.toLowerCase()
		);

		if (this.props.product.hasOwnProperty(fieldToRender)) {

			if (typeof this.props.product[fieldToRender] === "boolean") {
				let _val = this.props.product[fieldToRender];
				return (
					<Icon
						name={_val ? "success" : "clear"}
						height={
							this.props.iconSize ? this.props.iconSize : "14"
						}
						width={this.props.iconSize ? this.props.iconSize : "14"}
						color={_val ? "#4bca81" : "#d9675d"}
					/>
				);
			} else if (
				typeof this.props.product[fieldToRender] === "number" &&
				this.props.product[fieldToRender] >=
					Constants.DEFAULT_START_DATE_IN_MILLIS
			) {
				//no numeric props can have such high values, so assuming this to be date starting from 01/01/2000
				return convertMillisToLocaleDateString(
					this.props.product[fieldToRender]
				);
			} else {
				return this.props.product[fieldToRender].toString();
			}
		} else {
			return "-";
		}
	}
}

export default ProductRow;