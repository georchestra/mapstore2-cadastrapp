import React, { useState } from 'react';
import {randomString} from '../dummy';

export default function RequestObject() {
    let randomId = randomString(16);
    let item = {};
    item[randomId] = "";
    let [requestObjects, setRequestObjects] = useState(item);

    let handleAdd = () => {
        let r = { ...requestObjects };
        let id = randomString(16);
        r[id] = "";
        setRequestObjects(r);
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
    };

    return (
        <div>
            <div className="pull-left" style={{ width: "100%", marginBottom: 10 }}>
                <Button className="pull-right" onClick={handleAdd} style={{ marginRight: 4 }}>
                    <Glyphicon glyph="plus"></Glyphicon>
                </Button>
                <small style={{ marginTop: 5, marginRight: 10 }} className="pull-right">
                    Click to add more request object items
                </small>
            </div>
            <div>
                {Object.keys(requestObjects).map((v) => (
                    <RequestObjectItem
                        dataId={v}
                        value={requestObjects[v]}
                        onChange={handleChange}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    )
}