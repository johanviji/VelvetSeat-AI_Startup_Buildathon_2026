import { useState, useEffect } from 'react';
import { Crown, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

 const navLinks = [
  { label: 'Home', to: '/' },
  { label: "Search", to: "/search" },

  {
    label: 'Explore',
    onClick: () => {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document
            .getElementById("top-salons")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document
          .getElementById("top-salons")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    },
  },

  { label: 'AI Concierge', to: '/concierge' },

  { label: 'Compare', to: '/compare' },
];

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background:   scrolled ? 'rgba(26, 10, 15, 0.85)'  : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)'             : 'none',
        borderBottom: scrolled ? '1px solid rgba(201, 168, 76, 0.2)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Crown
            className="w-5 h-5 text-[#C9A84C] transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-xl font-bold text-[#C9A84C] tracking-wide">
            VelvetSeat
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.onClick ? (
              <button
                key={link.label}
                onClick={link.onClick}
                className="text-sm font-medium text-[#F5E6C8]/70 hover:text-[#F5E6C8] transition-all duration-200"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-[#C9A84C]"
                    : "text-[#F5E6C8]/70 hover:text-[#F5E6C8]"
                }`}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Book Now CTA */}
          <button
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("top-salons")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              } else {
                document
                  .getElementById("top-salons")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-5 py-2 bg-[#C9A84C] text-[#1A0A0F] text-sm font-semibold rounded-full hover:bg-[#C9A84C]/85 active:scale-95 transition-all duration-200"
          >
            Book Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#C9A84C] p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A0A0F]/95 backdrop-blur-xl border-t border-[#C9A84C]/20 px-4 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-medium transition-colors ${
                isActive(link.to) ? 'text-[#C9A84C]' : 'text-[#F5E6C8]/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("top-salons")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              } else {
                document
                  .getElementById("top-salons")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full text-center py-3 bg-[#C9A84C] text-[#1A0A0F] font-semibold rounded-full"
          >
            Book Now
          </button>
        </div>
      )}
    </nav>
  );
}