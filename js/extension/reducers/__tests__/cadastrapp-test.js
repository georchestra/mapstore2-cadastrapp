import expect from 'expect';

import cadastrapp from '../cadastrapp';

import {
    setConfiguration,
    setLayerStyle,
    setLayerStyles,
    toggleSearchTool,
    toggleSelectionTool
} from '../../actions/cadastrapp';

import {
    configurationSelector,
    currentSearchToolSelector,
    currentSelectionToolSelector,
    getDefaultStyle,
    getSelectedStyle
} from "../../selectors/cadastrapp";

import { SELECTION_TYPES, SEARCH_TOOLS, LAYER_STYLES } from '../../constants';


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
    describe('layer styles', () => {
        const customStyle = {
            fillColor: "#FFFFFF",
            opacity: 1,
            fillOpacity: 1,
            color: "#FFFFFF", // stroke color
            weight: 1
        };
        it('initial values', () => {
            const state1 = cadastrapp(undefined, {type: "DUMMY_ACTION"});
            expect(getSelectedStyle({ cadastrapp: state1 })).toEqual(LAYER_STYLES.selected);
            expect(getDefaultStyle({ cadastrapp: state1 })).toEqual(LAYER_STYLES.default);
        });
        it('setLayerStyle default', () => {
            const state1 = cadastrapp(undefined, setLayerStyle("default", customStyle));
            expect(getDefaultStyle({ cadastrapp: state1 })).toEqual(customStyle);
            expect(getSelectedStyle({ cadastrapp: state1 })).toEqual(LAYER_STYLES.selected);
        });
        it('setLayerStyle selected', () => {
            const state1 = cadastrapp(undefined, setLayerStyle("default", customStyle));
            expect(getDefaultStyle({ cadastrapp: state1 })).toEqual(customStyle);
            expect(getSelectedStyle({ cadastrapp: state1 })).toEqual(LAYER_STYLES.selected);
        });
        it('setLayerStyles resets to default', () => {
            const state1 = cadastrapp(undefined, setLayerStyle("default", customStyle));
            const state2 = cadastrapp(state1, setLayerStyles());
            expect(getSelectedStyle({ cadastrapp: state2 })).toEqual(LAYER_STYLES.selected);
            expect(getDefaultStyle({ cadastrapp: state2 })).toEqual(LAYER_STYLES.default);        });
    });

});
