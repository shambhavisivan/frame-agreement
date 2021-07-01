import React, { Component } from "react";

import Tabs from "../utillity/tabs/Tabs";
import Tab from "../utillity/tabs/Tab";
import StdCatalogueOffersTab from "./StdCatalogueOffersTab";
import FaOffersTab from "./FaOffersTab";

class OffersTab extends Component {
	constructor(props) {
		super(props);

	}

	render() {

		return (
			<Tabs initial={this.props.activeOfferTabIndex}
			onTabChange={this.props.onOfferTabChange}>
				<Tab
					label={window.SF.labels.offers_title}
				>
					<StdCatalogueOffersTab
						faId={this.props.faId}
						selectedOffers={this.props.selectedOffers}
						onSelectOffer={this.props.onSelectOffer}
						onSelectAllOffers={this.props.onSelectAllOffers}
						/>
				</Tab>
				<Tab
					label={window.SF.labels.fa_offers_title}
				>
					<FaOffersTab
						faId={this.props.faId}
						selectedOffers={this.props.selectedOffers}
						onSelectOffer={this.props.onSelectOffer}
						onSelectAllOffers={this.props.onSelectAllOffers}
						onEditFaOffer={this.props.onEditFaOffer}
						/>
				</Tab>

			</Tabs>
		);
	}
}

export default OffersTab;
