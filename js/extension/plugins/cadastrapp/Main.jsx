import React from 'react';
import { connect } from 'react-redux';

import MainPanel from './MainPanel';

import MainToolbar from './MainToolbar';
import Header from './Header';
import { CONTROL_NAME } from '../../constants';
import LandedProperty from './LandedProperty';
import {configurationSelector} from "@js/extension/selectors/cadastrapp";

/**
 * Main Container of Cadastrapp.
 * It contains the whole UI of the plugin.
 */
export default connect(state => ({
    enabled: state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled || false,
    configuration: configurationSelector(state)
}))(function Main({ enabled, ...props }) {
    if (!enabled) {
        return null;
    }
    return (<div className="cadastrapp">
        <Header/>
        <MainToolbar {...props} />
        <MainPanel {...props} />
        <LandedProperty />
    </div>);
});
