import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import cs from 'classnames';
import { isEmpty, isEqual, includes } from 'lodash';
import { Button, FormControl as FC, Glyphicon } from "react-bootstrap";
import RequestItemsCheckboxes from "./RequestItemsCheckboxes";
import MunicipalityCombo from "../forms/MunicipalityCombo";
import SectionCombo from "./searchCombos/SectionCombo";
import ProprietaireComboList from "./searchCombos/ProprietaireComboList";
import ProprietaireCombo from "../forms/ProprietaireCombo";
import localizedProps from '@mapstore/components/misc/enhancers/localizedProps';
const FormControl = localizedProps('placeholder')(FC);
const RequestSelect = localizedProps('options')(Select);

/**
 * RequestObjectItem component
 * @param {object} props Component props
 * @param {function} props.setRequestFormData triggered when adding or updating request object's data
 * @param {object} props.requestFormData contains request form data
 * @param {id} props.dataId key/index of the request object
 * @param {string} props.value contains current request option value
 * @param {function} props.onDelete triggered when adding or deleting a request object
 * @param {function} props.onChange triggered when changing a request object
 * @param {function} props.setInValidField triggered when changing mandatory fields values
 * @param {bool} props.allow boolean variable to show restricted options
 */
export default function RequestObjectItem({
    setRequestFormData = () => {},
    requestFormData = {},
    dataId,
    value,
    onDelete = () => {},
    onChange = () => {},
    setInValidField = () => {},
    allow = false
}) {
    const requestOptions = [
        { value: 'owner-id', label: 'cadastrapp.requestForm.ownerId' },
        { value: 'plot', label: 'cadastrapp.requestForm.plot' },
        { value: 'co-owners', label: 'cadastrapp.requestForm.coOwner' },
        { value: 'plot-id', label: 'cadastrapp.requestForm.plotId' },
        { value: 'owner', label: 'cadastrapp.requestForm.owner', style: {display: allow ? 'block' : 'none'} },
        { value: 'owner-birth-name', label: 'cadastrapp.requestForm.ownerBirthName', style: {display: allow ? 'block' : 'none'} },
        { value: 'lot-co-owners', label: 'cadastrapp.requestForm.lotCoOwners', style: {display: allow ? 'block' : 'none'} }
    ];

    const [fieldName, setFieldName] = useState('');
    const [mandatoryFields, setMandatoryFields] = useState(0);

    const handleOnChange = ({target}) => {
        const {name, value: data} = target || {};
        setRequestFormData({...requestFormData, [fieldName]: {
            ...requestFormData[fieldName],
            [dataId]: {
                ...requestFormData[fieldName][dataId],
                ...(includes(['propStatement', 'parcelSlip'], name)
                    ? {[name]: target.checked}
                    : {[name]: data})
            }}
        });
    };

    const handleSelectChange = (name, v) => {
        let result;
        if (name === "commune" && isEmpty(v)) {
            result = { [dataId]: {} };
            setRequestFormData({...requestFormData,
                [fieldName]: { ...requestFormData[fieldName] }});
        } else {
            result = {
                [dataId]: {
                    ...requestFormData[fieldName][dataId],
                    [name]: {...v}
                }
            };
        }
        setRequestFormData({...requestFormData,
            [fieldName]: { ...requestFormData[fieldName], ...result}});
    };

    useEffect(()=>{
        const data = requestFormData?.[fieldName]?.[dataId] || [];
        const fieldEquality = Object.keys(data).filter(k => !isEmpty(data[k]) && !includes(['propStatement', 'parcelSlip'], k));
        const booleanFields = Object.keys(data).filter(k => data[k] === true);
        // Mandatory field validation
        let inValid = true;
        if (!isEmpty(data) && !isEmpty(mandatoryFields)) {
            if (isEqual(fieldEquality.sort(), mandatoryFields.sort())) {
                if (booleanFields.length > 0) {
                    inValid = false;
                }
            }
        }
        setInValidField(inValid);
    }, [requestFormData]);

    function ownerId() {
        return (
            <div>
                <FormControl
                    className="pull-left"
                    placeholder={"cadastrapp.requestForm.accountId"}
                    name="accountId"
                    value={requestFormData?.[fieldName]?.[dataId]?.accountId || ''}
                    style={{ height: 34, width: 248, margin: 4 }}
                    onChange={handleOnChange}
                />
            </div>
        );
    }

    const plot = () => {
        return (
            <div>
                <div style={{display: 'flex', "float": "left", margin: 4}}>
                    <MunicipalityCombo
                        placeholder={'cadastrapp.requestForm.commune'}
                        additionalStyle={{width: 300, marginRight: 4}} value={requestFormData?.[fieldName]?.[dataId]?.commune?.label}
                        onSelect={v =>handleSelectChange("commune", v)}
                    />
                    <SectionCombo
                        cgocommune={requestFormData?.[fieldName]?.[dataId]?.commune?.cgocommune}
                        value={{section: requestFormData?.[fieldName]?.[dataId]?.section,
                            plot: isEmpty(requestFormData?.[fieldName]?.[dataId]?.plot) ? null : requestFormData?.[fieldName]?.[dataId]?.plot}}
                        onSelect={(c, v) =>handleSelectChange(c, v)}
                    />
                </div>
            </div>
        );
    };

    const coOwners = () => {
        return (
            <div style={{ width: "300" }}>
                <FormControl
                    placeholder={'cadastrapp.requestForm.accountId'}
                    name="accountId"
                    value={requestFormData?.[fieldName]?.[dataId]?.accountId || ''}
                    className={cs("pull-left", "request-obj-double")}
                    onChange={handleOnChange}
                />
                <FormControl
                    placeholder={'cadastrapp.requestForm.plotId'}
                    name={"plotId"}
                    value={requestFormData?.[fieldName]?.[dataId]?.plotId || ''}
                    className={cs("pull-left", "request-obj-double")}
                    onChange={handleOnChange}
                />
            </div>
        );
    };

    const plotId = () => {
        return (
            <div>
                <FormControl
                    placeholder={'cadastrapp.requestForm.accountId'}
                    name="accountId"
                    value={requestFormData?.[fieldName]?.[dataId]?.accountId || ''}
                    className={cs("pull-left", "request-obj-double")}
                    onChange={handleOnChange}
                />
            </div>
        );
    };

    const owner = () => {
        return (
            <div>
                <div style={{display: 'flex', "float": "left", margin: 4}}>
                    <MunicipalityCombo
                        placeholder={'cadastrapp.requestForm.commune'}
                        additionalStyle={{width: 300, marginRight: 4}}
                        value={requestFormData?.[fieldName]?.[dataId]?.commune?.label}
                        onSelect={v =>handleSelectChange("commune", v)}
                    />
                    <ProprietaireCombo
                        placeholder={'cadastrapp.requestForm.owner'}
                        disabled={isEmpty(requestFormData?.[fieldName]?.[dataId]?.commune)}
                        birthsearch
                        cgocommune={requestFormData?.[fieldName]?.[dataId]?.commune?.cgocommune}
                        additionalStyle={{width: 300, marginRight: 4}}
                        value={requestFormData?.[fieldName]?.[dataId]?.proprietaire?.value}
                        onSelect={v =>handleSelectChange("proprietaire", v)}
                    />
                </div>
            </div>
        );
    };

    const cadastrappDemandei = () => {
        return (
            <div>
                <div style={{display: 'flex', "float": "left", margin: 4}}>
                    <MunicipalityCombo
                        placeholder={'cadastrapp.requestForm.commune'}
                        additionalStyle={{width: 300, marginRight: 4}}
                        value={requestFormData?.[fieldName]?.[dataId]?.commune?.label}
                        onSelect={v =>handleSelectChange("commune", v)}
                    />
                    <ProprietaireCombo
                        placeholder={'cadastrapp.requestForm.owner'}
                        disabled={isEmpty(requestFormData?.[fieldName]?.[dataId]?.commune)}
                        birthsearch
                        cgocommune={requestFormData?.[fieldName]?.[dataId]?.commune?.cgocommune}
                        additionalStyle={{width: 300, marginRight: 4}}
                        value={requestFormData?.[fieldName]?.[dataId]?.proprietaire?.value }
                        onSelect={v =>handleSelectChange("proprietaire", v)}
                    />
                </div>
            </div>
        );
    };

    const lotCoOwners = () => {
        return (
            <div>
                <div style={{display: 'flex', margin: 4}}>
                    <MunicipalityCombo
                        placeholder={'cadastrapp.requestForm.commune'}
                        additionalStyle={{marginRight: 4}}
                        value={requestFormData?.[fieldName]?.[dataId]?.commune?.label}
                        onSelect={v =>handleSelectChange("commune", v)}
                    />
                    <SectionCombo
                        cgocommune={requestFormData?.[fieldName]?.[dataId]?.commune?.cgocommune}
                        value={{section: requestFormData?.[fieldName]?.[dataId]?.section,
                            plot: isEmpty(requestFormData?.[fieldName]?.[dataId]?.plot) ? null : requestFormData?.[fieldName]?.[dataId]?.plot}}
                        onSelect={(c, v) =>handleSelectChange(c, v)}/>

                    <ProprietaireComboList
                        placeholder={'cadastrapp.requestForm.owner'}
                        disabled={isEmpty(requestFormData?.[fieldName]?.[dataId]?.plot)}
                        section={requestFormData?.[fieldName]?.[dataId]?.section?.ccosec}
                        numero={requestFormData?.[fieldName]?.[dataId]?.section?.plot?.dnupla}
                        commune={requestFormData?.[fieldName]?.[dataId]?.commune?.cgocommune}
                        onSelect={v =>handleSelectChange("proprietaire", v)}
                    />
                </div>
            </div>
        );
    };

    const inputTemplate = () => <div/>;
    const [compRender, setCompRender] = useState(inputTemplate);

    useEffect(()=>{
        switch (value) {
        case "owner-id":
            setFieldName("comptecommunaux");
            setMandatoryFields(["accountId"]);
            setCompRender(ownerId);
            break;
        case "plot":
            setFieldName("parcelles");
            setMandatoryFields(["commune", "section", "plot"]);
            setCompRender(plot);
            break;
        case "co-owners":
            setFieldName("coproprietes");
            setMandatoryFields(["accountId", "plotId"]);
            setCompRender(coOwners);
            break;
        case "plot-id":
            setFieldName("parcelleIds");
            setMandatoryFields(["accountId"]);
            setCompRender(plotId);
            break;
        case "owner":
            setFieldName("proprietaires");
            setMandatoryFields(["commune", "proprietaire"]);
            setCompRender(owner);
            break;
        case "owner-birth-name":
            setFieldName("proprietaires");
            setMandatoryFields(["commune", "proprietaire"]);
            setCompRender(cadastrappDemandei);
            break;
        case "lot-co-owners":
            setFieldName("proprietaireLots");
            setMandatoryFields(["commune", "section", "numero", "proprietaire"]);
            setCompRender(lotCoOwners);
            break;
        default: break;
        }
    }, [value, requestFormData, fieldName, allow, dataId]);

    let handleDelete = () => {
        onDelete(dataId);
        delete requestFormData?.[fieldName]?.[dataId];
        setRequestFormData({...requestFormData});
    };

    const handleChange = (item) => {
        onChange(dataId, item.value);
    };

    return (
        <div className="pull-left" style={{ width: "100%" }}>
            <div className={"request-obj-triple"}>
                <RequestSelect
                    options={requestOptions}
                    value={value}
                    onChange={handleChange}
                />
            </div>
            {compRender}
            <Button className="pull-right" onClick={handleDelete} style={{ margin: 4 }}>
                <Glyphicon glyph="trash"/>
            </Button>
            {!isEmpty(fieldName) && <RequestItemsCheckboxes
                handleOnChange={handleOnChange}
                requestFormData={requestFormData?.[fieldName]?.[dataId] || {}}
            />}
        </div>
    );
}
