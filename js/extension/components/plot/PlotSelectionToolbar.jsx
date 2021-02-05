import React, {useState} from 'react';
import {find} from 'lodash';
import {
    MenuItem,
    DropdownButton,
    Glyphicon
} from "react-bootstrap";
import {
    exportParcellesAsCSV,
    exportProprietaireByParcelles,
    exportCoProprietaireByParcelles
} from '../../api';

import { downloadResponse } from '../../utils/download';


import Toolbar from '@mapstore/components/misc/toolbar/Toolbar';
import BundleInformationModal from './BundleInformationModal';

export default function PlotSelectionToolbar({
    foncier,
    authLevel = {},
    currentData = [],
    loadInfo = () => {},
    zoomToSelection = () => {},
    removePlots = () => {},
    showLandedPropertyInformation = () => {},
    selectedPlots = []
}) {
    const atLeaseOneSelected = selectedPlots.length > 0;
    const onlyOneSelected = selectedPlots.length === 1;
    const isDataPresent = currentData.length > 0;
    const { isCNIL1, isCNIL2 } = authLevel;
    const [showBundleInformation, setShowBundleInformation] = useState(false);
    return (
        <>
            <Toolbar
                btnGroupProps={{className: "pull-right"}}
                btnDefaultProps={{
                    tooltipPosition: 'bottom'
                }}
                buttons={[{
                    disabled: !isDataPresent,
                    glyph: "zoom-in",
                    tooltip: atLeaseOneSelected ? "Zoom to selected" : "Zoom on list", // localize
                    onClick: zoomToSelection
                }, ...(foncier
                    ? [{
                        disabled: !onlyOneSelected,
                        glyph: "th-list",
                        tooltip: "Owned Unit Information", // localize
                        onClick: () => { showLandedPropertyInformation(find(currentData, {parcelle: selectedPlots[0]})); }
                    }]
                    : []), {
                    disabled: !atLeaseOneSelected,
                    glyph: "trash",
                    tooltip: "Delete Selected Plots", // localize
                    onClick: () => { removePlots(selectedPlots); }
                }, {
                    disabled: !atLeaseOneSelected,
                    glyph: "info-sign",
                    tooltip: "Information Form", // localize
                    onClick: () => { loadInfo(selectedPlots);}
                }, (isCNIL1, isCNIL2 ? {
                    renderButton:
                        (<DropdownButton
                            disabled={!atLeaseOneSelected}
                            pullRight title={< Glyphicon glyph="export" />}>
                            <MenuItem onClick={() => exportParcellesAsCSV({ parcelles: selectedPlots }).then(downloadResponse)}>Plot</MenuItem>
                            <MenuItem onClick={() => exportProprietaireByParcelles({ parcelles: selectedPlots }).then(downloadResponse)}>Owners</MenuItem>
                            <MenuItem onClick={() => exportCoProprietaireByParcelles({ parcelles: selectedPlots }).then(downloadResponse)}>Co-owners</MenuItem>
                            <MenuItem disabled={!onlyOneSelected} onClick={() => {
                                // prevent click event when disabled
                                if (onlyOneSelected) {
                                    setShowBundleInformation(true);
                                }
                            }}>Bundle</MenuItem>
                        </DropdownButton>)
                } : {
                    disabled: !isDataPresent,
                    glyph: "export",
                    tooltip: "Export", // localize
                    onClick: () => exportParcellesAsCSV({ parcelles: selectedPlots }).then(downloadResponse)
                })
                ]}
            />
            <BundleInformationModal show={showBundleInformation} onClose={() => setShowBundleInformation(false)} parcelle={selectedPlots[0]} />
        </>);
}
