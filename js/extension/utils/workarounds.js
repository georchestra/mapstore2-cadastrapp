import Rx from "rxjs";
import { head, sortBy } from 'lodash';
import {setControlProperty} from "@mapstore/actions/controls";
import {createControlEnabledSelector} from "@mapstore/selectors/controls";
import {START_DRAWING} from "@mapstore/actions/annotations";
import {CHANGE_DRAWING_STATUS} from "@mapstore/actions/draw";
import {REGISTER_EVENT_LISTENER} from "@mapstore/actions/map";
import {OPEN_FEATURE_GRID} from "@mapstore/actions/featuregrid";

// this is a workaround that prevent duplicated parcelle coming from the back-end service.
// it can be used to fiter features coming from WFS, getting data of the most recent lot.
// Should have no effects with correct database.
export const workaroundDuplicatedParcelle = parcelleProperty => (v, index, array) => {
    const sameParcelleElements = array.filter((vv) => vv?.properties?.[parcelleProperty] === v?.properties?.[parcelleProperty]);
    const correctValue = head(sortBy(sameParcelleElements, 'lot').reverse());
    return v?.properties?.lot === correctValue?.properties?.lot;
};


/**
 * @todo Switch to the implementation in MapStore upstream once it is updated to the 2022.01.xx where this function exitst in epicUtils
 * Common part of the workflow that toggles one plugin off when another plugin intend to perform drawing action
 * @param action$
 * @param store
 * @param {string} toolName - tool name(s) that should be toggled off
 * @param {function} apply - optional function to override action triggered by default
 * @param isActiveCallback - optional function to override callback to check tool activeness
 * @returns {Observable<unknown>}
 */
export const shutdownToolOnAnotherToolDrawing = (action$, store, toolName,
    apply = (state, tool) => {
        let actions = [
            setControlProperty(tool, "enabled", null)
        ];
        return Rx.Observable.from(actions);
    },
    isActiveCallback = (state, name) => createControlEnabledSelector(name)(state)
) =>
    action$.ofType(START_DRAWING, CHANGE_DRAWING_STATUS, REGISTER_EVENT_LISTENER, OPEN_FEATURE_GRID)
        .filter(({type, status, owner, eventName, toolName: name}) => {
            const isActive = isActiveCallback(store.getState(), toolName);
            switch (type) {
            case OPEN_FEATURE_GRID:
                return toolName !== 'featureGrid';
            case REGISTER_EVENT_LISTENER:
                return isActive && eventName === 'click' && name !== toolName;
            case CHANGE_DRAWING_STATUS:
                return isActive &&
                    (status === 'drawOrEdit' || status === 'start') && owner !== toolName;
            case START_DRAWING:
            default:
                return isActive && toolName !== 'annotations';
            }
        })
        .switchMap((action) => {
            return isActiveCallback(store.getState(), toolName) ? apply(store.getState(), toolName, action) : Rx.Observable.empty();
        });
