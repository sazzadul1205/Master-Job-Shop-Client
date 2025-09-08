import { useEffect, useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Shared
import FormInput from "../../../../Shared/FormInput/FormInput";
import TagInput from "../../../../Shared/TagInput/TagInput";
import WeeklyPlanInput from "./WeeklyPlanInput/WeeklyPlanInput";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Hooks
import useAuth from "../../../../Hooks/useAuth";

// Category Options
const CategoryOptions = [
  {
    value: "technology",
    label: "Technology",
    subcategories: [
      "AI",
      "Web Development",
      "Mobile Development",
      "Cloud Computing",
      "DevOps",
      "Data Science",
      "Cybersecurity",
      "Blockchain",
      "Game Development",
      "UI/UX Design",
      "Software Engineering",
      "IoT",
      "AR/VR",
      "Quantum Computing",
    ],
  },
  {
    value: "business",
    label: "Business & Finance",
    subcategories: [
      "Finance",
      "Investing",
      "Marketing",
      "Sales",
      "Management",
      "Entrepreneurship",
      "Business Strategy",
      "Project Management",
      "Accounting",
      "Economics",
      "E-commerce",
      "Startups",
    ],
  },
  {
    value: "arts",
    label: "Arts & Creative",
    subcategories: [
      "Music",
      "Design",
      "Writing",
      "Film & Media",
      "Painting",
      "Photography",
      "Graphic Design",
      "Sculpture",
      "Fashion Design",
      "Animation",
      "Interior Design",
      "Creative Writing",
    ],
  },
  {
    value: "science",
    label: "Science & Research",
    subcategories: [
      "Physics",
      "Biology",
      "Chemistry",
      "Astronomy",
      "Mathematics",
      "Engineering",
      "Environmental Science",
      "Geology",
      "Research Methodology",
      "Statistics",
      "Genetics",
    ],
  },
  {
    value: "health",
    label: "Health & Wellness",
    subcategories: [
      "Yoga",
      "Fitness",
      "Medicine",
      "Nutrition",
      "Meditation",
      "Mental Health",
      "Physiotherapy",
      "Public Health",
      "Alternative Medicine",
      "Wellness Coaching",
    ],
  },
  {
    value: "personal_dev",
    label: "Personal Development & Education",
    subcategories: [
      "Leadership",
      "Study Skills",
      "Career Guidance",
      "Public Speaking",
      "Time Management",
      "Language Learning",
      "Personal Development",
      "Critical Thinking",
      "Emotional Intelligence",
      "Mindfulness",
      "Goal Setting",
    ],
  },
  {
    value: "lifestyle",
    label: "Lifestyle & Hobbies",
    subcategories: [
      "Travel",
      "Sports",
      "Gaming",
      "Fashion",
      "Cooking",
      "Gardening",
      "Photography",
      "DIY Projects",
      "Pets & Animal Care",
      "Music Instruments",
      "Crafts",
    ],
  },
  {
    value: "social_impact",
    label: "Social Impact & Volunteering",
    subcategories: [
      "Nonprofit Management",
      "Community Service",
      "Environmental Activism",
      "Social Entrepreneurship",
      "Fundraising",
      "Advocacy",
    ],
  },
  {
    value: "tech_entrepreneurship",
    label: "Tech Entrepreneurship",
    subcategories: [
      "Startup Incubation",
      "Pitching & Funding",
      "Business Models",
      "Product Management",
      "Tech Innovation",
    ],
  },
  {
    value: "languages",
    label: "Languages & Communication",
    subcategories: [
      "English",
      "Spanish",
      "French",
      "Mandarin",
      "Japanese",
      "Public Speaking",
      "Writing Skills",
      "Communication Skills",
    ],
  },
];

const CreateMentorshipModal = () => {
  // Axios
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // States Variables
  const [loading, setLoading] = useState(null);
  const [subOptions, setSubOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Mentors
  const { data: MyMentorsData } = useQuery({
    queryKey: ["MentorsData"],
    queryFn: () =>
      axiosPublic.get(`/Mentors?email=${user?.email}`).then((res) => res.data),
  });

  // Form Handling
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tags: [],
      attachments: [],
      prerequisites: [],
      skillsCovered: [],
    },
  });

  // Skills
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  // Prerequisites
  const {
    fields: prerequisitesFields,
    append: appendPrerequisites,
    remove: removePrerequisites,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  // Attachments
  const {
    fields: attachmentsFields,
    append: appendAttachments,
    remove: removeAttachments,
  } = useFieldArray({
    control,
    name: "attachments",
  });

  // WeeklyPlan
  const {
    fields: weeklyPlanFields,
    append: appendWeeklyPlan,
    remove: removeWeeklyPlan,
  } = useFieldArray({
    control,
    name: "weeklyPlan",
  });

  // skillsCovered
  const {
    fields: skillsCoveredFields,
    append: AppendSkillsCovered,
    remove: RemoveSkillsCovered,
  } = useFieldArray({
    control,
    name: "skillsCovered",
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

  // Close Modal and Clear Errors
  const handleClose = () => {
    setErrorMessage("");
    setSubOptions([]);
    reset();
  };

  // Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);

    const payload = {
      ...data,
      status: "active",
      postedAt: new Date(),
      Mentor: {
        name: MyMentorsData?.name || "",
        profileImage: MyMentorsData?.avatar || "",
        bio: MyMentorsData?.description || "",
        rating: MyMentorsData?.rating || "0.0",
        positions: MyMentorsData?.positions || "",
      },
    };

    console.log("payload :", payload);
  };

  return (
    <div
      id="Create_Mentorship_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("Create_Mentorship_Modal").close();
          handleClose();
        }}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        Create Mentor Profile
      </h3>

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
        {/* Basic Info Section */}
        <div className="space-y-4">
          {/* Title */}
          <FormInput
            label="Title"
            required
            placeholder="Mentorship Title..."
            register={register("title", { required: "Title is required" })}
            error={errors.title}
          />

          {/* Description */}
          <FormInput
            as="textarea"
            label="Description"
            required
            placeholder="Enter mentorship description..."
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full py-2 rounded shadow ${
            loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {loading ? "Creating..." : "Create Mentor Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateMentorshipModal;
