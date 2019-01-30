import React, { Component } from "react";

import Icon from '../Icon';

import "./InputTextArea.css";

class InputTextArea extends React.Component {

    constructor(props) {
        super(props);
        this.onTextChange = this.onTextChange.bind(this);
        this.state = {
            value: this.props.value
        };
    }

    onTextChange(event) {
        this.setState({
            value: event.target.value
        });
        this.props.onChange(event.target.value);
    }

    render() {
        return (
	      <div>
		      <textarea disabled={this.props.disabled} spellCheck="false" onKeyPress={this._handleKeyPress} className="slds-input" onChange={this.onTextChange} value={this.state.value} />
	      </div>
        )
    }
}

export default InputTextArea;