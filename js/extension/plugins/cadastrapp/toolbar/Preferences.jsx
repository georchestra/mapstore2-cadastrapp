import React, {useState} from 'react';
import {connect} from 'react-redux';
import { layerStylesSelector } from '../../../selectors/cadastrapp';

import TButton from './TButton';// ["cog", "preferences", "Preferences"],
import PreferencesDialog from '../../../components/modals/Preferences';
import { setLayerStyle, setLayerStyles } from '../../../actions/cadastrapp';


const Dialog = connect(state => ({
    styles: layerStylesSelector(state)
}), {
    setLayerStyle,
    setLayerStyles
})(PreferencesDialog);
/**
 * Implements Preferences button and modal.
 * Allow to set-up preferences.
 */
export default function Preferences() {
    const [isPreferencesModalShown, setPreferencesModalShown] = useState(false);
    return <>
        <TButton glyph="cog" onClick={() => setPreferencesModalShown(true)} />
        <Dialog
            isShown={isPreferencesModalShown}
            onClose={() => setPreferencesModalShown(false)}
        />
    </>;
}
