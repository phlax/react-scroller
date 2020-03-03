
import React from "react";

import {shallow} from "enzyme";

import Scroller from "@phlax/react-scroller";


const dummyContext = {
    emit: jest.fn(),
    listen: jest.fn(),
    number: jest.fn(() => "NUMBER"),
    text: jest.fn(() => "TEXT")};


class DummyNav extends Scroller.Nav {

    get context () {
        return dummyContext;
    }

    set context (c) {

    }
}


afterEach(() => {
    dummyContext.emit.mockClear();
});


test("Nav constructor", () => {
    const nav = shallow(
        <DummyNav
          className="custom-cls"
          buttonClassName="custom-button-cls" />);
    expect(nav.text()).toEqual("▲/NUMBER▼");
    expect(nav.props().className).toEqual(
        "react-scroller-nav custom-cls");
    expect(dummyContext.listen.mock.calls).toEqual(
        [["total", nav.instance().setTotal],
         ["current", nav.instance().setCurrent]]);
    const button1 = nav.childAt(0);
    expect(button1.props()).toEqual(
        {"children": "▲",
         "className": "custom-button-cls",
         "onClick": nav.instance().scrollUp,
         "title": "TEXT"});
    const button2 = nav.childAt(4);
    expect(button2.props()).toEqual(
        {"children": "▼",
         "className": "custom-button-cls",
         "onClick": nav.instance().scrollDown,
         "title": "TEXT"});
    const input = nav.childAt(1);
    expect(input.type()).toEqual("input");
    expect(input.props()).toEqual(
        {"className": "mousetrap",
         "onChange": nav.instance().onChange,
         "type": "number",
         "value": "NUMBER"});
    const total = nav.childAt(3);
    expect(total.props()).toEqual(
        {"children": "NUMBER",
         "className": "total"});
    expect(dummyContext.text.mock.calls).toEqual([["up"], ["down"]]);
    expect(dummyContext.number.mock.calls).toEqual([[1], [0]]);
    expect(dummyContext.emit.mock.calls).toEqual([]);
});


test("Nav scrollDown", () => {
    const nav = shallow(<DummyNav />);
    nav.instance().scrollDown();
    expect(dummyContext.emit.mock.calls).toEqual([["scroll-down"]]);
});


test("Nav scrollUp", () => {
    const nav = shallow(<DummyNav />);
    nav.instance().scrollUp();
    expect(dummyContext.emit.mock.calls).toEqual([["scroll-up"]]);
});


test("Nav onChange", () => {
    const nav = shallow(<DummyNav />);
    const e = {target: {value: "23"}};
    nav.instance().setState = jest.fn();
    nav.instance().onChange(e);
    expect(dummyContext.emit.mock.calls).toEqual([["go", 23]]);
    expect(nav.instance().setState.mock.calls).toEqual([[{"current": "23"}]]);
});


test("Nav setTotal", () => {
    const nav = shallow(<DummyNav />);
    nav.instance().setState = jest.fn();
    nav.instance().setTotal("SIGNAL", "23");
    expect(nav.instance().setState.mock.calls).toEqual(
        [[{"total": "23"}]]);
});


test("Nav setCurrent", () => {
    const nav = shallow(<DummyNav />);
    nav.instance().setState = jest.fn();
    nav.instance().setCurrent("SIGNAL", "23");
    expect(nav.instance().setState.mock.calls).toEqual(
        [[{"current": "23"}]]);
});
