import React from 'react';

import SelectionTools from './toolbar/SelectionTools';
import SearchTools from './toolbar/SearchTools';
import ZoomTo from './toolbar/ZoomTo';
import RequestLanding from './toolbar/RequestLanding';
import Preferences from './toolbar/Preferences';
import HelpButton from './toolbar/Help';


export default function MainToolbar(props) {
    return (<div className="side-bar pull-left">
        <ZoomTo/>
        <SearchTools/>
        <SelectionTools {...props}/>
        <RequestLanding />
        <Preferences configStyles={props.styles}/>
        <HelpButton helpUrl={props?.helpUrl}/>
    </div>);
}
