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
import ConfirmButton from './misc/ConfirmButton';


function PlotSelectionTabContent({
    loadInfo,
    selectedPlots,
    onRowsSelected,
    onRowsDeselected,
    ...props
}) {
    // mountOnEnter, unmountOnExit are used to workaround some conflicts with click event on "select all" checkbox of the react-data-grid table.
    // Without it the event on a second tab triggers the event of the first tab.
    return (
        <Col sm={12}>
            <Tab.Content
                mountOnEnter
                unmountOnExit>
                {props.data.map((value, index) => (
                    <Tab.Pane eventKey={index}>
                        <PlotsSelectionTable
                            onRowDoubleClick={(i, row) => loadInfo([row.parcelle])}
                            onRowsSelected={onRowsSelected}
                            onRowsDeselected={onRowsDeselected}
                            selectedKeys={selectedPlots}
                            data={props.data[index]}
                            tableIndex={index}/>
                        <div>
                            {props.data?.[index]?.length ?? 0} Items ({selectedPlots?.length ?? 0} Selected)
                        </div>
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
                <ConfirmButton
                    className="pull-right"
                    confirmContent="Are you sure you want to delete the selected tab"
                    onClick={onTabDelete}>
                    <Glyphicon glyph="trash" />
                </ConfirmButton>
            </OverlayTrigger>
        </ButtonGroup>
    );
}

function PlotTabs({
    active,
    onTabChange,
    data,
    plots,
    ...props
}) {

    const MAX_TABS = 3; // max number of tabs
    const getPlotTitle = (plot, index) => {
        return plot?.title ?? ("Selection " + (index + 1).toString());
    }
    return (
        <Tab.Container
            onSelect={onTabChange}
            activeKey={active}
            defaultActiveKey={active}>
            <Row className="clearfix">
                <Col sm={12}>
                    <Nav bsStyle="tabs">
                        {plots.slice(0, plots.length > MAX_TABS ? MAX_TABS - 1 : MAX_TABS).map((plot, index) => (
                            <NavItem role="tab" eventKey={index}>
                                {getPlotTitle(plot, index)}
                            </NavItem>
                        ))}
                        {plots.length > MAX_TABS
                            ? <NavDropdown title={active < MAX_TABS - 1 ? "More..." : getPlotTitle(plots[active], active)}>
                                {plots.slice(MAX_TABS - 1).map((plot, index) => (
                                    <MenuItem eventKey={index + MAX_TABS - 1}>
                                        {getPlotTitle(plot, index + MAX_TABS - 1)}
                                    </MenuItem>
                                ))}
                            </NavDropdown>
                            : null}
                        <PlotSelectionTabActionButtons {...props} data={data} />
                    </Nav>
                </Col>
                <PlotSelectionTabContent {...props} data={data} />
            </Row>
        </Tab.Container>
    );
}

export default function PlotsSelection(props) {

    let className = props.data.length === 0 ? "collapse" : "plots-selection";

    return (
        <div className={className}>
            <h3 className="pull-left">Plots Selection</h3>
            <PlotSelectionToolbar {...props}/>
            <PlotTabs {...props}/>
        </div>
    );
}
