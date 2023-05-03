/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event"


jest.mock("../app/store", () => mockStore)

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
  );
});

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({
    pathname,
  });
};

describe("Given I am connected as an employee", () => {


  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()

    })
    test("Then bills should be ordered from earliest to latest", () => {
      bills.map((doc)=>{doc.originalDate = doc.date ?? ''})
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe("I click on 'new bill'", () => {
      test("check if redirect on new bill", () => {

        document.body.innerHTML = BillsUI({ data: bills });
        const mockedOnNavigate = jest.fn(onNavigate);

        const BillsContainer = new Bills({
          document,
          onNavigate: mockedOnNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        // simule le click
        const newBillButton = screen.getByTestId("btn-new-bill");
        const handleClickNewBill = jest.fn(BillsContainer.handleClickNewBill())
        newBillButton.addEventListener("click", handleClickNewBill())
        userEvent.click(newBillButton);


        expect(handleClickNewBill).toHaveBeenCalled();
        expect(mockedOnNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
        expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();

      });
    })

    describe(" click  Eye icon", () => {
      test("open modal", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
            "user",
            JSON.stringify({
              type: "Employee",
            })
        );
        const html = BillsUI({
          data: bills,
        });
        document.body.innerHTML = html;

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({
            pathname,
          });
        };

        const firestore = null;
        const allBills = new Bills({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage,
        });

        $.fn.modal = jest.fn();
        const eye = screen.getAllByTestId("icon-eye")[0];
        const handleClickIconEye = jest.fn(() =>
            allBills.handleClickIconEye(eye)
        );

        eye.addEventListener("click", handleClickIconEye);
        fireEvent.click(eye);
        expect(handleClickIconEye).toHaveBeenCalled();
        const modale = document.getElementById("modaleFile");
        expect(modale).toBeTruthy();
      });

    });

    describe("When I navigate to Bills", () => {// TODO  test unitaire 404 500
      test("fetches bills API GET", async () => {

        const spyMock = jest.spyOn(mockStore, 'bills');
        const bills = await mockStore.bills().list()

        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        await waitFor(() => screen.getByText("Mes notes de frais"))
        const tableRows  = screen.getByTestId("tbody").children
        expect(spyMock).toHaveBeenCalled()
        expect(tableRows.length).toEqual(bills.length)
      })
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

      test("404 error message", async () => {
        mockStore.bills(() => {
          return {
            create: (bills) => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        document.body.innerHTML = BillsUI({ error: 'Erreur 404' });
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      });


    })
  })
})

