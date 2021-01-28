import React, { useState } from 'react';
import { connect } from 'react-redux';
import PS from '../../components/PlotSelection';
import Information from './Information';


import {
    addPlotSelection,
    removePlotSelection,
    setActivePlotSelection,
    selectPlots,
    deselectPlots,
    removePlots,
    zoomToSelection,
    loadInfo
} from '../../actions/cadastrapp';

import {
    activeSelectionTabIndexSelectors,
    plotDataSelector,
    getCurrentPlotData,
    selectedPlotIdsSelector,
    plotsSelector,
    getAuthLevel
} from '../../selectors/cadastrapp';

const PlotsSelection = connect((state) => ({
    currentData: getCurrentPlotData(state),
    selectedPlots: selectedPlotIdsSelector(state),
    data: plotDataSelector(state),
    plots: plotsSelector(state),
    authLevel: getAuthLevel(state)

}), {
    onNewTab: addPlotSelection,
    onTabChange: setActivePlotSelection,
    onRowsSelected: selectPlots,
    onRowsDeselected: deselectPlots,
    removePlots: removePlots,
    zoomToSelection: zoomToSelection,
    onTabDelete: () => removePlotSelection()
})(PS);

/**
 * Connected version of Plot selection table, with internal state.
 */
export default connect(
    state => ({
        plotSelectionData: plotDataSelector(state),
        activeSelectionTab: activeSelectionTabIndexSelectors(state),
    }), {
        loadInfo
    }
)(props => {
    const [showInfo, setShowInfo] = useState(false);
    const [expandedPanel, setExpandedPanel] = useState({});
    const handlePanelExpand = (index) => {
        let exp = { ...expandedPanel };
        if (exp[index]) {
            exp[index] = false;
        } else {
            exp[index] = true;
        }
        setExpandedPanel(exp);
    };
    return (<>
        <PlotsSelection
            isShown
            loadInfo={props.loadInfo}
            onZoom={() => { }}
            onClear={() => { }}
            onClick={() => { }} // on selection
            onNewTab={() => { }}
            onAllClick={() => { }} // on selection
            onRowClick={() => { }} // selection? remove?
            active={props.activeSelectionTab}
        />
        <Information
            expanded={expandedPanel}
            active={props.activeSelectionTab}
            data={props.informationData}
            isShown={showInfo}
            onBuildingRowClick={() => { }}
            onClose={() => setShowInfo(false)}
            onPanelExpand={handlePanelExpand}
        />
    </>);
});

