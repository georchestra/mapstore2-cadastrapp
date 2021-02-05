import React from 'react';
import { isString } from 'lodash';
import { ControlLabel, FormControl } from "react-bootstrap";

import useFormState from '../../hooks/useFormState';
import { SEARCH_TYPES } from '@js/extension/constants';
import { isSearchValid } from '../../utils/validation';

import MunicipalityCombo from '../forms/MunicipalityCombo';
import ProprietaireCombo from '../forms/ProprietaireCombo';
import SearchButtons from './SearchButtons';


export default function CoownershipSearch({ loading, onSearch = () => { }, onOwnersSearch = () => {} }) {
    const [searchState, setFormState, resetFormState] = useFormState();
    const values = searchState[SEARCH_TYPES.COOWNER];
    const setValue = (k, v) => setFormState(SEARCH_TYPES.COOWNER, k, v);
    return (
        <div className="coownership-search">
            <h3>Co-ownership Search</h3>
            <div style={{padding: "10px", height: 242}}>
                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Town Municipality</ControlLabel>
                    </div>
                    <div className="form-col">
                        <MunicipalityCombo value={values?.commune} onSelect={v => setValue('commune', v)} />
                        <div className="text-muted">ex: Rennes, Cesson-Sevigne</div>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Last name and First name</ControlLabel>
                    </div>
                    <div className="form-col">
                        <ProprietaireCombo
                            value={values?.proprietaire}
                            disabled={!values?.commune}
                            cgocommune={values?.commune?.cgocommune}
                            onSelect={v => setValue('proprietaire', v)}
                            onChange={v => setValue('proprietaire', v)}
                        />
                        <div className="text-muted">ex: Jego Pierre</div>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Plot id</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl value={values?.parcelle ?? ""} onChange={e => setValue('parcelle', e.target.value)} type="text" bsSize="sm"/>
                        <div className="text-muted">ex: 20148301032610C0012</div>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Owner id</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl value={values?.comptecommunal ?? ""} onChange={e => setValue('comptecommunal', e.target.value)} type="text" bsSize="sm"/>
                        <div className="text-muted">ex. 350001+00160</div>
                    </div>
                </div>
            </div>
            <SearchButtons
                loading={loading}
                valid={isSearchValid(SEARCH_TYPES.COOWNER, searchState[SEARCH_TYPES.COOWNER])}
                onClear={() => resetFormState(SEARCH_TYPES.COOWNER)}
                onSearch={() => {
                    if (isString(searchState[SEARCH_TYPES.COOWNER]?.proprietaire) && !values?.parcelle) {
                        onOwnersSearch(SEARCH_TYPES.COOWNER, searchState[SEARCH_TYPES.COOWNER]);
                    } else {
                        // plot search
                        onSearch(SEARCH_TYPES.COOWNER, searchState[SEARCH_TYPES.COOWNER]);
                    }
                }}/>
        </div>
    );
}
