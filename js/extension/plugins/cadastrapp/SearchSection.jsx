import React from 'react';
import {branch, renderNothing} from 'recompose';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import { ownersListOpenSelector, ownersListResultsSelector, searchLoadingSelector } from '../../selectors/cadastrapp';


import Coownership from '../../components/search/CoownershipSearch';
import Owners from '../../components/search/OwnersSearch';
import OwnersModal from '../../components/owners/Modal';
import Plots from '../../components/search/PlotSearch';

import { search, ownersSearch, clearOwners } from '../../actions/cadastrapp';

import {
    SEARCH_TOOLS
} from '../../constants';
import SearchTools from './toolbar/SearchTools';

const mapSearchLoadingToProps = createSelector(
    searchLoadingSelector,
    (loading) => ({ loading })
);

const PlotsSearch = connect(mapSearchLoadingToProps, {
    onSearch: search
})(Plots);
const OwnersSearch = connect(mapSearchLoadingToProps, {
    onSearch: search,
    onOwnersSearch: ownersSearch
})(Owners);

const CoownershipSearch = connect(mapSearchLoadingToProps, {
    onSearch: search,
    onOwnersSearch: ownersSearch
})(Coownership);

const OwnersList = connect(createSelector(
    ownersListOpenSelector,
    ownersListResultsSelector,
    (show, owners) => ({
        show,
        owners
    })
), {
    onSearch: search,
    onClose: () => clearOwners()
})(
    // not rendering the modal at all when show is false is useful to reset internal state on every load
    branch(({ show }) => !show, renderNothing)(OwnersModal)
);

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
    case SEARCH_TOOLS.OWNERS:
    case SEARCH_TOOLS.OWNER:
        return (
            <>
                <div className="cadastrapp_selectionToolsButton">
                    <SearchTools owners/>
                </div>
                <OwnersSearch/>
                <OwnersList />
            </>);
    case SEARCH_TOOLS.COOWNER:
        return (
            <>
                <div className="cadastrapp_selectionToolsButton">
                    <SearchTools owners/>
                </div>
                <CoownershipSearch/>
                <OwnersList />
            </>);

    default:
        return null;
    }
}
