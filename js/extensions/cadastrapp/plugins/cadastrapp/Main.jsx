import React from 'react';
import { connect } from 'react-redux';

import MP from '../../components/MainPanel';

import MainToolbar from './MainToolbar';
import Header from './Header';
import { CONTROL_NAME } from '../../constants';
import { currentSearchToolSelector } from '../../selectors/cadastrapp';

const MainPanel = connect(state => ({
    selectedSearchTool: currentSearchToolSelector(state)
}))(MP);

export default connect(state => ({
    enabled: state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled || false
}))(function Main({ enabled }) {
    if (!enabled) return null;
    return (<div className="cadastrapp">
        <Header/>
        <MainToolbar/>
        <MainPanel/>
    </div>);
});
