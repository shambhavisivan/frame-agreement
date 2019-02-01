import React, { Component } from 'react';
import './Toggle.css';

import Icon from '../Icon';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  onChange(val) {
    this.setState({
      value: val || false
    });
    console.log(this.state.value);
    this.props.onChange(val);
  }

  render() {
    let field;
    if (this.props.disabled) {
      field = (
        <label
          className={'switch disabled ' + (this.state.value ? 'checked' : '')}
        >
          <input type="checkbox" value={this.state.value} />
          <span className="slider round">
            {this.state.value && (
              <Icon name="check" width="14" height="14" color="white" />
            )}
          </span>
        </label>
      );
    } else {
      field = (
        <label className={'switch ' + (this.state.value ? 'checked' : '')}>
          <input
            type="checkbox"
            onClick={() => this.onChange(!this.state.value)}
            value={this.state.value}
          />
          <span className="slider round">
            {this.state.value && (
              <Icon name="check" width="14" height="14" color="white" />
            )}
          </span>
        </label>
      );
    }
    return <div>{field}</div>;
  }
}

export default Checkbox;
