
import React, { useState } from 'react';

import WelcomeMessage from './modals/Welcome';

import InformationFormModal from './Information';
import PlotsSelection from './PlotSelection';

import SearchSection from './search/SearchSection';

// dummy stuff
import { randomPlot } from './dummy';


export default function Main({
    selectedSearchTool
}) {


    let [isInformationFormShown, setIsInformationFormShown] = useState(false);

    let [isPlotSelectionShown, setIsPlotSelectionShown] = useState(false);

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

    const handleInformationFormClose = () => {
        setIsInformationFormShown(false);
        setExpandedPanel({});
    };

    const handleBuildingRowClick = (tabIndex, plotIndex, buildingIndex) => {

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
        case "owned-unit":
                alert("You clicked on owned unit information button, you will redirecting an external service in a new tab");
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

    return (

        <div className="right-side pull-left">
            <WelcomeMessage
                isShown={!selectedSearchTool && !isPlotSelectionShown}
                data={plotSelectionData}
            />
            <SearchSection
                selectedSearchTool={selectedSearchTool}
                handlePlotsSearch={handlePlotsSearch}
                handleOwnersSearch={handleOwnersSearch}
                handleCoownershipSearch={handleCoownershipSearch}
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
            <InformationFormModal
                expanded={expandedPanel}
                active={activeSelectionTab}
                data={plotSelectionData}
                isShown={isInformationFormShown}
                onBuildingRowClick={handleBuildingRowClick}
                onClose={handleInformationFormClose}
                onPanelExpand={handlePanelExpand}
            />
        </div>
    );
}
