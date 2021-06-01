import React from 'react';
import {
    Glyphicon
} from "react-bootstrap";
import Message from '@mapstore/components/I18N/Message';

export default function WelcomeMessage(props) {
    const { isShown, configuration: { dateValiditeEDIGEO = '', dateValiditeMajic = '' } = {}, data } = props;
    let className = isShown ? "welcome-message" : "collapse";
    if (data.length > 0) {
        className = "collapse";
    }


    return (
        <div className={className}>
            <div>
                <Glyphicon glyph="search-coords"
                    style={{
                        margin: "0px",
                        fontSize: "36px"
                    }}/>
                <h3 className="welcome-message-items"><Message msgId={'cadastrapp.title'}/></h3>
                <h4 className="welcome-message-items"><Message msgId={'cadastrapp.selectTool'}/></h4>
            </div>
            <div style={{padding: 40}}>
                <h4 className="welcome-message-items"><Message msgId={'cadastrapp.dateValiditeEDIGEO'}/>: &nbsp;{dateValiditeEDIGEO}</h4>
                <h4 className="welcome-message-items"><Message msgId={'cadastrapp.dateValiditeMajic'}/>: &nbsp;{dateValiditeMajic}</h4>
            </div>
            <h4 className="welcome-message-build">build &nbsp;
                {/* eslint-disable-next-line no-undef */}
                <a href={`${__REPOURL__?.replace('.git', '')}/commit/${__COMMITHASH__}`}>{__COMMITHASH__?.substr(0, 8)}</a>
            </h4>
        </div>
    );
}
