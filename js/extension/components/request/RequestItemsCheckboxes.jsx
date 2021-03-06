import React from 'react';
import Message from '@mapstore/components/I18N/Message';
import {Checkbox} from "react-bootstrap";

/**
 * RequestItemsCheckboxes component
 * @param {object} props Component props
 * @param {func} props.handleOnChange triggered on change
 * @param {object} props.requestFormData object containing checkbox's value
 */
export default ({handleOnChange = () => {}, requestFormData = {}}) => {
    return (
        <div
            style={{ width: "100%", display: "flex" }}>
            <Checkbox
                className="pull-left"
                style={{ marginLeft: 120 }}
                onChange={handleOnChange}
                checked={requestFormData?.propStatement}
                value={requestFormData?.propStatement}
                name={"propStatement"}
            >
                <Message msgId={'cadastrapp.duc.releve.depropriete'} />
            </Checkbox>
            <Checkbox
                style={{marginTop: 10, marginLeft: 10}}
                onChange={handleOnChange}
                value={requestFormData?.parcelSlip}
                name={"parcelSlip"}
            >
                <Message msgId={'cadastrapp.duc.bordereau.parcellaire'} />
            </Checkbox>
        </div>
    );
};
