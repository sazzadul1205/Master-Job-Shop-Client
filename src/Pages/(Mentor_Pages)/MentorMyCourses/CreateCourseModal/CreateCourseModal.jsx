import { useEffect, useState } from "react";
// Packages
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { FaPaste } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import { Tooltip } from "react-tooltip";

// Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import TagInput from "../../../../Shared/TagInput/TagInput";
import FormInput from "../../../../Shared/FormInput/FormInput";
import { LevelOptions } from "../../../../Shared/Lists/LevelOptions ";
import { LanguageOptions } from "../../../../Shared/Lists/LanguageOptions";
import { CategoryOptions } from "../../../../Shared/Lists/CategoryOptions";

// eslint-disable-next-line react/prop-types
const CreateCourseModal = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // States Variables
  const [loading, setLoading] = useState(null);
  const [subOptions, setSubOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Handling
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // Watch category selection
  const selectedCategory = watch("category");

  // Update subcategory options based on selected category
  useEffect(() => {
    const category = CategoryOptions.find((c) => c.value === selectedCategory);
    setSubOptions(
      category
        ? category.subcategories.map((sub) => ({ value: sub, label: sub }))
        : []
    );
  }, [selectedCategory]);

  // Tags
  const {
    fields: tagsFields,
    append: appendTags,
    remove: removeTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  // Close Modal and Clear Errors
  const handleClose = () => {
    // Close Modal after success
    document.getElementById("Create_Course_Modal").close();

    // Clear Errors and Loading
    setErrorMessage("");
    setLoading(false);
    setSubOptions([]);
    refetch();
    // reset();
  };

  const onSubmit = async (data) => {
    console.log("Submitted Data :", data);
  };

  return (
    <div
      id="Create_Course_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => handleClose()}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">Create New Course</h3>

      <button
        type="button"
        // onClick={handlePasteJSON}
        data-tooltip-id="pasteTooltip"
        data-tooltip-content="Paste JSON from clipboard"
        className="flex items-center gap-2 border border-amber-400 absolute top-2 left-3 z-50 p-2 rounded-xl hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <FaPaste className="text-lg" />
        <span className="hidden sm:inline">Paste</span>
      </button>

      <Tooltip id="pasteTooltip" place="bottom" effect="solid" />

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />

      {/* Alert Messages */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Modal Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Course Information */}
        <div className="space-y-4">
          {/* Title */}
          <FormInput
            label="Title"
            required
            placeholder="Course Title..."
            register={register("title", { required: "Title is required" })}
            error={errors.title}
          />

          {/* Sub Title */}
          <FormInput
            label="Sub Title"
            required
            placeholder="Course Sub Title..."
            register={register("subTitle", {
              required: "Sub Title is required",
            })}
            error={errors.subTitle}
          />

          {/* Description */}
          <FormInput
            as="textarea"
            label="Description"
            required
            placeholder="Enter Course description..."
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description}
            rows={6}
          />

          {/* Category & Subcategory */}
          <div className="flex gap-4">
            {/* Category */}
            <FormInput
              as="select"
              label="Category"
              required
              placeholder="Select a Category"
              options={CategoryOptions.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
              register={register("category", {
                required: "Category is required",
              })}
              error={errors.category}
            />

            {/* Subcategory */}
            <FormInput
              as="select"
              label="Sub Category"
              required
              placeholder="Select a Sub Category"
              options={subOptions}
              register={register("subCategory", {
                required: "Sub Category is required",
              })}
              error={errors.subCategory}
            />
          </div>

          {/* Level & Language */}
          <div className="flex gap-4">
            {/* Level */}
            <FormInput
              as="select"
              label="Level"
              required
              placeholder="Select a Level"
              options={LevelOptions}
              register={register("level", {
                required: "Level is required",
              })}
              error={errors.level}
            />

            {/* Language */}
            <FormInput
              as="select"
              label="Language"
              required
              placeholder="Select a Language"
              options={LanguageOptions}
              register={register("language", {
                required: "Language is required",
              })}
              error={errors.language}
            />
          </div>

          {/* Tags TagInput */}
          <TagInput
            items={tagsFields}
            appendItem={appendTags}
            removeItem={removeTags}
            label="Tags"
            placeholder="Add a Tag"
          />

          {/* Certificate Availability */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Label */}
            <label className="block font-medium text-gray-700 md:w-48">
              Certificate Available <span className="text-red-500">*</span>
            </label>

            {/* Toggle */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-600">No</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("certificateAvailability")}
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-6 transition-transform duration-300"></div>
              </label>

              <span className="font-semibold text-gray-600">Yes</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseModal;
