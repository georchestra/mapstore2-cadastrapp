import {useState} from 'react';

export default function useAccordionState() {
    const [expandedPanel, setExpandedPanel] = useState({});
    const togglePanel = (index) => {
        let exp = { ...expandedPanel };
        if (exp[index]) {
            exp[index] = false;
        } else {
            exp[index] = true;
        }
        setExpandedPanel(exp);
    };
    return [expandedPanel, togglePanel];
}
