import React, { Component } from 'react';
import './Toggle.css';

import Icon from '../Icon';
import './Checkbox.scss';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      value: false
    };
  }

  onChange(val) {
    this.setState({
      value: !this.state.value
    }, () => {
      this.props.onChange(this.state.value);
    });
  }


  render() {
    return (
      <div className={"checkbox" + (this.state.value ? ' checked' : '')} onClick={this.onChange}>
        {this.state.value && <Icon svg-class="checkbox-icon" name="check" width="12" height="12" color="white"></Icon>}
      </div>
    );
  }
}

export default Checkbox;
