import { Link } from "react-router-dom";
import { Briefcase, Users, FileText } from "lucide-react";

const ProfileBecomeEmployer = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-300 shadow-md rounded-2xl p-8 my-5 max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
        Ready to Hire Talent? Become an Employer
      </h2>

      {/* Subtitle */}
      <p className="text-gray-700 text-base md:text-lg mb-6">
        Upgrade your account to post jobs, manage applicants, and grow your team
        with confidence.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Feature */}
        <div className="flex items-start gap-4">
          <Briefcase className="text-blue-600 w-6 h-6 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-700">Post Jobs & Gigs</h4>
            <p className="text-sm text-gray-600">
              Gain access to job/gig posting tools to reach potential hires
              easily.
            </p>
          </div>
        </div>

        {/* Feature */}
        <div className="flex items-start gap-4">
          <Users className="text-blue-600 w-6 h-6 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-700">Manage Applicants</h4>
            <p className="text-sm text-gray-600">
              Review and track applicants with a clean and effective dashboard.
            </p>
          </div>
        </div>

        {/* Feature */}
        <div className="flex items-start gap-4">
          <FileText className="text-blue-600 w-6 h-6 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-700">Organize Documents</h4>
            <p className="text-sm text-gray-600">
              Handle contracts, portfolios, and onboarding materials in one
              place.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-right">
        <Link
          to="/BecomeEmployer"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
        >
          Apply to Become an Employer
        </Link>
      </div>
    </div>
  );
};

export default ProfileBecomeEmployer;
