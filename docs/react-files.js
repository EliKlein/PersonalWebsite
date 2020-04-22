const fs = require('fs');

for (let i = 2; i < process.argv.length; i++) {
  let base = process.argv[i];
  // if (process.argv[i][0] === "-") {
  //   throw new Error("There are no '-' arguments for this command");
  // }

  fs.appendFile(`src/${base}.js`, `import React from 'react';
import './${base}.css';

function ${base}({}) {
  return (
    <>
    </>
  )
}

export default ${base};`, function (err) {
    console.log(err);
  });

  // Smoke test, snapshot test
  fs.appendFile(`tests/${base}.test.js`, `import React from 'react';
import {render} from '@testing-library/react';
import ${base} from './${base}'

it('renders without crashing', function(){
  render(<${base}/>);
});

it('matches snapshot', function(){
  const {asFragment} = render(<${base}/>);
  expect(asFragment()).toMatchSnapshot();
});`, function (err) {
    console.log(err);
  });

  fs.appendFile(`src/${base}.css`, `.${base}{
  /* CSS HERE */
}`, function (err) {
    console.log(err);
  });
}
