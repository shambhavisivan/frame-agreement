import React, { Component } from "react";
import { connect } from "react-redux";

import Icon from "../utillity/Icon";

import Tabs from "../utillity/tabs/Tabs";
import Tab from "../utillity/tabs/Tab";

import Checkbox from "../utillity/inputs/Checkbox";

import Addons from "./Addons";
import Charges from "./Charges";
import Rates from "./Rates";


// import { getAddons, getRateCards } from "../../actions";

import "./CommercialProduct.scss";

class CommercialProduct extends React.Component {
  constructor(props) {
    super(props);
    this.fields = [...this.props.fields];
    this.fields.unshift("Name");

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

  render() {
    return (
      <div
        className={
          "commercial-product-container" +
          (this.state.open ? " product-open" : "")
        }
      >
        <div className="commercial-product-header">
        
          <div className="commercial-product-checkbox-container">
            <Checkbox onChange={() => {this.props.onSelect(this.props.product)}}/>
          </div>   
               
          <div className="commercial-product-fields-container">
              <div
                className="commercial-product-fields"
                onClick={this.onExpandProduct}
              >
                {this.fields.map(pif => {
                  return (
                    <span key={"facp-" + this.props.product.Id + "-" + pif}>
                      {this.props.product[pif] || "-"}
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
                <Addons addons={this.props.product._addons} />
              </Tab>
              <Tab label="Charges">
                <Charges />
              </Tab>
              <Tab label="Rates">
                <Rates rateCards={this.props.product._rateCards} />
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

};

export default connect(
    null,
    mapDispatchToProps
  )(CommercialProduct);
