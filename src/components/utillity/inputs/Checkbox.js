import React, { Component } from 'react';
import './Toggle.css';

import Icon from '../Icon';
import './Checkbox.scss';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    let initialState = false;

    if (this.props.hasOwnProperty("value")) {
      initialState = this.props.value;
    }
  }

  onChange(val) {
        this.props.onChange && this.props.onChange();
  }

  render() {
    if (this.props.hasOwnProperty("readOnly")) {
        return (
          <div className={"checkbox" + (this.props.readOnly ? ' checked' : '')}>
          {this.props.readOnly && <Icon svg-class="checkbox-icon" name="check" width="12" height="12" color="white"></Icon>}
        </div>
        )
    } else {
      return (
        <div className={"checkbox" + (this.props.value ? ' checked' : '')} onClick={this.onChange}>
          {this.props.value && <Icon svg-class="checkbox-icon" name="check" width="12" height="12" color="white"></Icon>}
        </div>
      );
    }


  }
}

export default Checkbox;
