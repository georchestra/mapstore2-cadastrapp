
export * from './setup';

// these epics synchronize the vector layer with the current selection
export { syncLayerForPlots, zoomToExtentAllResultsEpic } from './layerSync';

// epics that implement map selection
export { cadastrappMapSelection } from './mapSelection';

export { cadastrappZoomToSelection } from './events';

export { cadastrappSearch } from './search';

export { loadParcelleInformationData } from './information';
