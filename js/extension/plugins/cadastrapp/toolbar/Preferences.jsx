import React, {useState} from 'react';
import {connect} from 'react-redux';
import { layerStylesSelector } from '../../../selectors/cadastrapp';

import TButton from './TButton';// ["cog", "preferences", "Preferences"],
import PreferencesModal from '../../../components/modals/PreferencesModal';
import { setLayerStyle } from '../../../actions/cadastrapp';


const Modal = connect(state => ({
    styles: layerStylesSelector(state)
}), {
    setLayerStyle
})(PreferencesModal);
/**
 * Implements Preferences button and modal.
 * Allow to set-up preferences.
 */
export default function Preferences() {
    const [isPreferencesModalShown, setPreferencesModalShown] = useState(false);
    return <>
        <TButton glyph="cog" onClick={() => setPreferencesModalShown(true)} />
        <Modal
            isShown={isPreferencesModalShown}
            onClose={() => setPreferencesModalShown(false)}
        />
    </>;
}
