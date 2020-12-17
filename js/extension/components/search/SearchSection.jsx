import React from 'react';


import CoownershipSearch from './CoownershipSearch';
import OwnersSearch from './OwnersSearch';
import PlotsSearch from './PlotSearch';

import {
    SEARCH_TOOLS
} from '../../constants';

/**
 * Renders the search form,
 * depending on the search tool selected.
 */
export default function SearchSection({
    selectedSearchTool,
    handlePlotsSearch,
    handleOwnersSearch,
    handleCoownershipSearch
}) {
    switch (selectedSearchTool) {
    case SEARCH_TOOLS.PLOT:
        return (<PlotsSearch
            onSearch={handlePlotsSearch}
        />);
    case SEARCH_TOOLS.OWNER:
        return (<OwnersSearch
            onSearch={handleOwnersSearch}
        />);
    case SEARCH_TOOLS.COOWNER:
        return (<CoownershipSearch
            onSearch={handleCoownershipSearch}
        />);

    default:
        return null;
    }
}
