import { useState } from "react";
import PropTypes from "prop-types";
import { RxCross2 } from "react-icons/rx";

const TagInput = ({
  items = [], // default empty array
  appendItem,
  removeItem,
  label = "Items",
  placeholder = "Add new item",
  showNumbers = false, // NEW: directive from parent
}) => {
  const [newValue, setNewValue] = useState("");

  // Handle Add New Tag
  const handleAdd = () => {
    const value = newValue.trim();
    if (value) {
      // If showNumbers=true, send index automatically
      const payload = showNumbers
        ? { index: items.length + 1, value }
        : { value };
      appendItem(payload);
      setNewValue("");
    }
  };

  return (
    <div className="mb-3">
      <label className="block font-semibold text-sm mb-2 capitalize">
        {label}
      </label>

      <div className="flex flex-wrap gap-2 rounded border border-gray-700 mb-3 px-2 py-2">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => removeItem(idx)}
              className="flex items-center border border-gray-600 font-semibold text-gray-800 gap-2 px-5 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200 text-sm"
            >
              {showNumbers && <span>{item.index || idx + 1}.</span>}
              {item.value || `${label} #${idx + 1}`} <RxCross2 />
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm px-5 py-2">
            No {label.toLowerCase()} added yet.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="input input-bordered bg-white text-black border-black w-3/7"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 border border-blue-600 font-semibold text-blue-600 rounded shadow-xl hover:shadow-2xl px-5 py-1 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-500"
        >
          Add
        </button>
      </div>
    </div>
  );
};

TagInput.propTypes = {
  items: PropTypes.array,
  appendItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  showNumbers: PropTypes.bool,
};

export default TagInput;
