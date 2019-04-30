import React, { Component } from 'react';
import CommercialProductSkeleton from './CommercialProductSkeleton';

import Shape from './Shape';

class EditorSkeleton extends Component {
	constructor(props) {
		super(props);

		this.count = this.props.count > 10 ? 10 : this.props.count;
		this.products = new Array(this.count + 1);
		for (var i = 0; i < this.products.length; i++) {
			this.products[i] = i;
		}
	}

	render() {
		return (
			<div className="skeleton-container skeleton-ed">
				<div className="skeleton-header">
					<div className="skeleton-row">
						<div className="skeleton-left">
							<Shape width={360} height={10} />
							<Shape width={200} height={18} />
						</div>
						<div className="skeleton-right">
							<Shape width={120} height={33} />
							<Shape width={120} height={33} />
							<Shape width={120} height={33} />
						</div>
					</div>
				</div>
				<div className="skeleton-body">
					<div className="skeleton-ed-fields" />
				</div>
			</div>
		);
	}
}

export default EditorSkeleton;
