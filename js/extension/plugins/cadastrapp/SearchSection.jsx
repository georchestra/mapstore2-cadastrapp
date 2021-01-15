import React from 'react';
import {connect} from 'react-redux';

import Coownership from '../../components/search/CoownershipSearch';
import Owners from '../../components/search/OwnersSearch';
import Plots from '../../components/search/PlotSearch';

import { search } from '../../actions/cadastrapp';

import {
    SEARCH_TOOLS
} from '../../constants';

const PlotsSearch = connect(() => ({}), {
    onSearch: search
})(Plots);
const OwnersSearch = connect(() => ({}), {
    onSearch: search
})(Owners);
const CoownershipSearch = connect(() => ({}), {
    onSearch: search
})(Coownership);

/**
 * Renders the search form,
 * depending on the search tool selected.
 */
export default function SearchSection({
    selectedSearchTool
}) {
    switch (selectedSearchTool) {
    case SEARCH_TOOLS.PLOT:
        return (<PlotsSearch
        />);
    case SEARCH_TOOLS.OWNER:
        return (<OwnersSearch
        />);
    case SEARCH_TOOLS.COOWNER:
        return (<CoownershipSearch
        />);

    default:
        return null;
    }
}
