import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

const MyJobApplicationModal = ({ selectedApplicationID }) => {
  const axiosPublic = useAxiosPublic();
  console.log("selected Application ID :", selectedApplicationID);

  // Step 1: Fetch applications
  const {
    data: SelectedJobApplicationsData = [],
    isLoading: SelectedJobApplicationsIsLoading,
    error: SelectedJobApplicationsError,
  } = useQuery({
    queryKey: ["SelectedJobApplicationsData"],
    queryFn: () =>
      axiosPublic
        .get(`/JobApplications?id=${selectedApplicationID?._id}`)
        .then((res) => res.data),
    enabled: !!selectedApplicationID,
  });

  // UI Error / Loading
  if (SelectedJobApplicationsIsLoading) return <Loading />;
  if (SelectedJobApplicationsError) return <Error />;

  console.log(SelectedJobApplicationsData);

  return (
    <div className="modal-box bg-white p-0">
      {/* Header */}
      <div className="flex justify-between text-black px-3 py-3">
        <h3 className="font-bold text-lg">Hello!</h3>

        <div
          className="bg-gray-100 hover:bg-gray-200 text-black hover:text-red-500 p-3 rounded-full cursor-pointer"
          onClick={() =>
            document.getElementById("View_Application_Modal").close()
          }
        >
          <ImCross />
        </div>
      </div>
      <p className="py-4">Press ESC key or click the button below to close</p>
    </div>
  );
};

export default MyJobApplicationModal;
