
import React from "react";

import {shallow} from "enzyme";

import Scroller from "@phlax/react-scroller";
import {Scrollable, listen} from "@phlax/react-scroller/scrollable";


class DummyComponent extends React.PureComponent {
    render () {
        return "DUMMY COMPONENT";
    }
}


const fetch = jest.fn();
const formatter = jest.fn();


jest.mock("@phlax/react-scroller/scrollable", () => {
    const listen = jest.fn();
    const Scrollable = jest.fn(() => ({listen}));
    return {Scrollable, listen};
});


test("Provider constructor", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>
    );
    expect(Scrollable.mock.calls).toEqual([[formatter, fetch]]);
    expect(listen.mock.calls).toEqual([
        ["scroll-down", provider.instance().onDown],
        ["scroll-up", provider.instance().onUp],
        ["go", provider.instance().onGo],
        ["total", provider.instance().setTotal],
        ["end", provider.instance().setEnd],
        ["start", provider.instance().setStart],
        ["rows", provider.instance().setRows],
    ]);
    expect(provider.instance().scroller).toEqual({listen});
    const contextProvider = provider.find(Scroller.Context.Provider);
    expect(contextProvider.props()).toEqual(
        {"children": <DummyComponent />,
         "value": {listen}});
    const dummy = contextProvider.find(DummyComponent);
    expect(dummy.props()).toEqual({});
});



test("Provider setTotal", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>
    );
    provider.instance().setState = jest.fn();
    provider.instance().setTotal("SIGNAL", "TOTAL");
    expect(provider.instance().setState.mock.calls).toEqual(
        [[{total: "TOTAL"}]]);
});


test("Provider setEnd", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>
    );
    provider.instance().setState = jest.fn();
    provider.instance().setEnd("SIGNAL", "END");
    expect(provider.instance().setState.mock.calls).toEqual(
        [[{end: "END"}]]);
});


test("Provider setRows", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>
    );
    provider.instance().setState = jest.fn();
    provider.instance().setRows("SIGNAL", "ROWS");
    expect(provider.instance().setState.mock.calls).toEqual(
        [[{rows: "ROWS"}]]);
});


test("Provider setStart", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>
    );
    provider.instance().setState = jest.fn();
    provider.instance().setStart("SIGNAL", "START");
    expect(provider.instance().setState.mock.calls).toEqual(
        [[{start: "START"}]]);
});


test("Provider fetch", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>
    );

    global.window.setTimeout = jest.fn(() => "TIMER");
    global.window.clearTimeout = jest.fn();
    provider.instance().scroller = {fetch: jest.fn()};

    provider.instance().fetch("OFFSET");
    expect(global.window.clearTimeout.mock.calls).toEqual(
        [[undefined]]);
    expect(global.window.setTimeout.mock.calls[0][1]).toEqual(
        provider.instance().WAIT_INTERVAL);
    expect(provider.instance().timer).toEqual("TIMER");

    expect(provider.instance().scroller.fetch.mock.calls).toEqual([]);

    const fetch = global.window.setTimeout.mock.calls[0][0];
    fetch();
    expect(provider.instance().scroller.fetch.mock.calls).toEqual(
        [["OFFSET"]]);

    global.window.clearTimeout.mockClear();
    provider.instance().fetch("NEW OFFSET");
    expect(global.window.clearTimeout.mock.calls).toEqual(
        [["TIMER"]]);
});


test("Provider willUnmount", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>);
    provider.instance().scroller = {unlisten: jest.fn()};
    provider.instance().componentWillUnmount();
    expect(provider.instance().scroller.unlisten.mock.calls).toEqual([[]]);
});


test("Provider fetchRowsFrom", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>);
    expect(provider.instance().fetchRowsFrom).toEqual(7.5);
    provider.setState({rows: 40});
    expect(provider.instance().fetchRowsFrom).toEqual(30);
});


test("Provider onGo", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>);
    provider.instance().setState = jest.fn();
    provider.instance().scroller = {emit: jest.fn()};
    provider.instance().fetch = jest.fn();
    global.Math.max = jest.fn(() => "MAXED");

    provider.instance().onGo("SIGNAL", 0);
    expect(provider.instance().setState.mock.calls).toEqual([]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([]);
    expect(provider.instance().fetch.mock.calls).toEqual([]);
    expect(global.Math.max.mock.calls).toEqual([]);

    provider.instance().onGo("SIGNAL", 3);
    expect(provider.instance().setState.mock.calls).toEqual([]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([]);
    expect(provider.instance().fetch.mock.calls).toEqual([]);
    expect(global.Math.max.mock.calls).toEqual([]);

    provider.instance().state = {total: 10, rows: 10};
    provider.instance().onGo("SIGNAL", 3);
    expect(provider.instance().setState.mock.calls).toEqual(
        [[{current: 3}]]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual(
        [["current", 3]]);
    expect(provider.instance().fetch.mock.calls).toEqual([["MAXED"]]);
    expect(global.Math.max.mock.calls).toEqual([[-7, 0]]);
    provider.instance().setState.mockClear();
    provider.instance().scroller.emit.mockClear();
    provider.instance().fetch.mockClear();
    global.Math.max.mockClear();

    provider.instance().state = {total: 10, rows: 10};
    provider.instance().onGo("SIGNAL", 11);
    expect(provider.instance().setState.mock.calls).toEqual([]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([]);
    expect(provider.instance().fetch.mock.calls).toEqual([]);
    expect(global.Math.max.mock.calls).toEqual([]);
});


test("Provider onUp", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>);
    provider.instance().setState = jest.fn();
    provider.instance().scroller = {emit: jest.fn()};
    provider.instance().maybeFetch = jest.fn();

    provider.instance().onUp();
    expect(provider.instance().setState.mock.calls).toEqual([]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([]);
    expect(provider.instance().maybeFetch.mock.calls).toEqual([[]]);
    provider.instance().maybeFetch.mockClear();

    provider.instance().state = {current: 2};
    provider.instance().onUp();
    expect(provider.instance().setState.mock.calls).toEqual([[{current: 1}]]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([["current", 1]]);
    expect(provider.instance().maybeFetch.mock.calls).toEqual([[]]);
});


test("Provider onDown", () => {
    const provider = shallow(
        <Scroller.Provider
          formatter={formatter}
          fetch={fetch}>
          <DummyComponent />
        </Scroller.Provider>);
    provider.instance().setState = jest.fn();
    provider.instance().scroller = {emit: jest.fn()};
    provider.instance().maybeFetch = jest.fn();

    provider.instance().onDown();
    expect(provider.instance().setState.mock.calls).toEqual([]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([]);
    expect(provider.instance().maybeFetch.mock.calls).toEqual([[]]);
    provider.instance().maybeFetch.mockClear();

    provider.instance().state = {current: 3, total: 10};
    provider.instance().onDown();
    expect(provider.instance().setState.mock.calls).toEqual([[{current: 4}]]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([["current", 4]]);
    expect(provider.instance().maybeFetch.mock.calls).toEqual([[]]);
    provider.instance().setState.mockClear();
    provider.instance().scroller.emit.mockClear();
    provider.instance().maybeFetch.mockClear();

    provider.instance().state = {current: 9, total: 10};
    provider.instance().onDown();
    expect(provider.instance().setState.mock.calls).toEqual([]);
    expect(provider.instance().scroller.emit.mock.calls).toEqual([]);
    expect(provider.instance().maybeFetch.mock.calls).toEqual([[]]);
});
