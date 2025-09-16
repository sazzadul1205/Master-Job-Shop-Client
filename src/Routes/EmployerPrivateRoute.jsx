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

const EmployerPrivateRoute = ({
  children,
  allowedRoles = ["Company", "Employer"],
}) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch User Role & Data
  const {
    data: UserRole,
    isLoading: UserRoleIsLoading,
    error: UserRoleError,
  } = useQuery({
    queryKey: ["UserRole", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/Role?email=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Redirect to login if unauthenticated
  if (!user) return <Navigate to="/Login" state={{ from: location }} replace />;

  // Handle loading
  if (loading || UserRoleIsLoading) return <Loading />;

  // Handle query error
  if (UserRoleError) return <Error />;

  // Redirect to restricted page if flagged as deleted
  if (UserRole?.deleteStatus)
    return <Navigate to="/RestrictedAccess" replace />;

  // Allow access only if user role is in allowedRoles
  if (!allowedRoles.includes(UserRole?.role)) {
    return <Navigate to="/RestrictedAccess" replace />;
  }

  // Allow access
  return children;
};

EmployerPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default EmployerPrivateRoute;
