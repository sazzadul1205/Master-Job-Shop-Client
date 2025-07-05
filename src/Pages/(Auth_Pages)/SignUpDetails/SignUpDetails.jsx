import CommonButton from "../../../Shared/CommonButton/CommonButton";
import ImageCropper from "./ImageCropper/ImageCropper";

const SignUpDetails = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-100">
      {/* Login card container */}
      <div className="w-full max-w-lg rounded-2xl shadow-md px-3 py-10 md:px-10 md:py-10 bg-linear-to-bl from-blue-500/80 to-blue-100/80">
        {/* Heading section */}
        <div className="pb-5">
          <h4 className="text-3xl playfair font-bold text-center text-white">
            Details
          </h4>
        </div>

        {/* Forms */}
        <form onSubmit={handleSubmit(confirmAndSubmit)}>
          {/* Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10 items-center">
            {/* Left Side Data */}
            <div className="space-y-4">
              <div className="bg-white py-2 px-1 bg-linear-to-bl from-gray-100 to-gray-400">
                {/* Title */}
                <h3 className="text-black font-semibold text-xl">
                  Trainer Profile
                </h3>

                {/* Cropper Component */}
                <ImageCropper
                  onImageCropped={setProfileImage}
                  register={register}
                  errors={errors}
                />
              </div>
              <InputField
                label="Full Name"
                placeholder="John Doe"
                register={register}
                errors={errors}
                name="fullName"
                type="text"
              />
            </div>

            {/* Right Side Data */}
            <div className="space-y-4">
              <PhoneInput
                country={"bd"}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-lg "
                inputStyle={{ width: "100%", height: "40px" }}
              />

              <InputField
                label="Date of Birth"
                placeholder=""
                register={register}
                errors={errors}
                name="dob"
                type="date"
              />
              <GenderSelectField register={register} errors={errors} />
              <FitnessGoalsSelector
                selectedGoals={selectedGoals}
                setSelectedGoals={setSelectedGoals}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <CommonButton
              type="none"
              text="Create Account"
              isLoading={loading}
              loadingText="Submitting..."
              textColor="text-white"
              bgColor="OriginalRed"
              width="[300px]"
              px="px-5"
              py="py-3"
              borderRadius="rounded-xl"
              cursorStyle="cursor-pointer"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpDetails;

// Reusable Input Field Component
export const InputField = ({
  label,
  placeholder,
  register,
  errors,
  name,
  type,
}) => (
  <div>
    <label className="block text-gray-700 font-semibold text-xl pb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input w-full text-black bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
      {...register(name, { required: `${label} is required` })}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
    )}
  </div>
);
