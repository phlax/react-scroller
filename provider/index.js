
import React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";

import {Scrollable} from "../scrollable";
import {Context} from "../context";


export class Provider extends React.Component {
    static propTypes = exact({
	formatter: PropTypes.func,
	fetch: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.array]).isRequired});
    WAIT_INTERVAL = 200;
    state = {
	current: 1,
	total: 0,
	end: 0,
	rows: 10,
	start: 0,
	timer: null};

    get fetchRowsFrom () {
	const {rows} = this.state;
	return 3 * rows / 4;
    }

    onGo = (signal, current) => {
        const {rows, total} = this.state;
        if (current > 0 && current < total) {
            this.scroller.emit("current", current);
            this.setState({current});
            this.fetch(Math.max(current - rows, 0));
        }
    };

    onUp = () => {
	const {current} = this.state;
        if (current > 1) {
            this.scroller.emit("current", current - 1);
            this.setState({current: current - 1});
        }
	this.maybeFetch();
    };

    onDown = () => {
	const {current, total} = this.state;
	if (current + 1 < total) {
            this.scroller.emit("current", current + 1);
            this.setState({current: current + 1});
	}
	this.maybeFetch();
    };

    maybeFetch = () => {
	const {current, end, rows, start, total} = this.state;
        if (total > end && current + this.fetchRowsFrom > end) {
            this.fetch(end);
        } else if (start > 0 && current - this.fetchRowsFrom < start) {
            this.fetch(Math.max(start - 2 * rows, 0));
	}
    };

    fetch = (offset) => {
	clearTimeout(this.timer);
	this.timer = setTimeout(
            () => this.scroller.fetch(offset),
            this.WAIT_INTERVAL);
    };

    setTotal = (signal, total) => {
        this.setState({total});
    };

    setEnd = (signal, end) => {
        this.setState({end});
    };

    setRows = (signal, rows) => {
        this.setState({rows});
    };

    setStart = (signal, start) => {
        this.setState({start});
    };

    componentWillUnmount () {
	this.scroller.unlisten();
    }

    constructor (props) {
        super(props);
	const {formatter, fetch} = this.props;
        this.scroller = new Scrollable(formatter, fetch);
        this.scroller.listen("scroll-down", this.onDown);
        this.scroller.listen("scroll-up", this.onUp);
        this.scroller.listen("go", this.onGo);
        this.scroller.listen("total", this.setTotal);
        this.scroller.listen("end", this.setEnd);
        this.scroller.listen("start", this.setStart);
        this.scroller.listen("rows", this.setRows);
    }

    render () {
        return (
            <Context.Provider value={this.scroller}>
              {this.props.children}
            </Context.Provider>
        );
    }
}

export default {Provider};
