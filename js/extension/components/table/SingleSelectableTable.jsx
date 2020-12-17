import React from 'react';
import CustomCheckbox from '../CustomCheckbox';

export function SingleSelectableTable(props) {

    const handleDoubleClick = (index) => {
        return () => {
            props.onDoubleClick(index);
        };
    };

    const handleClick = (index) => {
        return () => {
            props.onClick(index);
        };
    };

    function generateRow(r, index) {
        if (r.length === 0) {
            return (<></>);
        }


        let className = r[r.length - 1] ? "selected" : "";
        return (
            <div
                onDoubleClick={handleDoubleClick(index)}
                onClick={handleClick(index)}
                className={"table-row " + className}>
                <div className="cell" style={{ width: "5%" }}>
                    <CustomCheckbox
                        onCheckClick={() => { }}
                        selected={r[r.length - 1]}/>
                </div>
                {r.map((cell, idx) => {
                    let w = props.widths[idx] + "%";
                    return (
                        <div style={{ width: w }} className="cell">{cell}</div>
                    );
                })}
            </div>
        );
    }

    return (
        <>
            <div className="header">
                <div className="cell" style={{ width: "5%" }}></div>
                {props.header.map((e, index) => {
                    let w = props.widths[index] + "%";
                    return (
                        <div style={{ width: w }} className="cell">
                            {e}
                        </div>
                    );
                })}
            </div>
            <div>
                {props.data.map((e, index) => {
                    return generateRow(e, index);
                })}
            </div>
        </>
    );
}
