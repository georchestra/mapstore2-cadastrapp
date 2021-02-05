import React, {useState} from 'react';
import { connect } from 'react-redux';
import TButton from './TButton';
import RequestFormModal from '../../../components/modals/Request';
import { error } from "@mapstore/actions/notifications";
import { onPrintPDF } from "@js/extension/actions/cadastrapp";
import {getAuthLevel} from "@js/extension/selectors/cadastrapp";
import {DEFAULT_MAX_REQUEST} from "@js/extension/utils/requestForm";

/**
 * Implement request landing form and Modal.
 */

const Modal = connect(state => ({
    allowDocument: state.cadastrapp?.requestFormData?.allowDocument || false,
    maxRequest: state.cadastrapp?.configuration?.maxRequest || DEFAULT_MAX_REQUEST,
    loading: state.cadastrapp?.loadFlags?.printing || false,
    authLevel: getAuthLevel(state)
}), {
    onPrintPDF,
    onError: error
})(RequestFormModal);

export default function RequestLanding() {
    const [isRequestFormShown, setRequestFormShow] = useState(false);
    return (<>
        <TButton glyph="features-grid" onClick={() => { setRequestFormShow(true); }}/>
        <Modal
            isShown={isRequestFormShown}
            onClose={() => setRequestFormShow(false)}
        />
    </>);
}
