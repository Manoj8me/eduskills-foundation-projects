// App.test.js
import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
// import InternshipApproval from './pages/Internship/InternApproval';

test("App renders Header and Content components correctly", () => {
  // Render the App component
  const { getByText } = render(<App />);

  // Assert that the Header component is rendered
  const headerElement = getByText("Header Component");
  expect(headerElement).toBeInTheDocument();

  // Assert that the Content component is rendered
  const contentElement = getByText("Content Component");
  expect(contentElement).toBeInTheDocument();
});
