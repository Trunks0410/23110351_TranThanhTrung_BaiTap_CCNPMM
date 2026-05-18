import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Search, User } from "lucide-react";
import useAuth from "@/hooks/useAuth";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
    }
  };

  return (
    <header className="w-full bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="font-sans text-2xl font-black tracking-tighter text-primary italic">UTEShop</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm điện thoại, smartwatch..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-gray-50 border-2 border-black rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:bg-white focus:shadow-brutal transition-all"
          />
        </form>

        {/* Navigation & Icons */}
        <div className="flex items-center space-x-8">
          <nav className="hidden lg:flex items-center space-x-6">
            {[
              { label: "ĐIỆN THOẠI", categoryId: "1" },
              { label: "SMARTWATCH", categoryId: "2" },
              { label: "PHỤ KIỆN", categoryId: "3" },
            ].map((item) => (
              <Link
                key={item.label}
                to={`/search?category=${item.categoryId}`}
                className="text-[13px] font-black hover:text-primary transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center transition-all hover:bg-primary hover:border-primary hover:text-white hover:shadow-lg">
              <ShoppingCart size={20} />
            </button>
            
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full border-2 border-black overflow-hidden transition-all hover:border-primary hover:shadow-lg"
              >
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center transition-all hover:bg-primary hover:border-primary hover:text-white hover:shadow-lg"
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
