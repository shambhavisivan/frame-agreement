import React, { Component } from 'react';

import './ProductCharges.scss';
// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

class ProductCharges extends React.Component {

  constructor(props) {
    super(props);

    // this.onSelect = this.onSelect.bind(this);
    // this.saveNegotiation = this.saveNegotiation.bind(this);
    // this.negotiateInline = this.negotiateInline.bind(this);

    this.state = {
      open: false,
      saveDisabled: true,
      negotiation: {}
    }
  }



  // Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Billing_Frequency__c, cspmb__Authorization_Level__c, cspmb__Recurring_Charge__c

  render() {
    return (
      <div className="table-container">

      </div>
    );
  }
}

export default ProductCharges;