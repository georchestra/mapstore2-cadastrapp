import React from 'react';
import { SELECTION_TYPES } from '../../../constants';
import { toggleSelectionTool } from '../../../actions/cadastrapp';
import { currentSelectionToolSelector } from '../../../selectors/cadastrapp';


import TButton from './TButton';

import {connect} from 'react-redux';

/*
["map-marker", "select-by-point", "Select / Activate / Unselect one plot with a simple click "],
["polyline", "select-by-linestring", "Select / Activate / Unselect plots which intersects a line"],
["polygon", "select-by-polygon", "Select / Activate / Unselect plots which intersects a polygon"],
// ["th-list", "unit-de-fonc", "Landed property information"]

 */
const BUTTONS_SETTINGS = {
    [SELECTION_TYPES.POINT]: {
        key: SELECTION_TYPES.POINT,
        glyph: "map-marker"
    },
    [SELECTION_TYPES.LINE_STRING]: {
        key: SELECTION_TYPES.LINE_STRING,
        glyph: "polyline"
    },
    [SELECTION_TYPES.POLYGON]: {
        key: SELECTION_TYPES.POLYGON,
        glyph: "polygon"
    },
    [SELECTION_TYPES.LANDED_PROPERTY]: {
        key: SELECTION_TYPES.LANDED_PROPERTY,
        glyph: "th-list"
    }
};
/**
 * Implement the selection tools.
 * They are mutually exclusive and allow to start a selection on map.
 */
function SelectionTools({ currentTool, onClick = () => {} }) {

    return <>
        {
            Object.keys(SELECTION_TYPES).map(k => SELECTION_TYPES[k])
                .map(toolName => {
                    const isActive = toolName === currentTool;
                    return (<TButton
                        bsStyle={isActive && "success"}
                        {...BUTTONS_SETTINGS[toolName]}
                        // if the current selection button is clicked, it turns off selection
                        onClick={() => isActive ? onClick() : onClick(toolName)}
                    />);
                })
        }
    </>;
}
export default connect(
    (state) => ({
        currentTool: currentSelectionToolSelector(state)
    }),
    {
        onClick: toggleSelectionTool
    }
)(SelectionTools);
