import React, { Component } from 'react';

import Shape from './Shape';

class LandingSkeleton extends Component {
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
			<div className="skeleton-container skeleton-fa">
				<div className="skeleton-header">
					<div className="skeleton-row">
						<Shape width={380} height={33} />
						<Shape width={600} height={33} />
					</div>
				</div>
				<div className="skeleton-body">
					<div className="skeleton-table">
						{this.products.map((cp, i) => {
							return (
								<div key={i} className="skeleton-table-item">
									<div className="skeleton-left">
										<Shape width={24} height={24} />
										<Shape width={200} height={24} />
									</div>
									<div className="skeleton-right">
										<Shape width={65} height={24} />
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default LandingSkeleton;
