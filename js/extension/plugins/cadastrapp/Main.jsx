import React from 'react';
import { connect } from 'react-redux';

import MainPanel from './MainPanel';

import MainToolbar from './MainToolbar';
import Header from './Header';
import { CONTROL_NAME } from '../../constants';
import LandedProperty from './LandedProperty';
import {configurationSelector} from "@js/extension/selectors/cadastrapp";
import DockPanel from "@mapstore/components/misc/panels/DockPanel";
import ContainerDimensions from "react-container-dimensions";
import DockContainer from "@js/extension/components/misc/panels/DockContainer";

/**
 * Main Container of Cadastrapp.
 * It contains the whole UI of the plugin.
 */
export default connect(state => ({
    enabled: state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled || false,
    configuration: configurationSelector(state)
}))(function Main({ enabled, dockStyle, dockWidth, ...props }) {
    if (!enabled) {
        return null;
    }
    return (
        <DockContainer
            dockStyle={dockStyle}
            id="cadastrapp-container"
            style={{pointerEvents: 'none'}}
        >
            <ContainerDimensions>
                {({ width }) => (<DockPanel
                    open
                    size={dockWidth / width > 1 ? width : dockWidth}
                    position="right"
                    bsStyle="primary"
                    style={dockStyle}>
                    <div className="cadastrapp">
                        <Header/>
                        <MainToolbar {...props} />
                        <MainPanel {...props} />
                        <LandedProperty />
                    </div>
                </DockPanel>)}
            </ContainerDimensions>
        </DockContainer>
    );
});
