const createLookUpObject = require("../db/seeds/utils-seed")

describe("createLookUpObject", () => {
    test("Returns an object with a single key-value pair when passed an array containing a single object", () => {
        const input = [{title: "Chocolate", id: 10}];
        const expected = {Chocolate: 10};
        expect(createLookUpObject(input, "title", "id")).toEqual(expected);
    })
    test("Returns an object with a multiply key-value pairs when passed an array containing multiply objects", () => {
        const input = [{title: "Chocolate", id: 10}, {title: "Icecream", id: 1}, {title: "Crisps", id: 3}];
        const expected = {Chocolate: 10, Icecream: 1, Crisps: 3};
        expect(createLookUpObject(input, "title", "id")).toEqual(expected);
    })
    test("Shoul not mutate original array", () => {
        const input = [{title: "Chocolate", id: 10}, {title: "Icecream", id: 1}, {title: "Crisps", id: 3}];
        const expected = [{title: "Chocolate", id: 10}, {title: "Icecream", id: 1}, {title: "Crisps", id: 3}];
        createLookUpObject(input, "title", "id");
        expect(input).toEqual(expected);
    })
})