import React from 'react';
import Select from 'react-select';

import { Button, FormControl, Glyphicon } from "react-bootstrap";

export default function RequestObjectItem(props) {
    const requestOptions = [
        { value: 'owner-id', label: 'Owner id' },
        { value: 'plot', label: 'Plot' },
        { value: 'co-owners', label: 'co-owners' },
        { value: 'plot-id', label: 'Plot id' },
        { value: 'owner', label: 'Owner' },
        { value: 'cadastrapp-demandei', label: 'cadastrapp.demandei' },
        { value: 'lot-co-owners', label: 'Lot co-owners' }
    ];

    const sectionOptions = [
        { value: '0', label: 'AZ' },
        { value: '1', label: 'NE' }
    ];

    const communeOptions = [
        { value: '0', label: 'AZ' },
        { value: '1', label: 'NE' }
    ];

    const noOptions = [
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' }
    ];

    function ownerId() {
        return (
            <div>
                <FormControl
                    className="pull-left"
                    placeholder="Municipial account id"
                    style={{ height: 34, width: 248, margin: 4 }}
                />
            </div>
        );
    }

    function plot() {
        return (
            <div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="commune"
                        options={communeOptions}
                    />

                </div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="section"
                        options={sectionOptions}/>
                </div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="no"
                        options={noOptions}/>
                </div>
            </div>
        );
    }

    function coOwners() {
        return (
            <div style={{ width: "300" }}>
                <FormControl
                    className="pull-left"
                    placeholder="Municipial account id"
                    style={{ height: 34, width: 120, margin: 4 }}
                />
                <FormControl
                    className="pull-left"
                    placeholder="Plot id"
                    style={{ height: 34, width: 120, margin: 4 }}
                />
            </div>
        );
    }

    function plotId() {
        return (
            <div>
                <FormControl
                    className="pull-left"
                    placeholder="Municipial account id"
                    style={{ height: 34, width: 120, margin: 4 }}
                />
            </div>
        );
    }

    function owner() {
        return (
            <div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="commune"
                        options={communeOptions}
                    />
                </div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="proprietaire"
                        options={sectionOptions}/>
                </div>
            </div>
        );
    }

    function cadastrappDemandei() {
        return (
            <div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="commune"
                        options={communeOptions}
                    />
                </div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="proprietaire"
                        options={sectionOptions}/>
                </div>
            </div>
        );
    }

    function lotCoOwners() {
        return (
            <div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="commune"
                        options={communeOptions}
                    />
                </div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="section"
                        options={sectionOptions}/>
                </div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="no"
                        options={noOptions}/>
                </div>
                <div style={{ width: 120, "float": "left", margin: 4 }}>
                    <Select
                        placeholder="proprietaire"
                        options={sectionOptions}/>
                </div>
            </div>
        );
    }

    let InputTemplate = () => <div></div>;
    switch (props.value) {
    case "owner-id": InputTemplate = ownerId; break;
    case "plot": InputTemplate = plot; break;
    case "co-owners": InputTemplate = coOwners; break;
    case "plot-id": InputTemplate = plotId; break;
    case "owner": InputTemplate = owner; break;
    case "cadastrapp-demandei": InputTemplate = cadastrappDemandei; break;
    case "lot-co-owners": InputTemplate = lotCoOwners; break;
    default: break;
    }

    let handleDelete = () => {
        props.onDelete(props.dataId);
    };

    const handleChange = (item) => {
        props.onChange(props.dataId, item.value);
    };

    return (
        <div className="pull-left" style={{ width: "100%" }}>
            <div
                style={{ width: 120, "float": "left", margin: 4 }}
            >
                <Select
                    options={requestOptions}
                    value={props.value}
                    onChange={handleChange}/>

            </div>
            <InputTemplate/>
            <Button className="pull-right"
                style={{ margin: 4 }}>
                <Glyphicon
                    glyph="trash"
                    onClick={handleDelete}/>
            </Button>
        </div>
    );
}
