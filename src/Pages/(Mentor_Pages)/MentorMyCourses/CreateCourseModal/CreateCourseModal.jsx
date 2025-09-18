import { useEffect, useState } from "react";
// Packages
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { FaChevronRight, FaPaste } from "react-icons/fa";
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
import { TypeOptions } from "../../../../Shared/Lists/TypeOptions";
import { CurrencyOptions } from "../../../../Shared/Lists/CurrencyOptions";
import { PaymentMethodOptions } from "../../../../Shared/Lists/PaymentMethodOptions";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

// Helper: format yyyy-mm-dd -> 25 Aug 2023
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // Watch category selection
  const selectedCategory = watch("category");

  // Fetch Mentors
  const { data: MyMentorsData } = useQuery({
    queryKey: ["MentorsData"],
    queryFn: () =>
      axiosPublic.get(`/Mentors?email=${user?.email}`).then((res) => res.data),
  });

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

  // Modules
  const {
    fields: modulesFields,
    append: appendModules,
    remove: removeModules,
  } = useFieldArray({
    control,
    name: "modules",
  });

  // Skills Covered
  const {
    fields: skillsCoveredFields,
    append: appendSkillsCovered,
    remove: removeSkillsCovered,
  } = useFieldArray({
    control,
    name: "skillsCovered",
  });

  // Learning Activity
  const {
    fields: learningActivityFields,
    append: appendLearningActivity,
    remove: removeLearningActivity,
  } = useFieldArray({
    control,
    name: "learningActivity",
  });

  // Prerequisites
  const {
    fields: PrerequisitesFields,
    append: appendPrerequisites,
    remove: removePrerequisites,
  } = useFieldArray({
    control,
    name: "prerequisites",
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
    setLoading(true);
    setErrorMessage("");

    // Format dates before saving
    const formattedStart = formatDate(data.startDate);
    const formattedEnd = formatDate(data.endDate);

    try {
      // Prepare payload
      const payload = {
        ...data,
        tags: data.tags?.map((item) => ({ value: item.value })) || [],
        skills: data.skills?.map((item) => ({ value: item.value })) || [],
        attachments:
          data.attachments?.map((item) => ({ value: item.value })) || [],
        modules: modulesFields?.map((item) => ({ value: item.value })) || [],
        skillsCovered:
          skillsCoveredFields?.map((item) => ({ value: item.value })) || [],
        learningActivity:
          learningActivityFields?.map((item) => ({ value: item.value })) || [],
        prerequisites:
          PrerequisitesFields?.map((item) => ({ value: item.value })) || [],
        endDate: formattedEnd,
        startDate: formattedStart,
        status: "closed",
        postedAt: new Date().toISOString(),
        Mentor: {
          name: MyMentorsData?.name || "",
          email: MyMentorsData?.email || "",
          profileImage: MyMentorsData?.avatar || "",
          bio: MyMentorsData?.description || "",
          rating: MyMentorsData?.rating || "0.0",
          position: MyMentorsData?.position || "",
        },
        archived: false,
      };

      // POST Request
      // await axiosPublic.post("/Mentorship", payload);
      console.log("Payload :", payload);

      // Close Modal and Reset
      handleClose();

      // Success Message
      Swal.fire({
        icon: "success",
        title: "Mentor Profile Created",
        text: "Your Mentor profile was saved successfully.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error creating mentorship:", err);
      console.log("Error", err);
      setErrorMessage("Failed to create mentorship. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
        {/* Course Structure */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center gap-2 text-lg font-semibold pb-0 mb-0">
            <FaChevronRight className="text-gray-500s" /> Course Structure
          </h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] mt-2 mb-5" />

          {/* Duration & Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {/* Duration */}
            <FormInput
              label="Total Duration (In Hours)"
              type="number"
              required
              placeholder="Enter total Hours"
              register={register("durationHours", {
                required: "Total duration is required",
                min: { value: 1, message: "Duration must be at least 1 hour" },
              })}
              error={errors.durationHours}
            />

            {/* Number of Modules */}
            <FormInput
              label="Number Of Modules"
              type="number"
              required
              placeholder="Enter Number of Modules"
              register={register("modulesNumber", {
                required: "Modules are required",
                min: { value: 1, message: "There must be at least 1 module" },
              })}
              error={errors.modules}
            />
          </div>

          {/* Modules TagInput */}
          <TagInput
            items={modulesFields}
            appendItem={appendModules}
            removeItem={removeModules}
            showNumbers={true}
            label="Modules Name"
            placeholder="Add a Module"
          />

          {/* Skills Covered TagInput */}
          <TagInput
            items={skillsCoveredFields}
            appendItem={appendSkillsCovered}
            removeItem={removeSkillsCovered}
            showNumbers={true}
            label="Skills Covered"
            placeholder="Add a Covered Skilled"
          />

          {/* Learning Activity TagInput */}
          <TagInput
            items={learningActivityFields}
            appendItem={appendLearningActivity}
            removeItem={removeLearningActivity}
            showNumbers={true}
            label="Learning Activity"
            placeholder="Add a Learning Activity"
          />

          {/* Prerequisites TagInput */}
          <TagInput
            items={PrerequisitesFields}
            appendItem={appendPrerequisites}
            removeItem={removePrerequisites}
            showNumbers={true}
            label="Prerequisites"
            placeholder="Add a Prerequisite"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow 
            ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourseModal;
