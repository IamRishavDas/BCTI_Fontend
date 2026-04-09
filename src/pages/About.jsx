import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-blue-700">BCTI</span>
          </h1>
          <p className="text-lg text-gray-600">
            Building technical excellence since 2008
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Bhadreswar Computer & Technical Institute (BCTI) was established in 2008 
              with a vision to provide quality computer education in Bhadreswar, West Bengal. 
              Over the past 15+ years, we have trained more than 1000 students in various 
              technical skills, helping them build successful careers in the IT industry.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower students with practical technical skills through focused training 
              programs, expert faculty support, and industry-relevant curriculum. We strive 
              to bridge the gap between education and employment by providing hands-on 
              learning experiences.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose BCTI?</h2>
            <ul className="space-y-3">
              {[
                "15+ years of excellence in computer education",
                "Expert faculty with industry experience",
                "Practical, hands-on training approach",
                "Industry-relevant curriculum",
                "Affordable course fees",
                "Flexible batch timings",
                "Small batch sizes for personalized attention",
                "Job placement assistance"
              ].map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-700 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-semibold">Location:</span> Bhadreswar, West Bengal</p>
              <p><span className="font-semibold">Phone:</span> +91 8420029222</p>
              <p><span className="font-semibold">Established:</span> 2008</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}