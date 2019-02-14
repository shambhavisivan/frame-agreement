import React, { Component } from 'react';
import Icon from '../utillity/Icon';

import './Charges.scss';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

import { validateNegotiation } from './Validation';

class Charges extends React.Component {

    constructor(props) {
        super(props);

        this.saveNegotiation = this.saveNegotiation.bind(this);

        this.state = {
            open: false,
            saveDisabled: true,
            negotiation: {}
        }

        console.log("CHARGES:", props);
    }

    saveNegotiation() {
      if (validateNegotiation(this.state.negotiation)) { 
        this.props.onNegotiate(this.state.negotiation);
        this.setState({saveDisabled: true});
      }
    }

    negotiateInline(chargeId, chargeType, value) {
        let negotiation = this.state.negotiation[chargeId] || {};
        negotiation[chargeType] = value;

        this.setState({ negotiation: { ...this.state.negotiation, [chargeId]: negotiation } }, () => {
            this.setState({ saveDisabled: false });
            console.log(this.state.negotiation);
      })

  }

  render() {
    return (
      <div className="table-container">
          <div className="table-list-header">
            <div className="list-cell">Charge Name</div>
            <div className="list-cell">Charge Type</div>
            <div className="list-cell">One-Off Adjustment</div>
            <div className="list-cell">Negotiated One Off</div>
            <div className="list-cell">Reccuring Adjustment</div>
            <div className="list-cell">Negotiated Reccuring</div>
          </div>

          <ul className="table-list">
                  {this.props.charges.map((charge, i) => {

                    return (
                      <li key={charge.Id} className='list-row'>
                        <div className="list-cell">
                          <Icon name="priority" width="14" color="#4bca81"/> {charge.typeLabel}
                        </div>
                        <div className="list-cell"> {charge.chargeType}</div>
                        <div className="list-cell"> {charge.oneOff || '-/-'}</div>
                        <div className="list-cell negotiable">
                          <InputNegotiate onChange={(val) => {this.negotiateInline(charge.Id, "oneOff", val)}} negotiatedValue={charge._negotiatedOneOff || charge.oneOff || 0} originalValue={charge.oneOff}/>
                        </div>
                        <div className="list-cell"> {charge.recurring || '-/-'}</div>
                        <div className="list-cell negotiable">
                          <InputNegotiate onChange={(val) => {this.negotiateInline(charge.Id, "reccuring", val)}} negotiatedValue={charge._negotiatedRecurring || charge.recurring || 0} originalValue={charge.recurring}/>
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
export default Charges;
