import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './Rates.scss';
import Icon from '../utillity/Icon';

class Rates extends React.Component {

  constructor(props) {
    super(props);

    this.negotiateSelected = this.negotiateSelected.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);

    this.state = {
      negotiation: false,
      selected: {}
    }
  }

  // onCheck(rclId) {
  //   let selected = this.state.selected;

  //   if (selected[rclId]) {
  //     delete selected[rclId];
  //   } else {
  //     selected[rclId] = true;
  //   }
  //   this.setState({
  //     selected
  //   });

  //   console.log(rclId);
  // }

  negotiateSelected() {
    this.setState({
      negotiation: true
    });
  }

  onCloseModal() {
    this.setState({
      negotiation: false
    });
  }

  /*
  <li key={rcl.Id} className={'list-row' + (this.state.selected[rcl.Id] ? ' selected-row' : '')}>
  */

  render() {
    return (
      <div className="table-container">
        <div className="table-list-header">
          <div className="list-cell">Name</div>
          <div className="list-cell">Unit</div>
          <div className="list-cell">Peak</div>
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

                            let icon = {};

                            if (this.state.selected[rcl.Id]) {
                              icon.name = "check";
                              icon.color = "0070d2";
                            } else {
                              icon.name = "priority";
                              icon.color = "4bca81";
                            }

                            return (
                                <li key={rcl.Id} className="list-row">
                                    <div className="list-cell">
                                      <Icon name={icon.name} width="14" color={icon.color}/> {rcl.Name}
                                    </div>
                                    <div className="list-cell">
                                      {rcl.cspmb__Cap_Unit__c}
                                    </div>
                                    <div className="list-cell">
                                      {rcl.cspmb__Peak__c}
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
              <button className="slds-button slds-button--neutral" disabled={true}>
                 {Object.keys(this.state.selected).length ? 'Negotiate Selected' : 'Negotiate All'}
               </button>
        </div>

      <Modal classNames={{ overlay: 'overlay', modal: 'sf-modal' }} open={this.state.negotiation} onClose={this.onCloseModal}>
          <div className="modal-header">
            <h2>Rate Card Negotiation</h2>
          </div>

        <div className="modal-body">
        </div>

        <div className="modal-footer">
          <button
            className="slds-button slds-button--brand"
          >
            Apply to Frame Agreement
          </button>
        </div>
      </Modal>
      </div>
    );
  }
}
export default Rates;
