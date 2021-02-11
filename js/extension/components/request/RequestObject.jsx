import React, { useState, useEffect } from 'react';
import { Button, Glyphicon } from "react-bootstrap";
import RequestObjectItem from './RequestObjectItem';
import Message from '@mapstore/components/I18N/Message';
import uuid from 'uuid';

/**
 * RequestObject component
 * @param {object} props Component props
 * @param {number} props.availableRequest contains number of available request allow for the user
 * @param {function} props.setAvailableRequest triggered when adding or deleting a request object
 */
export default function RequestObject({availableRequest = 0, setAvailableRequest = () => {}, ...props}) {
    let randomId = uuid();
    let item = {};
    if (availableRequest > 0) {
        item[randomId] = "";
    }
    let [requestObjects, setRequestObjects] = useState(item);

    useEffect(() => {
        setAvailableRequest(availableRequest - Object.keys(requestObjects).length);
    }, [setAvailableRequest]);

    let handleAdd = () => {
        let r = { ...requestObjects };
        let id = uuid();
        r[id] = "";
        setRequestObjects(r);
        setAvailableRequest(availableRequest - 1);
    };

    let handleChange = (id, value) => {
        let r = { ...requestObjects };
        r[id] = value;
        setRequestObjects(r);
    };

    let handleDelete = (id) => {
        let r = { ...requestObjects };
        delete r[id];
        setRequestObjects(r);
        setAvailableRequest(availableRequest + 1);
    };

    return (
        <div>
            <div className="pull-left" style={{ width: "100%", marginBottom: 10 }}>
                <Button disabled={availableRequest <= 0} className="pull-right" onClick={handleAdd} style={{ marginRight: 4 }}>
                    <Glyphicon glyph="plus"/>
                </Button>
                <small style={{ marginTop: 5, marginRight: 10, ...(availableRequest <= 0 && {color: "red"}) }} className="pull-right">
                    <Message msgId={availableRequest <= 0 ? 'cadastrapp.demandeinformation.exceded.maxNumber' : 'cadastrapp.demandeinformation.addMore'}/>
                </small>
            </div>
            <div>
                {Object.keys(requestObjects).map((v, index) => (
                    <RequestObjectItem
                        key={index}
                        dataId={v}
                        value={requestObjects[v]}
                        onChange={handleChange}
                        onDelete={handleDelete}
                        {...props}
                    />
                ))}
            </div>
        </div>
    );
}
