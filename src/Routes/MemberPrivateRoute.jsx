import { Navigate, useLocation } from "react-router-dom";

// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Shared
import Error from "../Shared/Error/Error";
import Loading from "../Shared/Loading/Loading";

const MemberPrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // Fetch user data
  const {
    data: UserData,
    isLoading: UserDataIsLoading,
    error: UserDataError,
  } = useQuery({
    queryKey: ["UserData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Handle auth or query loading
  if (loading || UserDataIsLoading) return <Loading />;

  // Redirect to login if unauthenticated
  if (!user) return <Navigate to="/Login" state={{ from: location }} replace />;

  // Handle query error
  if (UserDataError) return <Error />;

  // Redirect to deleted user page if flagged
  if (UserData?.deleteStatus === true)
    return <Navigate to="/DeletedUser" replace />;

  // Allow access
  return children;
};

MemberPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MemberPrivateRoute;
