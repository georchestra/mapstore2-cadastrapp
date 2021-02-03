import React from 'react';
import { ControlLabel, FormControl, Alert } from "react-bootstrap";
import { idTabValid } from '../../utils/validation';


// TODO: validation feedkback
export default ({ values = {}, setValue = () => {}}) => (<div className="item-row">
    <div className="label-col">
        <ControlLabel>Identifier</ControlLabel>
    </div>
    <div className="form-col">
        <FormControl type="text" bsSize="sm" value={values?.parcelle ?? ""} onChange={v => setValue('parcelle', v.target.value)}/>
        {values.parcelle && !idTabValid(values)
            ? <Alert variant="warning">Cadastral identifier must be at least 15 chars for Arcopole model and 19 chars for Qgis model, if more than one identifier is given, they should be separed by space, comma or semi-colon</Alert>
            : null
        }
        <div className="text-muted">ex. 20148301032610C0012</div>
        <div></div>
    </div>
</div>);
