import { ShoppingBag, Phone, Mail, MapPin } from "lucide-react";

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Footer = () => {
  return (
    <footer className="w-full bg-[#f9f9f9] border-t-2 border-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo & Intro */}
          <div className="md:col-span-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="font-sans text-2xl font-black tracking-tighter text-primary italic">UTEShop</span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-8 max-w-xs">
              Hệ thống bán lẻ điện thoại, smartwatch và phụ kiện công nghệ uy tín hàng đầu cho sinh viên và giới trẻ.
            </p>
            <div className="flex space-x-3">
              {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all hover:shadow-brutal"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2">
            <h4 className="font-sans font-black text-sm mb-6 uppercase tracking-wider">Sản phẩm</h4>
            <ul className="space-y-4 text-[13px] font-bold text-gray-600">
              {["iPhone 15 Series", "Samsung Galaxy S24", "Apple Watch Ultra", "Phụ kiện Baseus", "Loa Marshall"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div className="md:col-span-2">
            <h4 className="font-sans font-black text-sm mb-6 uppercase tracking-wider">Chính sách</h4>
            <ul className="space-y-4 text-[13px] font-bold text-gray-600">
              {["Bảo hành 1 đổi 1", "Vận chuyển tận nơi", "Trả góp qua Kredivo", "Thu cũ đổi mới", "Bảo mật thông tin"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="font-sans font-black text-sm mb-6 uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <span className="text-[13px] font-bold">1900 6789</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <span className="text-[13px] font-bold">contact@uteshop.vn</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-[13px] font-bold">01 Võ Văn Ngân, TP. Thủ Đức</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-black/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            © 2024 UTESHOP - DESIGNED WITH MODERN RETRO AESTHETIC
          </p>
          <div className="flex space-x-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-black transition-colors">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
