import marked from 'marked';

const options = {};
const text = 'I am using __markdown__.';
const lexer = new marked.Lexer(options);
const tokens = lexer.lex(text);
console.log(tokens);
console.log(lexer.rules);
console.log(marked(text));
