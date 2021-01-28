import React from 'react';
import ReactDataGrid from 'react-data-grid';
import PropTypes from 'prop-types';
import uuid from 'uuid';
const DEFAULTS = {
    minWidth: 120,
    maxWidth: 300,
    hPaddingCell: 16,
    hPaddingSort: 22,
    vPaddingCell: 16,
    lineHeight: 16 * 1.5,
    font: '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};
const H_PADDING_CORRECTION = 4;

/**
 * Internal helper class for multiline header
 */
class Helper {
    constructor(columns, config = {}) {
        this._columns = columns;
        this._config = Object.assign(DEFAULTS, config);
        this._lines = 1;
        this._ctx = document.createElement('canvas').getContext('2d');
        this._ctx.font = this._config.font;
    }

    _getLineWidth = line => Math.ceil(this._ctx.measureText(line).width);

    _getColumnHorizontalPadding = column => this._config.hPaddingCell + (column.sortable ? this._config.hPaddingSort : 0) + H_PADDING_CORRECTION;

    _updateLines = (text, columnContentWidth) => {
        const lines = [text];
        let currentLine = 0;
        do {
            if (this._getLineWidth(lines[currentLine]) > columnContentWidth) {
                if (lines.length === currentLine + 1) {
                    lines.push('');
                }
                lines[currentLine + 1] = (lines[currentLine].substring(lines[currentLine].lastIndexOf(' ') + 1) + ' ' + lines[currentLine + 1]).trim();
                lines[currentLine] = lines[currentLine].substring(0, lines[currentLine].lastIndexOf(' '));
            }
            else {
                currentLine += 1;
            }
        } while (lines.some(line => this._getLineWidth(line) > columnContentWidth));

        this._lines = Math.max(this._lines, lines.length);
    };

    _setColumnWidth = column => {
        const padding = this._getColumnHorizontalPadding(column);
        const maxTextWidth = (column.width || this._config.maxWidth) - padding;
        const textWidth = this._getLineWidth(column.name);

        if (textWidth <= maxTextWidth) {
            column.width = Math.max(this._config.minWidth, textWidth + padding);
        } else {
            const longestWordWidth = column.name
                .split(' ')
                .reduce((previousValue, currentValue) =>
                    Math.max(previousValue, this._getLineWidth(currentValue)), 0);
            const columnContentWidth = Math.max(maxTextWidth, longestWordWidth);
            column.width = columnContentWidth + padding;
            this._updateLines(column.name, columnContentWidth);
        }

        return column;
    };

    get headerRowHeight() {
        return this._lines * this._config.lineHeight + this._config.vPaddingCell;
    }

    get columns() {
        return this._columns.map(this._setColumnWidth);
    }
}

/**
 * A react data grid wrapper that provides the additional functionality
 * to provide multiline headers.
 * It requires the following css:
 * ```css
 * .react-grid-multiline-header .react-grid-HeaderCell {
 *     white-space: normal !important;
 * }
 * ```
 */
class MultilineHeaderTable extends React.Component {
    constructor(props) {
        super(props);
        this.helper = new Helper(this.props.columns);
    }
    componentDidMount() {
        // Used to workaround some conflicts with click event on "select all" checkbox of the react-data-grid table.
        // Without it the select all click event on a second table triggers the event on other tables (existing, with same id)
        if (this.grid !== undefined && this.grid.selectAllCheckbox?.id === 'select-all-checkbox') {
            const uniqueNumber = uuid.v4();
            this.grid.selectAllCheckbox.id += `-${uniqueNumber}`;
            this.grid.selectAllCheckbox.nextSibling.htmlFor += `-${uniqueNumber}`;
        }
    }

    render() {
        // create mixed column for address
        return (
            <div className="react-grid-multiline-header">
                <ReactDataGrid
                    ref={node => {this.grid = node; }}
                    headerRowHeight={this.helper.headerRowHeight}
                    columns={this.helper.columns}
                    {...this.props}
                />
            </div>
        );
    }
}
MultilineHeaderTable.propTypes = {
    columns: PropTypes.array
};
export default MultilineHeaderTable;
