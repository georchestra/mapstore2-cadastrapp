import React from 'react';
import { ControlLabel, FormControl, Alert } from "react-bootstrap";
import { idTabValid } from '../../utils/validation';
import Message from '@mapstore/components/I18N/Message';

// TODO: validation feedkback
export default ({ values = {}, setValue = () => {}}) => (<div className="item-row">
    <div className="label-col">
        <ControlLabel><Message msgId={'cadastrapp.parcelle.ident.title'}/></ControlLabel>
    </div>
    <div className="form-col">
        <FormControl type="text" bsSize="sm" value={values?.parcelle ?? ""} onChange={v => setValue('parcelle', v.target.value)}/>
        {values.parcelle && !idTabValid(values)
            ? <Alert variant="warning"><Message msgId={'cadastrapp.parcelle.ident.control'}/></Alert>
            : null
        }
        <div className="text-muted"><Message msgId={'cadastrapp.parcelle.ident.example'}/></div>
        <div></div>
    </div>
</div>);
