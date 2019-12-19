#!/usr/bin/env node
var path = require("path");
const ps = require("process");
global.documents = [];
// if (ps.argv.length === 2) {
//   throw new Error(
//     "This command requires that you specify a documentations file"
//   );
// }
const documentationPath =
  ps.argv.length === 2 ? ps.env.PWD : ps.argv[ps.argv.length - 1];
const {
  asyncForEach,
  walk,
  isDirectory,
  verifyExtension
} = require("../lib/utils");
const generateMarkdown = require("../lib/generateMarkdown");
asyncForEach(
  ps.argv.slice(2, -1).length ? ps.argv.slice(2, -1) : [ps.env.PWD],
  async target => {
    const absolutePath = path.isAbsolute(target)
      ? target
      : path.join(__dirname, target);
    await isDirectory(absolutePath, async directory => {
      if (directory) {
        await walk(absolutePath, async function(err, results) {
          if (err) throw err;
          await asyncForEach(results, async result => {
            verifyExtension(result) &&
              (await generateMarkdown(
                path
                  .join(documentationPath, path.basename(result))
                  .substr(
                    0,
                    path
                      .join(documentationPath, path.basename(result))
                      .lastIndexOf(".")
                  ) + ".md",
                result
              ));
          });
        });
      } else {
        verifyExtension(absolutePath) &&
          (await generateMarkdown(
            path.join(
              path
                .join(documentationPath, path.basename(result))
                .substr(
                  0,
                  path
                    .join(documentationPath, path.basename(result))
                    .lastIndexOf(".")
                ) + ".md",
              result
            ),
            absolutePath
          ));
      }
    });
  }
);
ps.on("beforeExit", () => {
  console.log(
    global.documents.length
      ? global.documents.length +
          " components documented: " +
          global.documents.join("\n\t")
      : "There's no React component in the specified path"
  );
});
