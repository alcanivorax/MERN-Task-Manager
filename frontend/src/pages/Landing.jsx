import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import dashboardPreview1 from "../assets/dashboard.png";
import dashboardPreview2 from "../assets/dashboard2.png";
import dashboardPreview3 from "../assets/dashboard3.png";
import dashboardPreview4 from "../assets/dashboard4.png";
import dashboardPreview5 from "../assets/dashboard5.png";
import dashboardPreview6 from "../assets/dashboard6.png";

export default function Landing() {
  const dashboardImages = [
    dashboardPreview1,
    dashboardPreview2,
    dashboardPreview3,
    dashboardPreview4,
    dashboardPreview5,
    dashboardPreview6,
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  // Automatically slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % dashboardImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-300 rounded-full blur-3xl opacity-40"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-[-150px] right-[-150px] w-[350px] h-[350px] bg-purple-400 rounded-full blur-3xl opacity-40"
      />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight"
        >
          Organize. <span className="text-indigo-600">Collaborate.</span>{" "}
          Succeed.
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl"
        >
          A powerful task management platform that keeps your team aligned,
          productive, and ahead of deadlines.
        </motion.p>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <Link to="/signup">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg font-semibold hover:bg-indigo-700 hover:shadow-xl transition-all">
              Get Started Free
            </button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl font-semibold shadow-md hover:bg-indigo-50 transition-all">
              Log In
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 py-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {[
          {
            icon: "📋",
            title: "Task Management",
            text: "Keep all your tasks organized and never miss a deadline.",
          },
          {
            icon: "👥",
            title: "Team Collaboration",
            text: "Collaborate seamlessly with your team in real-time.",
          },
          {
            icon: "📊",
            title: "Analytics",
            text: "Track progress and insights with clear visual reports.",
          },
          {
            icon: "⚡",
            title: "Quick Access",
            text: "Easily access tasks, projects, and important info in a flash.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all"
          >
            <div className="text-4xl">{f.icon}</div>
            <h3 className="mt-4 font-semibold text-slate-800 text-lg">
              {f.title}
            </h3>
            <p className="text-sm text-slate-600 mt-2">{f.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Dashboard Carousel Section */}
      <section className="relative z-10 px-6 py-20 flex flex-col items-center overflow-hidden max-w-5xl mx-auto">
        <motion.div
          ref={carouselRef}
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: "tween", duration: 0.8 }}
          className="flex w-full"
        >
          {dashboardImages.map((img, i) => (
            <div key={i} className="flex-shrink-0 w-full px-2">
              <img
                src={img}
                alt={`Dashboard ${i + 1}`}
                className="rounded-2xl shadow-2xl border-4 border-white w-full"
              />
            </div>
          ))}
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex gap-3 mt-6">
          {dashboardImages.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                i === activeIndex ? "bg-indigo-600" : "bg-gray-300"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          Ready to level up your productivity?
        </motion.h2>
        <p className="mt-3 text-indigo-100">
          Join thousands of users managing their work smarter.
        </p>
        <Link to="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:bg-slate-100"
          >
            Sign Up Free
          </motion.button>
        </Link>
      </section>
    </div>
  );
}
