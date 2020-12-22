
export * from './setup';

// these epics synchronize the vector layer with the current selection
export { syncLayerForPlots } from './layerSync';

// epics that implement map selection
export { cadastrappMapSelection } from './mapSelection';
