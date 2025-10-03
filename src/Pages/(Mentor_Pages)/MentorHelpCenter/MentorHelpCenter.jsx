import { useState } from "react";
import { FAQs } from "../../../Shared/Lists/MentorSettings/FAQs";
import { Tutorials } from "../../../Shared/Lists/MentorSettings/Tutorials";
import { UserGuides } from "../../../Shared/Lists/MentorSettings/UserGuides";

const MentorHelpCenter = () => {
  // separate open states for each section
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [tutorialOpenIndex, setTutorialOpenIndex] = useState(null);
  const [guideOpenIndex, setGuideOpenIndex] = useState(null);

  const toggleAccordion = (index, type) => {
    if (type === "faq") {
      setFaqOpenIndex(faqOpenIndex === index ? null : index);
    } else if (type === "tutorial") {
      setTutorialOpenIndex(tutorialOpenIndex === index ? null : index);
    } else if (type === "guide") {
      setGuideOpenIndex(guideOpenIndex === index ? null : index);
    }
  };

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-5">
      {/* Quick Access */}
      <div className="p-5 rounded-lg shadow-md mb-8 bg-white">
        <h2 className="text-xl font-bold text-black mb-4 text-center">
          Quick Access
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleScroll("faqs")}
            className="px-5 py-2 rounded-lg border-2 border-blue-500 text-blue-500 
               hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer w-[300px]"
          >
            FAQs
          </button>

          <button
            onClick={() => handleScroll("tutorials")}
            className="px-5 py-2 rounded-lg border-2 border-purple-500 text-purple-500 
               hover:bg-purple-500 hover:text-white transition-all duration-300 cursor-pointer w-[300px]"
          >
            Step-by-step Tutorials
          </button>

          <button
            onClick={() => handleScroll("guides")}
            className="px-5 py-2 rounded-lg border-2 border-pink-500 text-pink-500 
               hover:bg-pink-500 hover:text-white transition-all duration-300 cursor-pointer w-[300px]"
          >
            Detailed User Guides
          </button>
        </div>
      </div>

      {/* FAQs */}
      <h3 id="faqs" className="text-2xl font-bold text-black mb-6 text-center">
        FAQs (Frequently Asked Questions)
      </h3>
      <div className="space-y-4">
        {FAQs.map((faq, index) => (
          <div
            key={index}
            className="collapse collapse-arrow shadow-lg bg-white rounded-box"
          >
            <input
              type="checkbox"
              checked={faqOpenIndex === index}
              readOnly
              onClick={() => toggleAccordion(index, "faq")}
            />
            <div className="collapse-title text-lg font-semibold text-gray-800">
              {faq.question}
            </div>
            <div className="collapse-content text-gray-600">{faq.answer}</div>
          </div>
        ))}
      </div>

      {/* Tutorials */}
      <h3
        id="tutorials"
        className="text-2xl font-bold text-black my-6 text-center"
      >
        Step-by-step Tutorials
      </h3>
      <div className="space-y-4">
        {Tutorials.map((tutorial, index) => (
          <div
            key={index}
            className="collapse collapse-arrow shadow-lg bg-white rounded-box"
          >
            <input
              type="checkbox"
              checked={tutorialOpenIndex === index}
              readOnly
              onClick={() => toggleAccordion(index, "tutorial")}
            />
            <div className="collapse-title text-lg font-semibold text-gray-800">
              {tutorial.title}
            </div>
            <div className="collapse-content text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                {tutorial.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* User Guides */}
      <h3
        id="guides"
        className="text-2xl font-bold text-black my-6 text-center"
      >
        Detailed User Guides
      </h3>
      <div className="space-y-4">
        {UserGuides.map((guide, index) => (
          <div
            key={index}
            className="collapse collapse-arrow shadow-lg bg-white rounded-box"
          >
            <input
              type="checkbox"
              checked={guideOpenIndex === index}
              readOnly
              onClick={() => toggleAccordion(index, "guide")}
            />
            <div className="collapse-title text-lg font-semibold text-gray-800">
              {guide.title}
            </div>
            <div className="collapse-content text-gray-600 space-y-4">
              <div className="space-y-2">
                {guide.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-3">
                <h4 className="font-semibold text-gray-700">Pro Tips:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {guide.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorHelpCenter;
