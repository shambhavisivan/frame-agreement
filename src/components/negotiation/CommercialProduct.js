import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';

import Tabs from '../utillity/tabs/Tabs';
import Tab from '../utillity/tabs/Tab';

import Addons from './Addons';
import Charges from './Charges';
import Rates from './Rates';

import { withRouter } from 'react-router-dom';
import { getAddons } from '../../actions';

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
    }
  }

  onExpandProduct() {

      if (this.props.product._addons) {
          this.setState({
              open: !this.state.open
          });
      } else {
          this.setState({
              loading: true
          }, () => {
              this.props.getAddons(this.props.product.Id)
                  .then(response => {
                      this.setState({
                          open: !this.state.open,
                          loading: false
                      });
                  });
          });
      }
  }

  render() {
    return (
      <div className={"commercial-product-container" + (this.state.open ? ' product-open' : '')}>
          
          <div className="commercial-product-info">
            <div className="commercial-product-fields" onClick={this.onExpandProduct}>
              {this.fields.map(pif => {
                return (
                  <span key={'facp-' + this.props.product.Id + '-' + pif}>
                    {this.props.product[pif] || '-'}
                  </span>
                );
              })}
            </div>
              {this.state.open && (<div className="commercial-product-description">
                <span>1600 AVAILABLE  |  £39  |  Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget</span>
              </div>)}
          </div>

          {this.state.open && (<Tabs>
              <Tab label="Add-Ons">
                <Addons addons={this.props.product._addons}/>
              </Tab>
              <Tab label="Charges">
                <Charges />
              </Tab>
              <Tab label="Rates">
                <Rates />
              </Tab>
          </Tabs>)}

      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return {};
// };

const mapDispatchToProps = {
  getAddons
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(CommercialProduct)
);

