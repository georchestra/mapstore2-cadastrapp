import React, {useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { find, isObject } from 'lodash';
import { Combobox as CB } from 'react-widgets';
import { Glyphicon } from "react-bootstrap";
import localizedProps from '@mapstore/components/misc/enhancers/localizedProps';
import { getMessageById } from '../../../../MapStore2/web/client/utils/LocaleUtils';
import {compose, getContext, mapProps} from 'recompose';
import { minCharToSearchSelector } from "@js/extension/selectors/cadastrapp";


const localizeMessages = compose(
    getContext({
        messages: PropTypes.object
    }),
    mapProps(({messages, ...props}) => ({
        ...props,
        messages: {
            emptyList: getMessageById(messages, 'cadastrapp.nodata'),
            emptyFilter: getMessageById(messages, 'cadastrapp.nodata')
        }
    })
    )
);
const Combobox = localizedProps('placeholder')(localizeMessages(CB));


/**
 * A utility combo for search.
 * @params search
 */
export default connect(
    state=>({ minCharToSearch: minCharToSearchSelector(state) })
)(({
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
    dropUp = false,
    minCharToSearch,
    ...props
}) => {
    const _minLength = minLength ?? minCharToSearch;
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [data, setData] = useState([]);
    useEffect( () => {
        if (text.length >= _minLength) {
            setBusy(true);
            search(text).then(results => {
                setData(results);
                setBusy(false);
            });
        }
    }, [text]);
    return (<div style={{position: "relative", ...additionalStyle}}>
        <Combobox
            dropUp={dropUp}
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
            minLength={_minLength}
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
});
