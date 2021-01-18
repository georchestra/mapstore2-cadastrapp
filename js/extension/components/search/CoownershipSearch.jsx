import React from 'react';
import { isString } from 'lodash';
import { ControlLabel, FormControl, Button, ButtonGroup } from "react-bootstrap";

import useFormState from '../../hooks/useFormState';
import { SEARCH_TYPES } from '@js/extension/constants';
import { isSearchValid } from '../../utils/validation';

import MunicipalityCombo from '../forms/MunicipalityCombo';
import ProprietaireCombo from '../forms/ProprietaireCombo';

export default function CoownershipSearch({ onSearch = () => { } }) {
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
                        <FormControl value={values?.parcelle} onChange={e => setValue('parcelle', e.target.value)} type="text" bsSize="sm"/>
                        <div className="text-muted">ex: 20148301032610C0012</div>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Owner id</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl value={values?.comptecommunal} onChange={e => setValue('comptecommunal', e.target.value)} type="text" bsSize="sm"/>
                        <div className="text-muted">ex. 350001+00160</div>
                    </div>
                </div>
            </div>
            <ButtonGroup style={{ margin: "10px", "float": "right" }}>
                <Button
                    onClick={() => resetFormState(SEARCH_TYPES.COOWNER)}
                >Clear</Button>
                <Button
                    disabled={!isSearchValid(SEARCH_TYPES.COOWNER, searchState[SEARCH_TYPES.COOWNER])}
                    bsStyle="primary"
                    onClick={() => {
                        if (isString(searchState[SEARCH_TYPES.COOWNER]?.proprietaire)) {
                            alert("TODO: Search co owners");
                        } else {
                            // plot search
                            onSearch(SEARCH_TYPES.COOWNER, searchState[SEARCH_TYPES.COOWNER]);
                        }
                    }}
                >Search</Button>
            </ButtonGroup>
        </div>
    );
}
