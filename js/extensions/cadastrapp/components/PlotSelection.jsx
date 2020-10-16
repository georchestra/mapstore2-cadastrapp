import React from 'react';
import {
    Tab,
    ButtonGroup,
    Button,
    Tooltip,
    OverlayTrigger,
    Row,
    Col,
    NavDropdown,
    MenuItem,
    DropdownButton,
    Nav,
    NavItem,
    Glyphicon
} from "react-bootstrap";
import SelectableTable from './table/SelectableTable';


function PlotsSelectionTable(props) {

    const handleRowClick = (index) => {
        props.onRowClick(index, props.tableIndex);
    };

    const handleAllClick = () => {
        props.onAllClick(props.tableIndex);
    };

    const headers = ["Town", "Section", "Cadastrall Addr.", "Plan Number", "Surface DGFIP in m2"];
    const widths = [10, 15, 30, 20, 20];
    return (
        <SelectableTable
            widths={widths}
            data={props.data}
            header={headers}
            onAllClick={handleAllClick}
            onClick={handleRowClick}/>
    );
}

function PlotSelectionTabContent(props) {
    return (
        <Col sm={12}>
            <Tab.Content animation>
                {props.data.map((value, index) => (
                    <Tab.Pane eventKey={index}>
                        <PlotsSelectionTable
                            onAllClick={props.onAllClick}
                            onRowClick={props.onRowClick}
                            data={props.data[index]}
                            tableIndex={index}/>
                    </Tab.Pane>
                ))}
            </Tab.Content>
        </Col>
    );
}

function PlotSelectionTabActionButtons(props) {
    return (
        <ButtonGroup className="pull-right">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Add a new Selection Tab"}</Tooltip>}>
                <Button
                    className="pull-right"
                    onClick={props.onNewTab}
                ><span className="glyphicon glyphicon-plus"></span>
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Delete current Selection Tab"}</Tooltip>}>
                <Button
                    className="pull-right"
                    onClick={props.onTabDelete}>
                    <Glyphicon glyph="trash" />
                </Button>
            </OverlayTrigger>
        </ButtonGroup>
    );
}

function PlotSelectionTabs(props) {
    return (
        <Tab.Container
            onSelect={props.onTabChange}
            activeKey={props.active}
            defaultActiveKey={props.active}>
            <Row className="clearfix">
                <Col sm={12}>
                    <Nav bsStyle="tabs">
                        {props.data.map((value, index) => (
                            <NavItem eventKey={index}>
                                {"Selection " + (index + 1).toString()}
                            </NavItem>
                        ))}
                        <PlotSelectionTabActionButtons {...props}/>
                    </Nav>
                </Col>
                <PlotSelectionTabContent {...props}/>
            </Row>
        </Tab.Container>
    );
}

function PlotSelectionTabsWithDropdown(props) {
    let otherSelectionIndex = props.active + 1;
    if (otherSelectionIndex < 3) {
        otherSelectionIndex = "3+ ";
    }
    return (
        <Tab.Container
            onSelect={props.onTabChange}
            activeKey={props.active}
            defaultActiveKey={props.active}>
            <Row className="clearfix">
                <Col sm={12}>
                    <Nav bsStyle="tabs">
                        <NavItem eventKey={0}>
                            Selection 1
                        </NavItem>
                        <NavItem eventKey={1}>
                            Selection 2
                        </NavItem>
                        <NavDropdown title={"Selection " + otherSelectionIndex}>
                            {props.data.slice(2).map((value, index) => (
                                <MenuItem eventKey={index + 2}>
                                    {"Selection " + (index + 2 + 1).toString()}
                                </MenuItem>
                            ))}
                        </NavDropdown>
                        <PlotSelectionTabActionButtons {...props}/>
                    </Nav>
                </Col>
                <PlotSelectionTabContent {...props}/>
            </Row>
        </Tab.Container>
    );
}

function PlotSelectionTopActionButtons(props) {


    let isAtleastOneSelected = false;
    if (props.data.length > 0) {
        let data = props.data[props.active];
        for (let i = 0; i < data.length; i++) {
            if (data[i][5]) {
                isAtleastOneSelected = true;
                break;
            }
        }
    }

    return (
        <ButtonGroup className="pull-right">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Zoom"}</Tooltip>}>
                <Button
                    onClick={() => { props.onClick("zoom"); }}>
                    <Glyphicon glyph="zoom-in" />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Owned Unit Information"}</Tooltip>}>
                <Button
                    {...(!isAtleastOneSelected ? { disabled: 'true' } : {})}
                    onClick={() => { props.onClick("owned-unit"); }}>
                    <Glyphicon glyph="th-list" />
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Information Form"}</Tooltip>}>
                <Button
                    {...(!isAtleastOneSelected ? { disabled: 'true' } : {})}
                    onClick={() => { props.onClick("information-form"); }}
                ><Glyphicon glyph="info-sign" /></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Export"}</Tooltip>}>
                <DropdownButton
                    {...(!isAtleastOneSelected ? { disabled: 'true' } : {})}
                    pullRight title={<Glyphicon glyph="export" />}>
                    <MenuItem>Plot</MenuItem>
                    <MenuItem>Owners</MenuItem>
                    <MenuItem>Co-owners</MenuItem>
                    <MenuItem>Bundle</MenuItem>
                </DropdownButton>
            </OverlayTrigger>
        </ButtonGroup>
    );
}

export default function PlotsSelection(props) {

    let className = props.data.length === 0 ? "collapse" : "plots-selection";
    let TabComponent = props.data.length > 3 ? PlotSelectionTabsWithDropdown : PlotSelectionTabs;

    return (
        <div className={className}>
            <h3 className="pull-left">Plots Selection</h3>
            <PlotSelectionTopActionButtons {...props}/>
            <TabComponent {...props}/>
        </div>
    );
}
