import React from 'react';
import { connect } from 'react-redux';
import WelcomeMessage from '../../components/modals/Welcome';
import SearchSection from './SearchSection';


import {
    activeSelectionTabIndexSelectors,
    currentSearchToolSelector,
    plotDataSelector
} from '../../selectors/cadastrapp';

import PlotsSelection from './PlotSelection';

function MainPanel({
    selectedSearchTool,
    plotSelectionData,
    foncier,
    ...props
}) {
    return (

        <div className="right-side pull-left">
            <WelcomeMessage
                isShown={!selectedSearchTool}
                data={plotSelectionData}
                configuration={props.configuration}
            />
            <SearchSection
                selectedSearchTool={selectedSearchTool}
            />
            <PlotsSelection foncier={foncier}/>
        </div>
    );
}

export default connect(state => ({
    plotSelectionData: plotDataSelector(state),
    activeSelectionTab: activeSelectionTabIndexSelectors(state),
    selectedSearchTool: currentSearchToolSelector(state)
}))(MainPanel);
