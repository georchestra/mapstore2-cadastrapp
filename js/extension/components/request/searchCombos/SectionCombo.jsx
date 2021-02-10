import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { getSection } from "../../../api";
import ReferenceRow from "@js/extension/components/lists/ReferenceRow";

export default props => {
    const [sections, setSections] = useState([]);
    useEffect(() => {
        if (props.cgocommune) {
            getSection(props.cgocommune).then(results => {
                setSections(results);
            });
        }
    }, [props.cgocommune]);

    return !isEmpty(sections) && <ReferenceRow
        dropUp
        hideRemove
        containerStyle={{ width: "unset" }}
        fieldStyle={{ width: 120, marginBottom: 5, marginRight: 5 }}
        sections={sections}
        onSetValue={props.onSelect}
        row={props.value}
        {...props}
    />;
};
