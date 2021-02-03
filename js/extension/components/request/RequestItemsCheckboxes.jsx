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
                value={requestFormData?.propStatement || false}
                name={"propStatement"}
            >
                <Message msgId={'cadastrapp.requestForm.propertyStatement'} />
            </Checkbox>
            <Checkbox
                style={{marginTop: 10, marginLeft: 10}}
                onChange={handleOnChange}
                value={requestFormData?.parcelSlip || false}
                name={"parcelSlip"}
            >
                <Message msgId={'cadastrapp.requestForm.parcelSlip'} />
            </Checkbox>
        </div>
    );
};
