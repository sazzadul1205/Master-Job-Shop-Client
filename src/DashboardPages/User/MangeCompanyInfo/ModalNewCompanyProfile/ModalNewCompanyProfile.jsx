import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../Pages/Shared/Loader/Loader";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Provider/AuthProvider";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalNewCompanyProfile = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const [companyCode, setCompanyCode] = useState("");
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      services: [""],
      clients: [""],
      keyProjects: [{ projectName: "", description: "", year: "" }], // Initialize with one empty project
      awards: [{ awardName: "", year: "", organization: "" }], // Initialize with one empty project
      officeLocations: [""],
      partnerships: [{ partnerName: "", since: "", description: "" }],
    },
  });

  const {
    fields: fieldsServices,
    append: appendServices,
    remove: removeServices,
  } = useFieldArray({
    control,
    name: "services",
  });

  const {
    fields: fieldsClients,
    append: appendClients,
    remove: removeClients,
  } = useFieldArray({
    control,
    name: "clients",
  });

  const {
    fields: fieldsKeyProjects,
    append: appendKeyProjects,
    remove: removeKeyProjects,
  } = useFieldArray({
    control,
    name: "keyProjects",
  });

  const {
    fields: fieldsAwards,
    append: appendAwards,
    remove: removeAwards,
  } = useFieldArray({
    control,
    name: "awards",
  });

  const {
    fields: fieldsOfficeLocations,
    append: appendOfficeLocations,
    remove: removeOfficeLocations,
  } = useFieldArray({
    control,
    name: "officeLocations",
  });

  const {
    fields: fieldsPartnerships,
    append: appendPartnerships,
    remove: removePartnerships,
  } = useFieldArray({
    control,
    name: "partnerships",
  });

  useEffect(() => {
    if (fieldsServices.length === 0) {
      appendServices(""); // Automatically add an empty field if none exist
    }
    if (fieldsClients.length === 0) {
      appendClients(""); // Automatically add an empty field if none exist
    }
    if (fieldsKeyProjects.length === 0) {
      appendKeyProjects({ projectName: "", description: "", year: "" }); // Automatically add an empty project if none exist
    }
    if (fieldsAwards.length === 0) {
      appendAwards({ awardName: "", year: "", organization: "" }); // Automatically add an empty project if none exist
    }
    if (fieldsOfficeLocations.length === 0) {
      appendOfficeLocations(""); // Automatically add an empty field if none exist
    }
    if (fieldsAwards.length === 0) {
      appendAwards({ partnerName: "", since: "", description: "" }); // Automatically add an empty project if none exist
    }
  }, [
    fieldsServices,
    appendServices,
    fieldsClients,
    appendClients,
    fieldsKeyProjects,
    appendKeyProjects,
    fieldsAwards,
    appendAwards,
    fieldsOfficeLocations,
    appendOfficeLocations,
    fieldsPartnerships,
    appendPartnerships,
  ]);

  // Fetch Jobs data
  const {
    data: CompanyProfilesNamesCodes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CompanyProfilesNamesCodes"],
    queryFn: () =>
      axiosPublic.get(`/Company-Profiles-Names-Codes`).then((res) => res.data),
  });

  // Generate unique company code
  const generateUniqueCompanyCode = () => {
    let newCode;
    do {
      newCode = `CC${Math.floor(Math.random() * 1000)}`;
    } while (
      CompanyProfilesNamesCodes?.some(
        (profile) => profile.companyCode === newCode
      )
    );
    setCompanyCode(newCode);
    setValue("companyCode", newCode);
  };

  useEffect(() => {
    if (CompanyProfilesNamesCodes) {
      generateUniqueCompanyCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CompanyProfilesNamesCodes]);

  // On Submit
  const onSubmit = async (data) => {
    const formattedData = {
      companyName: data.companyName,
      companyCode: data.companyCode,
      location: data.location,
      industry: data.industry,
      website: data.website,
      postedBy: user.email, // Assuming 'user' is defined and has an 'email' property
      logo: data.logo,
      description: data.description,
      companyDetails: {
        foundingYear: data.foundingYear,
        employees: data.employees,
        revenue: data.revenue,
        ceo: data.ceo,
        services: data.services,
        clients: data.clients,
        keyProjects: data.keyProjects,
        awards: data.awards,
        officeLocations: data.officeLocations,
        partnerships: data.partnerships,
        socialMedia: {
          LinkedIn: data.LinkedIn,
          Twitter: data.Twitter,
          Facebook: data.Facebook,
        },
      },
    };

    try {
      // Make a POST request to the Company-Profiles API
      const response = await axiosPublic.post(
        "/Company-Profiles",
        formattedData
      );

      // Show success alert
      console.log(response);

      Swal.fire({
        title: "Success!",
        text: "Company profile submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      reset();
      refetch();
      document.getElementById("Create_New_Company_Profile").close();
    } catch (error) {
      console.error("Error submitting data:", error);
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "There was an error submitting the company profile. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle loading state
  if (isLoading) return <Loader />;

  // Handle error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white ">
        <p className="text-xl">Create New Company Profile</p>
        <button
          onClick={() =>
            document.getElementById("Create_New_Company_Profile").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Company Name */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Company Name:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("companyName", {
              required: "Company name is required",
            })}
            placeholder="Enter company name"
          />
          {errors.companyName && (
            <span className="text-red-500">{errors.companyName.message}</span>
          )}
        </div>

        {/* Company Code (Read-Only) */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Company Code:</label>
          <input
            className="input input-bordered w-full bg-gray-200 border-black rounded-none "
            type="text"
            {...register("companyCode", { required: true })}
            value={companyCode}
            readOnly
          />
        </div>

        {/* Location */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Location:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("location", {
              required: "Company name is required",
            })}
            placeholder="Enter location name"
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}
        </div>

        {/* Industry */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Industry:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="text"
            {...register("industry", {
              required: "Company name is required",
            })}
            placeholder="Enter industry name"
          />
          {errors.industry && (
            <span className="text-red-500">{errors.industry.message}</span>
          )}
        </div>

        {/* Website */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Website:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="url"
            {...register("website", {
              required: "Company name is required",
            })}
            placeholder="Enter website name"
          />
          {errors.website && (
            <span className="text-red-500">{errors.website.message}</span>
          )}
        </div>

        {/* Company Logo */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Company Logo:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none "
            type="url"
            {...register("logo", {
              required: "Company logo URL is required",
            })}
            placeholder="Enter company logo URL"
          />
          {errors.logo && (
            <span className="text-red-500">{errors.logo.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col md:flex-row gap-2">
          <label className="font-bold w-48 text-xl">Description:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 "
            {...register("description", { required: true })}
            placeholder="Enter job description"
          />
        </div>

        <p className="text-2xl font-bold text-center">Company Details</p>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Founding Year */}
          <div className="space-y-1 ">
            <label className="font-bold w-40 text-lg">Founding Year:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none "
              type="text"
              {...register("foundingYear", {
                required: "Company name is required",
              })}
              placeholder="Enter foundingYear name"
            />
            {errors.foundingYear && (
              <span className="text-red-500">
                {errors.foundingYear.message}
              </span>
            )}
          </div>

          {/* Employees */}
          <div className="space-y-1 ">
            <label className="font-bold w-40 text-lg">Employees:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none "
              type="number"
              {...register("employees", {
                required: "Company name is required",
              })}
              placeholder="Enter employees number"
            />
            {errors.employees && (
              <span className="text-red-500">{errors.employees.message}</span>
            )}
          </div>

          {/* Revenue */}
          <div className="space-y-1 ">
            <label className="font-bold w-40 text-lg">Revenue:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none "
              type="text"
              {...register("revenue", {
                required: "Company name is required",
              })}
              placeholder="Enter revenue name"
            />
            {errors.revenue && (
              <span className="text-red-500">{errors.revenue.message}</span>
            )}
          </div>

          {/* CEO */}
          <div className="space-y-1 ">
            <label className="font-bold w-40 text-lg">CEO:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none "
              type="text"
              {...register("ceo", {
                required: "Company name is required",
              })}
              placeholder="Enter ceo name"
            />
            {errors.ceo && (
              <span className="text-red-500">{errors.ceo.message}</span>
            )}
          </div>
        </div>

        {/* Services*/}
        <div>
          {renderFieldArray(
            fieldsServices,
            register,
            removeServices,
            appendServices,
            "Services",
            "services"
          )}
        </div>

        {/* Clients*/}
        <div>
          {renderFieldArray(
            fieldsClients,
            register,
            removeClients,
            appendClients,
            "Clients",
            "clients"
          )}
        </div>

        {/* Key Projects */}
        <div className="space-y-2 border border-gray-300 p-3">
          <p className="font-bold text-lg">Key Projects:</p>
          {fieldsKeyProjects.map((project, index) => (
            <div key={project.id} className="flex flex-col md:flex-row pb-2">
              <input
                className="input input-bordered bg-white border-black rounded-none md:w-[280px]"
                type="text"
                {...register(`keyProjects.${index}.projectName`, {
                  required: "Project name is required",
                })}
                placeholder="Project Name"
              />
              <input
                className="input input-bordered bg-white border-black rounded-none md:w-[280px]"
                type="text"
                {...register(`keyProjects.${index}.description`, {
                  required: "Description is required",
                })}
                placeholder="Description"
              />
              <input
                className="input input-bordered bg-white border-black rounded-none md:w-[150px]"
                type="number"
                {...register(`keyProjects.${index}.year`, {
                  required: "Year is required",
                })}
                placeholder="Year"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 px-5 py-3 text-white"
                onClick={() => removeKeyProjects(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendKeyProjects({ projectName: "", description: "", year: "" })
            }
            className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-full md:w-52 mt-3"
          >
            Add Project
          </button>
        </div>

        {/* Awards */}
        <div className="space-y-2 border border-gray-300 p-3">
          <p className="font-bold text-lg">Awards:</p>
          {fieldsAwards.map((awards, index) => (
            <div key={awards.id} className="flex flex-col md:flex-row">
              <input
                className="input input-bordered bg-white border-black rounded-none w-full md:w-[280px]"
                type="text"
                {...register(`awards.${index}.awardName`, {
                  required: "Project name is required",
                })}
                placeholder="Award Name"
              />
              <input
                className="input input-bordered bg-white border-black rounded-none w-full md:w-[280px]"
                type="text"
                {...register(`awards.${index}.organization`, {
                  required: "Year is organization",
                })}
                placeholder="Organization"
              />
              <input
                className="input input-bordered bg-white border-black rounded-none w-full md:w-[150px]"
                type="number"
                {...register(`awards.${index}.year`, {
                  required: "Description is required",
                })}
                placeholder="Year"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 px-5 py-3 text-white"
                onClick={() => removeAwards(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendAwards({ awardName: "", year: "", organization: "" })
            }
            className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-full md:w-52 mt-3"
          >
            Add Award
          </button>
        </div>

        {/* Office Locations */}
        <div>
          {renderFieldArray(
            fieldsOfficeLocations,
            register,
            removeOfficeLocations,
            appendOfficeLocations,
            "OfficeLocations",
            "officeLocations"
          )}
        </div>

        {/* Partnerships */}
        <div className="space-y-2 border border-gray-300 p-3">
          <p className="font-bold text-lg">Partnerships:</p>
          {fieldsPartnerships.map((partnerships, index) => (
            <div key={partnerships.id} className="flex flex-col md:flex-row">
              <input
                className="input input-bordered bg-white border-black rounded-none w-full md:w-[280px]"
                type="text"
                {...register(`partnerships.${index}.partnerName`, {
                  required: "Project name is required",
                })}
                placeholder="Partner Name"
              />
              <input
                className="input input-bordered bg-white border-black rounded-none w-full md:w-[280px]"
                type="text"
                {...register(`partnerships.${index}.description`, {
                  required: "Year is description",
                })}
                placeholder="description"
              />
              <input
                className="input input-bordered bg-white border-black rounded-none w-full md:w-[150px]"
                type="number"
                {...register(`partnerships.${index}.since`, {
                  required: "Description is required",
                })}
                placeholder="since"
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 px-5 py-3 text-white"
                onClick={() => removePartnerships(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendPartnerships({
                partnerName: "",
                since: "",
                description: "",
              })
            }
            className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-full md:w-52 mt-3"
          >
            Add Partner
          </button>
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <p className="text-xl font-bold text-center">Social Media</p>
          {/* LinkedIn */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="font-bold w-48 text-xl">LinkedIn:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none "
              type="text"
              {...register("LinkedIn", {
                required: "Company name is required",
              })}
              placeholder="Enter company name"
            />
            {errors.LinkedIn && (
              <span className="text-red-500">{errors.LinkedIn.message}</span>
            )}
          </div>

          {/* Twitter */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="font-bold w-48 text-xl">Twitter:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none "
              type="text"
              {...register("Twitter", {
                required: "Company name is required",
              })}
              placeholder="Enter company name"
            />
            {errors.Twitter && (
              <span className="text-red-500">{errors.Twitter.message}</span>
            )}
          </div>

          {/* Facebook */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="font-bold w-48 text-xl">Facebook:</label>
            <input
              className="input input-bordered w-full bg-white border-black rounded-none "
              type="text"
              {...register("Facebook", {
                required: "Company name is required",
              })}
              placeholder="Enter company name"
            />
            {errors.Facebook && (
              <span className="text-red-500">{errors.Facebook.message}</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 font-bold text-white px-5 py-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const renderFieldArray = (fields, registerFn, removeFn, addFn, label, name) => (
  <div className="border border-gray-300 p-3">
    <label className="font-bold w-48 text-xl">{label}</label>
    {fields.map((item, index) => (
      <div key={item.id} className="flex flex-col md:flex-row mb-1">
        <input
          className="input input-bordered w-full bg-white border-black rounded-none"
          {...registerFn(`${name}.${index}`)}
          defaultValue={item}
          placeholder={`Enter ${label.toLowerCase().slice(0, -1)}`}
        />
        <button
          type="button"
          className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
          onClick={() => removeFn(index)}
        >
          Remove
        </button>
      </div>
    ))}
    {fields.length === 0 && addFn("")}
    <button
      type="button"
      className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-full md:w-52 mt-5"
      onClick={() => addFn("")}
    >
      Add {label.slice(0, -1)}
    </button>
  </div>
);

export default ModalNewCompanyProfile;

// PropTypes validation
ModalNewCompanyProfile.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
