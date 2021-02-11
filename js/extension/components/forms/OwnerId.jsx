import React from 'react';
import MunicipalityCombo from './MunicipalityCombo';
import { StrList } from '../lists/StrList';
import Message from '@mapstore/components/I18N/Message';
import { ControlLabel } from "react-bootstrap";

/**
 * Examples of ownerId for rennes, in the list:
 * - `*00002`
 * - `*00003`
 * - `+00003`
 * - `+00005`
 * - `*00006`
 * - `*00007`
 * - `*00008`
 * - `+00008`
 * - `+00012`
 * - `*00013`
 * - `+00015`
 * - `*00016`
 * - `*00017`
 * - `*00019`
 * - `*00020`
 * - `*00022`
 * - `*00023`
 * - `+00023`
 * - `*00024`
 * - `*00025`
 */
export default function OwnerId({values, setValue = () => {}}) {
    return (
        <>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel><Message msgId={'cadastrapp.proprietaire.city'}/></ControlLabel>
                </div>
                <div className="form-col">
                    <MunicipalityCombo value={values?.commune} onSelect={v => setValue('commune', v)} />
                    <div className="text-muted"><Message msgId={'cadastrapp.proprietaire.cityExample'}/></div>
                </div>
            </div>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel><Message msgId={'cadastrapp.proprietaire.proprietaires.title'}/></ControlLabel>
                </div>
                <div className="form-col">
                    <StrList
                        items={values?.dnupro ?? []}
                        onAdd={(ownerId = "") => {
                            setValue(`dnupro`, [...(values?.dnupro ?? []), ownerId]);
                        }}
                        onRemove={index => {
                            const array = values?.dnupro ?? [];
                            const newArray = [...array.slice(0, index), ...array.slice(index + 1)];
                            setValue(`dnupro`, newArray);
                        }}
                        onSetValue={(index, value) => {
                            setValue(`dnupro[${index}]`, value);
                        }} />
                </div>
            </div>
        </>);
}
