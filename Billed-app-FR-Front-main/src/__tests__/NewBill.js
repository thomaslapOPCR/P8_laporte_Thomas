/**
 * @jest-environment jsdom
 */
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes";
import { localStorageMock } from '../__mocks__/localStorage'
import BillsUI from '../views/BillsUI.js'
import NewBillUI from '../views/NewBillUI'
import NewBill from '../containers/NewBill'
import {fileValidation,getByTextRegex} from "../app/format.js";
import Router from '../app/Router'

jest.mock("../app/Store", () => mockStore);

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock } )
  window.localStorage.setItem( "user", JSON.stringify( { type: "Employee" , email: "a@a"} ) )
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
      // userEvent.click(InputFile)
      // expect(screen.getByTestId('alertFormat')).not.toBeInTheDocument();
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

  describe("create new bill", () => {
    test("send bill API POST", async () => {
      // utilise beforeEach
      const content = await screen.getAllByText("Envoyer une note de frais");
      expect(content).toBeTruthy();
    })
  })


  describe("write new bill form", () => {
    test("Then send form", async () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock } )
      window.localStorage.setItem( "user", JSON.stringify( { type: "Employee" , email: "a@a"} ) )
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})

      expect(screen.getByTestId("expense-name").value).toBe("");
      expect(screen.getByTestId("datepicker").value).toBe("");
      expect(screen.getByTestId("amount").value).toBe("");
      expect(screen.getByTestId("vat").value).toBe("");
      expect(screen.getByTestId("pct").value).toBe("");
      expect(screen.getByTestId("file").value).toBe("");

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(form).toBeTruthy();
    });
  })


  describe("When an error on API",()=> {
    test("500 error message", async () => {
      mockStore.bills(() => {
        return {
          create: (bills) => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })
      document.body.innerHTML = BillsUI({ error: 'Erreur 500' });
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    });

    test("404 error message", async() => {

      //Permet de mettre un espion sur une fonction qui est executée par une autre fonction test.
      jest.spyOn(mockStore, "bills");
      //Ici on appelle la fonction create() de store.js et on simule le rejet de la promesse
      mockStore.bills(() => {
        return {
          create: (bill) => {
            return Promise.reject(new Error("Erreur 404"))
          },
        }
      })
      //page 404
      document.body.innerHTML = BillsUI({ error: "Erreur 404" })
      //On s'attend à voir affichée l'erreur.
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
      })
  })
})

