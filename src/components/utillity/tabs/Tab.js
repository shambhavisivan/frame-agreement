import React, { Component } from 'react';

import './Tab.scss';

class Tab extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(event) {
    event.preventDefault();
    this.props.onClick(this.props.tabIndex);
  }

  render() {
    return (
      <li
        className={`tab ${this.props.isActive ? 'active' : ''}`}
        onClick={this.handleTabClick}
      >
        <a className="tab-link">{this.props.label}</a>
      </li>
    );
  }
}

export default Tab;
