
import React from 'react';
import { connect } from 'react-redux';

import { CADASTRAPP_RASTER_LAYER_ID } from '../../constants';

import {createSelector, createStructuredSelector} from 'reselect';
import LandedPropertyInformationModal from '../../components/landedproperty/Modal';
import { layersSelector } from '@mapstore/selectors/layers';
import { additionalLayersSelector } from '@mapstore/selectors/additionallayers';

import { mapSelector } from '@mapstore/selectors/map';
import { configurationSelector, landedPropertyParcelleSelector, getSelectedStyle } from '../../selectors/cadastrapp';
import { showLandedPropertyInformation } from '../../actions/cadastrapp';


const mapLayersSelector = createSelector(
    layersSelector,
    additionalLayersSelector,
    landedPropertyParcelleSelector,
    getSelectedStyle,
    (l1 = [], additionaLayers = [], parcelle, style) => ([
        ...l1,
        // raster layer
        ...additionaLayers.filter(({ id }) => id === CADASTRAPP_RASTER_LAYER_ID).map(({options}) => options),
        // vector layer to highlight the current parcelle
        {
            id: 'vector-layer',
            features: [{
                ...(parcelle?.feature ?? {}),
                style
            }],
            type: "vector",
            name: "searchPoints",
            visibility: true
        }])
);
const LandedProperty = connect(createStructuredSelector({
    parcelle: landedPropertyParcelleSelector,
    show: landedPropertyParcelleSelector,
    layers: mapLayersSelector,
    map: mapSelector,
    configuration: configurationSelector
}), {
    onClose: () => showLandedPropertyInformation(undefined)
})((props) => {
    if (!props.show) {
        return null;
    }
    return <LandedPropertyInformationModal {...props} />;
});

export default LandedProperty;
