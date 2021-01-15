import { useState } from 'react';
import { set } from '@mapstore/utils/ImmutableUtils';

/**
 * Common search state holder hook
 */
export default () => {
    const [searchState, setSearchState] = useState({});
    const setFormState = (eventKey, key, value) => {
        const path = `['${eventKey}'].${key}`;
        setSearchState(set(path, value, searchState));
    };
    const resetFormState = (eventKey) => {
        setSearchState(set(eventKey, undefined, searchState));
    };
    return [searchState, setFormState, resetFormState];
}