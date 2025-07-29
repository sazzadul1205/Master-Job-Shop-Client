import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

const UserProfile = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch User Data
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
    // refetch: refetchUser,
  } = useQuery({
    queryKey: ["UserData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  //   UI Error / Loading
  if (loading || UserIsLoading) return <Loading />;
  if (UserError) return <Error />;

  return (
    <div className="bg-white">
      <ProfileHeader user={UserData} />
    </div>
  );
};

export default UserProfile;
