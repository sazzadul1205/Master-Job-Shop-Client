// Packages
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Components
import PublicUserProfileHeader from "./PublicUserProfileHeader/PublicUserProfileHeader";

const PublicUserProfile = () => {
  const { email } = useParams();

  // Axios instance for public requests
  const axiosPublic = useAxiosPublic();

  // Decode the email from base64
  const decodedEmail = atob(email || "");

  // Fetch user by decoded email
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicUser", decodedEmail],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${decodedEmail}`).then((res) => res.data),
    enabled: !!decodedEmail,
  });

  // UI Error / Loading State
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="bg-white py-3 min-h-screen">
      <div className="max-w-7xl mx-auto rounded-xl shadow-sm border p-6">
        <PublicUserProfileHeader user={user} />

        <div className="bg-gray-200 py-[1px] my-10 " />
      </div>
    </div>
  );
};

export default PublicUserProfile;
