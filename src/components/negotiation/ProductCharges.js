import React, { Component } from 'react';

import './ProductCharges.scss';
// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

class ProductCharges extends React.Component {
  constructor(props) {
    super(props);

    // this.onSelect = this.onSelect.bind(this);
    this.saveNegotiation = this.saveNegotiation.bind(this);
    // this.negotiateInline = this.negotiateInline.bind(this);

    // this.props.product
    console.log(this.props.product);

    this.state = {
      open: false,
      saveDisabled: true,
      negotiation: {}
    };
  }

  saveNegotiation() {
    // if (validateNegotiation(this.state.negotiation)) {
    this.props.onNegotiate(this.state.negotiation);
    this.setState({ saveDisabled: true });
    // }
  }

  negotiateInline(chargeType, value) {
    this.setState(
      { negotiation: { ...this.state.negotiation, [chargeType]: value } },
      () => {
        this.setState({ saveDisabled: false });
        console.log(this.state.negotiation);
      }
    );
  }

  render() {
    return (
      <div className="table-container">
        <div className="table-list-header">
          <div className="list-cell">Charge Name</div>
          <div className="list-cell">One-Off Adjustment</div>
          <div className="list-cell">Negotiated One Off</div>
          <div className="list-cell">Reccuring Adjustment</div>
          <div className="list-cell">Negotiated Reccuring</div>
        </div>

        <ul className="table-list">
          <li className="list-row">
            <div className="list-cell">
              <Icon name="priority" width="14" color="#4bca81" /> On product
            </div>
            <div className="list-cell">
              {' '}
              {this.props.product.cspmb__One_Off_Cost__c || 'N/A'}
            </div>
            <div className="list-cell negotiable">
              {this.props.product.cspmb__One_Off_Cost__c != null ? (
                <InputNegotiate
                  onChange={val => {
                    this.negotiateInline('oneOff', val);
                  }}
                  negotiatedValue={
                    this.props.product._negotiatedOneOff ||
                    this.props.product.cspmb__One_Off_Cost__c
                  }
                  originalValue={this.props.product.cspmb__One_Off_Cost__c}
                />
              ) : (
                'N/A'
              )}
            </div>
            <div className="list-cell">
              {' '}
              {this.props.product.cspmb__Recurring_Cost__c || 'N/A'}
            </div>
            <div className="list-cell negotiable">
              {this.props.product.cspmb__Recurring_Cost__c != null ? (
                <InputNegotiate
                  onChange={val => {
                    this.negotiateInline('reccuring', val);
                  }}
                  negotiatedValue={
                    this.props.product._negotiatedRecurring ||
                    this.props.product.cspmb__Recurring_Cost__c
                  }
                  originalValue={this.props.product.cspmb__Recurring_Cost__c}
                />
              ) : (
                'N/A'
              )}
            </div>
          </li>
        </ul>

        <div className="table-footer">
          <button
            className="slds-button slds-button--neutral negotiation-button"
            disabled={this.state.saveDisabled}
            onClick={this.saveNegotiation}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default ProductCharges;
