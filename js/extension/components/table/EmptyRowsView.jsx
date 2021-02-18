import React from 'react';
const emptyStyle = { textAlign: "center", padding: "50px" };
import Message from '@mapstore/components/I18N/Message';

/**
 * Utility component for react-data-grid table display loading spinner or no-data
 * @prop {boolean} loading if true, display loading indicator. Otherwise, no data.
 */
export const EmptyRowsView = ({ loading }) => (loading ? <div style={emptyStyle}><Message msgId="cadastrapp.loading" /></div> : <div style={emptyStyle}><Message msgId="cadastrapp.nodata" /></div>);
