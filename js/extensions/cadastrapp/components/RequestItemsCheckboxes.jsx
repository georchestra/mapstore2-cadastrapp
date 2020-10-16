import React from 'react';

import {Checkbox} from "react-bootstrap";

export function RequestObjectItemCheckboxes() {
    return (
        <div
            style={{ width: "100%" }}>
            <Checkbox
                className="pull-left"
                style={{ marginLeft: 120 }}>
                Relevé de propriété
            </Checkbox>
            <Checkbox>
                Bordereau parcellaire
            </Checkbox>
        </div>
    );
}
