import expect from 'expect';

import cadastrapp from '../cadastrapp';

import {
    setConfiguration,
    toggleSearchTool,
    toggleSelectionTool
} from '../../actions/cadastrapp';

import {
    configurationSelector,
    currentSearchToolSelector,
    currentSelectionToolSelector
 } from "../../selectors/cadastrapp";

import { SELECTION_TYPES, SEARCH_TOOLS } from '../../constants';


describe('reducer', () => {
    it('setConfiguration', () => {
        const TEST_CONFIG = { some: "config"};
        const state = cadastrapp({}, setConfiguration(TEST_CONFIG));
        expect(configurationSelector({cadastrapp: state})).toEqual(TEST_CONFIG);
    });
    it('toggleSearchTool', () => {
        const state1 = cadastrapp({}, toggleSearchTool(SEARCH_TOOLS.COOWNER));
        expect(currentSearchToolSelector({ cadastrapp: state1 })).toEqual(SEARCH_TOOLS.COOWNER);
        // check change
        const state2 = cadastrapp(state1, toggleSearchTool(SEARCH_TOOLS.PLOT));
        expect(currentSearchToolSelector({ cadastrapp: state2 })).toEqual(SEARCH_TOOLS.PLOT);
    });
    it('toggleSelectionTool', () => {
        const state1 = cadastrapp({}, toggleSelectionTool(SELECTION_TYPES.LANDED_PROPERTY));
        expect(currentSelectionToolSelector({ cadastrapp: state1 })).toEqual(SELECTION_TYPES.LANDED_PROPERTY);
        // check change
        const state2 = cadastrapp(state1, toggleSelectionTool(SELECTION_TYPES.POINT));
        expect(currentSelectionToolSelector({ cadastrapp: state2 })).toEqual(SELECTION_TYPES.POINT);
    });
});
