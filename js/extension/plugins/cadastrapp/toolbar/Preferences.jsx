import React, {useState} from 'react';
import TButton from './TButton';// ["cog", "preferences", "Preferences"],
import PreferencesModal from '../../../components/modals/PreferencesModal';

/**
 * Implements Preferences button and modal.
 * Allow to set-up preferences.
 */
export default function Preferences() {
    const [isPreferencesModalShown, setPreferencesModalShown] = useState(false);
    return <>
        <TButton glyph="cog" onClick={() => setPreferencesModalShown(true)} />
        <PreferencesModal
            isShown={isPreferencesModalShown}
            onClose={() => setPreferencesModalShown(false)}
        />
    </>;
}
