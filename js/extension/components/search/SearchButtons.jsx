import React from 'react';
import Spinner from "react-spinkit";
import Message from '@mapstore/components/I18N/Message';
import { Button, ButtonGroup, Glyphicon } from "react-bootstrap";


export default function({
    loading, valid, onClear = () => {}, onSearch = () => {}
}) {
    return (<ButtonGroup style={{ margin: "10px", "float": "right" }}>
        {loading ? <Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /> : null}
        <Button
            onClick={onClear}
        ><Message msgId={'cadastrapp.search.clear'}/> </Button>
        <Button
            disabled={loading || !valid}
            bsStyle="primary"
            onClick={onSearch}
        ><Glyphicon glyph="search"/> <Message msgId={'cadastrapp.search.title'}/></Button>
    </ButtonGroup>);
}
