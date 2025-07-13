import PropTypes from "prop-types";
import { useState } from "react";

const BlogTagInput = ({ register, setValue, errors }) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setValue("tags", updatedTags); // react-hook-form update
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setValue("tags", updatedTags);
  };

  return (
    <div className="flex flex-col">
      <label className="font-medium playfair pb-2">
        Tags (press Enter to add)
      </label>

      {/* Tag Input Area */}
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded min-h-[42px] bg-white"
        onClick={() => document.getElementById("tag-input")?.focus()}
      >
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-300 transition"
            onClick={() => removeTag(tag)}
          >
            <span>#{tag}</span>
            <span className="text-xs font-bold">×</span>
          </div>
        ))}
        <input
          id="tag-input"
          type="text"
          placeholder="Add a tag"
          className="flex-1 min-w-[120px] border-none focus:outline-none text-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Hidden field for form submission */}
      <input
        type="hidden"
        {...register("tags", { required: true })}
        value={tags.join(",")}
      />

      {/* Error message */}
      {errors.tags && (
        <span className="text-red-500 text-sm mt-1">Tags are required</span>
      )}
    </div>
  );
};

// Prop Validation
BlogTagInput.propTypes = {
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default BlogTagInput;
