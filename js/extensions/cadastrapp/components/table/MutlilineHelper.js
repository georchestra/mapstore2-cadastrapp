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

class ReactDataGridMultilineHeader {
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
        }
        else {
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

export default ReactDataGridMultilineHeader;
