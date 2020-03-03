
import {Scrollable} from "@phlax/react-scroller/scrollable";


test("Scrollable constructor", () => {
    const scrollable = new Scrollable("FORMATTER", "FETCH");
    expect(scrollable.formatter).toEqual("FORMATTER");
    expect(scrollable.fetch).toEqual("FETCH");
    expect(scrollable.listeners).toEqual({});
});


test("Scrollable listen", () => {
    const scrollable = new Scrollable();
    scrollable.listen("SIGNAL", "FUNC");
    expect(scrollable.listeners).toEqual({SIGNAL: ["FUNC"]});
    scrollable.listen("SIGNAL", "OTHER FUNC");
    expect(scrollable.listeners).toEqual(
        {SIGNAL: ["FUNC", "OTHER FUNC"]});
    scrollable.listen("OTHER SIGNAL", "FUNC");
    expect(scrollable.listeners).toEqual(
        {SIGNAL: ["FUNC", "OTHER FUNC"],
         "OTHER SIGNAL": ["FUNC"]});
});


test("Scrollable emit", () => {
    const scrollable = new Scrollable();
    scrollable.emit("SIGNAL", "MSG");
    scrollable.listeners = {SIGNAL: [jest.fn(), jest.fn()]};
    scrollable.emit("SIGNAL", "MSG");
    expect(scrollable.listeners.SIGNAL[0].mock.calls).toEqual(
        [["SIGNAL", "MSG"]]);
    expect(scrollable.listeners.SIGNAL[1].mock.calls).toEqual(
        [["SIGNAL", "MSG"]]);
});


test("Scrollable text", () => {
    const scrollable = new Scrollable();
    expect(scrollable.text("TEXT")).toEqual("TEXT");
    scrollable.formatter = jest.fn(() => "FORMATTED");
    expect(scrollable.text("TEXT")).toEqual("FORMATTED");
    expect(scrollable.formatter.mock.calls).toEqual([["TEXT"]]);
});


test("Scrollable number", () => {
    const scrollable = new Scrollable();
    const format = jest.fn(() => "FORMATTED NUMBER");
    global.Intl.NumberFormat = jest.fn(() => ({format}));
    Object.defineProperty(global.navigator, "language", {get: () => "LANGUAGE"});
    expect(scrollable.number("NUMBER")).toEqual("FORMATTED NUMBER");
    expect(global.Intl.NumberFormat.mock.calls).toEqual([["LANGUAGE"]]);
    expect(format.mock.calls).toEqual([["NUMBER"]]);
});


test("Scrollable unlisten", () => {
    const scrollable = new Scrollable();
    scrollable.listeners = "LISTENERS";
    scrollable.unlisten();
    expect(scrollable.listeners).toEqual({});
});
