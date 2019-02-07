import React, { Component } from "react";
import { connect } from "react-redux";
import { updateRcmData, addCustomRcl, editCustomRcl, removeCustomRcl } from "../actions";
import uuidv1 from "uuid";

import RclInput from "./RclInput";
import CustomRcl from "./CustomRcl";
import Menu from "./menu";
import "./RcmViewer.css";

class RcmViewer extends Component {
  constructor(props) {
    super(props);

    this.onNegotiatedValueChanged = this.onNegotiatedValueChanged.bind(this);
    this.onCustomRateCardLineChange = this.onCustomRateCardLineChange.bind(this);

    this.addCustomRcl = this.addCustomRcl.bind(this);
    this.removeCustomRcl = this.removeCustomRcl.bind(this);

    this.state = {
      newRclObj: {}
    };

  }

  onNegotiatedValueChanged(value, rcId, rclId) {
        this.props.rcm_data[rcId].rateCardLines = this.props.rcm_data[rcId].rateCardLines.map(rcl => {
          if (rcl.Id === rclId) {
            rcl.negotiatedValue = value;
          }
          return rcl;
        });

        this.props.updateRcmData(this.props.rcm_data)
  }

  onCustomRateCardLineChange(rcl) {
        if (this.state.newRclObj[rcl.Id] !== undefined) {
          this.setState({newRclObj: {...this.state.newRclObj, [rcl.Id]: false}});
        }
       this.props.editCustomRcl(rcl);
  }

  addCustomRcl(rcId) {

    var newRcl = {
        Id: uuidv1(),
        Name: "",
        Unit: "",
        negotiatedValue: 0,
        originalValue: 0,
        rateCardId: rcId,
    };

    this.setState({newRclObj: {...this.state.newRclObj, [newRcl.Id]: true}});

    // this.props.rcm_data[rcId].rateCardLines.push(newRcl);
    // this.props.updateRcmData(this.props.rcm_data);
    this.props.addCustomRcl(rcId, newRcl);
  }

  removeCustomRcl(rcId, crclId) {
    this.props.removeCustomRcl(rcId, crclId);
  }

sortByDefault(a,b) {
  if (a.IsDefault)
    return -1;

  return 1;
}

  // <input value={rcl.negotiatedValue} onChange={() => this.onValueChange(event, rc.Id, rcl.Id)}/>

  render() {
    return (
      <div id="rcmViewer">
        <ul id="vw-cardList" className={"" + (this.props.settings.AllowAddingRCL ? "" : "disabled-adding")}>
          {Object.values(this.props.rcm_data).filter(rc=>(rc.added || rc.IsDefault)).sort(this.sortByDefault).map(rc => {
           return (
              <li key={rc.Id}>
                <span className={"rc-name " + (rc.IsDefault ? 'default' : '')}>{rc.Name}</span>

                <table className="vw-rcTable slds-table slds-table_bordered slds-no-row-hover">
                  <thead>
                    <tr>
                      <th>
                        <div className="slds-truncate">
                            Name
                         </div>
                      </th>
                      <th>
                        <div className="slds-truncate">
                            Unit
                         </div>
                      </th>
                      {
                        Object.keys(this.props.custom_fields).filter(cf => this.props.custom_fields[cf]).map((cf, i) => {
                          return (<th key={'th-'+cf+i}><div className="slds-truncate">{cf}</div></th>)
                        })
                      }
                      <th>
                        <div className="slds-truncate">
                            Original Value
                         </div>
                      </th>
                      <th>
                        <div className="slds-truncate">
                            Negotiated Value
                         </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rc.rateCardLines.map(rcl => {
                      return (
                        <tr key={rcl.Id}>
                          <td>{rcl.Name}</td>
                          <td>{rcl.Unit}</td>
                          {
                            Object.keys(this.props.custom_fields).filter(cf => this.props.custom_fields[cf]).map((cf, i) => {
                              return (<td key={'th-'+cf+i}>{rcl[cf] || ''}</td>)
                            })
                          }
                          <td>{rcl.originalValue}</td>
                          <td>
                            <RclInput onChange={this.onNegotiatedValueChanged} rcid={rc.Id} rclid={rcl.Id} value={rcl.negotiatedValue}/>  
                          </td>
                          <td className="slds-cell-shrink"></td>
                        </tr>
                      );
                    })}

                    {rc.customRateCardLines && rc.customRateCardLines.map(rcl => {
                      return (
                        <CustomRcl editing={this.state.newRclObj[rcl.Id]} key={rcl.Id} rcl={rcl} customFields={this.props.custom_fields} onChange={this.onCustomRateCardLineChange} onRemove={this.removeCustomRcl}/>
                      );
                    })}

                  </tbody>
                </table>
                {this.props.settings.AllowAddingRCL && <div className="vw-add-custom">
                  <a href="javascript:void(0)" onClick={() => this.addCustomRcl(rc.Id)}>Add custom rate card line</a> 
                </div>}
              </li>
            );
          })}

          { !Object.values(this.props.rcm_data).filter(rc=>(rc.added || rc.IsDefault)).length && <li> No rate cards</li>}

        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { rcm_data: state.rcm_data, custom_fields: state.custom_fields, settings: state.settings };
};

const mapDispatchToProps = {
    updateRcmData,
    editCustomRcl,
    removeCustomRcl,
    addCustomRcl
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RcmViewer);
