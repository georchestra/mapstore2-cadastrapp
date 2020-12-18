import React, {useState } from 'react';
import Select from 'react-select';
import {
    Tabs,
    Tab,
    Table,
    ButtonGroup,
    Button,
    Tooltip,
    OverlayTrigger,
    Radio,
    FormGroup,
    Panel,
    Glyphicon
} from "react-bootstrap";

import Modal from '@mapstore/components/misc/Modal';


import SelectableTable from './table/SelectableTable';
import { SingleSelectableTable } from './table/SingleSelectableTable';


function InformationFormPlotInformationRadio(props) {

    let className = props.isShown ? "" : "collapse";

    return (
        <div className={className}>
            <hr></hr>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Owners Information: </b>
                    <Radio name="radioGroup" inline>
                        Without owner
                    </Radio>
                    <Radio name="radioGroup" inline>
                        With owner
                    </Radio>
                </FormGroup>
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Choose basemap:</b>
                    <div style={{ "float": "left" }}>
                        <Select style={{ width: 120, marginTop: -5 }} options={
                            [
                                { value: '0', label: 'Cadastre' },
                                { value: '1', label: 'Cadastre Noir et blanc' }

                            ]}/>
                    </div>
                </FormGroup>
            </div>
            <div
                style={{ width: "30%" }}
                className="pull-left">
                <Button
                    className="pull-right">Cadastrapp.generate</Button>
            </div>
            <hr></hr>
        </div>);
}

function InformationFormPropertyListRadio(props) {

    let className = props.isShown ? "" : "collapse";

    return (
        <div className={className}>
            <hr></hr>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Data to extract: </b>
                    <Radio name="radioGroup" inline>
                        Only this plot
                    </Radio>
                    <Radio name="radioGroup" inline>
                        All Properties
                    </Radio>
                </FormGroup>
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Choose output format:</b>
                    <Radio name="radioGroup" inline>
                        Export as PDF
                    </Radio>
                    <Radio name="radioGroup" inline>
                        Export as CSV
                    </Radio>
                </FormGroup>
            </div>
            <div
                style={{ width: "30%" }}
                className="pull-left">
                <Button
                    className="pull-right">Cadastrapp.generate</Button>
            </div>
            <hr></hr>
        </div>);
}

function InformationFormBundleRadio(props) {

    let className = props.isShown ? "" : "collapse";

    return (
        <div className={className}>
            <hr></hr>
            <div
                style={{ width: "70%" }}
                className="pull-left">
                <FormGroup>
                    <b style={{ "float": "left", width: 150, marginRight: 15 }}>Choose output format:</b>
                    <Radio name="radioGroup" inline>
                        Export as PDF
                    </Radio>
                    <Radio name="radioGroup" inline>
                        Export as CSV
                    </Radio>
                </FormGroup>
            </div>
            <div
                style={{ width: "30%" }}
                className="pull-left">
                <Button
                    className="pull-right">Cadastrapp.generate</Button>
            </div>
            <hr></hr>
        </div>);
}


function InformationFormBuildingsButtons(props) {

    return (
        <>
            <ButtonGroup className="pull-right">
                <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Properties List"}</Tooltip>}>
                    <Button
                        bsStyle={props.propertiesSelected ? "primary" : "default"}
                        onClick={props.onPropertiesClick}>
                        <Glyphicon glyph="th-list" />
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Description"}</Tooltip>}>
                    <Button
                        onClick={props.onDescriptionClick}
                        {...(!props.rowSelected ? { disabled: 'true' } : {})}>
                        <Glyphicon glyph="info-sign" />
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Bundle"}</Tooltip>}>
                    <Button
                        bsStyle={props.bundleSelected ? "primary" : "default"}
                        onClick={props.onBundleClick}>
                        <Glyphicon glyph="compressed" /></Button>
                </OverlayTrigger>
            </ButtonGroup>
        </>
    );
}

function InformationFormOwnersContent() {

    const headers = ["Identifier", "Identifier", "Last Name", "Address",
        "Date of birth", "Birth Location", "Right Code", "legal form"];

    const widths = [9, 12, 17, 18, 8, 8, 14, 9];

    let [data, setData] = useState([
        ["P", "350231+13232", "COMMUNE DE RENNES", "SERVICES IMMOBIL CS63123 PLE DE LA MAIRIE", "", "", "PROPRIETAIRE", "COM", false],
        ["P", "350231+13232", "COMMUNE DE RENNES", "SERVICES IMMOBIL CS63123 PLE DE LA MAIRIE", "", "", "PROPRIETAIRE", "COM", false],
        ["P", "350231+13232", "COMMUNE DE RENNES", "SERVICES IMMOBIL CS63123 PLE DE LA MAIRIE", "", "", "PROPRIETAIRE", "COM", false]
    ]);

    let [isShown, setIsShown] = useState(false);

    const handleRowClick = (index) => {
        let d = data.slice();
        d[index][d[index].length - 1] = !d[index][d[index].length - 1];
        setData(d);
    };

    const handleAllClick = () => {
        let d = data.slice();

        let allSelected = true;

        for (let i = 0; i < d.length; i++) {
            if (!d[i][d[i].length - 1]) {
                allSelected = false;
            }
        }

        if (allSelected) {
            for (let i = 0; i < d.length; i++) {
                d[i][d[i].length - 1] = false;
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                d[i][d[i].length - 1] = true;
            }
        }
        setData(d);
    };

    let atLeastOneSelected = false;
    for (let i = 0; i < data.length; i++) {
        if (data[i][data[i].length - 1]) {
            atLeastOneSelected = true;
        }
    }

    if (isShown) {
        atLeastOneSelected = true;
    }


    const handleClick = () => {
        setIsShown(!isShown);
    };

    return (
        <>
            <div style={{ margin: 10 }}>
                <Button
                    bsStyle={isShown ? "primary" : "default"}
                    onClick={handleClick}
                    {...(!atLeastOneSelected ? { disabled: 'true' } : {})}>
                    <Glyphicon style={{ marginRight: 4 }} glyph="1-pdf"/>
                    Properties List
                </Button>
            </div>
            <InformationFormPropertyListRadio isShown={isShown}/>
            <SelectableTable
                header={headers}
                widths={widths}
                data={data}
                onClick={handleRowClick}
                onAllClick={handleAllClick}
            />
        </>
    );
}

function InformationFormModalContent() {

    let [propertiesSelected, setPropertiesSelected] = useState(false);
    let [bundleSelected, setBundleSelected] = useState(false);
    let [buildingTableData, setBuildingTableData] = useState([
        ["00", "01", "Habitation", "1954", "1502", "35028763271", "M MARTIN ANDRE", false],
        ["00", "01", "Habitation", "1954", "1502", "35028763271", "M MARTIN ANDRE", false],
        ["00", "01", "Habitation", "1954", "1502", "35028763271", "M MARTIN ANDRE", false],
        ["00", "01", "Habitation", "1954", "1502", "35028763271", "M MARTIN ANDRE", false]
    ]);

    let [isPlotShown, setIsPlotShown] = useState(false);
    const handlePlotClick = () => {
        setIsPlotShown(!isPlotShown);
    };

    const onPropertiesClick = () => {
        setBundleSelected(false);
        setPropertiesSelected(!propertiesSelected);
    };

    const onBundleClick = () => {
        setPropertiesSelected(false);
        setBundleSelected(!bundleSelected);
    };

    const onDescriptionClick = () => {
        alert("A row selected and description button is clicked, this will open a floating window that shows more info related to building");
    };

    const buildingTableHeaders = ["Level", "Door", "Type", "Cre", "Income",
        "Identifier", "Usage Name"];

    const buildingTableWidths = [13, 13, 13, 13, 13, 13, 17];

    const handleBuildingRowClick = (index) => {

        let d = buildingTableData.slice();

        if (d[index][d[index].length - 1]) {d[index][d[index].length - 1] = false;} else {
            for (let i = 0; i < d.length; i++) {
                d[i][d[i].length - 1] = false;
            }

            d[index][d[index].length - 1] = true;
        }

        setBuildingTableData(d);
    };

    const handleBuildingRowDoubleClick = (index) => {
        let d = buildingTableData.slice();

        for (let i = 0; i < d.length; i++) {
            d[i][d[i].length - 1] = false;
        }

        d[index][d[index].length - 1] = true;
        setBuildingTableData(d);
        onDescriptionClick();
    };

    let atLeastOnebuildingRowSelected = false;
    for (let i = 0; i < buildingTableData.length; i++) {
        if (buildingTableData[i][buildingTableData[i].length - 1]) {atLeastOnebuildingRowSelected = true;}
    }
    return (
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="Plot">
                <div style={{ margin: 10 }}>
                    <Button
                        bsStyle={isPlotShown ? "primary" : "default"}
                        onClick={handlePlotClick}>
                        <Glyphicon style={{ marginRight: 4 }} glyph="1-pdf"/>
                    Plot Information
                    </Button>
                </div>
                <InformationFormPlotInformationRadio isShown={isPlotShown}/>
                <Table condensed>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Valeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Town</td><td>Rennes(359329)</td></tr>
                        <tr><td>Section</td><td>AP</td></tr>
                        <tr><td>Plot</td><td>851</td></tr>
                        <tr><td>Voie</td><td>5162</td></tr>
                        <tr><td>Address</td><td>RUEJULIEN OFFRAY D LA METTRIE</td></tr>
                        <tr><td>Size DGFIP in m2</td><td>277</td></tr>
                        <tr><td>Size in m2</td><td>288</td></tr>
                        <tr><td>Plot with building</td><td>no</td></tr>
                        <tr><td>Plot with building</td><td>no</td></tr>
                    </tbody>
                </Table>
            </Tab>
            <Tab eventKey={2} title="Owners">
                <InformationFormOwnersContent/>
            </Tab>
            <Tab eventKey={3} title="Co-Owners">
                <InformationFormOwnersContent/>
            </Tab>
            <Tab eventKey={4} title="Building(s)">
                <div style={{ margin: 10 }}>
                    <span style={{ marginRight: 10 }}>Batiments:</span>
                    <Button>A</Button>
                    <Button>B</Button>
                    <InformationFormBuildingsButtons
                        rowSelected={atLeastOnebuildingRowSelected}
                        propertiesSelected={propertiesSelected}
                        bundleSelected={bundleSelected}
                        onPropertiesClick={onPropertiesClick}
                        onBundleClick={onBundleClick}
                        onDescriptionClick={onDescriptionClick}
                        className="pull-left"/>
                </div>
                <InformationFormPropertyListRadio
                    isShown={propertiesSelected}/>
                <InformationFormBundleRadio
                    isShown={bundleSelected}/>
                <SingleSelectableTable
                    widths={buildingTableWidths}
                    data={buildingTableData}
                    header={buildingTableHeaders}
                    onDoubleClick={handleBuildingRowDoubleClick}
                    onClick={handleBuildingRowClick}/>
            </Tab>
            <Tab eventKey={5} title="Subdivisions Fiscales">
                <Table condensed>
                    <thead>
                        <tr>
                            <th>Lettre Indicative</th>
                            <th>Contenance</th>
                            <th>Nature de culture</th>
                            <th>Revenu au 01/01</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td></td><td>466</td><td>Sol, Sols</td><td>0</td></tr>
                    </tbody>
                </Table>
            </Tab>
            <Tab eventKey={6} title="Mutation History">
                <Table condensed>
                    <thead>
                        <tr>
                            <th>Date Acte</th>
                            <th>Reference de la parcelle mere</th>
                            <th>Type de mutation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>30/09/1988</td><td>238 AC 0958</td><td>Division</td></tr>
                    </tbody>
                </Table>
            </Tab>
        </Tabs>
    );
}

export default function InformationFormModal(props) {

    const handleClick = (index) => {
        props.onPanelExpand(index);
    };

    let tab = props.data[props.active];
    let items = [];

    if (typeof tab !== "undefined") {
        for (let i = 0; i < tab.length; i++) {
            if (tab[i][5]) {items.push(tab[i][0] + tab[i][1] + tab[i][2]);}
        }
    }

    return (
        <Modal
            style={{ maxHeight: "100%", overflowY: "auto" }}
            dialogClassName="cadastrapp-modal cadastrapp-information-modal"
            show={props.isShown}
            onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Information Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {items.map((r, index) => {
                    let className = props.expanded[index] ? "selected-panel" : "unselected-panel";
                    let header = <div className={className} onClick={() => { handleClick(index); }}>{r}</div>;
                    return (
                        <Panel
                            className="mapstore-side-card ms-sm"
                            collapsible
                            eventKey={index.toString()}
                            header={header}>
                            <InformationFormModalContent/>
                        </Panel>
                    );
                })}
            </Modal.Body>
        </Modal>
    );
}
