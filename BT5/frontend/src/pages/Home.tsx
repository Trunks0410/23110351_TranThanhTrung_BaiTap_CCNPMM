import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/productApi";
import axiosInstance from "@/lib/axiosInstance";
import { 
  ArrowRight as ArrowRightLucide, 
  Plus as PlusLucide, 
  Zap as ZapLucide, 
  CreditCard as CreditCardLucide, 
  ChevronRight as ChevronRightLucide,
  ChevronLeft as ChevronLeftLucide,
  Eye as EyeLucide,
  Loader2 as Loader2Lucide
} from "lucide-react";

const Home = () => {
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [mostViewed, setMostViewed] = useState<any[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Categories states
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Lazy Loaded Category Products states
  const [catProducts, setCatProducts] = useState<any[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catOffset, setCatOffset] = useState(0);
  const [catHasMore, setCatHasMore] = useState(true);
  const CAT_LIMIT = 4; // Tải 4 sản phẩm mỗi lần

  // Responsive Carousel page states
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [bestPage, setBestPage] = useState(0);
  const [viewedPage, setViewedPage] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = windowWidth >= 1024 ? 4 : windowWidth >= 768 ? 2 : 1;

  // Fetch standard home sections: Newest (4), Promotion (4), Bestsellers (10), Most-viewed (10), Categories list
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [newRes, bestRes, promoRes, viewedRes, catRes] = await Promise.all([
          getProducts({ type: "new", limit: 4 }),
          getProducts({ type: "bestseller", limit: 10 }), // Lấy 10 sản phẩm
          getProducts({ type: "sale", limit: 4 }),
          getProducts({ type: "mostviewed", limit: 10 }), // Lấy 10 sản phẩm
          axiosInstance.get("/api/categories/all"),
        ]);

        if (newRes.success) setNewProducts(newRes.data.products);
        if (bestRes.success) setBestSellers(bestRes.data.products);
        if (promoRes.success) setPromotionProducts(promoRes.data.products);
        if (viewedRes.success) setMostViewed(viewedRes.data.products);
        if (catRes.data.success) {
          setDbCategories(catRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Fetch category products whenever activeCategoryId changes
  useEffect(() => {
    const fetchCategoryInit = async () => {
      try {
        setCatLoading(true);
        setCatOffset(0);
        setCatProducts([]);
        
        const params: any = {
          limit: CAT_LIMIT,
          offset: 0,
        };
        if (activeCategoryId !== null) {
          params.category_id = activeCategoryId;
        }

        const res = await getProducts(params);
        if (res.success) {
          setCatProducts(res.data.products);
          setCatHasMore(res.data.products.length >= CAT_LIMIT);
        }
      } catch (error) {
        console.error("Error fetching initial category products:", error);
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategoryInit();
  }, [activeCategoryId]);

  // Load next page of category products (Lazy Loading)
  const loadNextPage = async () => {
    if (catLoading || !catHasMore) return;

    try {
      setCatLoading(true);
      const nextOffset = catOffset + CAT_LIMIT;
      setCatOffset(nextOffset);

      const params: any = {
        limit: CAT_LIMIT,
        offset: nextOffset,
      };
      if (activeCategoryId !== null) {
        params.category_id = activeCategoryId;
      }

      const res = await getProducts(params);
      if (res.success) {
        const newBatch = res.data.products;
        if (newBatch.length > 0) {
          setCatProducts((prev) => [...prev, ...newBatch]);
        }
        setCatHasMore(newBatch.length >= CAT_LIMIT);
      }
    } catch (error) {
      console.error("Error loading next page of products:", error);
    } finally {
      setCatLoading(false);
    }
  };

  // Scroll listener for Lazy Loading
  useEffect(() => {
    const handleScroll = () => {
      // Khi cuộn gần đến cuối trang (còn 150px)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 150
      ) {
        if (!catLoading && catHasMore) {
          loadNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [catLoading, catHasMore, catOffset, activeCategoryId]);

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductRating = (id: number) => {
    return (4.4 + (id % 7) * 0.1).toFixed(1);
  };

  const getProductReviewCount = (id: number) => {
    return 12 + (id % 13) * 6;
  };

  // Helper chunking array for horizontal pages
  const chunkArray = (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  // Emojis/Icons for categories
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("thoại") || lower.includes("phone")) return "📱";
    if (lower.includes("watch") || lower.includes("đồng hồ")) return "⌚";
    return "🎧"; // Phụ kiện / Mặc định
  };

  const bestChunks = chunkArray(bestSellers, itemsPerPage);
  const viewedChunks = chunkArray(mostViewed, itemsPerPage);

  const maxBestPage = bestChunks.length - 1;
  const maxViewedPage = viewedChunks.length - 1;

  // Reset Carousel pages if itemsPerPage changes to avoid out-of-bounds offset
  useEffect(() => {
    setBestPage(0);
    setViewedPage(0);
  }, [itemsPerPage]);

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
            src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop"
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

      {/* CHỨC NĂNG 1: Lazy loading sản phẩm theo từng Danh mục */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Danh mục sản phẩm</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Lọc sản phẩm theo thương hiệu và phân loại</p>
        </div>

        {/* Categories Dynamic Tabs */}
        <div className="flex gap-4 overflow-x-auto pt-2 pb-6 px-1 no-scrollbar mb-8 relative z-10">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 border-black font-black text-xs whitespace-nowrap transition-all duration-200 ${
              activeCategoryId === null 
                ? "bg-primary text-white shadow-brutal translate-y-[-2px] active:translate-y-[0px] active:shadow-none" 
                : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-brutal hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
            }`}
          >
            <span>🌐</span> Tất cả
          </button>

          {dbCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 border-black font-black text-xs whitespace-nowrap transition-all duration-200 ${
                activeCategoryId === cat.id 
                  ? "bg-primary text-white shadow-brutal translate-y-[-2px] active:translate-y-[0px] active:shadow-none" 
                  : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-brutal hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
              }`}
            >
              <span>{getCategoryIcon(cat.category_name)}</span>
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Dynamic Category Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {catProducts.map((product) => (
            <Link to={`/product/${product.slug}`} key={product.id} className="group relative flex flex-col justify-between h-full">
              <div>
                <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-4 relative overflow-hidden transition-all group-hover:shadow-brutal h-[300px] flex items-center justify-center">
                  {product.is_promotion && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-md z-10">
                      SALE
                    </span>
                  )}
                  <img
                    src={product.ProductImages?.[0]?.image_url || "https://placehold.co/600x600?text=No+Image"}
                    alt={product.product_name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 shadow-brutal active:translate-y-[0px] active:shadow-none">
                    <PlusLucide size={20} />
                  </button>
                </div>
                <h3 className="font-black text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {product.product_name}
                </h3>
              </div>
              <div>
                <p className="font-black text-lg text-black">{formatPrice(product.ProductVariants?.[0]?.price || 0)}</p>
                <div className="flex justify-between items-center mt-2 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-[#f5a623]">
                    ★ {getProductRating(product.id)} <span className="text-gray-400 font-medium">({getProductReviewCount(product.id)})</span>
                  </span>
                  <span className="text-gray-400">Đã bán: {product.ProductVariants?.[0]?.sold_quantity || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Infinite Scroll / Lazy Loading Status & Manual Trigger */}
        <div className="mt-12 flex flex-col items-center justify-center">
          {catLoading && (
            <div className="flex items-center gap-2 text-primary font-black text-sm uppercase">
              <Loader2Lucide className="animate-spin" size={24} /> Đang tải thêm sản phẩm...
            </div>
          )}

          {!catLoading && catHasMore && (
            <button
              onClick={loadNextPage}
              className="bg-white text-black border-2 border-black px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-brutal hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
            >
              Xem thêm sản phẩm <PlusLucide size={16} />
            </button>
          )}

          {!catHasMore && catProducts.length > 0 && (
            <span className="bg-gray-100 text-gray-500 border border-gray-300 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-wider">
              🎉 Đã hiển thị toàn bộ sản phẩm của danh mục
            </span>
          )}

          {catProducts.length === 0 && !catLoading && (
            <div className="text-center py-12 w-full bg-gray-50 border-2 border-dashed border-black/10 rounded-[32px]">
              <p className="text-gray-400 font-bold italic">Không có sản phẩm nào thuộc danh mục này</p>
            </div>
          )}
        </div>
      </div>

      {/* Promotion Section */}
      <div className="mb-20 border-t-2 border-black/5 pt-16">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-primary">Khuyến mãi cực hot</h2>
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

      {/* CHỨC NĂNG 2: Carousel 10 Sản phẩm bán chạy nhất - Phân trang ngang */}
      <div className="mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Bán chạy nhất (Top 10)</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Các sản phẩm có doanh số bán cao nhất</p>
          </div>
          
          {/* Custom Navigation Controls */}
          {bestChunks.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                Trang {bestPage + 1} / {bestChunks.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBestPage((prev) => Math.max(prev - 1, 0))}
                  disabled={bestPage === 0}
                  className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all duration-200 ${
                    bestPage === 0 ? "opacity-30 cursor-not-allowed bg-gray-100" : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-brutal hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
                  }`}
                >
                  <ChevronLeftLucide size={20} />
                </button>
                <button
                  onClick={() => setBestPage((prev) => Math.min(prev + 1, maxBestPage))}
                  disabled={bestPage === maxBestPage}
                  className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all duration-200 ${
                    bestPage === maxBestPage ? "opacity-30 cursor-not-allowed bg-gray-100" : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-brutal hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
                  }`}
                >
                  <ChevronRightLucide size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Carousel sliding container */}
        <div className="overflow-hidden w-full relative">
          <div 
            className="flex transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${bestPage * 100}%)` }}
          >
            {bestChunks.map((chunk, chunkIdx) => (
              <div key={chunkIdx} className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {chunk.map((product) => (
                  <Link to={`/product/${product.slug}`} key={product.id} className="group relative flex flex-col justify-between h-full">
                    <div>
                      <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-6 relative overflow-hidden transition-all group-hover:shadow-brutal h-[300px] flex items-center justify-center">
                        <span className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-md z-10 uppercase">
                          TOP {chunkIdx * itemsPerPage + chunk.indexOf(product) + 1} BÁN CHẠY
                        </span>
                        <img
                          src={product.ProductImages?.[0]?.image_url || "https://placehold.co/600x600?text=No+Image"}
                          alt={product.product_name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        />
                        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 shadow-brutal active:translate-y-[0px] active:shadow-none">
                          <PlusLucide size={20} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-[#f5a623] text-[10px] font-bold mb-1">
                        ★ {getProductRating(product.id)} <span className="text-gray-400 font-medium">({getProductReviewCount(product.id)})</span>
                      </div>
                      <h3 className="font-black text-sm leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {product.product_name}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center mt-2 border-t border-black/5 pt-2">
                      <p className="font-black text-lg text-black">{formatPrice(product.ProductVariants?.[0]?.price || 0)}</p>
                      <span className="text-[10px] font-bold text-gray-400">Đã bán: {product.ProductVariants?.[0]?.sold_quantity || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots Indicator */}
        {bestChunks.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {bestChunks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setBestPage(idx)}
                className={`w-3 h-3 rounded-full border border-black transition-all ${
                  bestPage === idx ? "bg-black scale-125" : "bg-white hover:bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CHỨC NĂNG 2: Carousel 10 Sản phẩm xem nhiều nhất - Phân trang ngang */}
      <div className="mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Xem nhiều nhất (Top 10)</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Các sản phẩm được quan tâm nhiều nhất</p>
          </div>
          
          {/* Custom Navigation Controls */}
          {viewedChunks.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                Trang {viewedPage + 1} / {viewedChunks.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewedPage((prev) => Math.max(prev - 1, 0))}
                  disabled={viewedPage === 0}
                  className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all duration-200 ${
                    viewedPage === 0 ? "opacity-30 cursor-not-allowed bg-gray-100" : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-brutal hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
                  }`}
                >
                  <ChevronLeftLucide size={20} />
                </button>
                <button
                  onClick={() => setViewedPage((prev) => Math.min(prev + 1, maxViewedPage))}
                  disabled={viewedPage === maxViewedPage}
                  className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center transition-all duration-200 ${
                    viewedPage === maxViewedPage ? "opacity-30 cursor-not-allowed bg-gray-100" : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-brutal hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-none"
                  }`}
                >
                  <ChevronRightLucide size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Carousel sliding container */}
        <div className="overflow-hidden w-full relative">
          <div 
            className="flex transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${viewedPage * 100}%)` }}
          >
            {viewedChunks.map((chunk, chunkIdx) => (
              <div key={chunkIdx} className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {chunk.map((product) => (
                  <Link to={`/product/${product.slug}`} key={product.id} className="group relative flex flex-col justify-between h-full">
                    <div>
                      <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-6 relative overflow-hidden transition-all group-hover:shadow-brutal h-[300px] flex items-center justify-center">
                        <span className="absolute top-4 left-4 bg-teal-500 text-white text-[9px] font-black px-2 py-1 rounded-md z-10 uppercase">
                          TOP {chunkIdx * itemsPerPage + chunk.indexOf(product) + 1} LƯỢT XEM
                        </span>
                        <img
                          src={product.ProductImages?.[0]?.image_url || "https://placehold.co/600x600?text=No+Image"}
                          alt={product.product_name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        />
                        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 shadow-brutal active:translate-y-[0px] active:shadow-none">
                          <PlusLucide size={20} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-[#f5a623] text-[10px] font-bold mb-1">
                        ★ {getProductRating(product.id)} <span className="text-gray-400 font-medium">({getProductReviewCount(product.id)})</span>
                      </div>
                      <h3 className="font-black text-sm leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {product.product_name}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center mt-2 border-t border-black/5 pt-2">
                      <p className="font-black text-lg text-black">{formatPrice(product.ProductVariants?.[0]?.price || 0)}</p>
                      <div className="flex flex-col items-end text-[9px] text-gray-400 font-bold leading-tight">
                        <span>Đã bán: {product.ProductVariants?.[0]?.sold_quantity || 0}</span>
                        <span className="flex items-center gap-0.5"><EyeLucide size={10} /> {product.views || 0} xem</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots Indicator */}
        {viewedChunks.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {viewedChunks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setViewedPage(idx)}
                className={`w-3 h-3 rounded-full border border-black transition-all ${
                  viewedPage === idx ? "bg-black scale-125" : "bg-white hover:bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
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
