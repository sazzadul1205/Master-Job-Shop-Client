import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const ModalEditCompanyProfile = ({ CompanyProfileData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    // setValue,
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

  // Reusable Input Section
  const InputSection = ({
    label,
    fields,
    registerName,
    removeFunc,
    appendFunc,
  }) => (
    <div className="space-y-2">
      <label className="font-bold w-48 text-xl">{label}:</label>
      {fields.map((item, index) => (
        <div key={item.id} className="flex mb-1">
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            {...register(`${registerName}.${index}`)}
            defaultValue={item}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          <button
            type="button"
            className="bg-red-500 hover:bg-red-400 px-5 text-white py-2"
            onClick={() => removeFunc(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-5"
        onClick={() => appendFunc("")}
      >
        Add {label}
      </button>
    </div>
  );

  // Add prop-types validation
  InputSection.propTypes = {
    label: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired, // Assuming fields is an array of strings
    registerName: PropTypes.string.isRequired,
    removeFunc: PropTypes.func.isRequired,
    appendFunc: PropTypes.func.isRequired,
  };

  // Reusable Multi Section
  const MultiSection = ({
    title,
    fields,
    registerName,
    removeFunc,
    appendFunc,
    placeholders,
  }) => (
    <div className="space-y-2">
      <p className="font-bold text-lg">{title}:</p>
      {fields.map((item, index) => (
        <div key={item.id} className="flex gap-1">
          {placeholders.map((placeholder, idx) => (
            <input
              key={idx}
              className="input input-bordered bg-white border-black rounded-none"
              type={placeholder.type}
              {...register(`${registerName}.${index}.${placeholder.name}`, {
                required: `${placeholder.name} is required`,
              })}
              placeholder={placeholder.placeholder}
              style={{ width: placeholder.width }}
            />
          ))}
          <button
            type="button"
            className="bg-red-500 hover:bg-red-400 px-5 text-white"
            onClick={() => removeFunc(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white py-1 text-lg w-52 mt-3"
        onClick={() =>
          appendFunc(Object.fromEntries(placeholders.map((p) => [p.name, ""])))
        }
      >
        Add {title.slice(0, -1)}
      </button>
    </div>
  );

  // Add prop-types validation
  MultiSection.propTypes = {
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    registerName: PropTypes.string.isRequired,
    removeFunc: PropTypes.func.isRequired,
    appendFunc: PropTypes.func.isRequired,
    placeholders: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  //   On Submit
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
              <div key={index} className="flex items-center gap-2">
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
        <div className="flex gap-2 mt-2">
          <label className="font-bold w-48 text-xl">Description:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36"
            {...register("description", { required: true })}
            placeholder="Enter job description"
          />
        </div>

        <p className="text-2xl font-bold text-center mt-5">Company Details</p>
        {/* Founding Year, Employees, Revenue, CEO inputs */}
        <div className="grid grid-cols-2 gap-2 mt-2">
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

        {/* Services Sections */}
        <div className="mt-3">
          <InputSection
            label="Services"
            fields={fieldsServices}
            registerName="services"
            removeFunc={removeServices}
            appendFunc={appendServices}
          />
        </div>

        {/* Clients Sections */}
        <div className="mt-3">
          <InputSection
            label="Clients"
            fields={fieldsClients}
            registerName="clients"
            removeFunc={removeClients}
            appendFunc={appendClients}
          />
        </div>

        {/* Key Projects */}
        <div className="mt-3">
          <MultiSection
            title="Key Projects"
            fields={fieldsKeyProjects}
            registerName="keyProjects"
            removeFunc={removeKeyProjects}
            appendFunc={appendKeyProjects}
            placeholders={[
              {
                name: "projectName",
                placeholder: "Project Name",
                type: "text",
                width: "280px",
              },
              {
                name: "description",
                placeholder: "Description",
                type: "text",
                width: "280px",
              },
              {
                name: "year",
                placeholder: "Year",
                type: "number",
                width: "150px",
              },
            ]}
          />
        </div>

        {/* Awards */}
        <div className="mt-3">
          <MultiSection
            title="Awards"
            fields={fieldsAwards}
            registerName="awards"
            removeFunc={removeAwards}
            appendFunc={appendAwards}
            placeholders={[
              {
                name: "awardName",
                placeholder: "Award Name",
                type: "text",
                width: "280px",
              },
              {
                name: "organization",
                placeholder: "Organization",
                type: "text",
                width: "280px",
              },
              {
                name: "year",
                placeholder: "Year",
                type: "number",
                width: "150px",
              },
            ]}
          />
        </div>

        {/* OfficeLocations Section */}
        <div className="mt-3">
          <InputSection
            label="OfficeLocations"
            fields={fieldsOfficeLocations}
            registerName="officeLocations"
            removeFunc={removeOfficeLocations}
            appendFunc={appendOfficeLocations}
          />
        </div>

        {/* Partnerships */}
        <div className="mt-3">
          <MultiSection
            title="Partnerships"
            fields={fieldsPartnerships}
            registerName="partnerships"
            removeFunc={removePartnerships}
            appendFunc={appendPartnerships}
            placeholders={[
              {
                name: "partnerName",
                placeholder: "Partner Name",
                type: "text",
                width: "280px",
              },
              {
                name: "description",
                placeholder: "Description",
                type: "text",
                width: "280px",
              },
              {
                name: "since",
                placeholder: "Since",
                type: "number",
                width: "150px",
              },
            ]}
          />
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <p className="text-xl font-bold">Social Media</p>
          {["LinkedIn", "Twitter", "Facebook"].map((platform) => (
            <div key={platform} className="flex items-center gap-2">
              <label className="font-bold w-48 text-xl">{platform}:</label>
              <input
                className="input input-bordered w-full bg-white border-black rounded-none"
                type="text"
                {...register(platform, { required: `${platform} is required` })}
                placeholder={`Enter ${platform} name`}
              />
              {errors[platform] && (
                <span className="text-red-500">{errors[platform].message}</span>
              )}
            </div>
          ))}
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

export default ModalEditCompanyProfile;

// Define prop types for CompanyProfileData
ModalEditCompanyProfile.propTypes = {
  CompanyProfileData: PropTypes.shape({
    _id: PropTypes.string,
    companyName: PropTypes.string,
    companyCode: PropTypes.string,
    location: PropTypes.string,
    industry: PropTypes.string,
    website: PropTypes.string,
    postedBy: PropTypes.string,
    logo: PropTypes.string,
    description: PropTypes.string,
    companyDetails: PropTypes.shape({
      foundingYear: PropTypes.string,
      employees: PropTypes.number,
      revenue: PropTypes.string,
      ceo: PropTypes.string,
      services: PropTypes.arrayOf(PropTypes.string),
      clients: PropTypes.arrayOf(PropTypes.string),
      keyProjects: PropTypes.arrayOf(PropTypes.string),
      awards: PropTypes.arrayOf(PropTypes.string),
      officeLocations: PropTypes.arrayOf(PropTypes.string),
      partnerships: PropTypes.arrayOf(PropTypes.string),
      socialMedia: PropTypes.shape({
        LinkedIn: PropTypes.string,
        Twitter: PropTypes.string,
        Facebook: PropTypes.string,
      }),
    }),
  }),
  reset: PropTypes.func.isRequired, // Ensure reset function is passed as a prop
};

// PropTypes validation
ModalEditCompanyProfile.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
