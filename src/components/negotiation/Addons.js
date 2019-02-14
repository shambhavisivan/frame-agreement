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

    this.state = {
      open: false,
      saveDisabled: true,
      negotiation: {}
    }
  }

  saveNegotiation() {
    if (validateNegotiation(this.state.negotiation)) { 
      this.props.onNegotiate(this.state.negotiation);
      this.setState({saveDisabled: true});
    }
  }

  negotiateInline(addId, chargeType, value) {
    let negotiation = this.state.negotiation[addId] || {};
    negotiation[chargeType] = value;

    this.setState({negotiation: {...this.state.negotiation, [addId]: negotiation}}, () => {
      this.setState({saveDisabled: false});
    })

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
                    return (
                      <li key={add.Id} className='list-row'>

                        <div className="list-cell">
                          <Icon name="priority" width="14" color="#4bca81"/> {add.Name}
                        </div>

                        <div className="list-cell"> {add.cspmb__One_Off_Charge__c || '-/-'}</div>
                        <div className="list-cell negotiable">
                            <InputNegotiate onChange={(val) => {this.negotiateInline(add.Id, "oneOff", val)}} negotiatedValue={add._negotiatedOneOff || add.cspmb__One_Off_Charge__c} originalValue={add.cspmb__One_Off_Charge__c}/>
                        </div>

                        <div className="list-cell"> {add.cspmb__Recurring_Charge__c || '-/-'}</div>

                        <div className="list-cell negotiable">
                          <InputNegotiate onChange={(val) => {this.negotiateInline(add.Id, "reccuring", val)}} negotiatedValue={add._negotiatedRecurring || add.cspmb__Recurring_Charge__c} originalValue={add.cspmb__Recurring_Charge__c}/>
                        </div>

                      </li>
                      );
                  })}
          </ul>


        <div className="table-footer">
              <button className="slds-button slds-button--neutral negotiation-button" disabled={this.state.saveDisabled} onClick={this.saveNegotiation}>
                 Save
               </button>
        </div>
      </div>
    );
  }
}

export default Addons;