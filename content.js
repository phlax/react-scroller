
import React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";

import mouseTrap from "react-mousetrap";

import {Context} from "./context";


export class DefaultContainer extends React.PureComponent {
    static propTypes = exact({
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.array]).isRequired,
        className: PropTypes.string});

    render () {
        const {children, className} = this.props;
        return (
            <div className={className}>
              {children}
            </div>);
    }
}


export class ContentPanel extends React.Component {
    static contextType = Context;
    static propTypes = exact({
        units: PropTypes.array,
        end: PropTypes.number,
	rows: PropTypes.number,
        start: PropTypes.number,
        total: PropTypes.number,
        className: PropTypes.string,
        Container: PropTypes.elementType,
        Row: PropTypes.elementType.isRequired,
        FocusRow: PropTypes.elementType.isRequired,
        bindShortcut: PropTypes.func.isRequired,
        unbindShortcut: PropTypes.func.isRequired,
    });

    state = {focusRow: 0, current: 1};

    constructor (props) {
        super(props);
        props.bindShortcut("ctrl+down", this.onScrollDown);
        props.bindShortcut("ctrl+up", this.onScrollUp);
    }

    onChange = (signal, current) => {
        if (current === 1) {
            this.setState({focusRow: 0, current});
        } else {
            this.setState({focusRow: 1, current});
        }
    };

    onScrollDown = (e) => {
        e.preventDefault();
        this.context.emit("scroll-down");
    };

    onScrollUp = (e) => {
        e.preventDefault();
        this.context.emit("scroll-up");
    };

    get sliceStart () {
        const {current, focusRow} = this.state;
        const {start=0} = this.props;
        return current - 1 - focusRow - start;
    }

    componentDidMount () {
        const {end, rows, start, total} = this.props;
        this.context.listen("current", this.onChange);
        this.context.emit("total", total);
        this.context.emit("end", end);
        this.context.emit("start", start);
	if (rows) {
            this.context.emit("rows", rows);
	}
    }

    componentWillUnmount () {
	const {unbindShortcut} = this.props;
	unbindShortcut("ctrl+down");
        unbindShortcut("ctrl+up");
    }

    componentDidUpdate(prevProps) {
        const {end, start, total} = this.props;
        if (prevProps.total !== total) {
            this.context.emit("total", total);
        }
        if (prevProps.end !== end) {
            this.context.emit("end", end);
        }
        if (prevProps.start !== start) {
            this.context.emit("start", start);
        }
    }

    render () {
        const {focusRow} = this.state;
        const {
            units=[],
            Container=DefaultContainer,
            FocusRow,
            Row} = this.props;
        const visible = units.slice(
            this.sliceStart,
            this.sliceStart + 10);
        return (
            <Container className={this.props.className}>
              {visible.map((value, index) => {
                  const RowComponent = index === focusRow ? FocusRow : Row;
                  return <RowComponent key={index} row={value} />;
              })}
            </Container>);
    }
}


export const Content = mouseTrap(ContentPanel);
