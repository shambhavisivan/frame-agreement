import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFrameAgreements } from '../actions';

import './FaSidebar.css';

class FaSidebar extends Component {
  constructor(props) {
    super(props);
    this.logs = window.react_logs;
  }

  render() {
    return (
      <div className="sidebar">
        <p>
          <span>Dev Sidebar</span>
        </p>

        <hr />

        <ul className="temp-info">
          <li className="delimiter" />

          {this.logs &&
            this.logs
              .slice(Math.max(this.logs.length - 15, 1))
              .map((log, i) => {
                return (
                  <li className="log" key={log + i}>
                    <span className="sf-label">Action fired:</span>{' '}
                    <span className="log-action">{log}</span>
                  </li>
                );
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
