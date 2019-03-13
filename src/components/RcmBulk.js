import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleRateCard } from '../actions';
import sharedService from './../utils/shared-service';

import './RcmBulk.css';

class RcmBulk extends Component {
  constructor(props) {
    super(props);

    this.applyFilter = this.applyFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.applyDiscount = this.applyDiscount.bind(this);

    this.onPropertyChange = this.onPropertyChange.bind(this);
    this.onPropertyValueChange = this.onPropertyValueChange.bind(this);
    this.onCheckboxToggle = this.onCheckboxToggle.bind(this);
    this.onRateCardLineSelectAll = this.onRateCardLineSelectAll.bind(this);
    this.handleDiscountModeChange = this.handleDiscountModeChange.bind(this);

    this.state = {
      rateCardLines: {},
      propertyData: {},
      selectedProperty: '',
      selectedPropertyValue: '',
      discount: 0,
      discountMode: 'percentage',
      selection: {},
      allToggle: true
    };
  }

  componentWillMount() {
    let rateCardLines = Object.values(this.props.rcm_data).reduce(
      (acc, cur) => {
        var crcl = cur.customRateCardLines || [];
        acc = [...acc, ...cur.rateCardLines, ...crcl];
        return acc;
      },
      []
    );

    var keys = {};
    var _customFieldsArray = Object.keys(this.props.custom_fields);

    _customFieldsArray.forEach(cf => {
      keys[cf] = {};
    });

    this.setState({ rateCardLines: rateCardLines });

    var _stateSelection = {};

    rateCardLines.forEach(rcl => {
      _customFieldsArray.forEach(cf => {
        if (rcl[cf]) {
          keys[cf][rcl[cf]] = true;
        }
      });
      _stateSelection[rcl.Id] = true;
    });

    this.setState({ selection: { ..._stateSelection } });

    for (var key in keys) {
      keys[key] = Object.keys(keys[key]);
    }

    this.setState({ propertyData: keys });
  }

  onPropertyChange(e) {
    var defaultProperty = this.state.propertyData[e.target.value]
      ? this.state.propertyData[e.target.value][0]
      : '';
    this.setState({
      selectedProperty: e.target.value || null,
      selectedPropertyValue: defaultProperty
    });
  }

  onPropertyValueChange(e) {
    this.setState({ selectedPropertyValue: e.target.value || null });
  }

  onCheckboxToggle(rclId) {
    this.setState(
      {
        selection: {
          ...this.state.selection,
          [rclId]: !this.state.selection[rclId]
        }
      },
      () => {
        this.checkSelectAllState();
      }
    );
  }

  onRateCardLineSelectAll() {
    var _stateSelection = { ...this.state.selection };

    var checkedCount = Object.values(_stateSelection).filter(rcl => {
      return !!rcl;
    }).length;

    var setToggleTo = !(checkedCount === this.state.rateCardLines.length);

    for (var key in _stateSelection) {
      _stateSelection[key] = setToggleTo;
    }

    this.setState({ selection: { ..._stateSelection } }, () => {
      this.checkSelectAllState();
    });
  }

  checkSelectAllState() {
    var _stateSelection = { ...this.state.selection };

    var checkedCount = Object.values(_stateSelection).filter(rcl => {
      return !!rcl;
    }).length;

    var allChecked = !!(checkedCount === this.state.rateCardLines.length);

    this.setState({ allToggle: allChecked });
  }

  applyFilter() {
    if (!this.state.selectedProperty) return false;

    let rateCardLines = Object.values(this.props.rcm_data).reduce(
      (acc, cur) => {
        var crcl = cur.customRateCardLines || [];
        acc = [...acc, ...cur.rateCardLines, ...crcl];
        return acc;
      },
      []
    );

    var _stateSelection = this.state.selection;

    rateCardLines = rateCardLines.filter(rcl => {
      var _targeted =
        rcl[this.state.selectedProperty] &&
        rcl[this.state.selectedProperty] === this.state.selectedPropertyValue;
      _stateSelection[rcl.Id] = _targeted;
      return (
        rcl[this.state.selectedProperty] &&
        rcl[this.state.selectedProperty] === this.state.selectedPropertyValue
      );
    });

    this.setState(
      { rateCardLines: rateCardLines, selection: _stateSelection },
      () => {
        this.checkSelectAllState();
      }
    );
  }

  resetFilter() {
    let _stateSelection = this.state.selection;
    for (var key in _stateSelection) {
      _stateSelection[key] = true;
    }

    let rateCardLines = Object.values(this.props.rcm_data).reduce(
      (acc, cur) => {
        var crcl = cur.customRateCardLines || [];
        acc = [...acc, ...cur.rateCardLines, ...crcl];
        return acc;
      },
      []
    );

    this.setState(
      {
        rateCardLines: rateCardLines,
        selectedProperty: '',
        selection: _stateSelection
      },
      () => {
        this.checkSelectAllState();
      }
    );
  }

  applyDiscount(e) {
    var state = this.state;

    function applyDiscountRate(val) {
      if (state.discountMode === 'fixed') {
        val = val + state.discount;
      } else {
        var discountSum = (val * Math.abs(state.discount)) / 100;

        if (state.discount >= 0) {
          val = val + discountSum;
        } else {
          val = val - discountSum;
        }
      }
      // Max 4 decimal places
      var dp = sharedService.decimalPlaces(val);
      if (dp > 4) {
        dp = 4;
      }
      return +val.toFixed(dp);
    }

    var _rclDiscountFiltered = state.rateCardLines.map(rcl => {
      if (state.selection[rcl.Id] && typeof rcl.negotiatedValue === 'number') {
        rcl.negotiatedValue = applyDiscountRate(rcl.negotiatedValue);
      }
      return rcl;
    });

    this.setState({ rateCardLines: _rclDiscountFiltered });
  }

  handleDiscountModeChange(event) {
    this.setState({
      discountMode: event.target.value
    });
  }
  render() {
    return (
      <div>
        <div className="bulk-filter-container">
          <h4>
            Filter rate card lines{' '}
            <span>({this.state.rateCardLines.length})</span>
          </h4>

          <div className="bulk-filter-section">
            <label>Select rate card line property:</label>

            <select
              className="rcm-input_sm"
              value={this.state.selectedProperty || ''}
              onChange={this.onPropertyChange}
            >
              <option value="">-- select an property --</option>
              {Object.keys(this.state.propertyData).map(key => {
                return (
                  <option key={key} value={key}>
                    {' '}
                    {key}{' '}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bulk-filter-section">
            <label>Select value:</label>

            <select
              className="rcm-input_sm"
              value={this.state.selectedPropertyValue || ''}
              disabled={
                this.state.propertyData[this.state.selectedProperty]
                  ? false
                  : true
              }
              onChange={this.onPropertyValueChange}
            >
              {this.state.propertyData[this.state.selectedProperty] &&
                this.state.propertyData[this.state.selectedProperty].map(
                  val => {
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  }
                )}
            </select>
          </div>

          <div className="bulk-button-container">
            <button
              className="slds-button rcm-input_sm slds-button--neutral"
              disabled={
                this.state.propertyData[this.state.selectedProperty]
                  ? false
                  : true
              }
              onClick={this.applyFilter}
            >
              Apply
            </button>
            <button
              className="slds-button rcm-input_sm slds-button--neutral"
              onClick={this.resetFilter}
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <table className="slds-table slds-table_bordered slds-no-row-hover">
            <thead>
              <tr>
                <th>
                  <div className="slds-truncate">
                    <span
                      className={
                        'slds-checkbox_faux ' +
                        (this.state.allToggle ? 'checked' : '')
                      }
                      onClick={this.onRateCardLineSelectAll}
                    />
                  </div>
                </th>
                <th>
                  <div className="slds-truncate">Name</div>
                </th>
                <th>
                  <div className="slds-truncate">Unit</div>
                </th>
                {Object.keys(this.props.custom_fields)
                  .filter(cf => this.props.custom_fields[cf])
                  .map(cf => {
                    return (
                      <th key={'th-' + cf}>
                        <div className="slds-truncate">{cf}</div>
                      </th>
                    );
                  })}
                <th>
                  <div className="slds-truncate">Original Value</div>
                </th>
                <th>
                  <div className="slds-truncate">Negotiated Value</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.rateCardLines.map(rcl => {
                return (
                  <tr key={rcl.Id}>
                    <td>
                      <span
                        className={
                          'slds-checkbox_faux ' +
                          (this.state.selection[rcl.Id] ? 'checked' : '')
                        }
                        onClick={() => this.onCheckboxToggle(rcl.Id)}
                      />
                    </td>
                    <td>{rcl.Name}</td>
                    <td>{rcl.Unit}</td>
                    {Object.keys(this.props.custom_fields)
                      .filter(cf => this.props.custom_fields[cf])
                      .map(cf => {
                        return <td key={'td-' + cf}>{rcl[cf] || ''}</td>;
                      })}
                    <td>{rcl.originalValue}</td>
                    <td>{rcl.negotiatedValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bulk-discount-container">
          <div className="bulk-discount-section" style={{ width: 20 + '%' }}>
            <form>
              <label>Discount mode:</label>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      value="percentage"
                      checked={this.state.discountMode === 'percentage'}
                      onChange={this.handleDiscountModeChange}
                    />
                    <span>Percentage</span>
                  </label>
                </li>

                <li>
                  <label>
                    <input
                      type="radio"
                      value="fixed"
                      checked={this.state.discountMode === 'fixed'}
                      onChange={this.handleDiscountModeChange}
                    />
                    <span>Fixed Amount</span>
                  </label>
                </li>
              </ul>
            </form>
          </div>
          <div className="bulk-discount-section">
            <label>Discount to selection:</label>

            <input
              className="rcm-input_sm form-control"
              type="number"
              value={this.state.discount}
              onChange={e => this.setState({ discount: +e.target.value })}
            />
          </div>
          <div className="bulk-discount-section">
            <label>&nbsp;</label>
            <button
              disabled={this.state.rateCardLines.length ? false : true}
              style={{ display: 'block' }}
              className="slds-button rcm-input_sm slds-button--brand"
              id="save-rcm-modal"
              onClick={this.applyDiscount}
            >
              Apply change{' '}
              {this.state.discount !== 0 && (
                <span>{`(${this.state.discount > 0 ? '+' : ''}${
                  this.state.discount
                }${this.state.discountMode === 'fixed' ? '' : '%'})`}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  toggleRateCard
};

const mapStateToProps = state => {
  return { rcm_data: state.rcm_data, custom_fields: state.custom_fields };
};

// const RcmModal = connect(null, mapDispatchToProps)(ConnectedForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RcmBulk);
