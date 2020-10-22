import React, {useState} from 'react';
import TButton from './TButton';
import RequestFormModal from '../../../components/modals/Request';

// ["features-grid", "request-form", "Request on landholding trust"],
/**
 * Implement request landing form and Modal.
 */
export default function RequestLanding() {
    const [isRequestFormShown, setRequestFormShow] = useState(false);
    return (<>
        <TButton glyph="features-grid" onClick={() => { setRequestFormShow(true); }}/>
        <RequestFormModal
            isShown={isRequestFormShown}
            onClose={() => setRequestFormShow(false)}/>
        </>);
}
