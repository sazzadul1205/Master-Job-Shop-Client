import { Link } from "react-router-dom";
import { Briefcase, Users, FileText } from "lucide-react";

const ProfileBecomeMentor = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 border border-purple-300 shadow-md rounded-2xl p-8 my-5 max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4">
        Ready to Guide Talent? Become a Mentor
      </h2>

      {/* Subtitle */}
      <p className="text-gray-700 text-base md:text-lg mb-6">
        Upgrade your profile to mentor aspiring professionals, share your
        knowledge, and shape future talent.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Feature */}
        <div className="flex items-start gap-4">
          <Briefcase className="text-purple-600 w-6 h-6 mt-1" />
          <div>
            <h4 className="font-semibold text-purple-700">
              Offer Mentorship Sessions
            </h4>
            <p className="text-sm text-gray-600">
              Create one-on-one or group mentoring opportunities for learners in
              your field.
            </p>
          </div>
        </div>

        {/* Feature */}
        <div className="flex items-start gap-4">
          <Users className="text-purple-600 w-6 h-6 mt-1" />
          <div>
            <h4 className="font-semibold text-purple-700">
              Engage with Mentees
            </h4>
            <p className="text-sm text-gray-600">
              Track mentee progress and provide ongoing feedback and support.
            </p>
          </div>
        </div>

        {/* Feature */}
        <div className="flex items-start gap-4">
          <FileText className="text-purple-600 w-6 h-6 mt-1" />
          <div>
            <h4 className="font-semibold text-purple-700">
              Share Learning Resources
            </h4>
            <p className="text-sm text-gray-600">
              Upload guides, templates, and materials to enrich your mentoring
              experience.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-right">
        <Link
          to="/BecomeMentor"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition"
        >
          Apply to Become a Mentor
        </Link>
      </div>
    </div>
  );
};

export default ProfileBecomeMentor;
