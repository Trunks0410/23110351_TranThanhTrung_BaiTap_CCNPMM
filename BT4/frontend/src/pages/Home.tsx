import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/productApi";
import { ArrowRight, Plus, Zap, CreditCard, ChevronRight } from "lucide-material";
import { ShoppingCart, User, Search, Menu, Heart, ArrowRight as ArrowIcon, Plus as PlusIcon, Zap as ZapIcon, CreditCard as CreditCardIcon, ChevronRight as ChevronRightIcon } from "lucide-react";

// Vì lucide-material có thể không tồn tại, tôi sẽ dùng lucide-react cho tất cả
import { 
  ArrowRight as ArrowRightLucide, 
  Plus as PlusLucide, 
  Zap as ZapLucide, 
  CreditCard as CreditCardLucide, 
  ChevronRight as ChevronRightLucide 
} from "lucide-react";

const Home = () => {
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Tất cả", icon: null, active: true },
    { name: "Apple", icon: "https://cdn-icons-png.flaticon.com/512/0/747.png" },
    { name: "Samsung", icon: "https://cdn-icons-png.flaticon.com/512/5969/5969046.png" },
    { name: "Xiaomi", icon: "https://cdn-icons-png.flaticon.com/512/11516/11516142.png" },
    { name: "Garmin", icon: "https://cdn-icons-png.flaticon.com/512/5969/5969116.png" },
    { name: "Âm thanh", icon: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png" },
    { name: "Laptop", icon: "https://cdn-icons-png.flaticon.com/512/3067/3067451.png" },
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [newRes, bestRes, promoRes] = await Promise.all([
          getProducts({ type: "new", limit: 4 }),
          getProducts({ type: "bestseller", limit: 4 }),
          getProducts({ type: "sale", limit: 4 }),
        ]);

        if (newRes.success) setNewProducts(newRes.data.products);
        if (bestRes.success) setBestSellers(bestRes.data.products);
        if (promoRes.success) setPromotionProducts(promoRes.data.products);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
        {/* Main Banner */}
        <div className="md:col-span-8 bg-[#f5f5f5] border-2 border-black rounded-[40px] p-10 relative overflow-hidden group hover:shadow-brutal transition-all min-h-[450px] flex items-center">
          <div className="relative z-10 max-w-sm">
            <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
              New Arrival
            </span>
            <h1 className="text-6xl font-black leading-[1.1] mb-6 italic tracking-tighter">
              SỨC MẠNH <br /> <span className="text-primary">VÔ ĐỐI.</span>
            </h1>
            <p className="text-sm text-gray-500 font-bold leading-relaxed mb-10">
              Khám phá dòng sản phẩm iPhone 15 Pro với khung viền Titan siêu bền và chip A17 Pro lần đầu tiên xuất hiện.
            </p>
            <Link to="/product/iphone-15-pro-max" className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm uppercase inline-flex items-center gap-3 transition-all hover:bg-primary hover:translate-x-2 group-hover:shadow-brutal">
              Mua ngay <ArrowRightLucide size={20} />
            </Link>
          </div>
          <img
            src="https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1692845702708"
            alt="iPhone 15 Pro"
            className="absolute top-0 right-[-10%] h-full w-2/3 object-contain pointer-events-none group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Side Banners */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Flash Sale */}
          <div className="bg-[#eef2ff] border-2 border-black rounded-[40px] p-8 relative overflow-hidden group hover:shadow-brutal transition-all flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Flash Sale</h3>
                <p className="text-[10px] font-bold text-gray-500">Kết thúc sau:</p>
              </div>
              <ZapLucide className="text-primary fill-primary" size={24} />
            </div>
            
            <div className="flex gap-2 mb-8">
              {["02", "14", "55"].map((num, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg">
                    {num}
                  </div>
                  {i < 2 && <span className="font-black">:</span>}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 bg-white/50 border-2 border-black p-3 rounded-2xl">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100&auto=format&fit=crop" className="w-12 h-12 object-cover rounded-lg border border-black" alt="" />
              <div>
                <p className="text-[11px] font-black leading-none mb-1">Marshall Major IV</p>
                <p className="text-primary font-black text-xs">-45%</p>
              </div>
            </div>
          </div>

          {/* Installment */}
          <div className="bg-white border-2 border-black rounded-[40px] p-8 relative overflow-hidden group hover:shadow-brutal transition-all flex-1">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center">
                 <CreditCardLucide size={20} />
               </div>
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Trả góp 0%</h3>
            </div>
            <p className="text-[11px] font-bold text-gray-500 leading-relaxed mb-6">
              Mua sắm không lo âu với ưu đãi trả góp 0% lãi suất qua thẻ tín dụng và đối tác tài chính.
            </p>
            <a href="#" className="text-[11px] font-black text-primary underline decoration-2 underline-offset-4 flex items-center gap-1">
              Tìm hiểu thêm <ChevronRightLucide size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Danh mục</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lọc theo thương hiệu bạn yêu thích</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 border-black font-black text-xs whitespace-nowrap transition-all ${
                cat.active ? "bg-primary text-white" : "bg-white hover:shadow-brutal"
              }`}
            >
              {cat.icon && <img src={cat.icon} alt="" className="w-4 h-4 object-contain" />}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Promotion Section */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-primary">Khuyến mãi cực hót</h2>
          <Link to="/search?sort=sale" className="text-xs font-black text-primary flex items-center gap-1 hover:translate-x-1 transition-transform">
            Xem tất cả <ChevronRightLucide size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotionProducts.map((product) => (
            <Link to={`/product/${product.slug}`} key={product.id} className="group relative">
              <div className="bg-[#fff1f1] border-2 border-primary rounded-[32px] p-6 mb-6 relative overflow-hidden transition-all group-hover:shadow-brutal min-h-[300px] flex items-center justify-center">
                <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-md z-10 animate-pulse">
                  SALE SỐC
                </span>
                <img
                  src={product.ProductImages?.[0]?.image_url || "https://placehold.co/600x600?text=No+Image"}
                  alt={product.product_name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="font-black text-sm mb-3 line-clamp-2">{product.product_name}</h3>
                <div className="flex items-center gap-3">
                   <p className="font-black text-lg text-primary">{formatPrice(product.ProductVariants?.[0]?.price)}</p>
                   <p className="text-xs text-gray-400 line-through font-bold">{formatPrice(product.ProductVariants?.[0]?.price * 1.2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newest Products Section */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Sản phẩm mới nhất</h2>
          <Link to="/search?sort=new" className="text-xs font-black text-primary flex items-center gap-1 hover:translate-x-1 transition-transform">
            Xem tất cả <ChevronRightLucide size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {newProducts.map((product) => (
            <Link to={`/product/${product.slug}`} key={product.id} className="group relative">
              <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-6 relative overflow-hidden transition-all group-hover:shadow-brutal min-h-[300px] flex items-center justify-center">
                <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-md z-10">
                  MỚI
                </span>
                <img
                  src={product.ProductImages?.[0]?.image_url || "https://placehold.co/600x600?text=No+Image"}
                  alt={product.product_name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-brutal">
                  <PlusLucide size={20} />
                </button>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{product.slug}</p>
                <h3 className="font-black text-sm leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {product.product_name}
                </h3>
                <p className="font-black text-lg">{formatPrice(product.ProductVariants?.[0]?.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Bán chạy nhất</h2>
          <Link to="/search?sort=bestseller" className="text-xs font-black text-primary flex items-center gap-1 hover:translate-x-1 transition-transform">
            Xem tất cả <ChevronRightLucide size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestSellers.map((product) => (
            <Link to={`/product/${product.slug}`} key={product.id} className="group relative">
              <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-6 relative overflow-hidden transition-all group-hover:shadow-brutal min-h-[300px] flex items-center justify-center">
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-md z-10">
                  BÁN CHẠY
                </span>
                <img
                  src={product.ProductImages?.[0]?.image_url || "https://placehold.co/600x600?text=No+Image"}
                  alt={product.product_name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-brutal">
                  <PlusLucide size={20} />
                </button>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Đã bán {product.ProductVariants?.[0]?.sold_quantity}</p>
                <h3 className="font-black text-sm leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {product.product_name}
                </h3>
                <p className="font-black text-lg">{formatPrice(product.ProductVariants?.[0]?.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter / Benefits */}
      <div className="bg-[#1a1a1a] border-2 border-black rounded-[40px] p-12 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black text-white italic uppercase leading-none mb-4 tracking-tighter">
              ĐỪNG BỎ LỠ <br /> <span className="text-primary">KÈO THƠM.</span>
            </h2>
            <p className="text-sm text-gray-400 font-bold mb-10">
              Nhận ngay thông báo về các chương trình giảm giá độc quyền và sự kiện ra mắt sản phẩm mới sớm nhất.
            </p>
            <form className="flex gap-4 max-w-md">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 bg-white border-2 border-black rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:shadow-brutal transition-all"
              />
              <button className="bg-primary text-white border-2 border-black rounded-2xl px-8 py-4 font-black text-sm uppercase hover:shadow-brutal active:translate-y-1 transition-all">
                Đăng ký
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Bảo hành 12 tháng", desc: "Chính hãng 100%" },
              { title: "Giao hàng 2h", desc: "Nội thành TP.HCM" },
              { title: "Đổi trả 30 ngày", desc: "Lỗi là đổi mới" },
              { title: "Hỗ trợ 24/7", desc: "Tận tâm chu đáo" },
            ].map((benefit, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl group hover:bg-white/20 transition-all cursor-default">
                <h4 className="text-white font-black italic text-sm mb-1">{benefit.title}</h4>
                <p className="text-[10px] font-bold text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Decorative Text */}
        <div className="absolute bottom-[-10%] right-[-5%] text-[200px] font-black text-white/[0.03] italic pointer-events-none select-none tracking-tighter">
          UTEShop
        </div>
      </div>
    </div>
  );
};

export default Home;
