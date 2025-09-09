import PropTypes from "prop-types";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); // e.g. Aug 23, 2001
};

const FormInput = ({
  label,
  required = false,
  placeholder,
  register,
  error,
  type = "text",
  as = "input",
  rows = 4,
  options = [],
  disabled = false,
  watch, // NEW: pass watch from react-hook-form
  name, // NEW: input name
}) => {
  // Watch the value for formatting (only for date type)
  const value = watch && name ? watch(name) : "";

  return (
    <div className="w-full space-y-1">
      {/* Label */}
      <label className="block font-medium text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input, Textarea, or Select */}
      {as === "textarea" ? (
        <textarea
          {...register}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={`textarea textarea-bordered w-full bg-white text-black border ${
            error ? "border-red-500" : "border-black"
          } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
        />
      ) : as === "select" ? (
        <select
          {...register}
          defaultValue=""
          disabled={disabled}
          className={`select select-bordered w-full bg-white text-black border ${
            error ? "border-red-500" : "border-black"
          } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...register}
          placeholder={placeholder}
          disabled={disabled}
          className={`input input-bordered w-full bg-white text-black border ${
            error ? "border-red-500" : "border-black"
          } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
        />
      )}

      {/* Show formatted date preview */}
      {type === "date" && value && (
        <p className="text-xs text-gray-600 italic">{formatDate(value)}</p>
      )}

      {/* Error Message */}
      {error && !disabled && (
        <p className="text-red-500 text-sm">{error.message || "Required"}</p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  rows: PropTypes.number,
  type: PropTypes.string,
  error: PropTypes.object,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  register: PropTypes.object.isRequired,
  as: PropTypes.oneOf(["input", "textarea", "select"]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  disabled: PropTypes.bool,
  watch: PropTypes.func,
  name: PropTypes.string,
};

export default FormInput;
