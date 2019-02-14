import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Icon from '../Icon';

import './InputNegotiate.css';

class InputNegotiate extends React.Component {
  constructor(props) {
    super(props);

    this.onNegotiate = this.onNegotiate.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      negotiatedValue: +this.props.negotiatedValue,
      focus: false
    };
  }

  onNegotiate(e) {
    this.setState({
      negotiatedValue: +e.target.value
    });
    this.props.onChange(+e.target.value);
  }

  onFocus() {
    this.setState({focus: true});
  }

  onBlur() {
    this.setState({focus: false});
  }

  // onTextChange(event) {
  //     this.setState({
  //         value: event.target.value
  //     });
  // }

  // onBlur={() => {this.setState({readOnly: true})}}

  // 

  render() {
    return (
      <div className="negotiate-container">
        <div className={"negotiate-input-wrapper" + (this.state.focus ? ' focused' : '') + (this.state.negotiatedValue !== this.props.originalValue ? ' negotiated' : '')}>
                <Icon svg-class="negotiate-icon" name="edit" width="14" height="14" color={this.state.focus ? "#0070d2" : "#747474"} />
                <DebounceInput
                    debounceTimeout={100}
                    placeholder="0"
                    spellCheck="false"
                    className="negotiate-input"
                    type="number"
                    onChange={this.onNegotiate}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    value={this.state.negotiatedValue}
                />
          </div>
          {this.state.negotiatedValue !== this.props.originalValue && this.props.originalValue ? (<span className="discount"><span>negotiated disc. </span>{(this.props.originalValue - this.state.negotiatedValue).toFixed(2)}</span>) : ''}
      </div>
    );

  }
}

export default InputNegotiate;