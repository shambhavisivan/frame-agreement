import React, { Component } from "react";
import { connect } from "react-redux";

import { withRouter } from 'react-router-dom';
import "./FaEditor.css";

import Header from './utillity/Header';
import Icon from './utillity/Icon';
import PropTypes from 'prop-types';

import SFDatePicker from "./utillity/datepicker/SFDatePicker";


class FaEditor extends Component {
  constructor(props) {
    super(props)
    this.onBackClick = this.onBackClick.bind(this);

    // this.state = {
    //   startDate: new Date()
    // };
    this.onDateChange = this.onDateChange.bind(this);
}

  componentWillMount() {
    this.urlId = this.props.match.params.id;
    this.activeFa = this.props.frameAgreements[this.urlId] || {};
    // this.activeFa.Name
  }

  onBackClick() {
    this.props.history.push('/');
  }

  onDateChange(date) {
    console.log("From FaEditor:", date);
  }
  
  render() {
    return (

      <div className="editor-container">


          <Header onBackClick={this.onBackClick} disabled={false} title="Parturient tortor tortor sed tellus molestie neque lobortis sodales" subtitle="Frame Agreement Details">
              <div></div>
          </Header>

        <div className="main-container">

          <div className="main">

            <div className="main-header">
                  <SFDatePicker onDateChange={this.onDateChange} labelText="" placeholderText="Enter date to"/>
            </div>

            <div className="main-frame-container">
                
                <ul>
                  {this.props.commercialProducts && this.props.commercialProducts.map(cp => {
                     return (
                        <li key={cp.Id}>
                            {cp.Name}
                        </li>
                      );
                    })}
                </ul>

            </div>

              <Icon name="ban" svg-class="arb" width="16" heigth="16" color="blue"/>
              <Icon name="check" svg-class="arb" width="16" heigth="16" color="#333"/>
            <hr/>

            </div>

        </div>

      </div>

    );
  }
}


const mapStateToProps = state => {
    return { frameAgreements: state.frameAgreements, commercialProducts: state.commercialProducts};
};

export default withRouter(connect(mapStateToProps, null)(FaEditor))