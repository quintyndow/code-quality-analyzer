import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: "#0D1117CC", borderColor: "#30363D", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ background: "#58A6FF22", border: "1px solid #58A6FF44", color: "#58A6FF" }}
          >
            CQ
          </div>
          <span className="font-semibold text-sm" style={{ color: "#E6EDF3" }}>
            CodeQuality
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-3 py-1.5 text-sm rounded-md transition-colors"
              style={{
                color: pathname === link.to ? "#E6EDF3" : "#8B949E",
              }}
            >
              {pathname === link.to && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-md"
                  style={{ background: "#161B22", border: "1px solid #30363D" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}

          <Link
            to="/analyze"
            className="ml-3 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: "#58A6FF",
              color: "#0D1117",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
