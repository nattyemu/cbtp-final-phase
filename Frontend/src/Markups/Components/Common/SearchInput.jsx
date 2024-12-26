import React, { useState } from "react";

function SearchInput({
  setSendSearch,
  placeholder = "Search...",
  maxLength = 23,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch();
  };

  const handleSearch = () => {
    const isStudentIdPattern =
      /^[a-zA-Z\d]*\/\d+$/.test(searchTerm) ||
      /^\d+\/\d+$/.test(searchTerm) ||
      /^\d+$/.test(searchTerm);

    if (isStudentIdPattern) {
      setSendSearch({ studentId: searchTerm });
    } else {
      setSendSearch({ firstName: searchTerm });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex mb-10 ">
      <input
        type="text"
        placeholder={placeholder}
        className="p-2]  ml-[130px]  rounded-md border border-gray-300 focus:outline-none focus:ring-2 "
        value={searchTerm}
        onChange={handleInputChange}
        maxLength={maxLength}
        onKeyDown={handleKeyPress}
      />
      <button
        className="ml-3 px-5 py-2 bg-[#141430] text-white rounded-md"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}

export default SearchInput;
