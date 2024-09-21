import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DynamicTable from "./DynamicTable";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DynamicTable />
  </StrictMode>
);
