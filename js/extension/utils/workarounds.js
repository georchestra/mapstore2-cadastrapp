import { head, sortBy } from 'lodash';

// this is a workaround that prevent duplicated parcelle coming from the back-end service.
// it can be used to fiter features coming from WFS, getting data of the most recent lot.
// Should have no effects with correct database.
export const workaroundDuplicatedParcelle = parcelleProperty => (v, index, array) => {
    const sameParcelleElements = array.filter((vv) => vv?.properties?.[parcelleProperty] === v?.properties?.[parcelleProperty]);
    const correctValue = head(sortBy(sameParcelleElements, 'lot').reverse());
    return v?.properties?.lot === correctValue?.properties?.lot;
};
