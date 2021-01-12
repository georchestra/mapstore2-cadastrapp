import React from 'react';
import { ControlLabel, FormControl } from "react-bootstrap";

// TODO: validation feedkback
export default ({values = {}, setValue = () => {}}) => (<div className="item-row">
    <div className="label-col">
        <ControlLabel>Identifier</ControlLabel>
    </div>
    <div className="form-col">
        <FormControl type="text" bsSize="sm" value={values.parcelle} onChange={v => setValue('parcelle', v.target.value)}/>

        <div className="text-muted">ex. 20148301032610C0012</div>
        <div></div>}
    </div>
</div>);
