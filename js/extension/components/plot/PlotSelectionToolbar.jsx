import React from 'react';
import {
    MenuItem,
    DropdownButton,
    Glyphicon
} from "react-bootstrap";

import Toolbar from '@mapstore/components/misc/toolbar/Toolbar';

export default function PlotSelectionToolbar({
    currentData = [],
    zoomToSelection = () => {},
    removePlots = () => {},
    selectedPlots = []
}) {
    const atLeaseOneSelected = selectedPlots.length > 0;
    const isDataPresent = currentData.length > 0;

    return (
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
            }, {
                disabled: !atLeaseOneSelected,
                glyph: "th-list",
                tooltip: "Owned Unit Information", // localize
                onClick: () => { alert("TODO"); }
            }, {
                disabled: !atLeaseOneSelected,
                glyph: "trash",
                tooltip: "Delete Selected Plots", // localize
                onClick: () => { removePlots(selectedPlots); }
            }, {
                disabled: !isDataPresent,
                glyph: "info-sign",
                tooltip: "Information Form", // localize
                onClick: () => { alert("TODO");}
            }, {
                renderButton:
                    (<DropdownButton
                        disabled={!atLeaseOneSelected}
                        pullRight title={< Glyphicon glyph="export" />}>
                        <MenuItem>Plot</MenuItem>
                        <MenuItem>Owners</MenuItem>
                        <MenuItem>Co-owners</MenuItem>
                        <MenuItem>Bundle</MenuItem>
                    </DropdownButton>)
            }
            ]}
        />);
/*
        <ButtonGroup className="pull-right">


            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Information Form"}</Tooltip>}>
                <Button
                    {...(!isOneSelected ? { disabled: 'true' } : {})}
                    onClick={() => { onClick("information-form"); }}
                ><Glyphicon glyph="info-sign" /></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Export"}</Tooltip>}>

            </OverlayTrigger>
        </ButtonGroup>

    );
*/
}