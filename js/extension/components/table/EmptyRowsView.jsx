import React from 'react';
const emptyStyle = { textAlign: "center", padding: "50px" };
/**
 * Utility component for react-data-grid table display loading spinner or no-data
 * @prop {boolean} loading if true, display loading indicator. Otherwise, no data.
 */
export const EmptyRowsView = ({ loading }) => (loading ? <div style={emptyStyle}>Loading...</div> : <div style={emptyStyle}>No data</div>);
