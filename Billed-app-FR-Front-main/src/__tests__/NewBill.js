/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("if upload justify file png format", () => {
      const file = new File(["file"], "file.png", { type: "image/png" });
    });

    test("if upload justify file text format", () => {
      const file = new File(["file"], "file.txt", { type: "text/plain" });
    });
  })
})
