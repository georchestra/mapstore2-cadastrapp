import Rx from 'rxjs';

import {
    updateAdditionalLayer
} from '@mapstore/actions/additionallayers';
import {
    ADD_PLOTS,
    REMOVE_PLOTS,
    SET_ACTIVE_PLOT_SELECTION,
    REMOVE_PLOT_SELECTION,
    SELECT_PLOTS,
    DESELECT_PLOTS,
    SET_LAYER_STYLE
} from '../actions/cadastrapp';
import { getCurrentPlotFeatures, getCadastrappVectorLayer } from '../selectors/cadastrapp';

import {
    CADASTRAPP_VECTOR_LAYER_ID,
    CADASTRAPP_OWNER
} from '../constants';


export const syncLayerForPlots = (action$, {getState = () => {}})=>
    action$.ofType(ADD_PLOTS, REMOVE_PLOTS, SET_ACTIVE_PLOT_SELECTION, REMOVE_PLOT_SELECTION, SELECT_PLOTS, DESELECT_PLOTS, SET_LAYER_STYLE )
        .switchMap(() => {
            const features = getCurrentPlotFeatures(getState());
            const options = getCadastrappVectorLayer(getState());
            return Rx.Observable.of(
                updateAdditionalLayer(
                    CADASTRAPP_VECTOR_LAYER_ID,
                    CADASTRAPP_OWNER,
                    "overlay", {
                        ...options,
                        features
                    }));
        });
