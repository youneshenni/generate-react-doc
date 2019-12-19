const fs = require("fs");
const rendererClass = require("react-docgen-markdown-renderer");
const renderer = new rendererClass();

module.exports = (documentationPath, componentPath) =>
  fs.readFile(componentPath, (error, content) => {
    if (error) throw error;
    try {
      const doc = require("react-docgen").parse(content);
      fs.writeFile(
        documentationPath,
        renderer.render(
          /* The path to the component, used for linking to the file. */
          componentPath,
          /* The actual react-docgen AST */
          doc,
          /* Array of component ASTs that this component composes*/
          []
        ),
        err => {
          if (err) throw err;
          else global.documents.push(documentationPath);
        }
      );
    } catch (err) {
      if (err.message === "No suitable component definition found.")
        console.error(err.message.slice(0, -1) + " in " + componentPath);
      else if ((err.code = "BABEL_PARSE_ERROR")) {
        console.error(err.message.slice(0, -1) + " in file " + componentPath);
      } else throw err;
    }
  });
