import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {applyDiscountToFrameAgreement} from "../../actions";

import Modal from 'react-responsive-modal';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Toggle from '../utillity/inputs/Toggle';
import Checkbox from '../utillity/inputs/Checkbox';

// import { getFrameAgreements } from '../../actions';

import './Modal.css';
import './NegotiationModal.css';

const ADDON_VALUE_FIELD = "cspmb__Recurring_Charge__c";
const RATE_VALUE_FIELD = "cspmb__rate_value__c";

class NegotiationModal extends Component {
    constructor(props) {
        super(props);

        this.discount = React.createRef();

        this.onCloseModal = this.onCloseModal.bind(this);
        this.filteringProcess = this.filteringProcess.bind(this);
        this.applyDiscount = this.applyDiscount.bind(this);

        this.productNames = {};

        this.commercialProducts = this.props.commercialProducts.filter(product => {
            this.productNames[product.Id] = product.Name
            return this.props.products.includes(product.Id);
        });

        // this._charges = this.commercialProducts.reduce((acc, val) => acc.concat(val._charges.map(ch => { return {...ch, ...{product:val.Id}}})), []);

        // Combine addons and add product id to them
        this._addons = this.commercialProducts.reduce((acc, val) => acc.concat(val._addons.map(addon => { return { ...addon, ...{ product: val.Id } } })), []);
        // Map addon:[pid]
        this._addCpMap = {};
        this._addons.forEach(rc => {
            this._addCpMap[rc.Id] = this._addCpMap[rc.Id] || [];
            this._addCpMap[rc.Id].push(rc.product);
        });
        // Filter unique addons
        (() => {
            let uniqueCheck = {};
            this._addons = this._addons.filter(rc => {
                if (!uniqueCheck[rc.Id]) {
                    uniqueCheck[rc.Id] = true;
                    return true;
                }
                return false;
            });
        })();

        // All rate card
        this._rateCards = this.commercialProducts.reduce((acc, val) => acc.concat(val._rateCards.map(rc => { return { ...rc, ...{ product: val.Id } } })), []);

        // Map rc:[pid]
        this._rcCpMap = {};
        this._rateCards.forEach(rc => {
            this._rcCpMap[rc.Id] = this._rcCpMap[rc.Id] || [];
            this._rcCpMap[rc.Id].push(rc.product);
        });
        // Filter unique rate cards
        (() => {
            let uniqueCheck = {};
            this._rateCards = this._rateCards.filter(rc => {
                if (!uniqueCheck[rc.Id]) {
                    uniqueCheck[rc.Id] = true;
                    return true;
                }
                return false;
            });
        })();

        this.state = {
            tab: 'addons',
            discountMode: 'percentage', // fixed
            discount: 0,
            selected: {
                addons: {},
                charges: {},
                rated: {}
            },
            count: {
                addons: 0,
                charges: 0,
                rated: 0
            },
            countTotal: 0,
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
        this.setState({ tab: newTab });
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
                    delete item.product;
                    return true;
                }
                return false;
            });
        }

        return returnData;
    }

    selectAll(type) {
        console.log("ALL");
    }

    onSelectRow(row, type) {
        let selected = this.state.selected;
        if (selected[type][row.Id]) {
            delete selected[type][row.Id];
        } else {
            selected[type][row.Id] = row;
        }
        this.setState({
            selected: selected,
            count: {...this.state.count, [type]: Object.keys(selected[type]).length}
        }, () => {
        this.setState({
            countTotal: Object.values(this.state.count).reduce((a,b) => +(a + b),0)
        });
            console.log(this.state.selected);
        });
    }

    applyDiscount() {

      const _DISCOUNT = +this.discount.current.value * -1;
      console.log(_DISCOUNT);

        function decimalPlaces(num) {
            var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) {
                return 0;
            }
            return Math.max(
                0,
                // Number of digits right of decimal point.
                (match[1] ? match[1].length : 0) -
                // Adjust for scientific notation.
                (match[2] ? +match[2] : 0)
            );
        };

        function applyDiscountRate(val, state) {
            if (state.discountMode === "fixed") {
                val = val + _DISCOUNT;
            } else {
                var discountSum = (val * Math.abs(_DISCOUNT) / 100);

                if (_DISCOUNT >= 0) {
                    val = val + discountSum;
                } else {
                    val = val - discountSum;
                }
            }
            // Max 4 decimal places
            var dp = decimalPlaces(val);
            if (dp > 2) {
                dp = 2;
            }
            return +val.toFixed(dp);
        }

        // var _rclDiscountFiltered = state.rateCardLines.map(rcl => {
        //     if (state.selected[rcl.Id] && typeof rcl.negotiatedValue === 'number') {
        //         rcl.negotiatedValue = applyDiscountRate(rcl.negotiatedValue, this.state._DISCOUNT);
        //     }
        //     return rcl;
        // });
        let selected = {...this.state.selected};
        for (var key in selected.addons) {
          selected.addons[key].negotiatedValue = applyDiscountRate(selected.addons[key][ADDON_VALUE_FIELD], this.state);
        }

        // for (var key in this.state.selection.charges) {
          
        // }

        for (var key in selected.rated) {
          selected.rated[key].negotiatedValue = applyDiscountRate(selected.rated[key][RATE_VALUE_FIELD], this.state);
        }

        this.setState({selected});

        // this.setState({ rateCardLines: _rclDiscountFiltered })
    }

    render() {

        let tab = {
            addons: null,
            charges: null,
            rated: null
        }

        tab.addons = (
              <div className="table-container">

                  <div className="table-list-header">
                    <div className="list-cell"><Checkbox onChange={() => {this.selectAll('addons')}}/>Name</div>
                    <div className="list-cell">Present In</div>
                    <div className="list-cell">Billing Frequency</div>
                    <div className="list-cell">Authorization Level</div>
                    <div className="list-cell">Recurring Charge</div>
                  </div>

                  <ul className="table-list">
                          {this.filteringProcess(this._addons).map((add, i) => {
                            return (
                              <li onClick={() => {this.onSelectRow(add, 'addons')}} key={add.product + '-' + add.Id} className={'list-row' + (this.state.selected.addons[add.Id] ? ' selected-row' : '')}>
                                <div className="list-cell">
                                  <Checkbox readOnly={this.state.selected.addons[add.Id]}/> {add.Name}
                                </div>
                                <div className="list-cell"> {this._addCpMap[add.Id].length + '/' + this.commercialProducts.length}</div>
                                <div className="list-cell"> {add.cspmb__Billing_Frequency__c}</div>
                                <div className="list-cell"> {add.cspmb__Authorization_Level__c}</div>
                                <div className="list-cell"> 
                                  {add.cspmb__Recurring_Charge__c}
                                  {this.state.selected.addons[add.Id] && this.state.selected.addons[add.Id].negotiatedValue ? (<span>/{this.state.selected.addons[add.Id].negotiatedValue}</span>) : ''}
                                </div>
                              </li>
                              );
                          })}
                  </ul>

              </div>
          ); 

        tab.rated = (
              <div className="table-container">
                      <div className="table-list-header">
                        <div className="list-cell"><Checkbox onChange={() => {this.selectAll('rated')}}/>Name</div>
                        <div className="list-cell">Unit</div>
                        <div className="list-cell">Rate Value</div>
                      </div>
                      <ul className="rc-list">
                                {this.filteringProcess(this._rateCards).map((rc, i) => {

                                  return (
                                    <li key={rc.product + '-' + rc.Id} className="list-item selectable">
                                      <div className="rc-title"> 
                                          <div className="title-upper"></div>
                                          <div className="title-content"><Icon name="announcement" width="14" color="#706e6b"/> 
                                              {rc.Name}
                                              <span className="product-count">
                                                {this._rcCpMap[rc.Id].length}
                                              </span>
                                          </div>
                                          <div className="title-lower"> </div>
                                      </div>

                                      <ul className="table-list">
                                        {rc.rateCardLines.map((rcl, i) => {

                                          return (
                                              <li onClick={() => {this.onSelectRow(rcl, 'rated')}} key={rcl.Id} className={"list-row" + (this.state.selected.rated[rcl.Id] ? ' selected-row' : '')}>
                                                  <div className="list-cell">
                                                    <Checkbox readOnly={this.state.selected.rated[rcl.Id]}/> {rcl.Name}
                                                  </div>
                                                  <div className="list-cell">
                                                    {rcl.cspmb__Cap_Unit__c}
                                                  </div>
                                                  <div className="list-cell">
                                                    {rcl.cspmb__rate_value__c}
                                                    {this.state.selected.rated[rcl.Id] && this.state.selected.rated[rcl.Id].negotiatedValue ? (<span>/{this.state.selected.rated[rcl.Id].negotiatedValue}</span>) : ''}
                                                  </div>
                                              </li>
                                          )
                                        })}
                                      </ul>
                                    </li>
                                    );
                                })}
                      </ul>
              </div>
          ); 

        return (
          <Modal
            classNames={{ overlay: 'overlay', modal: 'sf-modal negotiation-modal', closeButton: 'close-button'}}
            open={this.props.open}
            onClose={this.onCloseModal}
            
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

                 {this.state.tab === "charges" && <div>
                      <div className="label-text">Unique Rows</div>
                      <Toggle
                        onChange={(val) => {this.setState({filter: {...this.state.filter, unique: val}})}}
                        disabled={this.state.tab === 'rated'}
                        value={this.state.filter.unique}
                      />
                  </div>}

                  <div>
                    <div className="label-text">Intersection Rows</div>
                    <Toggle
                      onChange={(val) => {this.setState({filter: {...this.state.filter, intersection: val}})}}
                      value={this.state.filter.intersection}
                    />
                  </div>

              </div>

              <div className="tab-content-container">
                  {tab[this.state.tab]}
              </div>

              <div className="action-container">
                    <div className="label-text">Charges options</div>
                <div className="box">
                    <div className="button-group toggle-buttons">
                      <button className={"slds-button slds-button--" + (this.state.tab === "addons" ? 'brand' : 'neutral')} onClick={() => {this.setTab('addons')}}>
                        Addons {this.state.count.addons ? (<span>({this.state.count.addons})</span>) : ''}
                      </button>
                      <button disabled={true} className={"slds-button slds-button--" + (this.state.tab === "charges" ? 'brand' : 'neutral')} onClick={() => {this.setTab('charges')}}>
                        Charges {this.state.count.charges ? (<span>({this.state.count.charges})</span>) : ''}
                      </button>
                      <button className={"slds-button slds-button--" + (this.state.tab === "rated" ? 'brand' : 'neutral')} onClick={() => {this.setTab('rated')}}>
                        Rated {this.state.count.rated ? (<span>({this.state.count.rated})</span>) : ''}
                      </button>
                    </div>
                </div>
                 <div className="box filter-container">
                  <div>
                    <span>Discount options</span>
                    <div className="button-group toggle-buttons">
                      <button className={"slds-button slds-button--" + (this.state.discountMode === "percentage" ? 'brand' : 'neutral')} onClick={() => {this.setState({discountMode: "percentage"})}}>
                        Percentage
                      </button>
                      <button className={"slds-button slds-button--" + (this.state.discountMode === "fixed" ? 'brand' : 'neutral')} onClick={() => {this.setState({discountMode: "fixed"})}}>
                        Fixed Amount
                      </button>
                    </div>
                  </div>
                  <div>
                    <span>Discount to selections</span>
                    <input type="number" name="" className="search-input" ref={this.discount} placeholder="Enter discount percentage"/>
                      <button disabled={!this.state.countTotal} className="slds-button slds-button--neutral" onClick={this.applyDiscount}>
                        Apply discount
                      </button>
                  </div>
                </div>
                  
              </div> 


            </div>
              <div className="modal-footer">
                      <button className="slds-button slds-button--neutral" onClick={() => {this.props.applyDiscountToFrameAgreement(this.state.selected)}}>
                        Apply to Frame Agreement
                      </button>
              </div>
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
    applyDiscountToFrameAgreement
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NegotiationModal);