import React, { useState } from 'react';
import { Button, FormControl, Glyphicon } from "react-bootstrap";
export default function ReferencesList() {
    let [items, setItems] = useState([["", ""]]);

    let handleDelete = (index) => {
        return () => {
            let i = items.slice();
            i.splice(index, 1);
            setItems(i);
        };
    };

    let handleChange = (index, elementIndex) => {
        return (e) => {
            let i = items.slice();
            i[index][elementIndex] = e.target.value;
            setItems(i);
        };
    };

    let handleAdd = () => {
        let i = items.slice();
        i.push(["", ""]);
        setItems(i);
    };

    return (
        <>
            <div style={{ width: "100%", "float": "left" }}>

                <Button
                    onClick={handleAdd}
                    className="pull-left">
                    <Glyphicon glyph="plus"/>

                </Button>
                <span
                    style={{ marginLeft: 6, marginTop: 4 }}
                    className="pull-left">Click to add a new reference</span>
            </div>
            <div style={{ width: "100%", height: "calc(50vh - 290px)", minHeight: 96, "overflowY": "auto" }}>
                {items.map((v, index) => (
                    <div style={{ widthh: "100%", "float": "left" }}>
                        <FormControl
                            value={v[0]}
                            className="pull-left"
                            style={{ width: 120, marginTop: 3, marginRight: 3 }}
                            onChange={handleChange(index, 0)}
                        />
                        <FormControl
                            value={v[1]}
                            className="pull-left"
                            style={{ width: 120, marginTop: 3, marginRight: 3 }}
                            onChange={handleChange(index, 1)}
                        />
                        <Button
                            style={{ marginTop: 3, marginRight: 3 }}
                            className="pull-right"
                            onClick={handleDelete(index)}
                        >
                            <Glyphicon glyph="trash"/>
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
}
