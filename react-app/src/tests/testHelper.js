import React from "react";
import { render } from "@testing-library/react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";

export function renderWithRouter(children, initialPath = "/") {
  const history = createMemoryHistory();
  history.push(initialPath);
  return render(<Router history={history}>{children}</Router>);
}
