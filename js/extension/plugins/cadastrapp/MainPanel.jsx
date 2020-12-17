import React from 'react';
import { connect } from 'react-redux';


import MP from '../../components/MainPanel';


import {
    activeSelectionTabIndexSelectors,
    currentSearchToolSelector,
    plotDataSelector
} from '../../selectors/cadastrapp';

import PlotsSelection from './PlotSelection';

const MainPanel = (props) => {

    return (<MP {...props}>
        <PlotsSelection />
    </MP>);
}
export default connect(state => ({
    plotSelectionData: plotDataSelector(state),
    activeSelectionTab: activeSelectionTabIndexSelectors(state),
    selectedSearchTool: currentSearchToolSelector(state)
}))(MainPanel);
