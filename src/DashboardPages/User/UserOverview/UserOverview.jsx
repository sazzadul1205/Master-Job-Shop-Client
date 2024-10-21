import { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import ViewAllJobApplications from "./ViewAllJobApplications/ViewAllJobApplications";
import ViewAllGigApplications from "./ViewAllGigApplications/ViewAllGigApplications";

const UserOverview = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  // Fetch Jobs where user has applied
  const { data: AppliedJobs = [] } = useQuery({
    queryKey: ["AppliedJobs", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/applied-jobs?email=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email, // Only run if the user is logged in
  });

  // Fetch Gigs where user has applied
  const { data: AppliedGig = [] } = useQuery({
    queryKey: ["AppliedGig", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/applied-gigs?biderEmail=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email, // Only run if the user is logged in
  });

  return (
    <div className="bg-white border border-black min-h-screen">
      <p className="text-3xl font-bold text-white pl-10 py-5 bg-blue-400">
        {user?.displayName} Overview
      </p>

      <ViewAllJobApplications
        AppliedJobs={AppliedJobs}
      ></ViewAllJobApplications>

      <ViewAllGigApplications AppliedGig={AppliedGig}></ViewAllGigApplications>
    </div>
  );
};

export default UserOverview;
