import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './Rates.scss';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

import { validateNegotiation } from './Validation';

class Rates extends React.Component {

  constructor(props) {
    super(props);

    this.saveNegotiation = this.saveNegotiation.bind(this);

        this.state = {
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

    negotiateInline(rcId, rclId, value) {
        let negotiation = this.state.negotiation[rcId] || {};
        negotiation[rclId] = value;

        this.setState({ negotiation: { ...this.state.negotiation, [rcId]: negotiation } }, () => {
            this.setState({ saveDisabled: false });
            console.log(this.state.negotiation);
      })

  }


  render() {
    return (
      <div className="table-container">
        <div className="table-list-header">
          <div className="list-cell">Name</div>
          <div className="list-cell">Rate Value</div>
          <div className="list-cell">Negotiated Value</div>
        </div>
        <ul className="rc-list">
                  {this.props.rateCards.map((rc, i) => {
                    return (
                      <li key={rc.Id} className="list-item">
                        <div className="rc-title"> 
                            <div className="title-upper"></div>
                            <div className="title-content"><Icon name="announcement" width="14" color="#706e6b"/> {rc.Name}</div>
                            <div className="title-lower"> </div>
                        </div>

                        <ul className="table-list">
                          {rc.rateCardLines.map((rcl, i) => {

                            return (
                                <li key={rcl.Id} className="list-row">
                                    <div className="list-cell">
                                      <Icon name="priority" width="14" color="#4bca81"/> {rcl.Name}
                                    </div>
                                    <div className="list-cell">
                                      {rcl.cspmb__rate_value__c || '-/-'}
                                    </div>
                                  <div className="list-cell negotiable">
                                    <InputNegotiate onChange={(val) => {this.negotiateInline(rc.Id, rcl.Id, val)}} negotiatedValue={rcl._negotiated || rcl.cspmb__rate_value__c || 0} originalValue={rcl.cspmb__rate_value__c}/>
                                  </div>
                                </li>
                            )
                          })}
                        </ul>
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
export default Rates;
