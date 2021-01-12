import React, {useState, useEffect } from 'react';
import { find, isObject } from 'lodash';
import { Combobox } from 'react-widgets';

/**
 * A utility combo for search.
 * @params search
 */
export default ({
    value = {},
    valueField,
    minLength,
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
    return (<Combobox
        busy={busy}
        valueField={valueField}
        value={isObject(value) ? value[valueField] : value}
        onSelect={(v) => {
            onSelect(find(data, {[valueField]: v}) ?? v);
        }}
        onChange={t => setText(t)}
        data={data}
        minLength={minLength}
        {...props}
    />);
};
