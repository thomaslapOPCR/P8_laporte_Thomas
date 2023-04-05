/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from '../__mocks__/localStorage'
import BillsUI from '../views/BillsUI.js'
import NewBillUI from '../views/NewBillUI'
import NewBill from '../containers/NewBill'
jest.mock("../app/store", () => mockStore);

beforeEach(() => {
  localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "a@a" })
  );
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
  window.onNavigate(ROUTES_PATH.NewBill);
});

afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = "";
});


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    /**
     * Test si le file est un format valide
     */
    test("I can upload a justified PNG file", async () => {

      const file = new File(["file"], "file.png", { type: "image/png" });

      const fileInput = await waitFor(() => screen.getByTestId("file"));
      userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).toStrictEqual(file);
      expect(fileInput.files).toHaveLength(1);
    });
    /**
     * Test si le ficher a un format invalide
     */
    test("I cannot upload a justified text file", async () => {

      const file = new File(["file"], "file.txt", { type: "text/plain" });
      const fileInput = await waitFor(() => screen.getByTestId("file"));
      userEvent.upload(fileInput, file);
      expect(fileInput.files).toHaveLength(1);
    });
  })
})
