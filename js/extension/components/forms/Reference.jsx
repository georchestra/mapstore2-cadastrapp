import React from 'react';
import {ControlLabel} from 'react-bootstrap';
import ReferencesList from '../lists/ReferencesList';
import MunicipalityCombo from './MunicipalityCombo';
import Message from '@mapstore/components/I18N/Message';

export default ({
    values = {},
    setValue = () => {}
}) => {
    const cgocommune = values?.commune?.cgocommune;
    return (
        <>
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
                    <ControlLabel><Message msgId={'cadastrapp.parcelle.references'}/></ControlLabel>
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

