import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from 'react-router-dom';

import { getFrameAgreements, getCommercialProducts, getAppSettings } from './actions';
// import { editModalWidth } from "./actions";
import FaPicker from './components/FaPicker';
import FaEditor from './components/FaEditor';
import "./App.css";

import { withRouter } from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);

        this.props.getFrameAgreements();
        this.props.getCommercialProducts();
        this.props.getAppSettings();
    }

    // <img className="icon-settings" src="http://www.vicksdesign.com/products/settings-machine-cog-gear-22-B1.png" />
    render() {
        return this.props.initialised.fa_loaded && this.props.initialised.cp_loaded && this.props.initialised.settings_loaded && (
            <div>
                <Switch>
                  <Route exact path='/' component={FaPicker}/>
                  <Route exact path='/agreement' component={FaEditor}/>
                  <Route exact path='/agreement/:id' component={FaEditor}/>
                </Switch>
              </div>
        );
    }
}

const mapDispatchToProps = {
    getFrameAgreements,
    getCommercialProducts,
    getAppSettings
};

const mapStateToProps = state => {
    return { frameAgreements: state.frameAgreements, initialised: state.initialised};
};

// export default App;
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
