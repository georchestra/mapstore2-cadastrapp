
import React, { useState } from 'react';
import { Button } from "react-bootstrap";

import WelcomeMessage from './modals/Welcome';
import MainToolbar from './MainToolbar';
import CoownershipSearch from './search/CoownershipSearch';
import OwnersSearch from './search/OwnersSearch';
import InformationFormModal from './Information';
import PlotsSelection from './PlotSelection';
import PlotsSearch from './search/PlotSearch';
import RequestFormModal from './modals/Request';
import PreferencesModal from './modals/PreferencesModal';

// dummy stuff
import { randomPlot } from './dummy';


export default function Main({
    enabled,
    onClose = () => {}
}) {

    let [isWelcomeShown, setIsWelcomeShown] = useState(true);
    let [isRequestFormShown, setIsRequestFormShown] = useState(false);
    let [isInformationFormShown, setIsInformationFormShown] = useState(false);
    let [isPreferencesModalShown, setIsPreferencesModalShown] = useState(false);
    let [isPlotsSearchShown, setIsPlotsSearchShown] = useState(false);
    let [isOwnersSearchShown, setIsOwnersSearchShown] = useState(false);
    let [isCoownershipSearchShown, setIsCoownershipSearchShown] = useState(false);
    let [isPlotSelectionShown, setIsPlotSelectionShown] = useState(false);

    let [activeToolbar, setActiveToolbar] = useState("");
    let [activeSelectionTab, setActiveSelectionTab] = useState(0);
    let [plotSelectionData, setPlotSelectionData] = useState([]);
    // let [selectedBuildings, setSelectedBuildings] = useState({});
    let [expandedPanel, setExpandedPanel] = useState({});
    let [searchIndices, setSearchIndices] = useState({ "owner": -1, "co-owner": -1, "plot": -1 });


    const handlePlotsZoom = () => {
        alert("The user clicks on a selection zoom");
    };

    const handlePlotsClear = () => {
        setPlotSelectionData([]);
    };

    const handleRequestFormClose = () => {
        setIsRequestFormShown(false);
    };

    const handleInformationFormClose = () => {
        setIsInformationFormShown(false);
        setExpandedPanel({});
    };

    const handleBuildingRowClick = (tabIndex, plotIndex, buildingIndex) => {

    };

    const handleCoOwnerRowClick = () => {

    };

    const handleOwnerRowClick = () => {

    };


    const handlePanelExpand = (index) => {
        let exp = { ...expandedPanel };
        if (exp[index]) {
            exp[index] = false;
        } else {
            exp[index] = true;
        }
        setExpandedPanel(exp);
    };

    const handlePreferencesModalClose = () => {
        setIsPreferencesModalShown(false);
    };

    const handleInformationFormOpen = (plotData) => {
        setIsInformationFormShown(true);
    };

    const handlePlotsSearch = (searchParameters) => {
        alert("Plot search is executed, random data is appended to plots selection");
        let selectionData = plotSelectionData.slice();
        let indices = { ...searchIndices };

        if (searchIndices.plot === -1) {
            selectionData.push([randomPlot()]);
            indices.plot = selectionData.length - 1;
            setPlotSelectionData(selectionData);
            setSearchIndices(indices);
            setActiveSelectionTab(selectionData.length - 1);
        } else {
            let index = searchIndices.plot;
            selectionData[index].push(randomPlot());
            setPlotSelectionData(selectionData);
            setActiveSelectionTab(index);
        }
    };

    const handleOwnersSearch = (searchParameters) => {
        alert("Owner search is executed");
        let selectionData = plotSelectionData.slice();
        let indices = { ...searchIndices };

        if (searchIndices.owner === -1) {
            selectionData.push([randomPlot()]);
            indices.owner = selectionData.length - 1;
            setPlotSelectionData(selectionData);
            setSearchIndices(indices);
            setActiveSelectionTab(selectionData.length - 1);
        } else {
            let index = searchIndices.owner;
            selectionData[index].push(randomPlot());
            setPlotSelectionData(selectionData);
            setActiveSelectionTab(index);
        }

    };

    const handleCoownershipSearch = (searchParameters) => {
        alert("Coownership search is executed");
        let selectionData = plotSelectionData.slice();
        let indices = { ...searchIndices };

        if (searchIndices["co-owner"] === -1) {
            selectionData.push([randomPlot()]);
            indices["co-owner"] = selectionData.length - 1;
            setPlotSelectionData(selectionData);
            setSearchIndices(indices);
            setActiveSelectionTab(selectionData.length - 1);
        } else {
            let index = searchIndices["co-owner"];
            selectionData[index].push(randomPlot());
            setPlotSelectionData(selectionData);
            setActiveSelectionTab(index);
        }
    };

    const handleToolbarClick = (action) => {

        let url;
        let selectionData = plotSelectionData.slice();
        switch (action) {

        case "zoom":
            alert("The user clicked on zoom");
            break;

        case "select-by-point":
            alert("The user selected a plot by a point tool. Adding (1) random to plot data to 'Plots Selection' section");
            if (selectionData.length === 0) {selectionData = [[]];}
            selectionData[activeSelectionTab].push(randomPlot());
            setPlotSelectionData(selectionData);
            break;

        case "select-by-linestring":
            if (selectionData.length === 0) {selectionData = [[]];}

            alert("The user selected a plot by a linestring tool. Adding (2) random to plot data to 'Plots Selection' section");
            selectionData[activeSelectionTab].push(randomPlot());
            selectionData[activeSelectionTab].push(randomPlot());
            setPlotSelectionData(selectionData);
            break;

        case "select-by-polygon":
            if (selectionData.length === 0) {selectionData = [[]];}

            alert("The user selected a plot by a polygon tool. Adding (3) random to plot data to 'Plots Selection' section");
            selectionData[activeSelectionTab].push(randomPlot());
            selectionData[activeSelectionTab].push(randomPlot());
            selectionData[activeSelectionTab].push(randomPlot());
            setPlotSelectionData(selectionData);
            break;

        case "unit-de-fonc":
            alert("The user clicks on a selection zoom in the map and he is redirected an external web page in a new browser tab");
            url = "https://portail.sig.rennesmetropole.fr/mapfishapp/ws/addons/cadastrapp/html/ficheUniteFonciere.html";
            window.open(url, '_blank');
            break;

        case "search-plots":
            setActiveToolbar("search-plots");
            setIsPlotsSearchShown(true);
            setIsOwnersSearchShown(false);
            setIsCoownershipSearchShown(false);
            setIsWelcomeShown(false);
            break;

        case "search-owners":
            setActiveToolbar("search-owners");
            setIsOwnersSearchShown(true);
            setIsPlotsSearchShown(false);
            setIsCoownershipSearchShown(false);
            setIsWelcomeShown(false);
            break;

        case "coownership":
            setActiveToolbar("coownership");
            setIsCoownershipSearchShown(true);
            setIsPlotsSearchShown(false);
            setIsOwnersSearchShown(false);
            setIsWelcomeShown(false);
            break;

        case "request-form":
            setIsRequestFormShown(true);
            break;

        case "preferences":
            setIsPreferencesModalShown(true);
            break;

        case "help":
            url = "https://portail.sig.rennesmetropole.fr/actus/aide/cadastre";
            window.open(url, '_blank');
            break;
        default:
            break;
        }
    };

    const handlePlotsSelectionClick = (action) => {
        switch (action) {
        case "information-form":
            setIsInformationFormShown(true);
            break;
        case "export":
            alert("Selection export is clicked");
            break;
        case "zoom":
            alert("Selection zoom is clicked");
            break;
        case "landry":
            alert("You clicked on landry information button, you will redirecting an external service in a new tab");
            let url = "https://portail.sig.rennesmetropole.fr/mapfishapp/ws/addons/cadastrapp/html/ficheUniteFonciere.html";
            window.open(url, '_blank');
            break;
        default:
            break;
        }
    };

    const handlePlotsSelectionDeleteTab = () => {

        let index = activeSelectionTab;

        let selectionData = plotSelectionData.slice();

        let indices = { ...searchIndices };
        if (indices.plot === index) {
            indices.plot = -1;
        }
        if (indices.owner === index) {
            indices.owner = -1;
        }
        if (indices["co-owner"] === index) {
            indices["co-owner"] = -1;
        }
        if (index < indices.plot) indices.plot--;
        if (index < indices.owner) indices.owner--;
        if (index < indices["co-owner"]) indices["co-owner"]--;

        selectionData.splice(index, 1);

        setSearchIndices(indices);
        setPlotSelectionData(selectionData);
        let active = selectionData.length - 1;
        active = active < 0 ? 0 : active;
        setActiveSelectionTab(active);
    };

    const handlePlotsSelectionNewTab = () => {
        let selectionData = plotSelectionData.slice();
        selectionData.push([[]]);
        setPlotSelectionData(selectionData);
        setActiveSelectionTab(selectionData.length - 1);
    };

    const handleAllRowClick = (tableIndex) => {
        let selectionData = plotSelectionData.slice();

        let data = selectionData[tableIndex];
        let allSelected = true;

        for (let i = 0; i < data.length; i++) {
            if (!data[i][data[i].length - 1]) {allSelected = false;}
        }

        if (allSelected) {
            for (let i = 0; i < data.length; i++) {
                data[i][data[i].length - 1] = false;
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i][data[i].length - 1] = true;
            }
        }
        setPlotSelectionData(selectionData);
    };

    const handleRowClick = (rowIndex, tableIndex) => {
        let selectionData = plotSelectionData.slice();
        selectionData[tableIndex][rowIndex][5] = !selectionData[tableIndex][rowIndex][5];
        setPlotSelectionData(selectionData);
    };

    const handlePlotsSelectionTabChange = (tabIndex) => {
        setActiveSelectionTab(tabIndex);
    };

    let className = enabled ? "cadastrapp" : "collapse";
    return (
        <div className={className}>
            <MainToolbar
                onClick={handleToolbarClick}
                selected={activeToolbar}
            />
            <div className="top">
                <h4>Cadastrapp</h4>
                <Button
                    onClick={() => onClose()}
                    bsStyle="primary"
                    className="square-button ms-close pull-right">
                    <span className="glyphicon glyphicon-1-close"></span>
                </Button>
            </div>
            <div className="right-side pull-left">
                <WelcomeMessage
                    isShown={isWelcomeShown}
                    data={plotSelectionData}
                />
                <PlotsSearch
                    isShown={isPlotsSearchShown}
                    onSearch={handlePlotsSearch}
                />
                <OwnersSearch
                    isShown={isOwnersSearchShown}
                    onSearch={handleOwnersSearch}
                />
                <CoownershipSearch
                    isShown={isCoownershipSearchShown}
                    onSearch={handleCoownershipSearch}
                />
                <PlotsSelection
                    isShown={isPlotSelectionShown}
                    onInformationForm={handleInformationFormOpen}
                    onZoom={handlePlotsZoom}
                    onClear={handlePlotsClear}
                    onClick={handlePlotsSelectionClick}
                    onTabDelete={handlePlotsSelectionDeleteTab}
                    onTabChange={handlePlotsSelectionTabChange}
                    onNewTab={handlePlotsSelectionNewTab}
                    onAllClick={handleAllRowClick}
                    onRowClick={handleRowClick}
                    data={plotSelectionData}
                    active={activeSelectionTab}
                />
                <RequestFormModal
                    isShown={isRequestFormShown}
                    onClose={handleRequestFormClose}
                />
                <InformationFormModal
                    expanded={expandedPanel}
                    active={activeSelectionTab}
                    data={plotSelectionData}
                    isShown={isInformationFormShown}
                    onBuildingRowClick={handleBuildingRowClick}
                    onClose={handleInformationFormClose}
                    onPanelExpand={handlePanelExpand}
                />
                <PreferencesModal
                    isShown={isPreferencesModalShown}
                    onClose={handlePreferencesModalClose}
                />
            </div>
        </div>
    );
}
