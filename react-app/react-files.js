// This is a file for Node.js to create component files for React

const fs = require('fs');

function showMeTheError(err) {
  if (err) {
    console.error(err);
  }
}

for (let i = 2; i < process.argv.length; i++) {
  let base = process.argv[i];
  // if (process.argv[i][0] === "-") {
  //   throw new Error("There are no '-' arguments for this command");
  // }
  jsFile = [
    "import React from 'react';",
    `import './${base}.css';`,
    "",
    `function ${base}({}) {`,
    "  return (",
    "    <>",
    "    </>",
    "  )",
    "}",
    `export default ${base};`
  ].join("\n");

  // Smoke test, snapshot test
  testFile = [
    "import React from 'react';",
    "import { render } from '@testing-library/react';",
    `import ${base} from '../${base}'`,
    "",
    "it('renders without crashing', function () {",
    `  render(<${base} />);`,
    "});",
    "",
    "it('matches snapshot', function () {",
    `  const { asFragment } = render(<${base} />);`,
    "  expect(asFragment()).toMatchSnapshot();",
    "});"
  ].join("\n");

  cssFile = [
    `.${base}{`,
    "  /* CSS HERE */",
    "}"
  ].join("\n");

  fs.appendFile(`src/${base}.js`, jsFile, showMeTheError);
  fs.appendFile(`src/tests/${base}.test.js`, testFile, showMeTheError);
  fs.appendFile(`src/${base}.css`, cssFile, showMeTheError);
}
