const EOF = Symbol('EOF'); // End of file

function data(c) {
    if (c == '<') {
    } else if(c == EOF) {
        return ;
    }else {
        return data;
    }
}

function tagOpen(c) {
    if(c === '/') {
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    }else {

    }
}


function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if(c == '/') {
        return selfClosingStartTag;
    }else if(c.match(/^[A-Z]$/)) {
        return tagName;
    }else if(c == '>') {

    }else {
        return tagName;
    }
}

function beforeAttributeName() {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if(c === '/' || c === '>' || c === EOF) {
        return afterAttributeName;
    }else if(c === '=') {

    }else {

        return attributeName(c)
    }
}

function attributeName(c) {
    if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    }else if(c === '=') {
        return beforeAttributeValue;
    }else if(c === '\u0000') {

    }else if(c === '\"' || c === '\'' || c === '<') {

    }else {
        return beforeAttributeName;
    }
}

function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue;
    }else if(c === '\"') {
        return doubleQuoteAttributeValue;
    }else if(c === '\'') {
        return singleQuoteAttributeValue;
    }else if(c === '>') {

    }else {
        return unquoteAttributeValue(c);
    }
}

function doubleQuoteAttributeValue(c) {
    if(c == '\"') {
        return afterQuoteAttributeValue;
    } else if(c == '\u0000') {

    }else if(c == EOF) {

    }else {
        return doubleQuoteAttributeValue;
    }
}

function singleQuoteAttributeValue(c){
    if(c == '\'') {
        return afterQuoteAttributeValue;
    }else if(c == '\u0000') {

    }else if(c === EOF){

    }else {
        return doubleQuoteAttributeValue;
    }
}

function afterQuoteAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if(c == '/') {
        return selfClosingStartTag;
    }else if(c === '>') {

    }else if(c == EOF){

    }else {
        return doubleQuoteAttributeValue;
    }
}

function unquoteAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {

    }else if(c === '/') {
        return selfClosingStartTag;
    }else if(c === '>') {
        return data;
    }else if(c === '\u0000'){

    }else if(c == '\"' || c == '\'' || c == '<' || c == '=' || c == '`') {

    }else if(c === EOF) {

    }else {
        return unquoteAttributeValue;
    }
}

function afterAttributeName(c) {
    if(c.match(/^[\t\n\f]$/)) {
        return afterAttributeName;
    }else if(c == '/') {
        return selfClosingStartTag;
    }else if(c == '>') {
        return data;
    }else if(c == EOF) {

    }else {
        return attributeName(c)
    }
}

function selfClosingStartTag(c) {
    if(c == '>') {
        return data;
    }else if(c === 'EOF') {

    }else {

    }
}

function endTagOpen(c) {
    if(c.match(/^[a-zA-Z]$/)) {

        return tagName(c)
    }else if(c == '>') {

    }else if(c == EOF) {

    }else {

    }
}




module.exports = function parcerHTML(htmlString) {
    console.log(htmlString);
    let state = data;
    for (let c of htmlString) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
};
