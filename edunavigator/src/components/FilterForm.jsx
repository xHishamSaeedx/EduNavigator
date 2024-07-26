import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FilterForm.css"; // Import CSS for pagination styling

const FilterForm = () => {
  const [filters, setFilters] = useState({
    caste: "All",
    rank: 0,
    place: "All",
    dist: "All",
    coed: "All",
    type_: "All",
    branch: "All",
    tuitionFeeMax: 0,
    affiliated: "All",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    PLACE: [],
    DIST: [],
    COED: [],
    TYPE: [],
    BRANCH: [],
    AFFILIATED: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Change this value to adjust the number of items per page

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === "tuitionFeeMax" ? Number(value) : value,
    }));
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/filter_options/");
      setFilterOptions(response.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchFilteredData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/filter_colleges/",
        filters
      );
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFilteredData();
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get column names from the filtered data for table headers
  const columns = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

  return (
    <div>
      <h1>College Finder</h1>
      <button className="toggle-filters" onClick={toggleFilters}>
        {showFilters ? "Close Filters" : "FIND YOUR DREAM COLLEGE"}
      </button>
      {showFilters && (
        <form onSubmit={handleSubmit}>
          <h2>Filter Colleges</h2>
          <label>
            Select your caste:
            <select
              name="caste"
              value={filters.caste}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="OC BOYS">OC BOYS</option>
              <option value="OC GIRLS">OC GIRLS</option>
              <option value="BC_A BOYS">BC_A BOYS</option>
              <option value="BC_A GIRLS">BC_A GIRLS</option>
              <option value="BC_B BOYS">BC_B BOYS</option>
              <option value="BC_B GIRLS">BC_B GIRLS</option>
              <option value="BC_C BOYS">BC_C BOYS</option>
              <option value="BC_C GIRLS">BC_C GIRLS</option>
              <option value="BC_D BOYS">BC_D BOYS</option>
              <option value="BC_D GIRLS">BC_D GIRLS</option>
              <option value="BC_E BOYS">BC_E BOYS</option>
              <option value="BC_E GIRLS">BC_E GIRLS</option>
              <option value="SC BOYS">SC BOYS</option>
              <option value="SC GIRLS">SC GIRLS</option>
              <option value="ST BOYS">ST BOYS</option>
              <option value="ST GIRLS">ST GIRLS</option>
              <option value="EWS GEN OU">EWS GEN OU</option>
              <option value="EWS GIRLS OU">EWS GIRLS OU</option>
            </select>
          </label>
          {filters.caste !== "All" && (
            <label>
              Enter your rank:
              <input
                type="number"
                name="rank"
                value={filters.rank}
                onChange={handleFilterChange}
                min="0"
              />
            </label>
          )}
          <label>
            Select PLACE:
            <select
              name="place"
              value={filters.place}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filterOptions.PLACE.map((place, index) => (
                <option key={index} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </label>
          <label>
            Select DIST:
            <select
              name="dist"
              value={filters.dist}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filterOptions.DIST.map((dist, index) => (
                <option key={index} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </label>
          <label>
            Select COED:
            <select
              name="coed"
              value={filters.coed}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filterOptions.COED.map((coed, index) => (
                <option key={index} value={coed}>
                  {coed}
                </option>
              ))}
            </select>
          </label>
          <label>
            Select TYPE:
            <select
              name="type_"
              value={filters.type_}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filterOptions.TYPE.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Select BRANCH:
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filterOptions.BRANCH.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>
          <label>
            Maximum Tuition Fee:
            <input
              type="number"
              name="tuitionFeeMax"
              value={filters.tuitionFeeMax}
              onChange={handleFilterChange}
              min="0"
            />
          </label>
          <label>
            Select AFFILIATED:
            <select
              name="affiliated"
              value={filters.affiliated}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filterOptions.AFFILIATED.map((affiliated, index) => (
                <option key={index} value={affiliated}>
                  {affiliated}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Apply Filters</button>
        </form>
      )}
      <div>
        <h2>Results</h2>
        {currentItems.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col, idx) => (
                      <td key={idx}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="pagination-scroll">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-button ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default FilterForm;
