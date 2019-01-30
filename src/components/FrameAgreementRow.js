import React, { Component } from "react";
import { Link } from 'react-router-dom'

import Icon from './utillity/Icon';

import "./FrameAgreementRow.css";


class FrameAgreementRow extends React.Component {

    constructor(props) {
        super(props);
        this.statusClass = 'badge ' + (this.props.agreement.csconta__Status__c === 'Draft' ? '' : 'badge-dark');
    }

    // onTextChange(event) {
    //     this.setState({
    //         value: event.target.value
    //     });
    // }

    render() {
        return (
            <Link className="fa-row-container" to={`/agreement/${this.props.agreement.Id}`}>
                <div className="fa-row-text-container">
                    <Icon name="threedots_vertical" width="16" height="16" color="#0070d2"/>
                    <span className="fa-row-text">{this.props.agreement.csconta__Agreement_Name__c}</span>
                </div> 
                <span className={this.statusClass}>{this.props.agreement.csconta__Status__c}</span>
          </Link>
        )
    }
}
export default FrameAgreementRow;