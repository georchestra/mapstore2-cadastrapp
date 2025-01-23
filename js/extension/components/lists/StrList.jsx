
import React from 'react';
import { Button, FormControl, Glyphicon } from "react-bootstrap";
import Message from '@mapstore/components/I18N/Message';

export function StrList({items = [], onAdd, onRemove, onSetValue}) {

    return (
        <>
            <div style={{ width: "100%", "float": "left" }}>

                <Button
                    onClick={() => onAdd()}
                    className="pull-left">
                    <Glyphicon glyph="plus"/>

                </Button>
                <span
                    style={{ marginLeft: 6, marginTop: 4 }}
                    className="pull-left"><Message msgId={'cadastrapp.proprietaire.proprietaires.addMoreProprietaire'}/>
                </span>
            </div>
            <div style={{ width: "100%", "overflowY": "auto" }}>
                {items.map((v, index) => (
                    <div style={{ width: "100%", "float": "left" }}>
                        <FormControl
                            value={v}
                            className="pull-left"
                            style={{ width: 240, marginTop: 5, marginRight: 5 }}
                            onChange={e => onSetValue(index, e.target.value)}
                        />
                        <Button
                            style={{ marginTop: 5, marginRight: 5 }}
                            className="pull-right"
                            onClick={() => onRemove(index)}
                        >
                            <Glyphicon glyph="trash"/>
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
}
