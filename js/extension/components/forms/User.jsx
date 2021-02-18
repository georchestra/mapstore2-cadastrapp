import React from 'react';
import MunicipalityCombo from './MunicipalityCombo';
import ProprietaireCombo from './ProprietaireCombo';
import Message from '@mapstore/components/I18N/Message';
import { ControlLabel, Checkbox  } from "react-bootstrap";

export default function User({values, setValue = () => {}}) {
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
                    <ControlLabel><Message msgId={'cadastrapp.proprietaire.name.title'}/></ControlLabel>
                </div>
                <div className="form-col">
                    <ProprietaireCombo
                        birthsearch={values?.birthsearch ?? false}
                        value={values?.proprietaire}
                        disabled={!values?.commune}
                        cgocommune={values?.commune?.cgocommune}
                        onSelect={v => setValue('proprietaire', v)}
                        onChange={v => setValue('proprietaire', v)}
                    />
                    <div className="text-muted"><Message msgId={'cadastrapp.proprietaire.name.example'}/></div>
                </div>
            </div>
            <div className="item-row">
                <div className="label-col">
                    <ControlLabel/>
                </div>
                <div className="form-col">
                    <Checkbox
                        value={values?.birthsearch}
                        onChange={v => {
                            setValue('birthsearch', v.target.checked);
                        }} >
                        <Message msgId={'cadastrapp.proprietaire.search.birth'}/>
                    </Checkbox>
                    <div className="text-muted"><Message msgId={'cadastrapp.proprietaire.name.tooltip'}/></div>
                </div>
            </div>
        </>);
}
