// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Components
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfilePersonalInformation from "./ProfilePersonalInformation/ProfilePersonalInformation";
import ProfileDocuments from "./ProfileDocuments/ProfileDocuments";
import ProfileSkills from "./ProfileSkills/ProfileSkills";
import ProfileJobPreference from "./ProfileJobPreference/ProfileJobPreference";

const UserProfile = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch User Data
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
    refetch: refetchUser,
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
    <div className="bg-white py-3">
      <ProfileHeader user={UserData} />

      <ProfilePersonalInformation user={UserData} />

      <ProfileDocuments user={UserData} refetch={refetchUser} />

      <ProfileSkills user={UserData} />

      <ProfileJobPreference />
    </div>
  );
};

export default UserProfile;
