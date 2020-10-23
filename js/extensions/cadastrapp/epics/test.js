import Rx from 'rxjs';
import { MAP_CONFIG_LOADED } from '@mapstore/actions/config';
import { toggleControl } from '@mapstore/actions/controls';
import { zoomToExtent } from '@mapstore/actions/map';

import { CONTROL_NAME } from '../constants';

/**
 * TEST EPIC ONLY TO FACILITATE DEVELOPMENT, should not be present in production
 */
export const autoOpenCadastrapp = action$ => action$.ofType(MAP_CONFIG_LOADED).delay(4000).switchMap(() => {
    return Rx.Observable.of(
        toggleControl(CONTROL_NAME, "enabled", true),
        zoomToExtent([-187846.3856679544, 6123926.893037676, -181697.98220526555, 6128049.71525080], "EPSG:3857" )
    );
});
