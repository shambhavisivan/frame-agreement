import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Icon from '../Icon';
import SFDatePicker from '../datepicker/SFDatePicker';
import InputText from '../inputs/InputText';
import InputTextArea from '../inputs/InputTextArea';
import Checkbox from '../inputs/Toggle';

import './SFField.css';

class SFField extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    // this.props.editable

    this.state = {
      value: this.props.value
    };

    console.warn('Edit:', this.props.editable);
  }

  onChange(value) {
    this.setState({
      value: value
    });
    this.props.onChange(this.props.field.field, value);
  }

  render() {
    let field;
    if (this.props.field.type === 'date') {
      field = (
        <SFDatePicker
          disabled={!this.props.editable}
          initialDate={this.state.value}
          onDateChange={this.onChange}
          placeholderText="Enter date from"
        />
      );
    } else if (this.props.field.type === 'text' || this.props.field.type === 'number') {
      field = (
        <InputText
          disabled={!this.props.editable}
          type={this.props.field.type}
          onChange={this.onChange}
          onBlur={() => {
            this.setState({ edit: false });
          }}
          value={this.state.value}
        />
      );
    } else if (this.props.field.type === 'boolean') {
      field = (
        <Checkbox
          onChange={this.onChange}
          disabled={!this.props.editable}
          value={this.state.value}
        />
      );
    } else if (this.props.field.type === 'textarea') {
      field = (
        <InputTextArea
          disabled={!this.props.editable}
          onChange={this.onChange}
          onBlur={() => {
            this.setState({ edit: false });
          }}
          value={this.state.value}
        />
      );
    }

    return (
      <div
        className={'sf-field ' + (this.props.editable ? 'editable' : '')}
        style={{ width: (100 / 12) * this.props.field.grid + '%' }}
      >
        <label className={'sf-label ' + (this.state.edit ? 'edit' : '')}>
          <span>{this.props.field.label}</span>
          <Icon
            svg-class="form-edit-icon"
            name="edit"
            width="11"
            height="11"
            color="#4bca81"
          />
        </label>
        <div className="sf-field-value">{field}</div>
      </div>
    );
  }
}

// SFField.propTypes = {
//     label: PropTypes.string,
//     editable: PropTypes.bool,
//     value: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.number
//     ]),
//     type: PropTypes.oneOf(['text', 'date'])
// }

export default SFField;
