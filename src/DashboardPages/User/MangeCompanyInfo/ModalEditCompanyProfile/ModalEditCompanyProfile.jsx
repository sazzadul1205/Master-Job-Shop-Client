/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const ModalEditCompanyProfile = ({ CompanyProfileData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
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
    if (CompanyProfileData) {
      reset({
        companyName: CompanyProfileData?.companyName,
        companyCode: CompanyProfileData?.companyCode,
        location: CompanyProfileData?.location,
        industry: CompanyProfileData?.industry,
        website: CompanyProfileData?.website,
        postedBy: CompanyProfileData?.postedBy,
        logo: CompanyProfileData?.logo,
        description: CompanyProfileData?.description,
        foundingYear: CompanyProfileData?.companyDetails?.foundingYear,
        employees: CompanyProfileData?.companyDetails?.employees,
        revenue: CompanyProfileData?.companyDetails?.revenue,
        ceo: CompanyProfileData?.companyDetails?.ceo,
        services: CompanyProfileData?.companyDetails?.services,
        clients: CompanyProfileData?.companyDetails?.clients,
        keyProjects: CompanyProfileData?.companyDetails?.keyProjects,
        awards: CompanyProfileData?.companyDetails?.awards,
        officeLocations: CompanyProfileData?.companyDetails?.officeLocations,
        partnerships: CompanyProfileData?.companyDetails?.partnerships,
        LinkedIn: CompanyProfileData?.companyDetails?.socialMedia?.LinkedIn,
        Twitter: CompanyProfileData?.companyDetails?.socialMedia?.Twitter,
        Facebook: CompanyProfileData?.companyDetails?.socialMedia?.Facebook,
      });
    }
  }, [CompanyProfileData, reset]);

  // On Submit
  const onSubmit = async (data) => {
    try {
      // Arrange the data in the required format
      const updatedCompanyProfile = {
        companyName: data.companyName,
        companyCode: data.companyCode,
        location: data.location,
        industry: data.industry,
        website: data.website,
        logo: data.logo,
        description: data.description,
        companyDetails: {
          foundingYear: data.foundingYear,
          employees: data.employees,
          revenue: data.revenue,
          ceo: data.ceo,
          services: data.services || [], // Using default empty array
          clients: data.clients || [], // Using default empty array
          keyProjects:
            data.keyProjects?.map((project) => ({
              projectName: project.projectName,
              description: project.description,
              year: project.year,
            })) || [], // Handle keyProjects array
          awards:
            data.awards?.map((award) => ({
              awardName: award.awardName,
              organization: award.organization,
              year: award.year,
            })) || [], // Handle awards array
          officeLocations: data.officeLocations || [], // Using default empty array
          partnerships:
            data.partnerships?.map((partner) => ({
              partnerName: partner.partnerName,
              description: partner.description,
              since: partner.since,
            })) || [], // Handle partnerships array
          socialMedia: {
            LinkedIn: data.LinkedIn || "", // Fallback to empty string if not provided
            Twitter: data.Twitter || "",
            Facebook: data.Facebook || "",
          },
        },
      };

      // Log the structured data to check before sending
      console.log("Updated company profile:", updatedCompanyProfile);

      // Send the update request using axiosPublic
      const response = await axiosPublic.put(
        `/Company-Profiles/${CompanyProfileData._id}`, // Use the profile ID
        updatedCompanyProfile // Pass the structured data
      );

      console.log("Response from server:", response.data);

      // Close the modal and refetch data
      document.getElementById("Edit_Company_Profiles_Modal").close();
      refetch();

      // Show success alert using SweetAlert
      await Swal.fire({
        title: "Success!",
        text: "Company profile updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating company profile:", error);

      // Show error alert using SweetAlert
      await Swal.fire({
        title: "Error!",
        text: "Failed to update company profile.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      {/* Top section */}
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white ">
        <p className="text-xl">Edit My Company Profile</p>
        <button
          onClick={() =>
            document.getElementById("Edit_Company_Profiles_Modal").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        {/* Company Name ,Company Code ,Location ,Industry ,Website ,Company Logo  Inputs*/}
        <div className="space-y-2 text-black">
          {[
            {
              label: "Company Name",
              name: "companyName",
              type: "text",
              placeholder: "Enter company name",
              errorMessage: errors.companyName?.message,
            },
            {
              label: "Company Code",
              name: "companyCode",
              type: "text",
              readOnly: true,
            },
            {
              label: "Location",
              name: "location",
              type: "text",
              placeholder: "Enter location name",
              errorMessage: errors.location?.message,
            },
            {
              label: "Industry",
              name: "industry",
              type: "text",
              placeholder: "Enter industry name",
              errorMessage: errors.industry?.message,
            },
            {
              label: "Website",
              name: "website",
              type: "url",
              placeholder: "Enter website name",
              errorMessage: errors.website?.message,
            },
            {
              label: "Company Logo",
              name: "logo",
              type: "url",
              placeholder: "Enter company logo URL",
              errorMessage: errors.logo?.message,
            },
          ].map(
            (
              {
                label,
                name,
                type,
                placeholder,
                defaultValue,
                readOnly,
                errorMessage,
              },
              index
            ) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center gap-2"
              >
                <label className="font-bold w-48 text-xl">{label}:</label>
                <input
                  className="input input-bordered w-full bg-white border-black rounded-none"
                  type={type}
                  {...register(name, { required: `${label} is required` })}
                  placeholder={placeholder}
                  defaultValue={defaultValue}
                  readOnly={readOnly}
                />
                {errorMessage && (
                  <span className="text-red-500">{errorMessage}</span>
                )}
              </div>
            )
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col md:flex-row mt-2">
          <label className="font-bold w-48 text-xl">Description:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36"
            {...register("description", { required: true })}
            placeholder="Enter job description"
          />
        </div>

        <p className="text-2xl font-bold text-center mt-5">Company Details</p>
        {/* Founding Year, Employees, Revenue, CEO inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {[
            {
              label: "Founding Year",
              name: "foundingYear",
              placeholder: "Enter founding year",
            },
            {
              label: "Employees",
              name: "employees",
              placeholder: "Enter number of employees",
            },
            {
              label: "Revenue",
              name: "revenue",
              placeholder: "Enter revenue",
            },
            {
              label: "CEO",
              name: "ceo",
              placeholder: "Enter CEO name",
            },
          ].map(({ label, name, placeholder, defaultValue }, index) => (
            <div key={index} className="space-y-1">
              <label className="font-bold w-40 text-lg">{label}:</label>
              <input
                className="input input-bordered w-full bg-white border-black rounded-none"
                type="text"
                {...register(name, { required: `${label} is required` })}
                defaultValue={defaultValue}
                placeholder={placeholder}
              />
              {errors[name] && (
                <span className="text-red-500">{errors[name]?.message}</span>
              )}
            </div>
          ))}
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
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 font-bold text-white px-5 py-3"
          >
            Update
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

export default ModalEditCompanyProfile;
