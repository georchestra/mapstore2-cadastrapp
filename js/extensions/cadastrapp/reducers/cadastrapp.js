import { set } from '@mapstore/utils/ImmutableUtils';

import {
    SET_CONFIGURATION,
    LOADING
} from '../actions/cadastrapp';


export default function cadastrapp(state = {}, action) {
    const type = action.type;
    switch (type) {
    case SET_CONFIGURATION:
        return set('configuration', action.configuration, state);
    case LOADING: {
        // anyway sets loading to true
        return set(action.name === "loading" ? "loading" : `loadFlags.${action.name}`, action.value, set(
            "loading", action.value, state
        ));
    }
    default:
        return state;
    }
}
