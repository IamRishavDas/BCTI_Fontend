import { motion } from "framer-motion";

const coursesData = [
  {
    id: 1,
    name: "Basic Computer Course",
    duration: "3 Months",
    description: "Learn fundamental computer skills including MS Office, Internet basics, and typing. Perfect for beginners.",
    fees: "3000"
  },
  {
    id: 2,
    name: "Advanced Excel & Tally",
    duration: "2 Months",
    description: "Master Excel formulas, pivot tables, and Tally ERP for accounting and data management.",
    fees: "4500"
  },
  {
    id: 3,
    name: "Web Design & Development",
    duration: "4 Months",
    description: "Learn HTML, CSS, JavaScript and create responsive websites. Build your portfolio projects.",
    fees: "6000"
  },
  {
    id: 4,
    name: "DTP & Graphic Design",
    duration: "3 Months",
    description: "Master CorelDRAW, Photoshop, and Illustrator for professional graphic design work.",
    fees: "5000"
  },
  {
    id: 5,
    name: "Programming Fundamental",
    duration: "6 Months",
    description: "Learn C, C++, and Python programming. Build problem-solving skills and logic.",
    fees: "8000"
  },
  {
    id: 6,
    name: "Digital Marketing",
    duration: "3 Months",
    description: "Learn SEO, Social Media Marketing, Google Ads, and content marketing strategies.",
    fees: "5500"
  },
  {
    id: 7,
    name: "Hardware & Networking",
    duration: "4 Months",
    description: "Computer assembly, troubleshooting, and network configuration. Hands-on training included.",
    fees: "7000"
  },
  {
    id: 8,
    name: "Data Entry Operator",
    duration: "2 Months",
    description: "High-speed typing, MS Office, and data management skills for data entry jobs.",
    fees: "3500"
  },
];

export default function Courses() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-700">Courses</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive training programs designed to build your technical skills
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesData.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex-1">
                  {course.name}
                </h3>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                  {course.duration}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-blue-700">
                  ₹{course.fees}
                </span>
                <button
                  onClick={() => window.open("tel:+918420029222", "_self")}
                  className="cursor-pointer px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Enquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}