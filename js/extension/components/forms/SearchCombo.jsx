import React, {useState, useEffect } from 'react';
import { find, isObject } from 'lodash';
import { Combobox as CB } from 'react-widgets';
import { Glyphicon } from "react-bootstrap";
import localizedProps from '@mapstore/components/misc/enhancers/localizedProps';
const Combobox = localizedProps('placeholder')(CB);

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
    disabled = false,
    hideRemove = false,
    additionalStyle = {},
    placeholder = "",
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
    return (<div style={{position: "relative", ...additionalStyle}}>
        <Combobox
            busy={busy}
            disabled={disabled}
            placeholder={placeholder}
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
        {!hideRemove && (text || value) ? <Glyphicon glyph="remove"
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
