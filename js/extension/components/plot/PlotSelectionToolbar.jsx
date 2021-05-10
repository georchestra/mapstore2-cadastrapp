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
import Message from '@mapstore/components/I18N/Message';

import Toolbar from '@mapstore/components/misc/toolbar/Toolbar';
import BundleInformationModal from './BundleInformationModal';

export default function PlotSelectionToolbar({
    foncier,
    authLevel = {},
    currentData = [],
    loadInfo = () => {},
    zoomToSelection = () => {},
    removePlots = () => {},
    showLandedPropertyInformationByParcelle = () => {},
    selectedPlots = []
}) {
    const atLeastOneSelected = selectedPlots.length > 0;
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
                    tooltipId: atLeastOneSelected ? "cadastrapp.result.parcelle.zoom.selection" : "cadastrapp.result.parcelle.zoom.list",
                    onClick: zoomToSelection
                }, ...(foncier
                    ? [{
                        disabled: !onlyOneSelected,
                        glyph: "th-list",
                        tooltipId: "cadastrapp.result.parcelle.uf",
                        onClick: () => { showLandedPropertyInformationByParcelle(find(currentData, {parcelle: selectedPlots[0]})); }
                    }]
                    : []), {
                    disabled: !atLeastOneSelected,
                    glyph: "trash",
                    tooltipId: "cadastrapp.result.parcelle.delete",
                    onClick: () => { removePlots(selectedPlots); }
                }, {
                    disabled: !atLeastOneSelected,
                    glyph: "info-sign",
                    tooltipId: "cadastrapp.result.parcelle.fiche",
                    onClick: () => { loadInfo(selectedPlots);}
                }, ((isCNIL1 || isCNIL2) ? {
                    renderButton:
                        (<DropdownButton
                            disabled={!atLeastOneSelected}
                            pullRight title={< Glyphicon glyph="export" />}>
                            <MenuItem onClick={() => exportParcellesAsCSV({ parcelles: selectedPlots }).then(downloadResponse)}>
                                <Message msgId={"cadastrapp.result.csv.button.parcelles"} />
                            </MenuItem>
                            <MenuItem onClick={() => exportProprietaireByParcelles({ parcelles: selectedPlots }).then(downloadResponse)}>
                                <Message msgId={"cadastrapp.result.csv.button.owner"} />
                            </MenuItem>
                            <MenuItem onClick={() => exportCoProprietaireByParcelles({ parcelles: selectedPlots }).then(downloadResponse)}>
                                <Message msgId={"cadastrapp.result.csv.button.coowner"} />
                            </MenuItem>
                            <MenuItem disabled={!onlyOneSelected} onClick={() => {
                                // prevent click event when disabled
                                if (onlyOneSelected) {
                                    setShowBundleInformation(true);
                                }
                            }}><Message msgId={"cadastrapp.result.csv.button.bundle"} /></MenuItem>
                        </DropdownButton>)
                } : {
                    disabled: !isDataPresent || !atLeastOneSelected,
                    glyph: "export",
                    tooltipId: "cadastrapp.result.csv.export",
                    onClick: () => exportParcellesAsCSV({ parcelles: selectedPlots }).then(downloadResponse)
                })
                ]}
            />
            <BundleInformationModal show={showBundleInformation} onClose={() => setShowBundleInformation(false)} parcelle={selectedPlots[0]} />
        </>);
}
