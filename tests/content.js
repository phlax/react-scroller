
import React from "react";

import {shallow} from "enzyme";

import Scroller from "@phlax/react-scroller";
import {
    ContentPanel,
    DefaultContainer} from "@phlax/react-scroller/content";


const dummyContext = {
    emit: jest.fn(),
    listen: jest.fn()};


class DummyContentPanel extends ContentPanel {

    get context () {
        return dummyContext;
    }

    set context (c) {

    }
}


class DummyRow extends React.PureComponent {

    render () {
        return "ROW";
    }
}


class DummyFocusRow extends React.PureComponent {

    render () {
        return "FOCUS ROW";
    }
}


class DummyComponent extends React.PureComponent {

    render () {
        return "DUMMY COMPONENT";
    }
}


test("Content constructor", () => {
    const provider = shallow(
        <Scroller.Content
          Row="ROW"
          FocusRow="FOCUS ROW" />);
    expect(provider.text()).toEqual("<ContentPanel />");
    const panel = provider.find(ContentPanel);
    expect(Object.keys(panel.props())).toEqual(
        ["Row", "FocusRow", "bindShortcut", "unbindShortcut"]);
});



test("ContentPanel constructor", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const content = shallow(
        <DummyContentPanel
          start={0}
          end={20}
          total={100}
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);
    const container = content.find(DefaultContainer);
    expect(container.props()).toEqual({"children": [], "className": undefined});
    expect(bindShortcut.mock.calls).toEqual(
        [["ctrl+down", content.instance().onScrollDown],
         ["ctrl+up", content.instance().onScrollUp]]);
    expect(unbindShortcut.mock.calls).toEqual([]);
    expect(dummyContext.listen.mock.calls).toEqual(
        [["current", content.instance().onChange]]);
    expect(dummyContext.emit.mock.calls).toEqual(
        [["total", 100],
         ["end", 20],
         ["start", 0]]);
});


test("ContentPanel constructor rows", () => {
    dummyContext.emit.mockClear();
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    shallow(
        <DummyContentPanel
          start={0}
          end={20}
          total={100}
          rows={20}
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);
    expect(dummyContext.emit.mock.calls).toEqual(
        [["total", 100],
         ["end", 20],
         ["start", 0],
         ["rows", 20]]);
});

test("ContentPanel constructor units", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const units = [...Array(100).keys()];
    const content = shallow(
        <DummyContentPanel
          start={0}
          end={20}
          total={100}
          units={units}
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);
    expect(content.children().length).toEqual(10);
    const first = content.childAt(0);
    expect(first.props()).toEqual({row: 0});
    expect(first.type()).toEqual(DummyFocusRow);

    for(let i = 1; i < 10; i++) {
        const el = content.childAt(i);
        expect(el.props()).toEqual({row: i});
        expect(el.type()).toEqual(DummyRow);
    }
});


test("ContentPanel constructor focusRow", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const units = [...Array(100).keys()];
    const content = shallow(
        <DummyContentPanel
          start={0}
          end={20}
          total={100}
          units={units}
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);

    content.setState({focusRow: 1, current: 5});
    content.update();
    expect(content.children().length).toEqual(10);
    for(let i = 0; i < 10; i++) {
        const el = content.childAt(i);
        if (i == 1) {
            expect(el.props()).toEqual({row: i + 3});
            expect(el.type()).toEqual(DummyFocusRow);
        } else {
            expect(el.props()).toEqual({row: i + 3});
            expect(el.type()).toEqual(DummyRow);
        }
    }
});


test("ContentPanel sliceStart", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const content = shallow(
        <DummyContentPanel
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);
    expect(content.instance().sliceStart).toBe(0);
    content.setState({current: 50});
    expect(content.instance().sliceStart).toBe(49);
    content.setState({focusRow: 1});
    expect(content.instance().sliceStart).toBe(48);
    content.setProps({start: 23});
    expect(content.instance().sliceStart).toBe(25);
});



test("ContentPanel onScrollDown", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const content = shallow(
        <DummyContentPanel
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);
    dummyContext.emit.mockClear();
    const e = {preventDefault: jest.fn()};
    content.instance().onScrollDown(e);
    expect(e.preventDefault.mock.calls).toEqual([[]]);
    expect(dummyContext.emit.mock.calls).toEqual([["scroll-down"]]);
});


test("ContentPanel onScrollUp", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const content = shallow(
        <DummyContentPanel
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);

    dummyContext.emit.mockClear();
    const e = {preventDefault: jest.fn()};
    content.instance().onScrollUp(e);
    expect(e.preventDefault.mock.calls).toEqual([[]]);
    expect(dummyContext.emit.mock.calls).toEqual([["scroll-up"]]);
});


test("ContentPanel onChange", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const content = shallow(
        <DummyContentPanel
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);

    content.instance().setState = jest.fn();
    content.instance().onChange("change", 1);
    expect(content.instance().setState.mock.calls).toEqual(
        [[{current: 1, focusRow: 0}]]);
    content.instance().setState = jest.fn();
    content.instance().onChange("change", 23);
    expect(content.instance().setState.mock.calls).toEqual(
        [[{current: 23, focusRow: 1}]]);
});


test("ContentPanel componentDidUpdate", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const content = shallow(
        <DummyContentPanel
          start={0}
          end={20}
          total={100}
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);
    dummyContext.emit.mockClear();
    content.instance().componentDidUpdate({
        start: 0,
        end: 20,
        total: 100});
    expect(dummyContext.emit.mock.calls).toEqual([]);
    dummyContext.emit.mockClear();
    content.instance().componentDidUpdate({
        start: 10,
        end: 20,
        total: 100});
    expect(dummyContext.emit.mock.calls).toEqual([["start", 0]]);
    dummyContext.emit.mockClear();
    content.instance().componentDidUpdate({
        start: 0,
        end: 30,
        total: 100});
    expect(dummyContext.emit.mock.calls).toEqual([["end", 20]]);
    dummyContext.emit.mockClear();
    content.instance().componentDidUpdate({
        start: 0,
        end: 20,
        total: 200});
    expect(dummyContext.emit.mock.calls).toEqual([["total", 100]]);
    dummyContext.emit.mockClear();
    content.instance().componentDidUpdate({
        start: 10,
        end: 30,
        total: 200});
    expect(dummyContext.emit.mock.calls).toEqual([
        ["total", 100],
        ["end", 20],
        ["start", 0]]);
});


test("DefaultContainer constructor", () => {
    const content = shallow(
        <DefaultContainer className="CLASSNAME">
          <DummyComponent />
        </DefaultContainer>);
    const div = content.find("div");
    expect(div.props()).toEqual(
        {"children": <DummyComponent />,
         "className": "CLASSNAME"});
});


test("ContentPanel componentWillUnmount", () => {
    const bindShortcut = jest.fn();
    const unbindShortcut = jest.fn();
    const content = shallow(
        <DummyContentPanel
          start={0}
          end={20}
          total={100}
          Row={DummyRow}
          FocusRow={DummyFocusRow}
          bindShortcut={bindShortcut}
          unbindShortcut={unbindShortcut} />);
    content.instance().componentWillUnmount();
    expect(unbindShortcut.mock.calls).toEqual(
        [["ctrl+down"], ["ctrl+up"]]);
});
