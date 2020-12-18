import React from 'react';
import PlotsSelectionTable from './table/PlotsSelectionTable';
import {
    Nav,
    Tab,
    ButtonGroup,
    Button,
    Tooltip,
    OverlayTrigger,
    Row,
    Col,
    NavDropdown,
    MenuItem,
    NavItem,
    Glyphicon
} from "react-bootstrap";
import PlotSelectionToolbar from './plot/PlotSelectionToolbar';


function PlotSelectionTabContent({
    selectedPlots,
    onRowsSelected,
    onRowsDeselected,
    ...props
}) {
    return (
        <Col sm={12}>
            <Tab.Content>
                {props.data.map((value, index) => (
                    <Tab.Pane eventKey={index}>
                        <PlotsSelectionTable
                            onRowsSelected={onRowsSelected}
                            onRowsDeselected={onRowsDeselected}
                            selectedKeys={selectedPlots}
                            data={props.data[index]}
                            tableIndex={index}/>
                    </Tab.Pane>
                ))}
            </Tab.Content>
        </Col>
    );
}

function PlotSelectionTabActionButtons({onNewTab = () => {}, onTabDelete = () => {}}) {
    return (
        <ButtonGroup className="pull-right">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Add a new Selection Tab"}</Tooltip>}>
                <Button
                    className="pull-right"
                    onClick={onNewTab}
                ><span className="glyphicon glyphicon-plus"></span>
                </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>{"Delete current Selection Tab"}</Tooltip>}>
                <Button
                    className="pull-right"
                    onClick={onTabDelete}>
                    <Glyphicon glyph="trash" />
                </Button>
            </OverlayTrigger>
        </ButtonGroup>
    );
}

function PlotSelectionTabs({
    active,
    onTabChange,
    data,
    ...props
}) {
    return (
        <Tab.Container
            onSelect={onTabChange}
            activeKey={active}
            defaultActiveKey={active}>
            <Row className="clearfix">
                <Col sm={12}>
                    <Nav bsStyle="tabs">
                        {data.map((value, index) => (
                            <NavItem eventKey={index}>
                                {"Selection " + (index + 1).toString()}
                            </NavItem>
                        ))}
                        <PlotSelectionTabActionButtons {...props} data={data}/>
                    </Nav>
                </Col>
                <PlotSelectionTabContent {...props} data={data}/>
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

export default function PlotsSelection(props) {

    let className = props.data.length === 0 ? "collapse" : "plots-selection";
    let TabComponent = props.data.length > 3 ? PlotSelectionTabsWithDropdown : PlotSelectionTabs;

    return (
        <div className={className}>
            <h3 className="pull-left">Plots Selection</h3>
            <PlotSelectionToolbar {...props}/>
            <TabComponent {...props}/>
        </div>
    );
}
