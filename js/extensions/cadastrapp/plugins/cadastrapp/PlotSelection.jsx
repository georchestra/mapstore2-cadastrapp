import React, { useState } from 'react';
import { connect } from 'react-redux';
import PS from '../../components/PlotSelection';
import InformationFormModal from '../../components/Information';


import {
    addPlotSelection,
    removePlotSelection,
    setActivePlotSelection
} from '../../actions/cadastrapp';

import {
    activeSelectionTabIndexSelectors,
    plotDataSelector
} from '../../selectors/cadastrapp';

const PlotsSelection = connect((state) => ({
    data: plotDataSelector(state)
}), {
    onNewTab: addPlotSelection,
    onTabChange: setActivePlotSelection,
    onTabDelete: () => removePlotSelection()
})(PS);

export default connect(
    state => ({
        plotSelectionData: plotDataSelector(state),
        activeSelectionTab: activeSelectionTabIndexSelectors(state),
    })
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
            onInformationForm={() => setShowInfo(true)}
            onZoom={() => { }}
            onClear={() => { }}
            onClick={() => { }} // on selection
            onNewTab={() => { }}
            onAllClick={() => { }} // on selection
            onRowClick={() => { }} // selection? remove?
            active={props.activeSelectionTab}
        />
        {showInfo && <InformationFormModal
            expanded={expandedPanel}
            active={props.activeSelectionTab}
            data={props.plotSelectionData}
            isShown={showInfo}
            onBuildingRowClick={() => { }}
            onClose={() => setShowInfo(false)}
            onPanelExpand={handlePanelExpand}
        />}
    </>);
});

