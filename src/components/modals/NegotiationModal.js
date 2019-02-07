import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Toggle from '../utillity/inputs/Toggle';

// import { getFrameAgreements } from '../../actions';

import './Modal.css';
import './NegotiationModal.css';

class NegotiationModal extends Component {
  constructor(props) {
    super(props);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.filteringProcess = this.filteringProcess.bind(this);

    this.commercialProducts = this.props.commercialProducts.filter(product => {
      return this.props.products.includes(product.Id);
    });

    /// TEST
    this.commercialProducts[0]._addons = [...this.commercialProducts[0]._addons];
    this.commercialProducts[0]._addons.pop();

    // Combine addons and add product id to them
    this._addons = this.commercialProducts.reduce((acc, val) => acc.concat(val._addons.map(addon => { return {...addon, ...{product:val.Id}}})), []);
    // this._charges = this.commercialProducts.reduce((acc, val) => acc.concat(val._charges.map(ch => { return {...ch, ...{product:val.Id}}})), []);
    this._rateCards = this.commercialProducts.reduce((acc, val) => acc.concat(val._rateCards.map(rc => { return {...rc, ...{product:val.Id}}})), []);

    this.state = {
      tab: 'addons',
      selected: {},
      filter: {
        unique: false,
        intersection: false
      }
    };

    // this.priceItemFields = [
    //   ...this.props.settings.FACSettings.Price_Item_Fields
    // ];
    // this.priceItemFields.unshift('Name');
    // console.warn(this.priceItemFields);
    console.log("***********************************");
    console.warn(this.commercialProducts);
    console.warn(this._addons);
    console.warn(this._rateCards);
    console.log("***********************************");
  }

  onCloseModal() {
    this.props.onCloseModal();
  }

  setTab(newTab) {
    this.setState({tab: newTab});
  }

  filteringProcess(data) {
    let returnData = data;

      if (this.state.filter.intersection) {
      let intersectionMap = {};
      let productSize = this.commercialProducts.length;

      returnData.forEach(item => {
        if (!intersectionMap[item.Id]) {
          intersectionMap[item.Id] = {};
        }
        intersectionMap[item.Id][item.product] = true;
      });

      console.log(intersectionMap);

        returnData = returnData.filter(item => {
          return Object.keys(intersectionMap[item.Id]).length === productSize;
        });
      }

      if (this.state.filter.unique) {
      let uniqueMap = {};
        returnData = returnData.filter(item => {
          if (!uniqueMap[item.Id]) {
            uniqueMap[item.Id] = true;
            return true;
          }
          return false;
        });
      }

      return returnData;
  }

  render() {

    let addonsTab;
    let chargesTab;
    let rateCardsTab;

    addonsTab = (
          <div className="table-container">

              <div className="table-list-header">
                <div className="list-cell">Name</div>
                <div className="list-cell">Price Item</div>
                <div className="list-cell">Billing Frequency</div>
                <div className="list-cell">Authorization Level</div>
                <div className="list-cell">Recurring Charge</div>
              </div>

              <ul className="table-list">
                      {this.filteringProcess(this._addons).map((add, i) => {
                        return (
                          <li key={add.product + '-' + add.Id} className={'list-row' + (this.state.selected[add.Id] ? ' selected-row' : '')}>
                            <div className="list-cell" onClick={() => {this.onCheck(add.Id)}}>
                              [] {add.Name}
                            </div>
                            <div className="list-cell"> {add.product}</div>
                            <div className="list-cell"> {add.cspmb__Billing_Frequency__c}</div>
                            <div className="list-cell"> {add.cspmb__Authorization_Level__c}</div>
                            <div className="list-cell"> {add.cspmb__Recurring_Charge__c}</div>
                          </li>
                          );
                      })}
              </ul>

          </div>
      ); 

    return (
      <Modal
        classNames={{ overlay: 'overlay', modal: 'sf-modal negotiation-modal' }}
        open={this.props.open}
        onClose={this.onCloseModal}
        center
      >


        <div className="modal-header">
          <h2>Bulk Negotiation</h2>
        </div>
        <div className="modal-body">
          <div className="products-container">
              <div className="label-text">Selected products</div>
              <ul className="horizontal-list">
              {this.commercialProducts.map(product => {
                        return (
                          <li key={product.Id}>
                            {product.Name}
                          </li>
                        );
                })}
              </ul>
          </div>
          <div className="filter-container">
            <div>
                <div className="label-text">Unique Rows</div>
                <Toggle
                  onChange={(val) => {this.setState({filter: {...this.state.filter, unique: val}})}}
                  value={this.state.filter.unique}
                />
              </div>
              <div>
                <div className="label-text">Intersection Rows</div>
                <Toggle
                  onChange={(val) => {this.setState({filter: {...this.state.filter, intersection: val}})}}
                  value={this.state.filter.intersection}
                />
              </div>
          </div>

          <div className="tab-content-container">
            {addonsTab}
          </div>

          <div className="action-container">
          <button className="slds-button slds-button--brand" onClick={() => {this.setTab('addons')}}>
            Addons
          </button>
          <button disabled={true} className="slds-button slds-button--brand" onClick={() => {this.setTab('charges')}}>
            Charges
          </button>
          <button className="slds-button slds-button--brand" onClick={() => {this.setTab('rated')}}>
            Rated
          </button>
          </div>
        </div>
          <div className="modal-footer"></div>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    commercialProducts: state.commercialProducts,
    settings: state.settings
  };
};

const mapDispatchToProps = {
  // getFrameAgreements
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(NegotiationModal);
