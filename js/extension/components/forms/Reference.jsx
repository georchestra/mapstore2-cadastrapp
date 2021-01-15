import React from 'react';
import {ControlLabel} from 'react-bootstrap';
import ReferencesList from '../lists/ReferencesList';
import MunicipalityCombo from './MunicipalityCombo';

export default ({
    values = {},
    setValue = () => {}
}) => {
    const cgocommune = values?.commune?.cgocommune;
    return (
        <>
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
                    <ControlLabel>Reference(s)</ControlLabel>
                </div>
                <div className="form-col">
                    <ReferencesList
                        cgocommune={cgocommune}
                        references={values?.references ?? []}
                        onAddReference={(reference = {}) => {
                            setValue(`references`, [...(values?.references ?? []), reference]);
                        }}
                        onRemoveReference={ index => {
                            const array = values?.references ?? [];
                            const newArray = [...array.slice(0, index), ...array.slice(index + 1)];
                            setValue(`references`, newArray);
                        }}
                        onSetValue={(index, column, value) => {
                            setValue(`references[${index}][${column}]`, value);
                        }} />
                </div>
            </div>
        </>
    );
};

