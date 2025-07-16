import React, { useEffect } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUsers,
  FaBullseye,
  FaHistory,
  FaCheckCircle,
  FaUserTie,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  const {
    data: AboutUsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["AboutUsData"],
    queryFn: () => axiosPublic.get(`/AboutUs`).then((res) => res.data),
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const { mission, values, history, team, contact } = AboutUsData || {};

  return (
    <div className="min-h-screen text-white py-12 px-4 md:px-20">
      {/* Header */}
      <div className="text-center mb-16" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-white">About Master Job Shop</h1>
        <p className="mt-4 text-lg text-gray-100 font-semibold max-w-2xl mx-auto">
          Learn about our purpose, core values, journey, and the passionate team
          driving our mission forward.
        </p>
      </div>

      {/* Mission */}
      {mission && (
        <section className="mb-12 px-20" data-aos="fade-up">
          <div className="flex items-center gap-2 mb-2 text-white text-2xl font-semibold">
            <FaBullseye />
            <h2>{mission.title}</h2>
          </div>
          <p className="text-gray-100 font-semibold">{mission.description}</p>
        </section>
      )}

      {/* Values */}
      {values && (
        <section className="mb-12 px-20" data-aos="fade-up">
          <div className="flex items-center gap-2 mb-4 text-white text-2xl font-semibold">
            <FaCheckCircle />
            <h2>{values.title}</h2>
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-100 font-semibold">
            {values.list.map((val, idx) => (
              <li key={idx}>{val}</li>
            ))}
          </ul>
        </section>
      )}

      {/* History */}
      {history && (
        <section className="mb-12 px-20" data-aos="fade-up">
          <div className="flex items-center gap-2 mb-2 text-white text-2xl font-semibold">
            <FaHistory />
            <h2>{history.title}</h2>
          </div>
          <p className="text-gray-100 font-semibold">{history.description}</p>
        </section>
      )}

      {/* Team */}
      {team && (
        <section className="mb-16 px-20" data-aos="fade-up">
          <div className="flex items-center gap-2 mb-4 text-white text-2xl font-semibold">
            <FaUsers />
            <h2>{team.title}</h2>
          </div>
          <p className="text-gray-100 font-semibold mb-6">{team.content}</p>
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {team.members.map((member, idx) => (
              <div
                key={idx}
                className="border p-4 rounded-lg bg-linear-to-bl hover:bg-linear-to-tl from-white to-gray-200 shadow hover:shadow-xl transition duration-300 cursor-default"
              >
                <div className="flex items-center gap-2 mb-2 text-black font-medium">
                  <FaUserTie />
                  <h3 className="text-lg text-gray-600 font-semibold">
                    {member.name}
                  </h3>
                </div>
                <p className="text-sm text-black">{member.position}</p>
                <p className="text-sm text-gray-800 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {contact && (
        <section className="mb-16 px-20" data-aos="fade-up">
          <div className="flex items-center gap-2 mb-4 text-white text-2xl font-semibold">
            <FaEnvelope />
            <h2>{contact.title}</h2>
          </div>
          <p className="text-gray-100 font-semibold mb-4">
            {contact.description}
          </p>
          <div className="flex justify-between pt-10 text-gray-200">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-white text-2xl" />
              <span className="text-xl" >{contact.email}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-white text-2xl" />
              <span className="text-xl" >{contact.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-white text-2xl" />
              <span className="text-xl" >{contact.address}</span>
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutUs;
