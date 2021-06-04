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
            <table className="welcome-message-versions">
                <tr><td><Message msgId={'cadastrapp.dateValiditeEDIGEO'}/>: </td><td>{dateValiditeEDIGEO}</td></tr>
                <tr><td><Message msgId={'cadastrapp.dateValiditeMajic'}/>: </td><td>{dateValiditeMajic}</td></tr>
            </table>
            <div className="welcome-message-build">build &nbsp;
                {/* eslint-disable-next-line no-undef */}
                <a target="_blank" href={`${__REPOURL__?.replace('.git', '')}/commit/${__COMMITHASH__}`}>{__COMMITHASH__?.substr(0, 8)}</a>
            </div>
        </div>
    );
}
