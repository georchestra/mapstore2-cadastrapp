import React from 'react';
import { SEARCH_TOOLS } from '../../../constants';
import { toggleSearchTool } from '../../../actions/cadastrapp';
import { currentSearchToolSelector } from '../../../selectors/cadastrapp';


import TButton from './TButton';

import { connect } from 'react-redux';

/*
["zoom-to", "search-plots", "Plots Search"],
["search", "search-owners", "Owners Search"],
["user", "coownership", "Co-ownership data Search"],

 */
const BUTTONS_SETTINGS = {
    [SEARCH_TOOLS.PLOT]: {
        glyph: "search"
    },
    [SEARCH_TOOLS.OWNER]: {
        glyph: "user"
    },
    [SEARCH_TOOLS.COOWNER]: {
        glyph: "1-group"
    }
};

/*
["zoom-to", "search-plots", "Plots Search"],
["search", "search-owners", "Owners Search"],
["user", "coownership", "Co-ownership data Search"],
*/
/**
 * Implements Search tools buttons.
 * They are mutually exclusive and allow to select the needed search form.
 */
function SearchTools({ currentTool, onClick = () => { } }) {
    return <>
        {
            Object.keys(SEARCH_TOOLS).map(k => SEARCH_TOOLS[k])
                .map(toolName => {
                    const isActive = toolName === currentTool;
                    return (<TButton
                        bsStyle={isActive && "active"}
                        {...BUTTONS_SETTINGS[toolName]}
                        onClick={() => isActive ? onClick() : onClick(toolName)}
                    />);
                })
        }
    </>;
}
export default connect(
    (state) => ({
        currentTool: currentSearchToolSelector(state)
    }),
    {
        onClick: toggleSearchTool
    }
)(SearchTools);
