import React, { Component } from "react";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";
import { setActiveFa, updateActiveFa, upsertFrameAgreements, setAddedProducts, getCommercialProductData } from "../actions";
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
import NegotiationModal from "./modals/NegotiationModal";

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
        this.onFieldChange = this.onFieldChange.bind(this);
        this.upsertFrameAgreements = this.upsertFrameAgreements.bind(this);
        this.onOpenCommercialProductModal = this.onOpenCommercialProductModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onAddProducts = this.onAddProducts.bind(this);
        this.onOpenNegotiationModal = this.onOpenNegotiationModal.bind(this);
        this.onSelectProduct = this.onSelectProduct.bind(this);

        this.urlId = this.props.match.params.id || null;

        // Ref active FA from store
        this.state = {
            activeFa: this.props.frameAgreements[this.urlId] || new FrameAgreement(),
            productModal: false,
            negotiateModal: false,
            selectedProducts: {}
        };
        // Set active Id in store
        this.props.setActiveFa(this.state.activeFa);
    }

    componentWillMount() {
        this.editable = this.state.activeFa.csconta__Status__c === "Draft" || !this.state.activeFa.Id;
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
    /**************************************************/
    onOpenNegotiationModal() {
        console.log(this.state.selectedProducts);
        if (this.state.activeFa.Id) {
            this.setState({ negotiateModal: true });
        }
    }

    onOpenCommercialProductModal() {
        if (this.state.activeFa.Id) {
            this.setState({ productModal: true });
        }
    }

    onCloseModal() {
        this.setState({ productModal: false, negotiateModal: false });
    }

    /**************************************************/
    onAddProducts(productIds) {
        console.log("Added products:", productIds);

        // Do not load products twice
        let IdsToLoad = this.props.commercialProducts.filter(cp => {
            if (!cp._addons) { // If its not loaded
                if (productIds.includes(cp.Id)) {
                    return true;
                }
            } else {
                // For testing, remove
                if (productIds.includes(cp.Id)) {
                    console.warn("Already loaded:", cp.Id);
                }
            }

            return false;
        });

        if (IdsToLoad.length) {
            this.props.getCommercialProductData(productIds)
                .then(r => {
                    this.props.setAddedProducts(productIds);
                    setTimeout(() => {
                        this.setState({ activeFa: this.props.activeFa }, () => {
                            this.onCloseModal();
                        });
                    });
                })
        } else {
            this.props.setAddedProducts(productIds);
            setTimeout(() => {
                this.setState({ activeFa: this.props.activeFa }, () => {
                    this.onCloseModal();
                });
            });
        }
    }
    onSelectProduct(product) {
        let selectedProducts = this.state.selectedProducts;

        if (selectedProducts[product.Id]) {
            delete selectedProducts[product.Id];
        } else {
            selectedProducts[product.Id] = product;
        }
        this.setState({
            selectedProducts
        });
    }

    onBackClick() {
        this.props.history.push("/");
    }
    onFieldChange(field, value) {
        this.props.updateActiveFa(field, value);
    }
    /**************************************************/

    upsertFrameAgreements() {
        var data = { ...this.props.activeFa };
        data.Id = data.Id || null;
        delete data.csconta__Account__c;
        delete data.csconta__Account__r;
        delete data.Name;
        delete data._ui;
        console.log("***********************************************");
        console.log(data);
        this.props.upsertFrameAgreements(data, this.props.activeFa.Id).then(response => {
            this.setState({
                activeFa: response
            });
        });
    }

    // <SFDatePicker editable={this.editable} initialDate={true} onDateChange={this.onDateChange} labelText="Effective date from" placeholderText="Enter date from"/>

    render() {
        // *******************************************************
        // Add product call to action
        let addProductCTA = "";
        if (!this.state.activeFa._ui.commercialProducts.length) {
            addProductCTA = (
                <div className="add-product-box">
          <span className="box-header-1">There are no Products in here</span>
          {(() => {
            if (!this.state.activeFa.Id) {
              return <span className="box-header-2">Save frame agreement before adding products!</span>;
            } else {
              return <span className="box-header-2">They will be visible as soon as you create them.</span>;
            }
          })()}
          <div className="box-button-container">
            <button className="slds-button slds-button--brand" onClick={this.onOpenCommercialProductModal} disabled={!this.state.activeFa.Id}>
              Add Products
            </button>
          </div>
        </div>
            );
        }
        // *******************************************************
        let footer = "";
        if (this.state.activeFa._ui.commercialProducts.length) {
            footer = (
                <div className="main-footer">
          <button className="slds-button slds-button--brand" onClick={this.onOpenCommercialProductModal}>
            Toggle Products
          </button>
          <button className="slds-button slds-button--neutral" onClick={this.onOpenNegotiationModal}>
            Negotiate Products
          </button>
        </div>
            );
        }
        // *******************************************************
        // Modal needs to be conditionally rendered to activate its lifecycle
        let productModal = "";
        if (this.state.productModal) {
            productModal = (
                <ProductModal
          open={this.state.productModal}
          addedProducts={this.state.activeFa._ui.commercialProducts}
          onAddProducts={this.onAddProducts}
          onCloseModal={this.onCloseModal}
        />
            );
        }
        // *******************************************************
        // Modal needs to be conditionally rendered to activate its lifecycle
        let negotiateModal = "";
        if (this.state.negotiateModal) {
            negotiateModal = (
                <NegotiationModal
          open={this.state.negotiateModal}
          products={Object.keys(this.state.selectedProducts)}
          onCloseModal={this.onCloseModal}
        />
            );
        }
        // *******************************************************
        // Negotiation header with and without commercial products
        let negotiationHeader;
        if (this.state.activeFa._ui.commercialProducts.length) {
            negotiationHeader = (
                <div className="info-row">
          <span>Products ({this.state.activeFa._ui.commercialProducts.length})</span>
          <InputSearch placeholder="Quick search" />
        </div>
            );
        } else {
            negotiationHeader = (
                <div className="info-row">
          <span>Product Negotiation</span>
        </div>
            );
        }

        // *******************************************************

        return (
            <div className="editor-container">
        <Header
          onBackClick={this.onBackClick}
          disabled={!this.editable}
          title="Parturient tortor tortor sed tellus molestie neque lobortis sodales"
          subtitle="Frame Agreement Details"
        >
          <div className="header-button-container">
            <button className="slds-button slds-button--translucent" onClick={this.upsertFrameAgreements}>
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
                          onChange={this.onFieldChange}
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
                return <CommercialProduct key={"cp-" + cp.Id} product={cp} onSelect={this.onSelectProduct} fields={this.props.settings.FACSettings.Price_Item_Fields} />;
              })}

              {productModal}
              {negotiateModal}
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
    getCommercialProductData,
    updateActiveFa
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(FaEditor)
);