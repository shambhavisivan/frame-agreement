import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFrameAgreements } from '../actions';


import './FaSidebar.css';

class FaSidebar extends Component {
  constructor(props) {
    super(props);
  }



  render() {
    return (
          <div className="sidebar">

              <p>
                <span>Dev Sidebar</span>
              </p>

            <hr />

              <ul className="temp-info">
                {Object.keys(this.props.activeFa).map(fa => {
                  return <li key={fa}>{fa + ':' + this.props.activeFa[fa]}</li>;
                })}
              </ul>         

          </div>
    );
  }
}

const mapStateToProps = state => {
  return { activeFa: state.activeFa };
};

const mapDispatchToProps = {
  getFrameAgreements
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(FaSidebar);
