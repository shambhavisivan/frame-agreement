import React, { Component } from 'react';

import './Addons.scss';
// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

import { validateNegotiation } from './Validation';

class Addons extends React.Component {
  constructor(props) {
    super(props);

    // this.onSelect = this.onSelect.bind(this);
    this.saveNegotiation = this.saveNegotiation.bind(this);
    // this.negotiateInline = this.negotiateInline.bind(this);

    // this.props.attachment

    let negotiation = this.props.attachment;

    this.state = {
      open: false,
      saveDisabled: true,
      negotiation
    };
  }

  saveNegotiation() {
    if (validateNegotiation(this.state.negotiation)) {
      this.props.onNegotiate(this.state.negotiation);
      this.setState({ saveDisabled: true });
    }
  }

  negotiateInline(add, chargeType, value) {
    let negotiation = this.props.attachment;
    negotiation[add.Id] = negotiation[add.Id] || {};
    negotiation[add.Id][chargeType] = value;

    if (validateNegotiation(negotiation)) {
      this.props.onNegotiate(negotiation);
      this.setState({ saveDisabled: false });
    }
  }

  // Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Billing_Frequency__c, cspmb__Authorization_Level__c, cspmb__Recurring_Charge__c

  render() {
    return (
      <div className="table-container">
        <div className="table-list-header">
          <div className="list-cell">Name</div>
          <div className="list-cell">One Off Charge</div>
          <div className="list-cell">Negotiated One Off</div>
          <div className="list-cell">Reccuring Charge</div>
          <div className="list-cell">Negotiated Reccuring</div>
        </div>

        <ul className="table-list">
          {this.props.addons.map((add, i) => {
            let recurringRow = 'N/A';
            let oneOffRow = 'N/A';
            var value;

            if (add.cspmb__One_Off_Charge__c != null) {
              value =
                (this.props.attachment[add.Id] &&
                  this.props.attachment[add.Id].oneOff) ||
                add.cspmb__One_Off_Charge__c;
              oneOffRow = (
                <InputNegotiate
                  onChange={val => {
                    this.negotiateInline(add, 'oneOff', val);
                  }}
                  negotiatedValue={value}
                  originalValue={add.cspmb__One_Off_Charge__c}
                />
              );
            }

            if (add.cspmb__Recurring_Charge__c != null) {
              value =
                (this.props.attachment[add.Id] &&
                  this.props.attachment[add.Id].reccuring) ||
                add.cspmb__Recurring_Charge__c;
              recurringRow = (
                <InputNegotiate
                  onChange={val => {
                    this.negotiateInline(add, 'reccuring', val);
                  }}
                  negotiatedValue={value}
                  originalValue={add.cspmb__Recurring_Charge__c}
                />
              );
            }

            return (
              <li key={add.Id} className="list-row">
                <div className="list-cell">
                  <Icon name="priority" width="14" color="#4bca81" /> {add.Name}
                </div>

                <div className="list-cell">
                  {' '}
                  {add.cspmb__One_Off_Charge__c || 'N/A'}
                </div>

                <div className="list-cell negotiable">{oneOffRow}</div>

                <div className="list-cell">
                  {' '}
                  {add.cspmb__Recurring_Charge__c || 'N/A'}
                </div>

                <div className="list-cell negotiable">{recurringRow}</div>
              </li>
            );
          })}
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

export default Addons;
