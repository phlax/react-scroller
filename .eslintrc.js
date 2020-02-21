module.exports = {
    "extends": [
	"eslint:recommended",
	"plugin:react/recommended"
    ],
    settings: {
	"propWrapperFunctions": ["exact"]},
    env: {
	browser: true,
	"jest/globals": true
    },
    parser: "babel-eslint",
    parserOptions: {
	ecmaVersion: 6,
	ecmaFeatures: {
	    jsx: true,
	},
	sourceType: "module",
    },
    globals: {
	gettext: false,
	ngettext: false,
	interpolate: false,
	l: false,
	expect: false,
	test: false,
	browser: false,
	jest: false,
	Promise: false,
	require: false,
	shortcut: false,
	sorttable: false,
	module: false,
	global: false
    },
    plugins: [
	"react",
	"babel",
	"jest"
    ],
    rules: {
	"react/prefer-es6-class": 1,
	"react/prefer-stateless-function": 1,
	"react/prefer-stateless-function": [1, {"ignorePureComponents": true}],
	"react/prop-types": 1,
	"react/jsx-key": 1,
	"react/jsx-uses-react": 1,
	"react/jsx-uses-vars": 1,
	"babel/new-cap": 1,
	"babel/camelcase": 1,
	"babel/no-invalid-this": 1,
	"babel/object-curly-spacing": 1,
	"babel/quotes": 1,
	"babel/semi": 1,
	"babel/no-unused-expressions": 1,
	"babel/valid-typeof": 1,
	"no-unused-vars": [1, { "ignoreRestSiblings": true }]
    },
};
