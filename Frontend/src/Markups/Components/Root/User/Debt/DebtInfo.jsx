// UserDebtInformationDesk.jsx
import { useState } from "react";
import "./debtInfo.css";
import AddDebt from "./AddDebt";
import DebtTable from "./DebtTable";

function DebtInfo() {
  const [view, setView] = useState("addDebt");

  const handleViewChange = (change) => {
    setView(change);
  };

  return (
    <div className="mt-4 w-full flex justify-center">
      <div className="items-center ">
        <header className=" items-center">
          <nav>
            <ul>
              <li>
                <button
                  onClick={() =>
                    view == "addDebt"
                      ? handleViewChange("viewDebt")
                      : handleViewChange("addDebt")
                  }
                  className="p-3 bg-[#141430] border-neutral-50 rounded-xl "
                >
                  {view == "addDebt" ? "View Debt" : "Add Debt"}
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <div className="contentDebt ">
          {view === "addDebt" && <AddDebt />}
          {view === "viewDebt" && <DebtTable />}
        </div>
      </div>
    </div>
  );
}
export default DebtInfo;
