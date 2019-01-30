import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import Modal from 'react-responsive-modal';
import { getFrameAgreements } from '../../actions';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';

import "./Modal.css";
import "./ProductModal.css";

class ProductModal extends Component {
    constructor(props) {
        super(props);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.togglePanel = this.togglePanel.bind(this);

        this.state = {
            searchValue: '',
            panel: false
        }
    }

    onSearchChange(value) {
        console.log(value);
    }

    togglePanel(value) {
        this.setState({
            panel: !this.state.panel
        });
    }

    render() {
        return (
            <Modal classNames={{overlay: "overlay", modal: "sf-modal"}} open={this.props.open} onClose={this.props.onCloseModal} center>

            <div className="modal-header">
               <h2>Add Product to Frame Agreement</h2>
            </div>



            <div className={"modal-body " + (this.state.panel ? 'panel-open' : 'panel-closed')}>

                <div className="modal-panel">
                    <div className="panel-navigation">
                        <div className="panel-navigation--close" onClick={this.togglePanel}>
                            <Icon name="close" width="12" height="12" color="#0070d2"></Icon>
                            <span>Close</span>
                        </div>
                        <div className="product-list-header" style={{border: 0, padding:0}}>
                            <div className="header-th">
                                <span>Product categorisation</span>
                            </div>
                        </div>
                    </div>
                    <div className="panel-filter-container">
                        b
                    </div>
                </div>

            <div className="modal-table-container">

               <div className="modal-navigation">

                  <div className="categorisation-container" onClick={this.togglePanel}>
                     <Icon name="color_swatch" width="14" height="14" color="#0070d2"></Icon>
                     <div className="categorisation-switch">Product categorisation panel</div>
                  </div>

                  <div className="search-container">
                     <InputSearch placeholder="Filter products" value={this.state.searchValue} onChange={this.onSearchChange}/>
                  </div>

               </div>

               <div className="modal-product-list">
                    <div className="product-list-header">
                        <div className="header-th">
                            <span>Product Name</span>
                        </div>
                        <div className="header-th">
                            <span>SKU Code</span>
                        </div>
                        <div className="header-th">
                            <span>Category</span>
                        </div>
                        <div className="header-th">
                            <span>Status</span>
                        </div>
                        
                    </div>
                    <div className="product-list">
                        <div className="product-row">
                            <span>Product 1</span>
                            <span>11345</span>
                            <span>Apple</span>
                            <span>Published</span>
                        </div>
                        <div className="product-row">
                            <span>Product 2</span>
                            <span>11345</span>
                            <span>Apple</span>
                            <span>Published</span>
                        </div>
                        <div className="product-row">
                            <span>Product 3</span>
                            <span>11345</span>
                            <span>Apple</span>
                            <span>Published</span>
                        </div>
                    </div>
               </div>

               <div className="modal-pagination">
               </div>

            </div>

            </div>



            <div className="modal-footer">
            </div>

            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return { frameAgreements: state.frameAgreements};
};

const mapDispatchToProps = {
    getFrameAgreements
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductModal))
