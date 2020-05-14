const EOF = Symbol('EOF'); // End of file

function data(c) {
    if (c == '<') {
    } else {
        return data;
    }
}

module.exports = function parcerHTML(htmlString) {
    console.log(htmlString);
    let state = data;
    for (let c of htmlString) {
        state = state(c);
    }
    state = state(EOF);
};
