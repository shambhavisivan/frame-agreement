import React, { Component } from "react";
import RcmViewer from "./components/RcmViewer";
import RcmEditor from "./components/RcmEditor";
import RcmBulk from "./components/RcmBulk";

import sharedService from "./utils/shared-service";
import rs from "./utils/resize-sensor";

import { connect } from "react-redux";
import store from "./store";

import { editModalWidth, updateRcmData, updateGroupData, invokeSetPlugin, invokeSetPluginRemote, invokeGetPlugin, invokeGetPluginRemote } from "./actions";

class Modal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialised: false,
            activeTab: 'viewer'
        };

        this.rcmModal = React.createRef();
        this.resizeSensor = null;
        this.modalBody = React.createRef();
        this.modalHeight =  this.rcmModal.innerHeight;

        this.vfContext = sharedService.vfContext;
        this.expanded = false;

        if (sharedService.vfContext && sharedService.SF.param.expanded) {
          this.expanded = true;
          this.props.editModalWidth(100);
        }

        this.priceItem = sharedService.getAttributeData();
        // this.invokeRcmGetPlugin = this.invokeRcmGetPlugin.bind(this);
        this.invokeRcmSetPlugin = this.invokeRcmSetPlugin.bind(this);
        this.setActiveTab = this.setActiveTab.bind(this);

        if (sharedService.vfContext) {
          console.log('%c Using RemoteActions to invoke plugin! ', 'background: #0070d2; color: white; padding: 2px');
          this.getPluginAction = this.props.invokeGetPluginRemote;
          this.setPluginAction = this.props.invokeSetPluginRemote;

          // Open modal
          store.dispatch({ type: "TOGGLE_MODAL", payload: true })

        } else if (CS && CS.Service) {
          console.log('%c Using CS.Service.Invoke to invoke plugin! ', 'background: #0070d2; color: white; padding: 2px');
          this.getPluginAction = this.props.invokeGetPlugin;
          this.setPluginAction = this.props.invokeSetPlugin;
        } else {
          throw new Error("Cannot find CS.Service nor SF object!")
        }

    }

    componentDidMount() {

        function debounce(func) {
            var timer;
            return function(event) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(func, 300, event);
            };
        }

        function sendMessage(height) {
            var msg = btoa(JSON.stringify({
                sender: 'RCM',
                height: height
            }));
            window.parent.postMessage(msg, '*');
        }

        this.getPluginAction(JSON.stringify(this.priceItem))
            .then(
                response => {
                    this.setState({ initialised: true });
                    console.log("RCM date:", this.props.rcm_data);
                    console.log("Group data:", this.props.group_data);

                    // Now that refs are rendered
                    let modal_container = document.getElementsByClassName('slds-modal__container')[0];
                    this.resizeSensor = new ResizeSensor(modal_container, () => {
                        // debounce(() => {
                          sendMessage(modal_container.clientHeight);
                        // });
                    });
                    // Initials
                    sendMessage(modal_container.clientHeight);
                },
                error => {}
            );

        // Refresh on price item change
        if (!sharedService.vfContext) {
            CS.EventHandler.subscribe(CS.EventHandler.Event.RULES_FINISHED, payload => {
                console.log("RULES_FINISHED");
                var _priceItem = sharedService.getAttributeData();
                    this.priceItem = sharedService.getAttributeData();
                    if (this.priceItem.priceItemId) {
                      this.getPluginAction(JSON.stringify(this.priceItem))
                    } else {
                      console.warn("Cannot find price item!", this.priceItem);
                    }
            });
        }

    }

    componentDidUpdate() {
      // Increase width state if overflown
      if (this.modalBody.current && !this.expanded) {
        function isOverflown(element) {
            return (element.scrollWidth > element.clientWidth && element.scrollWidth < (window.innerWidth * 0.9));
        }
        if (isOverflown(this.modalBody.current)) {
          this.props.editModalWidth(this.props.settings.modalWidth + 10);
        }
      }
    }

    componentWillUnmount() {
      this.setState({ editorVisible: false, bulkVisible: false });
      if (this.resizeSensor) {
        this.resizeSensor.detach();
      }
    }

    invokeRcmSetPlugin(event) {
        event.preventDefault();
        // SET plugin takes stringified object LIKE {priceItemId : rateCardArray[]}
        let _rcm_data = { ...this.props.rcm_data };

        let _attachment = { ...this.props.attachment };

        console.log("Saving. RCM Data:", _rcm_data);
        console.log("Saving. Attachment:", _attachment);

        // Filter only added rate cards and remove said property
        let attachmentValue = Object.values(_rcm_data).filter(rc => (rc.added || rc.IsDefault));

        // Attachment still contains "added" property which is not supported in apex
        // Attachment is saved as string so it doesn't matter. But, if anyone decides to
        // unwrap attachment in apex this will cause an issue

        _attachment[this.priceItem.priceItemId] = attachmentValue;

        var parameter = {
            configId: this.priceItem.configId,
            attachmentBody: JSON.stringify(_attachment)
        };

        this.setPluginAction(JSON.stringify(parameter)).then(
            result => {
                console.log("AttachmentEditor Plugin successful:", result);
            },
            error => {
                console.log("Error while invoking APEX Set plugin: " + error);
            }
        );

    }

    setActiveTab(newActive) {
      this.setState({activeTab: newActive});
    }

    // <img className="icon-settings" src="http://www.vicksdesign.com/products/settings-machine-cog-gear-22-B1.png" />
    render() {
      return this.state.initialised && (
            <div className={"" + (!this.vfContext ? 'rcm-modal-backdrop ' : '') + (this.props.modal ? 'open' : 'closed')}>
                <div id="rcm-modal" role="dialog" ref={this.rcmModal}>
                    <div className="slds-modal__container" style={{width: this.props.settings.modalWidth  + '%'}}>
                        <div className="rcm-modal_header">
                            <h2 className="slds-text-heading--medium">
                                <span>Rate Card Manager</span>

                            </h2>
                        </div>

                        <div className="rcm-modal_tabs">
                            <div className={"modal_tab" + (this.state.activeTab === 'viewer' ? ' active' : '')} onClick={() => this.setActiveTab('viewer')}>Negotiation of Rates</div>
                            <div className={"modal_tab" + (this.state.activeTab === 'editor' ? ' active' : '')} onClick={() => this.setActiveTab('editor')}>Rate Card Selection</div>
                            <div className={"modal_tab" + (this.state.activeTab === 'bulk' ? ' active' : '')} onClick={() => this.setActiveTab('bulk')}>Bulk Actions</div>
                        </div>

                        <div className="rcm-modal_body" ref={this.modalBody}>

                          {(() => {
                              switch (this.state.activeTab) {
                                  case 'viewer':
                                      return <RcmViewer />
                                  case 'editor':
                                      return <RcmEditor />
                                  case 'bulk':
                                      return <RcmBulk />
                                  default:
                                      return <RcmViewer />
                              }
                          })()}

                        </div>
                        <div className="rcm-modal_footer">
                            <button className="slds-button slds-button--brand" id="save-rcm-modal"  onClick={this.invokeRcmSetPlugin}>Save</button>
                            { !this.vfContext && <button className="slds-button slds-button--neutral" id="close-rcm-modal" onClick={this.props.onClose}>Cancel</button>}
                        </div>
                    </div>

                </div>
              </div>
      );
    }
}

const mapDispatchToProps = {
    editModalWidth,
    invokeGetPlugin,
    invokeGetPluginRemote,
    invokeSetPlugin,
    invokeSetPluginRemote,
    updateRcmData,
    updateGroupData
};

const mapStateToProps = state => {
    return { modal: state.modal, rcm_data: state.rcm_data, group_data: state.group_data, attachment: state.attachment, settings: state.settings };
};

// const RcmModal = connect(null, mapDispatchToProps)(ConnectedForm);

// export default Modal;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);
