import React from 'react';
import PlotsSelectionTable from './table/PlotsSelectionTable';
import Spinner from "react-spinkit";
import Message from '@mapstore/components/I18N/Message';

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
    loading,
    loadInfo,
    selectedPlots,
    onRowsSelected,
    onRowsDeselected,
    ...props
}) {
    return (
        <Col sm={12}>
            <Tab.Content
                unmountOnExit>
                {props.data.map((value, index) => (
                    <Tab.Pane eventKey={index}>
                        <PlotsSelectionTable
                            onRowDoubleClick={(i, row) => loadInfo([row.parcelle])}
                            onRowsSelected={onRowsSelected}
                            onRowsDeselected={onRowsDeselected}
                            selectedKeys={selectedPlots}
                            data={props.data[index]}
                            tablloadingeIndex={index}/>
                        <div style={{height: 25}}>
                            <span style={{ "float": "right" }}>
                                {props.data?.[index]?.length ?? 0} <Message msgId="cadastrapp.parcelle.result.items" msgParams={{ number: props.data?.[index]?.length ?? 0 }} />&nbsp;
                                ({selectedPlots?.length ?? 0} <Message msgId="cadastrapp.parcelle.result.selected" msgParams={{ number: selectedPlots?.length ?? 0}} />)
                            </span>
                            {loading ? <Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /> : null}
                        </div>
                    </Tab.Pane>
                ))}
            </Tab.Content>
        </Col>
    );
}

function PlotSelectionTabActionButtons({onNewTab = () => {}}) {
    return (
        <ButtonGroup className="plotSelectionTabActionButtons">
            <OverlayTrigger placement="bottom" overlay={<Tooltip><Message msgId={'cadastrapp.search.addTab'}/></Tooltip>}>
                <Button
                    onClick={onNewTab}
                ><span className="glyphicon glyphicon-plus"></span>
                </Button>
            </OverlayTrigger>
        </ButtonGroup>
    );
}

function PlotTabs({
    active,
    onTabChange,
    data,
    plots,
    onTabDelete = (index) => {index},
    onRowsSelected,
    ...props
}) {

    const MAX_TABS = 3; // max number of tabs
    const getPlotTitle = (plot, index) => {
        return plot?.title ?? ("Selection " + (index + 1).toString());
    };
    return (
        <Tab.Container
            onSelect={onTabChange}
            activeKey={active}
            defaultActiveKey={active}>
            <Row className="clearfix">
                <Col sm={12}>
                    <Nav bsStyle="tabs" className={plots.length >= MAX_TABS ? "full" : ""}>
                        {plots.slice(0, plots.length > MAX_TABS ? MAX_TABS - 1 : MAX_TABS).map((plot, index) => (
                            <NavItem role="tab" eventKey={index} href="javascript:void(0)" className="plotPanel">
                                {getPlotTitle(plot, index)}
                                <OverlayTrigger placement="bottom" overlay={<Tooltip><Message msgId={'cadastrapp.search.deleteTab'}/></Tooltip>}>
                                    <ConfirmButton
                                        confirmContent={<Message msgId={'cadastrapp.search.confirmDeleteTab'}/>}
                                        onClick={() => {onTabDelete(index);}}>
                                        <Glyphicon glyph="remove" />
                                    </ConfirmButton>
                                </OverlayTrigger>
                            </NavItem>
                        ))}
                        {plots.length > MAX_TABS
                            ? <NavDropdown title={active < MAX_TABS - 1 ? "More..." : getPlotTitle(plots[active], active)}>
                                {plots.slice(MAX_TABS - 1).map((plot, index) => (
                                    <MenuItem eventKey={index + MAX_TABS - 1} href="javascript:void(0)" className="plotPanel">
                                        {getPlotTitle(plot, index + MAX_TABS - 1)}
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip><Message msgId={'cadastrapp.search.deleteTab'}/></Tooltip>}>
                                            <ConfirmButton
                                                confirmContent={<Message msgId={'cadastrapp.search.confirmDeleteTab'}/>}
                                                onClick={() => {onTabDelete(index);}}>
                                                <Glyphicon glyph="remove" />
                                            </ConfirmButton>
                                        </OverlayTrigger>
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

export default function PlotSelection(props) {

    let className = props.data.length === 0 ? "collapse" : "plots-selection";

    return (
        <div className={className}>
            <h3 className="pull-left"><Message msgId={"cadastrapp.parcelle.result.title"}/></h3>
            <PlotSelectionToolbar {...props}/>
            <PlotTabs {...props}/>
        </div>
    );
}
