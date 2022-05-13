import expect from 'expect';

import cadastrapp from '../cadastrapp';

import {
    saveBubbleInfo,
    setConfiguration,
    setLayerStyle,
    setUp,
    toggleSearchTool,
    toggleSelectionTool
} from '../../actions/cadastrapp';

import {
    bulleInfoSelector,
    cadastrappPluginCfgSelector,
    configurationSelector,
    currentSearchToolSelector,
    currentSelectionToolSelector,
    getDefaultStyle
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
    it('setUp', () => {
        const state1 = cadastrapp({}, setUp({test: 1}));
        expect(cadastrappPluginCfgSelector({ cadastrapp: state1 })).toEqual({test: 1});
    });
    it('saveBubbleInfo', () => {
        const state1 = cadastrapp({}, saveBubbleInfo({test: 1}));
        expect(bulleInfoSelector({ cadastrapp: state1 })).toEqual({test: 1});
    });
    describe('layer styles', () => {
        const customStyle = {
            fillColor: "#FFFFFF",
            opacity: 1,
            fillOpacity: 1,
            color: "#FFFFFF", // stroke color
            weight: 1
        };
        it('setLayerStyle default', () => {
            const state1 = cadastrapp(undefined, setLayerStyle("default", customStyle));
            expect(getDefaultStyle({ cadastrapp: state1 })).toEqual(customStyle);
        });
        it('setLayerStyle selected', () => {
            const state1 = cadastrapp(undefined, setLayerStyle("default", customStyle));
            expect(getDefaultStyle({ cadastrapp: state1 })).toEqual(customStyle);
        });
    });

});
