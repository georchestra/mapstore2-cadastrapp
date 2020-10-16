
import React, { useState } from 'react';
import { Button, FormControl, Glyphicon } from "react-bootstrap";
export function StrList() {
    let [items, setItems] = useState([""]);

    let handleDelete = (index) => {
        return () => {
            let i = items.slice();
            i.splice(index, 1);
            setItems(i);
        };
    };

    let handleChange = (index) => {
        return (e) => {
            let i = items.slice();
            i[index] = e.target.value;
            setItems(i);
        };
    };

    let handleAdd = () => {
        let i = items.slice();
        i.push("");
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
                    className="pull-left">Click to add a new owner
                </span>
            </div>
            <div style={{ width: "100%", height: "calc(50vh - 290px)", minHeight: 96, "overflowY": "auto" }}>
                {items.map((v, index) => (
                    <div style={{ width: "100%", "float": "left" }}>
                        <FormControl
                            value={v}
                            className="pull-left"
                            style={{ width: 240, marginTop: 5, marginRight: 5 }}
                            onChange={handleChange(index)}
                        />
                        <Button
                            style={{ marginTop: 5, marginRight: 5 }}
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
