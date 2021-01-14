import React from 'react';
import { ControlLabel, FormControl } from "react-bootstrap";
import MunicipalityCombo from './MunicipalityCombo';
import RoadCombo from './RoadCombo';

import { DropdownList } from 'react-widgets';


const options = [{
    label: '--',
    value: ''
}, {
    label: 'bis',
    value: 'B'
}, {
    label: 'ter',
    value: 'T'
}, {
    label: 'quater',
    value: 'Q'
}, {
    label: 'A',
    value: 'A'
}, {
    label: 'B',
    value: 'B'
}, {
    label: 'C',
    value: 'C'
}, {
    label: 'D',
    value: 'D'
}, {
    label: 'E',
    value: 'E'
}, {
    label: 'F',
    value: 'F'
}, {
    label: 'G',
    value: 'G'
}, {
    label: 'H',
    value: 'H'
}];

export default function Address({values, setValue = () => {}}) {
    return (<>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel>Town, Municipality</ControlLabel>
            </div>
            <div className="form-col">
                <MunicipalityCombo value={values?.commune} onSelect={v => setValue('commune', v)} />
                <div className="text-muted">ex. Rennes, Cesson-Sévigné</div>
            </div>
        </div>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel>Adress, Roads, Name or locality</ControlLabel>
            </div>
            <div className="form-col">
                <RoadCombo disabled={!values?.commune} cgocommune={values?.commune?.cgocommune} onSelect={v => setValue('road', v)}/>
                <div className="text-muted">ex. Henri Freville or La morinaie</div>
            </div>
        </div>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel>Road Number</ControlLabel>
            </div>
            <div className="form-col">
                <FormControl style={{ height: 34, width: 100, "float": "left" }} type="text" bsSize="sm" onChange={v => setValue('dnvoiri', v.target.value)}/>
                <div className="pull-left">
                    <DropdownList
                        style={{ width: 100, marginLeft: 5 }}
                        valueField="value"
                        textField="label"
                        value={values?.dindic}
                        onSelect={(v) => {
                            setValue('dindic', v.dindic);
                        }}
                        data={options}
                    />
                </div>
                <div style={{ "float": "left", marginLeft: 5, marginTop: 5 }} className="text-muted ">ex. 4 TER</div>
            </div>
        </div>
    </>);
}