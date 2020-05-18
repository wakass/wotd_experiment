## Howto make a graph

### Ngraph
We use the following libraries

* [ngraph](https://github.com/anvaka/ngraph)
* [ngraph.pixel](https://github.com/anvaka/ngraph.pixel)


### Node.js and npm

Node.js and npm (node package manager) work together in managing the node.js javascript libraries. Installing libraries is accomplished with `npm --save nameoflibrary`. This install the libraries in the node_modules directory and updates the package.json file of your own package.

[Howto use npm package in html code](https://support.glitch.com/t/how-can-i-use-npm-packages-in-html-code/12699/9
)

Use `npm install -g watchify` to install the "watch"  version of browserify (which bundles all package into bundle.js) to automatically update your bundle.js when changes occur in your code.

Have an index.js (e.g.) to store your code.
`watchify index.js -o bundle.js`.

Then in your html:
 `<script src="bundle.js"></script>`

### Collecting the xml
Uses the https package dependency to obtain the xml, jsonifies it. Then use jquery (easy to add with npm using `var $ = require('jquery');` to go through the DOM, since we post our WOTDs in a list format. 



