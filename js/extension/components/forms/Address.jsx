import React, { useEffect } from 'react';
import { ControlLabel, FormControl } from "react-bootstrap";
import MunicipalityCombo from './MunicipalityCombo';
import RoadCombo from './RoadCombo';
import Message from '@mapstore/components/I18N/Message';
import { DropdownList } from 'react-widgets';
import isEmpty from 'lodash/isEmpty';


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
    useEffect(()=> {isEmpty(values) && setValue('dindic', '');}, [values]);
    return (<>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel><Message msgId={'cadastrapp.parcelle.city'}/></ControlLabel>
            </div>
            <div className="form-col">
                <MunicipalityCombo value={values?.commune} onSelect={v => setValue('commune', v)} />
                <div className="text-muted"><Message msgId={'cadastrapp.parcelle.cityExample'}/></div>
            </div>
        </div>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel><Message msgId={'cadastrapp.parcelle.town'}/></ControlLabel>
            </div>
            <div className="form-col">
                <RoadCombo value={values?.road} disabled={!values?.commune} cgocommune={values?.commune?.cgocommune} onSelect={v => setValue('road', v)}/>
                <div className="text-muted"><Message msgId={'cadastrapp.parcelle.townExample'}/></div>
            </div>
        </div>
        <div className="item-row">
            <div className="label-col">
                <ControlLabel><Message msgId={'cadastrapp.parcelle.street'}/></ControlLabel>
            </div>
            <div className="form-col">
                <FormControl value={values?.dnvoiri ?? ""} style={{ height: 34, width: 100, "float": "left" }} type="text" bsSize="sm" onChange={v => setValue('dnvoiri', v.target.value)}/>
                <div className="pull-left">
                    <DropdownList
                        style={{ width: 100, marginLeft: 5 }}
                        valueField="value"
                        textField="label"
                        value={values?.dindic}
                        onSelect={(v) => {
                            setValue('dindic', v.value);
                        }}
                        data={options}
                    />
                </div>
                <div style={{ "float": "left", marginLeft: 5, marginTop: 5 }} className="text-muted "><Message msgId={'cadastrapp.parcelle.streetExample'}/></div>
            </div>
        </div>
    </>);
}
