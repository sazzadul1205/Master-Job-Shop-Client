// Packages
import PropTypes from "prop-types";

// Icons
import { FaTrash } from "react-icons/fa";

// Shared
import FormInput from "../../../../../Shared/FormInput/FormInput";

const WeeklyPlanInput = ({ fields, append, remove, register, errors }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h4 className="font-semibold text-lg">Weekly Breakdown (Optional) </h4>

      {/* Weekly Plan */}
      {fields.map((week, index) => (
        <div
          key={week.id}
          className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white space-y-4 relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            {/* Week Number */}
            <h5 className="font-semibold text-base text-gray-800">
              Week {index + 1}
            </h5>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full cursor-pointer shadow hover:shadow-xl"
              title="Delete Week"
            >
              <FaTrash className="text-base" />
            </button>
          </div>

          {/* Week Number */}
          <FormInput
            label="Week Number"
            type="number"
            required
            register={register(`weeklyPlan.${index}.weekNo`, {
              required: "Week number is required",
              min: { value: 1, message: "Week must be 1 or higher" },
            })}
            error={errors?.weeklyPlan?.[index]?.weekNo}
            placeholder="e.g., 1"
          />

          {/* Topic */}
          <FormInput
            label="Topic / Focus"
            type="text"
            required
            placeholder="e.g., Resume building"
            register={register(`weeklyPlan.${index}.topic`, {
              required: "Topic is required",
              minLength: {
                value: 3,
                message: "Topic should be at least 3 characters",
              },
            })}
            error={errors?.weeklyPlan?.[index]?.topic}
          />

          {/* Objectives */}
          <FormInput
            label="Objectives"
            as="textarea"
            rows={3}
            placeholder="Key outcomes for this week"
            register={register(`weeklyPlan.${index}.objectives`, {
              maxLength: {
                value: 500,
                message: "Objectives should not exceed 500 characters",
              },
            })}
            error={errors?.weeklyPlan?.[index]?.objectives}
          />

          {/* Resources */}
          <FormInput
            label="Resources / Assignments"
            as="textarea"
            rows={3}
            placeholder="Links, tasks, or articles"
            register={register(`weeklyPlan.${index}.resources`)}
            error={errors?.weeklyPlan?.[index]?.resources}
          />

          {/* Notes */}
          <FormInput
            label="Extra Notes (Optional)"
            as="textarea"
            rows={2}
            placeholder="Guest speaker, Q&A session, etc."
            register={register(`weeklyPlan.${index}.notes`)}
            error={errors?.weeklyPlan?.[index]?.notes}
          />
        </div>
      ))}

      {/* Add Week Button */}
      <button
        type="button"
        onClick={() =>
          append({
            weekNo: fields.length + 1,
            topic: "",
            objectives: "",
            resources: "",
            notes: "",
          })
        }
        className="btn btn-primary btn-sm"
      >
        + Add Week
      </button>
    </div>
  );
};

WeeklyPlanInput.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      weekNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      topic: PropTypes.string,
      objectives: PropTypes.string,
      resources: PropTypes.string,
      notes: PropTypes.string,
    })
  ).isRequired,
  append: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default WeeklyPlanInput;
