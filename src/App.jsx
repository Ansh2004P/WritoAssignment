import React, { useState } from "react";
import { toast } from "react-toastify";

const DynamicTable = () => {
  const [cols, setCols] = useState(0);
  const [columns, setColumns] = useState([]);
  const [types, setTypes] = useState([]);
  const [rows, setRows] = useState(0);
  const [rowsData, setRowsData] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("String");

  const [sortCondition, setSortCondition] = useState(""); // State to hold the sort condition
  const [sortColumn, setSortColumn] = useState(""); // Column to sort by
  const [searchValue, setSearchValue] = useState(""); // Search value
  const [searchColumn, setSearchColumn] = useState(""); // Search column
  const [originalRowsData, setOriginalRowsData] = useState([]); // To hold original rows data

  const handleChange = (e, index, index2) => {
    const value = e.split(",").map((val) => val.trim());
    const isValid = validateInput(value, types[index2]);

    if (!isValid) {
      toast.error(`Invalid input for ${types[index2]} in column ${index2 + 1}`);
      return;
    }

    const fields = rowsData[index].map((r, j) => (j === index2 ? value : r));
    setRowsData(rowsData.map((rw, i) => (i === index ? fields : rw)));
  };

  const validateInput = (value, type) => {
    return value.every((val) =>
      type === "Number" ? !isNaN(val) : typeof val === "string"
    );
  };

  const addRow = () => {
    setRows((prevRows) => prevRows + 1);
    let array = Array(columns.length).fill([]);
    setRowsData((prevRowsData) => [...prevRowsData, array]);
    setOriginalRowsData((prevRowsData) => [...prevRowsData, array]); // Update original rows data
  };

  const deleteRow = (index) => {
    setRows((prevRows) => prevRows - 1);
    setRowsData((prevRowsData) => prevRowsData.filter((_, i) => i !== index));
    setOriginalRowsData((prevRowsData) =>
      prevRowsData.filter((_, i) => i !== index)
    ); // Update original rows data
  };

  const addColumn = () => {
    if (columns.length === 10) {
      return toast.dark("You can add a maximum of 10 columns!");
    }
    if (!newColumnName) {
      return toast.error("Column name is required!");
    }

    setColumns((prevColumns) => [...prevColumns, newColumnName]);
    setTypes((prevTypes) => [...prevTypes, newColumnType]);
    setRowsData((prevRowsData) => prevRowsData.map((row) => [...row, []]));
    setOriginalRowsData((prevRowsData) =>
      prevRowsData.map((row) => [...row, []])
    ); // Update original rows data

    setNewColumnName("");
    setNewColumnType("String");
  };

  const deleteColumn = (index) => {
    if (columns.length === 1) {
      return toast.dark("There should be at least 1 column!");
    }
    setColumns((prevColumns) => prevColumns.filter((_, i) => i !== index));
    setTypes((prevTypes) => prevTypes.filter((_, i) => i !== index));
    setRowsData((prevRowsData) =>
      prevRowsData.map((row) => row.filter((_, i) => i !== index))
    );
    setOriginalRowsData((prevRowsData) =>
      prevRowsData.map((row) => row.filter((_, i) => i !== index))
    ); // Update original rows data
  };

  // Sorting function based on selected column and condition
  const handleSort = () => {
    if (sortColumn === "" || sortCondition === "") {
      toast.error("Please select a column and sorting condition!");
      return;
    }

    const columnIndex = columns.indexOf(sortColumn);
    if (types[columnIndex] !== "Number") {
      toast.error("Sorting can only be applied to number columns.");
      return;
    }

    const sortedData = [...rowsData].sort((a, b) => {
      const aValue = parseFloat(a[columnIndex]);
      const bValue = parseFloat(b[columnIndex]);

      if (sortCondition === "greater") {
        return aValue >= bValue ? -1 : 1;
      } else if (sortCondition === "less") {
        return aValue <= bValue ? -1 : 1;
      }
      return 0;
    });

    setRowsData(sortedData);
  };

  // Filter function for search functionality
  const handleSearch = () => {
    if (searchColumn === "" || searchValue === "") {
      toast.error("Please select a column and enter a search value!");
      return;
    }

    const columnIndex = columns.indexOf(searchColumn);
    const filteredData = originalRowsData.filter((row) =>
      row[columnIndex].some((value) =>
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );

    setRowsData(filteredData);
  };

  // Reset search functionality
  const resetSearch = () => {
    setSearchValue("");
    setSearchColumn("");
    setRowsData(originalRowsData); // Reset to original data
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-center text-2xl font-bold mb-5">Dynamic Table</h1>

      <div className="mt-5">
        <div className="flex justify-end mb-3">
          <span className="mr-2">Columns: {columns.length}</span>
          <span className="mr-2">Rows: {rows}</span>
          <button
            onClick={addRow}
            className="bg-gray-300 text-gray-800 p-2 rounded mx-1"
          >
            Add Row
          </button>
        </div>

        <div className="mb-5 flex justify-end">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
            placeholder="Column Name"
          />
          <select
            value={newColumnType}
            onChange={(e) => setNewColumnType(e.target.value)}
            className="border border-gray-300 rounded p-2 mr-2"
          >
            <option value="String">String</option>
            <option value="Number">Number</option>
          </select>
          <button
            onClick={addColumn}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Column
          </button>
        </div>

        {/* Sorting Options */}
        <div className="flex justify-end mb-3">
          <select
            value={sortColumn}
            onChange={(e) => setSortColumn(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
          >
            <option value="">Select Column</option>
            {columns.map((col, index) =>
              types[index] === "Number" ? (
                <option key={index} value={col}>
                  {col}
                </option>
              ) : null
            )}
          </select>
          <select
            value={sortCondition}
            onChange={(e) => setSortCondition(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
          >
            <option value="">Select Condition</option>
            <option value="greater">Greater than or equal to</option>
            <option value="less">Less than or equal to</option>
          </select>
          <button
            onClick={handleSort}
            className="bg-green-500 text-white p-2 rounded"
          >
            Sort Data
          </button>
        </div>

        {/* Search Options */}
        <div className="flex justify-end mb-3">
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
          >
            <option value="">Select Column</option>
            {columns.map((col, index) => (
              <option key={index} value={col}>
                {col}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
            placeholder="Search Value"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Search
          </button>
          <button
            onClick={resetSearch}
            className="bg-red-500 text-white p-2 rounded ml-2"
          >
            Reset Search
          </button>
        </div>

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 text-center">#</th>
              {columns.map((col, index) => (
                <th key={index} className="border border-gray-300 text-center">
                  {col}
                  <button
                    onClick={() => deleteColumn(index)}
                    className="bg-red-500 text-white text-sm rounded p-1 ml-2"
                  >
                    Delete
                  </button>
                </th>
              ))}
              <th className="border border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.length > 0 ? (
              rowsData.map((row, i) => (
                <tr key={i} className="border border-gray-300">
                  <td className="border border-gray-300 text-center">
                    {i + 1}
                  </td>
                  {row.map((data, index2) => (
                    <td
                      key={index2}
                      className="border border-gray-300 text-center"
                    >
                      <input
                        type="text"
                        value={data.join(",")}
                        onChange={(e) =>
                          handleChange(e.target.value, i, index2)
                        }
                        className="border border-gray-300 p-2 w-full text-center"
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => deleteRow(i)}
                      className="bg-red-500 text-white text-sm rounded p-1 w-full"
                    >
                      Delete Row
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="text-center p-5">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
