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
      attachments: [],
      prerequisites: [],
      skillsCovered: [],
      WeeklyPlan: [],
      skills: [],
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
        position: MyMentorsData?.position || "",
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
        {/* Divider */}
        <p className="bg-gray-500 h-[1px] w-full" />

        {/* Fee & Payment */}
        <div className="space-y-3">
          {/* Header */}
          <h3 className="font-semibold text-lg">Fee & Payment</h3>

          {/* Divider */}
          <p className="bg-gray-500 p-[1px] my-2" />

          {/* Free Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFree"
              {...register("fee.isFree")}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="isFree" className="text-gray-700 font-medium">
              Free Mentorship
            </label>
          </div>

          {/* All fee inputs (conditionally disabled if Free) */}
          <div className="grid grid-cols-2 items-center gap-4">
            {/* Fee Type */}
            <FormInput
              label="Fee Type"
              required
              as="select"
              placeholder="-- Select Fee Type --"
              register={register("fee.type", {
                required: !watch("fee.isFree") ? "Fee type is required" : false,
              })}
              error={errors?.fee?.type}
              disabled={watch("fee.isFree")}
              options={[
                { value: "fixed", label: "Fixed" },
                { value: "hourly", label: "Hourly" },
                { value: "perSession", label: "Per Session" },
                { value: "weekly", label: "Weekly" },
              ]}
            />

            {/* Amount */}
            <FormInput
              label="Amount"
              type="number"
              placeholder="e.g., 50"
              required
              register={register("fee.amount", {
                required: !watch("fee.isFree") ? "Amount is required" : false,
                valueAsNumber: true,
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              error={errors?.fee?.amount}
              disabled={watch("fee.isFree")}
            />

            {/* Currency */}
            <FormInput
              label="Currency"
              required
              as="select"
              placeholder="-- Select Currency --"
              register={register("fee.currency", {
                required: !watch("fee.isFree") ? "Currency is required" : false,
              })}
              error={errors?.fee?.currency}
              disabled={watch("fee.isFree")}
              options={[
                { value: "USD", label: "USD ($)" },
                { value: "EUR", label: "EUR (€)" },
                { value: "GBP", label: "GBP (£)" },
                { value: "BDT", label: "BDT (৳)" },
                { value: "INR", label: "INR (₹)" },
              ]}
            />

            {/* Payment Method */}
            <FormInput
              label="Payment Method"
              required
              as="select"
              placeholder="-- Select Payment Method --"
              register={register("fee.paymentMethod", {
                required: !watch("fee.isFree")
                  ? "Payment method is required"
                  : false,
              })}
              error={errors?.fee?.paymentMethod}
              disabled={watch("fee.isFree")}
              options={[
                { value: "paypal", label: "PayPal" },
                { value: "stripe", label: "Stripe" },
                { value: "bankTransfer", label: "Bank Transfer" },
                {
                  value: "mobilePayment",
                  label: "Mobile Payment (bKash, Paytm, etc.)",
                },
                { value: "other", label: "Other" },
              ]}
            />

            {/* Confirmation Type */}
            <FormInput
              label="Confirmation Type"
              required
              as="select"
              placeholder="-- Select Confirmation Type --"
              register={register("fee.confirmationType", {
                required: !watch("fee.isFree")
                  ? "Confirmation type is required"
                  : false,
              })}
              error={errors?.fee?.confirmationType}
              disabled={watch("fee.isFree")}
              options={[
                { value: "receiptLink", label: "Receipt Link (URL)" },
                { value: "transactionId", label: "Transaction ID" },
                { value: "screenshot", label: "Screenshot Upload" },
                { value: "referenceNumber", label: "Bank Reference Number" },
              ]}
            />

            {/* Negotiable */}
            <div className="flex flex-col justify-center">
              <label
                htmlFor="negotiable"
                className="block font-medium text-sm mb-1"
              >
                Negotiable
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  {...register("fee.negotiable")}
                  disabled={watch("fee.isFree")}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <span className="text-gray-700 text-sm">Yes</span>
              </div>
            </div>
          </div>
          {/* Payment Link */}
          <FormInput
            label="Payment Link"
            placeholder="e.g., https://paypal.me/username"
            register={register("fee.paymentLink")}
            error={errors?.fee?.paymentLink}
            disabled={watch("fee.isFree")}
          />
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
