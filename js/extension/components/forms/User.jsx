import React from 'react';
import MunicipalityCombo from './MunicipalityCombo';
import ProprietaireCombo from './ProprietaireCombo';

import { ControlLabel, Checkbox  } from "react-bootstrap";

export default function User({values, setValue = () => {}}) {
    return (
        <>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel>Town, Municipality</ControlLabel>
                </div>
                <div className="form-col">
                    <MunicipalityCombo value={values?.commune} onSelect={v => setValue('commune', v)} />
                    <div className="text-muted">ex: Rennes, Cesson-Sevigne</div>
                </div>
            </div>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel>Last name and first name</ControlLabel>
                </div>
                <div className="form-col">
                    <ProprietaireCombo
                        value={values?.proprietaire}
                        disabled={!values?.commune}
                        cgocommune={values?.commune?.cgocommune}
                        onSelect={v => setValue('proprietaire', v)}
                        onChange={v => setValue('proprietaire', v)}
                    />
                    <div className="text-muted">ex: Jeog Pierre</div>
                </div>
            </div>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel/>
                </div>
                <div className="form-col">
                    <Checkbox
                        value={values?.birthsearch}
                        onchange={v => {
                            setValue('birthsearch', v.target.value)
                        }} >
                        Search by Birth name
                    </Checkbox>
                    <div className="text-muted">Echap to load query without completion</div>
                </div>
            </div>
        </>);
}