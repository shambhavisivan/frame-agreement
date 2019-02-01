import React, { Component } from 'react';

import './Addons.scss';
// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';

class Addons extends React.Component {

  constructor(props) {
    super(props);

    // this.onSelect = this.onSelect.bind(this);
    this.negotiateSelected = this.negotiateSelected.bind(this);

    this.state = {
      open: false,
      selected: {}
    }
  }

  onCheck(addonId) {
    let selected = this.state.selected;

    if (selected[addonId]) {
      delete selected[addonId];
    } else {
      selected[addonId] = true;
    }
    this.setState({
      selected
    });

    console.log(addonId);
  }

  onCheckAll() {
    console.log("All");
  }

  negotiateSelected() {
    console.log(this.state.selected);
  }

  // Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Billing_Frequency__c, cspmb__Authorization_Level__c, cspmb__Recurring_Charge__c

  render() {
    return (
      <div className="table-container">
        <table className="addons-table">
           <thead>
              <tr>
                 <th>Name</th>
                 <th>Billing Frequency</th>
                 <th>Authorization Level</th>
                 <th>Reccuring Charge</th>
              </tr>
           </thead>
           <tbody>
                  {this.props.addons.map((add, i) => {

                    let icon = {};

                    if (this.state.selected[add.Id]) {
                      icon.name = "check";
                      icon.color = "0070d2";
                    } else {
                      icon.name = "priority";
                      icon.color = "4bca81";
                    }

                    return (
                      <tr key={add.Id} className={'addon-row' + (this.state.selected[add.Id] ? ' selected-addon' : '')}>
                        <td onClick={() => {this.onCheck(add.Id)}}><Icon name={icon.name} width="14" color={icon.color}/> {add.Name}</td>
                        <td>{add.cspmb__Billing_Frequency__c}</td>
                        <td>{add.cspmb__Authorization_Level__c}</td>
                        <td>{add.cspmb__Recurring_Charge__c}</td>
                      </tr>
                      );
                  })}
           </tbody>
           <tfoot>

           </tfoot>
        </table>
        <div className="table-footer">
              <button className="slds-button slds-button--neutral" onClick={this.negotiateSelected}>
                 {Object.keys(this.state.selected).length ? 'Negotiate Selected' : 'Negotiate All'}
               </button>
        </div>
      </div>
    );
  }
}

export default Addons;