import React from 'react';

import SelectionTools from './toolbar/SelectionTools';
import SearchTools from './toolbar/SearchTools';
import ZoomTo from './toolbar/ZoomTo';
import RequestLanding from './toolbar/RequestLanding';
import Preferences from './toolbar/Preferences';
import HelpButton from './toolbar/Help';


export default function MainToolbar() {
    return (<div className="side-bar pull-left">
        <ZoomTo/>
        <SelectionTools/>
        <SearchTools/>
        <RequestLanding />
        <Preferences/>
        <HelpButton/>
    </div>);
};