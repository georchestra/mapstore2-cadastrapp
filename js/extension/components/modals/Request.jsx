import React, { useState, useEffect } from 'react';
import Modal from '@mapstore/components/misc/Modal';
import Message from '@mapstore/components/I18N/Message';
import RS from 'react-select';
import Spinner from "react-spinkit";
import { isEmpty, includes } from 'lodash';
import localizedProps from '@mapstore/components/misc/enhancers/localizedProps';
import { Button, ControlLabel, FormControl as FC, Radio, FormGroup } from "react-bootstrap";
import { checkRequestLimitation } from "../../api";
import RequestObject from '../request/RequestObject';
import { isValidEmail } from '@mapstore/utils/StringUtils';
const FormControl = localizedProps('placeholder')(FC);
const Select = localizedProps('options')(RS);
import {
    DEFAULT_REQUEST_OBJ,
    formulatePrintParams,
    DEFAULT_MAX_REQUEST
} from "@js/extension/utils/requestForm";

export default function RequestFormModal({
    onClose = () => {},
    isShown = false,
    authLevel = {},
    maxRequest = DEFAULT_MAX_REQUEST,
    ...props
}) {

    // Auth level of the user
    const isCNIL = authLevel.isCNIL2 || authLevel.isCNIL1;

    const USER_TYPE_OPTIONS = [
        { value: 'A', label: 'cadastrapp.demandeinformation.type.A'},
        { value: 'P1', label: 'cadastrapp.demandeinformation.type.P1' },
        { value: 'P2', label: 'cadastrapp.demandeinformation.type.P2' },
        { value: 'P3', label: 'cadastrapp.demandeinformation.type.P3' }
    ];

    const [showReqByFields, setShowReqByFields] = useState(false);
    const [showRequestObj, setShowRequestObj] = useState(false);
    const [requestFormData, setRequestFormData] = useState(DEFAULT_REQUEST_OBJ);
    const [inValidField, setInValidField] = useState(true);
    const [availableRequest, setAvailableRequest] = useState(+maxRequest);
    const [checkingLimit, setCheckingLimit] = useState(false);

    useEffect(()=>{
        const {type, lastname, cni} = requestFormData;
        const isNotNormalUser = !isEmpty(type) && type !== "P3";  // P3 is normal user
        const isValidNormalUser = !isEmpty(cni) && type === "P3";

        setShowReqByFields(isNotNormalUser || isValidNormalUser); // Show/hide requestBy fields
        setShowRequestObj((isNotNormalUser && !!lastname.length) || isValidNormalUser); // Show/hide request object fields
    }, [requestFormData.cni, requestFormData.type, requestFormData.lastname]);

    // Check request limit based cni and type and set available request
    const checkRequestLimit = ({cni, type}) => {
        setCheckingLimit(true);
        checkRequestLimitation({cni, type}).then((data)=> {
            if (data.user) {
                // Use the fetched user data to populate the request form field
                setRequestFormData({
                    ...requestFormData, ...data.user,
                    firstname: data.user?.firstName || '',
                    lastname: data.user?.lastName || '',
                    codepostal: data.user?.codePostal || ''
                });
            }
            // Set available requests from the response, else set max request from configuration
            data.requestAvailable || data.requestAvailable === 0 ? setAvailableRequest(+data.requestAvailable) : setAvailableRequest(+maxRequest);
            setCheckingLimit(false);
        }).catch(()=>{
            setAvailableRequest(0);
            props.onError({
                title: "Error",
                message: "cadastrapp.demandeinformation.availableReqError"
            });
            setCheckingLimit(false);
        });
    };

    const [printRequest, setPrintRequest] = useState({});

    useEffect(() => {
        // Generate print params from form data
        setPrintRequest(formulatePrintParams(requestFormData));
    }, [requestFormData]);

    const onChange = (item) => {
        let formObj;
        if (item.value) {
            formObj = {...DEFAULT_REQUEST_OBJ, type: item.value};
        } else {
            const {name = '', value = ''} = item?.target || {};
            formObj = {...requestFormData, [name]: includes(['askby', 'responseby'], name) ? +value : value};
            name === "cni" && setCheckingLimit(true); // Set flag when checking for request limit
        }
        setRequestFormData(formObj);
    };

    const onBlur = ({target}) => {
        const {name = '', value = ''} = target || {};
        const trimmedValue = value.trim();
        setRequestFormData({...requestFormData, [name]: trimmedValue});

        // Trigger check request limit call
        if (name === "cni" && !isEmpty(requestFormData.type) && !isEmpty(trimmedValue) && trimmedValue.length > 2) {
            checkRequestLimit(requestFormData);
        }
    };

    const onCloseForm = () => { onClose(); setRequestFormData(DEFAULT_REQUEST_OBJ); setAvailableRequest(DEFAULT_MAX_REQUEST);};

    const formFields = [
        {
            value: requestFormData.cni,
            name: 'cni',
            label: <Message msgId={"cadastrapp.demandeinformation.cni"}/>,
            validation: requestFormData.type === 'P3' && isEmpty(requestFormData.cni) && "error"
        },
        {
            value: requestFormData.lastname,
            name: 'lastname',
            label: <Message msgId={"cadastrapp.demandeinformation.nom"}/>,
            validation: !isEmpty(requestFormData.type) && requestFormData.type !== 'P3' && isEmpty(requestFormData.lastname) && "error"
        },
        {
            value: requestFormData.firstname,
            name: 'firstname',
            label: <Message msgId={"cadastrapp.demandeinformation.prenom"}/>
        },
        {
            value: requestFormData.adress,
            name: 'adress',
            label: <Message msgId={"cadastrapp.demandeinformation.num_rue"}/>
        },
        {
            value: requestFormData.codepostal,
            name: 'codepostal',
            label: <Message msgId={"cadastrapp.demandeinformation.code_postal"}/>
        },
        {
            value: requestFormData.commune,
            name: 'commune',
            label: <Message msgId={"cadastrapp.demandeinformation.commune"}/>
        },
        {
            value: requestFormData.mail,
            name: 'mail',
            type: 'email',
            label: <Message msgId={"cadastrapp.demandeinformation.mail"}/>,
            validation: !isEmpty(requestFormData.mail) && !isValidEmail(requestFormData.mail) && "error"
        }
    ];

    const radioButtonGroup = {
        groupLabel: [
            {label: <Message msgId={"cadastrapp.demandeinformation.realise"}/>, name: 'askby' },
            {label: <Message msgId={"cadastrapp.demandeinformation.transmission"}/>, name: 'responseby'}
        ],
        groupField: [
            <Message msgId={"cadastrapp.demandeinformation.counter"}/>,
            <Message msgId={"cadastrapp.demandeinformation.mail"}/>,
            <Message msgId={"cadastrapp.demandeinformation.email"}/>
        ]
    };

    return (
        <Modal
            dialogClassName="cadastrapp-modal"
            show={isShown} onHide={onCloseForm}>
            <Modal.Header closeButton>
                <Modal.Title><Message msgId={'cadastrapp.demandeinformation.title'}/></Modal.Title>
            </Modal.Header>
            <Modal.Body className="request-modal-body">
                <div className="item-row">
                    <div className="label-col">
                        <ControlLabel><Message msgId={'cadastrapp.demandeinformation.type.demandeur'}/></ControlLabel>
                    </div>
                    <div className="form-col">
                        <Select name="type" value={requestFormData.type} onChange={onChange} options={USER_TYPE_OPTIONS}/>
                    </div>
                </div>
                {
                    formFields.map(({label, name, value, type = "text", validation = null}, index)=> (
                        <div className="item-row" key={index}>
                            <FormGroup validationState={validation}>
                                <div className="label-col">
                                    <ControlLabel>{label}</ControlLabel>
                                </div>
                                <div className="form-col">
                                    <FormControl
                                        disabled={isEmpty(requestFormData.type) || (name !== "cni" && requestFormData.type === 'P3' && isEmpty(requestFormData.cni))}
                                        value={value} name={name} onBlur={onBlur} onChange={onChange} type={type}
                                        bsSize="sm"
                                    />
                                </div>
                            </FormGroup>
                        </div>
                    ))
                }
                {
                    showReqByFields && radioButtonGroup.groupLabel.map(({label, name})=> (
                        <div className={"item-row"}>
                            <div className="label-col">
                                <ControlLabel>{label}</ControlLabel>
                            </div>
                            <div className="form-col">
                                <FormGroup>
                                    {radioButtonGroup.groupField.map((fieldLabel, index)=>
                                        <Radio onChange={onChange} checked={requestFormData[name] === index + 1} value={index + 1}  name={name} inline>
                                            {fieldLabel}
                                        </Radio>)}
                                </FormGroup>
                            </div>
                        </div>
                    ))
                }
                <hr/>
                {showRequestObj && !checkingLimit && <div className={"item-row"}>
                    <div className="request-obj-label">
                        <ControlLabel><Message msgId={"cadastrapp.demandeinformation.titre2"}/></ControlLabel>
                    </div>
                    <RequestObject
                        allow={isCNIL}
                        requestFormData={requestFormData}
                        setInValidField={setInValidField}
                        setRequestFormData={setRequestFormData}
                        setAvailableRequest={setAvailableRequest}
                        availableRequest={availableRequest}
                    />
                </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCloseForm}><Message msgId={'cadastrapp.demandeinformation.annuler'}/></Button>
                <Button
                    disabled={!showRequestObj || checkingLimit || inValidField || props.loading}
                    onClick={()=>props.onPrintPDF(printRequest)}
                    className="print"
                >
                    {!props.allowDocument && props.loading ? (
                        <Spinner
                            spinnerName="circle"
                            noFadeIn
                            overrideSpinnerClassName="spinner"
                        />
                    ) : null}
                    <Message msgId={'cadastrapp.demandeinformation.imprimer'}/>
                </Button>
                <Button
                    disabled={isCNIL ? !props.allowDocument : true}
                    onClick={()=>props.onPrintPDF(null, 'Document')}
                    className="print"
                >
                    {props.allowDocument && props.loading ? (
                        <Spinner
                            spinnerName="circle"
                            noFadeIn
                            overrideSpinnerClassName="spinner"
                        />
                    ) : null}
                    <Message msgId={'cadastrapp.demandeinformation.generate.document'}/>
                </Button>
            </Modal.Footer>
        </Modal>);
}

