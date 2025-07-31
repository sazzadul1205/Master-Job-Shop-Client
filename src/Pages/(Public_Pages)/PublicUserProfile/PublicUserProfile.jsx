// Packages
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

const PublicUserProfile = () => {
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  // Decode the email from base64
  const decodedEmail = atob(email || "");

  console.log(decodedEmail);

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

  console.log(user);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <div className="max-w-5xl mx-auto p-6"></div>;
};

export default PublicUserProfile;
