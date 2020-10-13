import React, { useState } from 'react';
import Modal from '@mapstore/components/misc/Modal';
import Select from 'react-select';
import { Button, ControlLabel, FormControl, Radio, FormGroup } from "react-bootstrap";

import RequestObject from '../request/RequestObject';


export default function RequestFormModal(props) {

    const userTypeOptions = [
        { value: '0', label: 'Administration' },
        { value: '1', label: 'P1 - User with Rights' },
        { value: '2', label: 'P2 - Representative' },
        { value: '3', label: 'P3 - Normal user' }
    ];

    let [userType, setUserType] = useState("");
    let [radioClass, setRadioClass] = useState("collapse");
    let [requestClass, setRequestClass] = useState("collapse");

    const handleLastNameChange = (e) => {

        if (e.target.value.length > 2) {
            setRequestClass("item-row");
        } else {
            setRequestClass("collapse");
        }
    };

    const handleChange = (item) => {
        setUserType(item.value);

        if (item.value === 3) {
            setRadioClass("collapse");
        } else {
            setRadioClass("item-row");
        }
    };

    return (
        <Modal
            dialogClassName="cadastrapp-modal"
            show={props.isShown} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Request on landholding trust</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Request User Type</ControlLabel>
                    </div>
                    <div className="form-col">
                        <Select value={userType} onChange={handleChange} options={userTypeOptions}/>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>CNI</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Last Name</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl onChange={handleLastNameChange} type="text" bsSize="sm"/>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>First Name</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Road Number</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Zip Code</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Town, Municipality</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                    </div>
                </div>

                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel>Mail</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormControl type="text" bsSize="sm"/>
                    </div>
                </div>
                <div className={radioClass}>
                    <div className="label-col">
                        <ControlLabel>Request ask by</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormGroup>
                            <Radio name="radioGroup" inline>
                                Guichet
                            </Radio>{' '}
                            <Radio name="radioGroup" inline>
                                Courrier
                            </Radio>{' '}
                            <Radio name="radioGroup" inline>
                                Mail
                            </Radio>
                        </FormGroup>
                    </div>
                </div>

                <div className={radioClass}>
                    <div className="label-col">
                        <ControlLabel>Give document by</ControlLabel>
                    </div>
                    <div className="form-col">
                        <FormGroup>
                            <Radio name="radioGroup" inline>
                                Guichet
                            </Radio>{' '}
                            <Radio name="radioGroup" inline>
                                Courrier
                            </Radio>{' '}
                            <Radio name="radioGroup" inline>
                                Mail
                            </Radio>
                        </FormGroup>
                    </div>
                </div>
                <hr></hr>
                <div className={requestClass}>
                    <div className="label-col">
                        <ControlLabel>Request Object</ControlLabel>
                    </div>
                    <div className="form-col">
                    </div>
                </div>

                <div className={requestClass}>
                    <RequestObject></RequestObject>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button>Cancel Request</Button>
                <Button>Print Request</Button>
                <Button>Generate Documents</Button>
            </Modal.Footer>
        </Modal>)
}

