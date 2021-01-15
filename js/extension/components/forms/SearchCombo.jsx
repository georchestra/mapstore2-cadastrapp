import React, {useState, useEffect } from 'react';
import { find, isObject } from 'lodash';
import { Combobox } from 'react-widgets';
import { Glyphicon } from "react-bootstrap";


/**
 * A utility combo for search.
 * @params search
 */
export default ({
    value = {},
    valueField,
    minLength,
    onChange = () => {},
    search = () => {},
    onSelect = () => {},
    ...props
}) => {
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [data, setData] = useState([]);
    useEffect( () => {
        if (text.length >= minLength) {
            setBusy(true);
            search(text).then(results => {
                setData(results);
                setBusy(false);
            });
        }
    }, [text]);
    return (<div style={{position: "relative"}}>
        <Combobox
            busy={busy}
            valueField={valueField}
            value={isObject(value) ? value[valueField] : value}
            onSelect={(v) => {
                onSelect(find(data, {[valueField]: v}) ?? v);
            }}
            onChange={
                t => {
                    onChange(t);
                    setText(t);
                }
            }
            data={data}
            minLength={minLength}
            {...props}
        />
        {text || value ? <Glyphicon glyph="remove"
            bsSize="xsmall"
            style={{
                position: 'absolute',
                top: 9,
                opacity: 0.4,
                right: 35,
                zIndex: 2,
                cursor: "pointer"

            }}
            onClick={() => {
                setText('');
                onSelect(undefined);
            }}/> : null}
    </div>);
};
