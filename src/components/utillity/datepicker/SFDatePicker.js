import React, { Component } from "react";

import Icon from '../Icon';

import DatePicker from "../../../utils/react-datepicker";
import "../../../utils/react-datepicker.css";

import "./SFDatePicker.css";

class DatePickerInput extends React.Component {

    render() {
        return (
	       <div className="datepicker-input" onClick={this.props.onClick}>
		        <input className="slds-input" type="text" onChange={this.props.onChange} placeholder={this.props.placeholderText} value={this.props.value} />
		        <Icon name="event" width="16" heigth="16"/>
	      </div>
        )
    }
}

class SFDatePicker extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dateValue: undefined
        };
        this.handleDataChange = this.handleDataChange.bind(this);
    }
    handleDataChange(date) {
        this.setState({
            dateValue: date
        });

        this.props.onDateChange(date);
    }

    render() {
        return (
            <DatePicker
                customInput={<DatePickerInput placeholderText={this.props.placeholderText}/>}
                dateFormat="dd.MM.yyyy"
                weekStartsOn={1}
                yearDropdownItemNumber={3}
                dateFormatCalendar="MMMM"
                showYearDropdown
                todayButton={"Today"}
                selected={this.state.dateValue}
                onChange={this.handleDataChange}
              />
        );
    }
}

export default SFDatePicker;