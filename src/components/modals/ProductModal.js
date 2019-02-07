import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


import Modal from 'react-responsive-modal';
// import { getFrameAgreements } from '../../actions';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';

import './Modal.css';
import './ProductModal.css';

class ProductModal extends Component {
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    this.truncateCPField = this.truncateCPField.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.addProducts = this.addProducts.bind(this);

    let addedIds = {};
    this.props.addedProducts.map( p => p.Id).forEach( id => {
      addedIds[id] = true;
    });

    console.log("ADDED:", addedIds);

    this.state = {
      searchValue: '',
      panel: false,
      actionTaken: false,
      selected: addedIds
    };

    this.priceItemFields = [
      ...this.props.settings.FACSettings.Price_Item_Fields
    ];
    this.priceItemFields.unshift('Name');
    console.warn(this.priceItemFields);
  }

  onCloseModal() {
    this.setState({
      actionTaken: false,
      selected: {}
    });
    this.props.onCloseModal();
  }

  onSearchChange(value) {
    console.log(value);
  }

  togglePanel(value) {
    this.setState({
      panel: !this.state.panel
    });
  }

  selectProduct(product) {
    let currentState = !!this.state.selected[product.Id];
    let newState = { ...this.state.selected };
    if (currentState) {
      delete newState[product.Id];
    } else {
      newState[product.Id] = true;
    }

    this.setState(
      {
        selected: { ...newState }
      },
      () => {
        this.setState({
          actionTaken: true
        });
        console.log(this.state.selected);
      }
    );
  }

  addProducts() {
    this.props.onAddProducts(Object.keys(this.state.selected));
    this.setState({
      actionTaken: false,
      selected: {}
    });
  }

  truncateCPField(field) {
    var returnString = field;
    try {
      returnString = field.split('__')[1].replace(/_/g, ' ');
    } catch (err) {}
    return returnString;
  }

  render() {
    return (
      <Modal
        classNames={{ overlay: 'overlay', modal: 'sf-modal' }}
        open={this.props.open}
        onClose={this.onCloseModal}
        center
      >
        <div className="modal-header">
          <h2>Add Product to Frame Agreement</h2>
        </div>

        <div
          className={
            'modal-body ' + (this.state.panel ? 'panel-open' : 'panel-closed')
          }
        >
          <div className="modal-panel">
            <div className="panel-navigation">
              <div
                className="panel-navigation--close"
                onClick={this.togglePanel}
              >
                <Icon name="close" width="12" height="12" color="#0070d2" />
                <span>Close</span>
              </div>
              <div
                className="product-list-header"
                style={{ border: 0, padding: 0 }}
              >
                <div className="header-th">
                  <span>Product categorisation</span>
                </div>
              </div>
            </div>
            <div className="panel-filter-container">TBA Filtering</div>
          </div>

          <div className="modal-table-container">
            <div className="modal-navigation">
              <div
                className="categorisation-container"
                onClick={this.togglePanel}
              >
                <Icon
                  name="color_swatch"
                  width="14"
                  height="14"
                  color="#0070d2"
                />
                <div className="categorisation-switch">
                  Product categorisation panel
                </div>
              </div>

              <div className="search-container">
                <InputSearch
                  placeholder="Filter products"
                  value={this.state.searchValue}
                  onChange={this.onSearchChange}
                />
              </div>
            </div>

            <div className="modal-product-list">
              <div className="product-list-header">
                {this.priceItemFields.map(pif => {
                  return (
                    <div key={pif} className="header-th">
                      <span>
                        {this.props.settings.FACSettings.Truncate_CP_Fields
                          ? this.truncateCPField(pif)
                          : pif}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="product-list">
                {this.props.commercialProducts.map(cp => {
                  return (
                    <div
                      key={cp.Id}
                      className={
                        'product-row' +
                        (this.state.selected[cp.Id] ? ' selected' : '')
                      }
                      onClick={() => this.selectProduct(cp)}
                    >
                      {this.priceItemFields.map(pif => {
                        return (
                          <span key={cp.Id + '-' + pif}>{cp[pif] || '-'}</span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-pagination" />
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={this.addProducts}
            className="slds-button slds-button--brand"
            disabled={!this.state.actionTaken}
          >
            Save Selection
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
  // getFrameAgreements
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProductModal);