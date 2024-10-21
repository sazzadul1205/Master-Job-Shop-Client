import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";

const AboutUs = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching AboutUsData
  const {
    data: AboutUsData = [],
    isLoading: AboutUsDataIsLoading,
    error: AboutUsDataError,
  } = useQuery({
    queryKey: ["AboutUsData"],
    queryFn: () => axiosPublic.get(`/AboutUs`).then((res) => res.data),
  });

  // Loading state
  if (AboutUsDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (AboutUsDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  const data = AboutUsData[0];

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-50 text-black">
      <div className="max-w-[1200px] mx-auto pt-20 px-4">
        <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>

        {/* Mission Section */}
        {data?.mission && (
          <section className="mb-10">
            <h2 className="text-3xl font-semibold mb-4">
              {data.mission.title}
            </h2>
            <p className="text-lg">{data.mission.description}</p>
          </section>
        )}

        {/* Values Section */}
        {data?.values && (
          <section className="mb-10">
            <h2 className="text-3xl font-semibold mb-4">{data.values.title}</h2>
            <ul className="list-disc list-inside text-lg">
              {data.values.list.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </section>
        )}

        {/* History Section */}
        {data?.history && (
          <section className="mb-10">
            <h2 className="text-3xl font-semibold mb-4">
              {data.history.title}
            </h2>
            <p className="text-lg">{data.history.description}</p>
          </section>
        )}

        {/* Team Section */}
        {data?.team && (
          <section className="mb-10">
            <h2 className="text-3xl font-semibold mb-4">{data.team.title}</h2>
            <p className="text-lg mb-4">{data.team.content}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.team.members.map((member, index) => (
                <div
                  key={index}
                  className="p-5 border rounded shadow bg-gradient-to-br from-blue-500 to-blue-50 hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-white">{member.position}</p>
                  <p className="pt-3 leading-7">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {data?.contact && (
          <section className="pb-5">
            <h2 className="text-3xl font-semibold mb-4">
              {data.contact.title}
            </h2>
            <p className="text-lg mb-4">{data.contact.description}</p>
            <ul className="list-none">
              <li className="text-lg">
                Email:{" "}
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-blue-500"
                >
                  {data.contact.email}
                </a>
              </li>
              <li className="text-lg">
                Phone:{" "}
                <a
                  href={`tel:${data.contact.phone.replace(/ /g, "")}`}
                  className="text-blue-500"
                >
                  {data.contact.phone}
                </a>
              </li>
              <li className="text-lg">{data.contact.address}</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
