import React from 'react';
import CustomCheckbox from '../CustomCheckbox';

export default function SelectableTable(props) {

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
                onClick={handleClick(index)}
                className={"table-row " + className}>
                <div className="cell" style={{ width: "5%" }}>
                    <CustomCheckbox
                        onCheckClick={() => { }}
                        selected={r[r.length - 1]}/>
                </div>
                {r.map((cell, i) => {
                    let w = props.widths[i] + "%";
                    return (
                        <div style={{ width: w }} className="cell">{cell}</div>
                    );
                })}
            </div>
        );
    }

    let allSelected = true;
    for (let i = 0; i < props.data.length; i++) {
        let p = props.data[i];
        if (!p[p.length - 1]) {allSelected = false;}
    }
    return (
        <>
            <div className="header">
                <div className="cell" style={{ width: "5%" }}>
                    <CustomCheckbox onCheckClick={props.onAllClick} selected={allSelected}/>
                </div>
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

