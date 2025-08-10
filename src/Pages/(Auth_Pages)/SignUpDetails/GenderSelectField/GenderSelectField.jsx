import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import { FaGenderless, FaMars, FaVenus } from "react-icons/fa";

const genderOptions = [
  {
    label: "Male",
    value: "male",
    icon: <FaMars className="text-blue-600" />,
  },
  {
    label: "Female",
    value: "female",
    icon: <FaVenus className="text-pink-500" />,
  },
  {
    label: "Other",
    value: "other",
    icon: <FaGenderless className="text-gray-600" />,
  },
];

export const GenderSelectField = ({ register, errors, control }) => {
  const selectedGender = useWatch({ control, name: "gender" });

  return (
    <div>
      <label className="block text-black font-playfair font-semibold text-lg mb-2">
        Gender
      </label>
      <div className="flex flex-wrap gap-4">
        {genderOptions.map(({ label, value, icon }) => (
          <label
            key={value}
            className={`cursor-pointer flex items-center gap-3 rounded-xl border px-5 py-3 shadow-sm transition-transform duration-200 ease-in-out
              ${
                selectedGender === value
                  ? "bg-blue-100 border-blue-500 scale-105"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
          >
            <input
              type="radio"
              value={value}
              {...register("gender", { required: "Gender is required" })}
              className="hidden"
              aria-checked={selectedGender === value}
              aria-label={label}
            />
            <div className="text-2xl">{icon}</div>
            <span className="text-base font-medium text-black">{label}</span>
          </label>
        ))}
      </div>
      {errors.gender && (
        <p className="text-red-600 text-sm mt-2" role="alert" id="gender-error">
          {errors.gender.message}
        </p>
      )}
    </div>
  );
};

GenderSelectField.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
};
