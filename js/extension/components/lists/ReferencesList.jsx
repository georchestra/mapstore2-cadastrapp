import React, { useState, useEffect } from 'react';
import { getSection } from '../../api';
import { validateReferences } from '../../utils/validation';
import Message from '@mapstore/components/I18N/Message';
import { Button, Glyphicon } from "react-bootstrap";
import ReferenceRow from './ReferenceRow';

export default function ReferencesList({ references = [], cgocommune, onAddReference, onRemoveReference, onSetValue }) {

    const [sections, setSections] = useState();
    useEffect(() => {
        if (cgocommune) {
            getSection(cgocommune).then(results => {
                setSections(results);
                onAddReference({}); // when commune is selected, first line of references is added by default
            });
        }
    }, [cgocommune]);
    const validReferences = validateReferences(references);
    return (
        <>
            <div style={{ width: "100%", "float": "left" }}>
                <Button
                    disabled={
                        !sections
                        || !cgocommune
                        || sections
                            && cgocommune
                            && references.length > 0
                        && !validReferences
                    }
                    onClick={() => onAddReference({})}
                    className="pull-left">
                    <Glyphicon glyph="plus"/>

                </Button>
                <span
                    style={{ marginLeft: 6, marginTop: 4 }}
                    className="pull-left"><Message msgId={'cadastrapp.parcelle.addMoreReference'}/></span>
            </div>
            <div style={{ width: "100%", minHeight: 96, "overflowY": "visible" }}>
                {
                    sections && references.map((row, index) => {
                        return (<ReferenceRow
                            row={row}
                            sections={sections}
                            onRemove={() => onRemoveReference(index)}
                            onSetValue={(column, value) => onSetValue(index, column, value)} />);
                    })
                }
            </div>
        </>
    );
}
