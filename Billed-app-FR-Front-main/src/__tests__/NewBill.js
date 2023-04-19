/**
 * @jest-environment jsdom
 */
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes";
import { localStorageMock } from '../__mocks__/localStorage'
import BillsUI from '../views/BillsUI.js'
import NewBillUI from '../views/NewBillUI'
import NewBill from '../containers/NewBill'
import {fileValidation} from "../app/format.js";

jest.mock("../app/Store", () => mockStore);

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock } )
  window.localStorage.setItem( "user", JSON.stringify( { type: "Employee" } ) )
  document.body.innerHTML = NewBillUI()
  const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
  const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
})

describe("Given I am connected", () => {
  describe("And test Uploaded files", () => {

    test("Png format", async () => {
      const filePNG = new File(['hello'], 'hello.png', {type: 'image/png'})
      await waitFor(() => screen.getByTestId("file"))
      const InputFile = screen.getByTestId("file")
      userEvent.upload(InputFile, filePNG)
      expect(InputFile.files[0].name).toEqual("hello.png")
      const valid = fileValidation(filePNG)
      expect(valid).toBeTruthy()
    })

    test("text format", async () => {
      const fileText = new File(['hello'], 'hello.txt', {type: 'text/plain'})
      await waitFor(() => screen.getByTestId("file"))
      const InputFile = screen.getByTestId("file")
      userEvent.upload(InputFile, fileText)
      userEvent.click(InputFile)
      expect(screen.getByTestId('alertFormat')).toBeTruthy()
      const noValid = fileValidation(fileText)
      expect(noValid).not.toBeTruthy()
    })

  })
})
