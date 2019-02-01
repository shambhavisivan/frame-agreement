import React, { Component } from "react";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";
import {
  setActiveFa,
  updateActiveFa,
  upsertFrameAgreements,
  setAddedProducts
} from "../actions";
import "./FaEditor.css";

import FaSidebar from "./FaSidebar";
import CommercialProduct from "./negotiation/CommercialProduct";

import Header from "./utillity/Header";
import Icon from "./utillity/Icon";
import PropTypes from "prop-types";

import SFDatePicker from "./utillity/datepicker/SFDatePicker";
import SFField from "./utillity/readonly/SFField";
import InputSearch from "./utillity/inputs/InputSearch";

import ProductModal from "./modals/ProductModal";

class FrameAgreement {
  constructor() {
    this.Id = null;
    this.Name = "";
    this.csconta__Agreement_Name__c = "";
    this.csconta__Status__c = "Draft";
    this.csconta__Valid_From__c = null;
    this.csconta__Valid_To__c = null;
    this._ui = {
      commercialProducts: []
    };
  }
}

class FaEditor extends Component {
  constructor(props) {
    super(props);
    this.onBackClick = this.onBackClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.upsertFrameAgreements = this.upsertFrameAgreements.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onAddProducts = this.onAddProducts.bind(this);

    this.urlId = this.props.match.params.id || null;

    // Ref active FA from store
    this.state = {
      activeFa: this.props.frameAgreements[this.urlId] || new FrameAgreement(),
      productModal: false
    };
    // Set active Id in store
    this.props.setActiveFa(this.state.activeFa);
  }

  onOpenModal() {
    if (this.state.activeFa.Id) {
      this.setState({ productModal: true });
    }
  }

  onCloseModal() {
    this.setState({ productModal: false });
  }

  onAddProducts(productIds) {
    console.log("Added products:", productIds);
    this.props.setAddedProducts(productIds);
    setTimeout(() => {
      this.setState(
        {
          activeFa: this.props.activeFa
        },
        () => {
          this.onCloseModal();
        }
      );
    });
  }

  componentWillMount() {
    this.editable =
      this.state.activeFa.csconta__Status__c === "Draft" ||
      !this.state.activeFa.Id;
    // **************************************
    // Organize the header grid
    var field_rows = [];
    var row = [];
    var row_grid_count = 0;

    this.props.settings.JSONData.map(f => {
      if (row_grid_count + f.grid > 12) {
        field_rows.push([...row]);
        row = [];
        row_grid_count = 0;
      }
      row_grid_count += f.grid;
      row.push(f);
    });
    field_rows.push(row);
    this.header_rows = field_rows;
    // **************************************
  }

  onBackClick() {
    this.props.history.push("/");
  }

  upsertFrameAgreements() {
    var data = { ...this.props.activeFa };
    data.Id = data.Id || null;
    delete data.csconta__Account__c;
    delete data.csconta__Account__r;
    delete data.Name;
    delete data._ui;
    console.log("***********************************************");
    console.log(data);
    this.props.upsertFrameAgreements(data, this.props.activeFa.Id)
      .then(response => {
        this.setState({
          activeFa: response
        });
      });
  }

  onChange(field, value) {
    this.props.updateActiveFa(field, value);
  }

  // <SFDatePicker editable={this.editable} initialDate={true} onDateChange={this.onDateChange} labelText="Effective date from" placeholderText="Enter date from"/>

  render() {
// *******************************************************
// Add product call to action
let addProductCTA = '';
if (!this.state.activeFa._ui.commercialProducts.length) {
    addProductCTA = (<div className="add-product-box">
        <span className="box-header-1">
              There are no Products in here
        </span>
        {(() => {
          if (!this.state.activeFa.Id) {
            return (
              <span className="box-header-2">
                Save frame agreement before adding products!
              </span>
            );
          } else {
            return (
              <span className="box-header-2">
                They will be visible as soon as you create them.
              </span>
            );
          }
        })()}
        <div className="box-button-container">
          <button
            className="slds-button slds-button--brand"
            onClick={this.onOpenModal}
            disabled={!this.state.activeFa.Id}>
            Add Products
          </button>
        </div>
      </div>)
}
// *******************************************************
let footer = "";
if (this.state.activeFa._ui.commercialProducts.length) {
    footer = (
        <div className="main-footer">
                    <button
                      className="slds-button slds-button--brand"
                      onClick={this.onOpenModal}>
                      Toggle Products
                    </button>
                  </div>
    )
}
// *******************************************************
// Modal needs to be conditionally rendered to activate its lifecycle
let productModal = '';
if (this.state.productModal) {
    productModal = (<ProductModal
                      open={this.state.productModal}
                      addedProducts={this.state.activeFa._ui.commercialProducts}
                      onAddProducts={this.onAddProducts}
                      onCloseModal={this.onCloseModal}
                    />)
}
// *******************************************************
// Negotiation header with and without commercial products
let negotiationHeader;
if (this.state.activeFa._ui.commercialProducts.length) {
    negotiationHeader = (
        <div className="info-row">
          <span>Products ({this.state.activeFa._ui.commercialProducts.length})</span>
          <InputSearch placeholder="Quick search"/>
          <a href="#">expand all</a>
      </div>
    );
} else {
    negotiationHeader = (<div className="info-row"><span>Product Negotiation</span></div>);
}

// *******************************************************



    return (
      <div className="editor-container">


        <Header
          onBackClick={this.onBackClick}
          disabled={!this.editable}
          title="Parturient tortor tortor sed tellus molestie neque lobortis sodales"
          subtitle="Frame Agreement Details">
          <div className="header-button-container">
            <button
              className="slds-button slds-button--translucent"
              onClick={this.upsertFrameAgreements}>
              Save
            </button>
          </div>
        </Header>

        <div className="main-container">
          <div className="main">

            <div className="main-header">
              {this.header_rows.map((row, i) => {
                return (
                  <div className="main-header-row" key={"header-row-" + i}>
                    {row.map(f => {
                      var editable = !f.readOnly && this.editable;
                      return (
                        <SFField
                          editable={editable}
                          onChange={this.onChange}
                          key={f.field}
                          field={f}
                          value={this.state.activeFa[f.field] || ""}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="main-frame-container">

              {negotiationHeader}

              {addProductCTA}

              {this.state.activeFa._ui.commercialProducts.map(cp => {
                return (
                  <CommercialProduct
                    key={"cp-" + cp.Id}
                    product={cp}
                    fields={this.props.settings.FACSettings.Price_Item_Fields}
                  />
                );
              })}

            {productModal}

            </div>

            {footer}
          </div>

          <FaSidebar />

        </div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    frameAgreements: state.frameAgreements,
    commercialProducts: state.commercialProducts,
    settings: state.settings,
    activeFa: state.activeFa
  };
};

const mapDispatchToProps = {
  setActiveFa,
  upsertFrameAgreements,
  setAddedProducts,
  updateActiveFa
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FaEditor)
);
