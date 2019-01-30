import React, { Component } from 'react';

import Icon from '../Icon';

import DatePicker from './react-datepicker';
import './react-datepicker.css';

import './SFDatePicker.css';

class DatePickerInput extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={
          'datepicker-input-container ' +
          (this.props.disabled ? 'disabled' : '')
        }
        onClick={this.props.onClick}
      >
        <input
          className="slds-input"
          type="text"
          disabled={this.props.disabled}
          onChange={this.props.onChange}
          placeholder={this.props.placeholderText}
          value={this.props.value}
        />
        <Icon name="event" width="16" height="16" />
      </div>
    );
  }
}

class SFDatePicker extends Component {
  constructor(props) {
    super(props);
    console.log('DATEPICKER:', props);
    let initialDate = props.initialDate ? new Date(props.initialDate) : null;
    this.state = {
      dateValue: initialDate
    };
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(date) {
    if (!this.props.disabled) {
      this.setState({
        dateValue: new Date(date)
      });
      this.props.onDateChange(new Date(date).getTime());
    }
  }

  render() {
    return (
      <DatePicker
        customInput={
          <DatePickerInput
            labelText={this.props.labelText}
            placeholderText={this.props.placeholderText}
          />
        }
        dateFormat="dd.MM.yyyy"
        weekStartsOn={1}
        disabled={this.props.disabled}
        yearDropdownItemNumber={3}
        dateFormatCalendar="MMMM"
        showYearDropdown
        todayButton={'Today'}
        selected={this.state.dateValue}
        onChange={this.handleDataChange}
      />
    );
  }
}

export default SFDatePicker;
