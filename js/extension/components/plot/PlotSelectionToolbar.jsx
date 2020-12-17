import React from 'react';
import {
    ButtonGroup,
    Button,
    Tooltip,
    OverlayTrigger,
    MenuItem,
    DropdownButton,
    Glyphicon
} from "react-bootstrap";

import Toolbar from '@mapstore/components/misc/toolbar/Toolbar';
import ToolbarButton from '@mapstore/components/misc/toolbar/ToolbarButton';


export default function PlotSelectionToolbar({
    removePlots = () => {},
    onClick = () => { },
    selectedPlots = []
}) {
    const isOneSelected = selectedPlots.length === 1;
    const atLeaseOneSelected = selectedPlots.length > 0;


    return (
        <Toolbar
            btnGroupProps={{className: "pull-right"}}
            btnDefaultProps={{
                tooltipPosition: 'bottom'
            }}
            buttons={[{
                disabled: !atLeaseOneSelected,
                glyph: "zoom-in",
                tooltip: "Zoom", // localize
                onClick: () => { alert("TODO"); }
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
                disabled: !atLeaseOneSelected,
                glyph: "info-sign",
                tooltip: "Information Form", // localize
                onClick: () => { alert("TODO");
            }

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