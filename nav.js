
import React from "react";
import PropTypes from "prop-types";
import exact from "prop-types-exact";

import {Context} from "./context";

import css from "./scroller.css";


export class Nav extends React.PureComponent {
    static contextType = Context;
    static propTypes = exact({
        buttonClassName: PropTypes.string,
        className: PropTypes.string});

    state = {current: 1, total: 0};

    onChange = (e) => {
        this.context.emit("go", parseInt(e.target.value));
        this.setState({current: e.target.value});
    };

    scrollDown = () => {
	this.context.emit("scroll-down");
    };

    scrollUp = () => {
	this.context.emit("scroll-up");
    };

    setTotal = (signal, total) => {
        this.setState({total});
    };

    setCurrent = (signal, current) => {
        this.setState({current});
    };

    componentDidMount () {
        this.context.listen("total", this.setTotal);
        this.context.listen("current", this.setCurrent);
    }

    render () {
        let {buttonClassName, className} = this.props;
        className = "react-scroller-nav " + className;
        return (
            <div className={className}>
              <button
                className={buttonClassName}
                title={this.context.text("up")}
                onClick={this.scrollUp}>
                ▲
              </button>
              <input
                className="mousetrap"
                type="number"
                onChange={this.onChange}
                value={this.context.number(this.state.current)} />
              /
              <span className="total">{this.context.number(this.state.total)}</span>
              <button
                className={buttonClassName}
                title={this.context.text("down")}
                onClick={this.scrollDown}>
                ▼
              </button>
            </div>
        );
    }
}
