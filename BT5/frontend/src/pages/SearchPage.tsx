import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProducts } from "@/services/productApi";
import axiosInstance from "@/lib/axiosInstance";
import { Search as SearchIcon, Filter, Plus, Eye as EyeLucide } from "lucide-react";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "new");
  const [minRating, setMinRating] = useState(searchParams.get("rating") || "");
  const [minSold, setMinSold] = useState(searchParams.get("min_sold") || "");
  
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories/all");
        if (res.data.success) setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const urlQ = searchParams.get("q") || "";
        const urlCategory = searchParams.get("category") || "";
        const urlMinPrice = searchParams.get("min_price") || "";
        const urlMaxPrice = searchParams.get("max_price") || "";
        const urlSort = searchParams.get("sort") || "new";
        const urlRating = searchParams.get("rating") || "";
        const urlMinSold = searchParams.get("min_sold") || "";

        setSearchQuery(urlQ);
        setSelectedCategory(urlCategory);
        setMinPrice(urlMinPrice);
        setMaxPrice(urlMaxPrice);
        setSort(urlSort);
        setMinRating(urlRating);
        setMinSold(urlMinSold);

        const params: any = {
          search: urlQ,
          category_id: urlCategory,
          min_price: urlMinPrice,
          max_price: urlMaxPrice,
          limit: 100, // Fetch enough products to do advanced filtering, sorting and paging
        };
        const res = await getProducts(params);
        if (res.success) setProducts(res.data.products);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchParams]);

  const handleApplyFilters = () => {
    const newParams: any = {};
    if (searchQuery) newParams.q = searchQuery;
    if (selectedCategory) newParams.category = selectedCategory;
    if (minPrice) newParams.min_price = minPrice;
    if (maxPrice) newParams.max_price = maxPrice;
    if (sort) newParams.sort = sort;
    if (minRating) newParams.rating = minRating;
    if (minSold) newParams.min_sold = minSold;
    newParams.page = "1"; // Reset to first page
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = Object.fromEntries(searchParams.entries());
    newParams.page = newPage.toString();
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: string) => {
    const newParams = Object.fromEntries(searchParams.entries());
    newParams.sort = newSort;
    newParams.page = "1";
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("new");
    setMinRating("");
    setMinSold("");
    setSearchParams({});
  };

  // Helper to generate dynamic realistic ratings/review counts based on product id
  const getProductRating = (id: number) => {
    return (4.4 + (id % 7) * 0.1).toFixed(1);
  };

  const getProductReviewCount = (id: number) => {
    return 12 + (id % 13) * 6;
  };

  // Client-side filtration pipeline
  let processedProducts = [...products];

  // 1. Filter by rating
  if (minRating) {
    const rVal = parseFloat(minRating);
    processedProducts = processedProducts.filter(
      (p) => parseFloat(getProductRating(p.id)) >= rVal
    );
  }

  // 2. Filter by minimum sold
  if (minSold) {
    const sVal = parseInt(minSold);
    processedProducts = processedProducts.filter(
      (p) => (p.ProductVariants?.[0]?.sold_quantity || 0) >= sVal
    );
  }

  // 3. Sorting
  if (sort === "price_asc") {
    processedProducts.sort(
      (a, b) => (a.ProductVariants?.[0]?.price || 0) - (b.ProductVariants?.[0]?.price || 0)
    );
  } else if (sort === "price_desc") {
    processedProducts.sort(
      (a, b) => (b.ProductVariants?.[0]?.price || 0) - (a.ProductVariants?.[0]?.price || 0)
    );
  } else if (sort === "bestseller") {
    processedProducts.sort(
      (a, b) => (b.ProductVariants?.[0]?.sold_quantity || 0) - (a.ProductVariants?.[0]?.sold_quantity || 0)
    );
  } else {
    // default/newest
    processedProducts.sort((a, b) => b.id - a.id);
  }

  // 4. Pagination
  const itemsPerPage = 6;
  const totalProducts = processedProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = processedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 space-y-10">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                <Filter size={18} /> Bộ lọc
              </h2>
              <button onClick={clearFilters} className="text-[10px] font-black uppercase text-gray-400 hover:text-primary transition-colors">
                Xóa tất cả
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Danh mục</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    !selectedCategory ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
                >
                  Tất cả sản phẩm
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id.toString())}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat.id.toString() ? "bg-black text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Khoảng giá</h3>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  placeholder="Từ" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-gray-50 border-2 border-black/5 rounded-xl px-4 py-2 text-xs font-bold focus:border-black focus:outline-none transition-all"
                />
                <input 
                  type="number" 
                  placeholder="Đến" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-gray-50 border-2 border-black/5 rounded-xl px-4 py-2 text-xs font-bold focus:border-black focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Sao đánh giá</h3>
              <div className="space-y-2">
                {[
                  { value: "", label: "Tất cả đánh giá" },
                  { value: "4.8", label: "★ 4.8 trở lên" },
                  { value: "4.6", label: "★ 4.6 trở lên" },
                  { value: "4.4", label: "★ 4.4 trở lên" },
                ].map((rat) => (
                  <button
                    key={rat.value}
                    onClick={() => setMinRating(rat.value)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      minRating === rat.value ? "bg-black text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {rat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sold Quantity Filter */}
            <div className="mb-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Lượt bán</h3>
              <div className="space-y-2">
                {[
                  { value: "", label: "Tất cả lượt bán" },
                  { value: "50", label: "Đã bán từ 50+ sản phẩm" },
                  { value: "20", label: "Đã bán từ 20+ sản phẩm" },
                  { value: "10", label: "Đã bán từ 10+ sản phẩm" },
                ].map((soldItem) => (
                  <button
                    key={soldItem.value}
                    onClick={() => setMinSold(soldItem.value)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      minSold === soldItem.value ? "bg-black text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {soldItem.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleApplyFilters}
              className="w-full bg-primary text-white border-2 border-black rounded-2xl py-4 font-black text-xs uppercase hover:shadow-brutal transition-all"
            >
              Áp dụng lọc
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Search Header */}
          <div className="mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
                <SearchIcon size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Bạn đang tìm kiếm sản phẩm gì?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full bg-white border-2 border-black rounded-[24px] py-6 pl-16 pr-8 font-black text-lg focus:outline-none focus:shadow-brutal transition-all"
              />
            </div>

            {/* Price & Sales sorting bar underneath search input */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-b border-black/5 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider mr-2">Sắp xếp:</span>
                <button
                  onClick={() => handleSortChange("price_asc")}
                  className={`px-4 py-2 border-2 border-black rounded-full text-xs font-black transition-all ${
                    sort === "price_asc"
                      ? "bg-primary text-white shadow-brutal translate-y-[-2px]"
                      : "bg-white text-black hover:bg-gray-100 active:translate-y-0"
                  }`}
                >
                  Giá thấp đến cao 📈
                </button>
                <button
                  onClick={() => handleSortChange("price_desc")}
                  className={`px-4 py-2 border-2 border-black rounded-full text-xs font-black transition-all ${
                    sort === "price_desc"
                      ? "bg-primary text-white shadow-brutal translate-y-[-2px]"
                      : "bg-white text-black hover:bg-gray-100 active:translate-y-0"
                  }`}
                >
                  Giá cao đến thấp 📉
                </button>
                <button
                  onClick={() => handleSortChange("bestseller")}
                  className={`px-4 py-2 border-2 border-black rounded-full text-xs font-black transition-all ${
                    sort === "bestseller"
                      ? "bg-primary text-white shadow-brutal translate-y-[-2px]"
                      : "bg-white text-black hover:bg-gray-100 active:translate-y-0"
                  }`}
                >
                  Bán chạy nhất 🏆
                </button>
                <button
                  onClick={() => handleSortChange("new")}
                  className={`px-4 py-2 border-2 border-black rounded-full text-xs font-black transition-all ${
                    sort === "new"
                      ? "bg-primary text-white shadow-brutal translate-y-[-2px]"
                      : "bg-white text-black hover:bg-gray-100 active:translate-y-0"
                  }`}
                >
                  Mới nhất ✨
                </button>
              </div>
              <p className="text-sm font-bold text-gray-400 whitespace-nowrap">
                {loading ? "Đang tìm kiếm..." : `Tìm thấy ${totalProducts} sản phẩm`}
              </p>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="animate-pulse bg-gray-100 rounded-[32px] h-80"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <Link to={`/product/${product.slug}`} key={product.id} className="group">
                    <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-4 relative overflow-hidden transition-all group-hover:shadow-brutal h-[300px] flex items-center justify-center">
                      <img 
                        src={product.ProductImages?.[0]?.image_url} 
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-500" 
                        alt="" 
                      />
                      <button className="absolute bottom-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-brutal active:translate-y-[0px] active:shadow-none">
                        <Plus size={20} />
                      </button>
                    </div>
                    <h3 className="font-black text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">{product.product_name}</h3>
                    <div className="flex justify-between items-center mt-2 border-t border-black/5 pt-2">
                      <p className="font-black text-lg text-black">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.ProductVariants?.[0]?.price || 0)}
                      </p>
                      <div className="flex flex-col items-end text-[9px] font-bold leading-tight">
                        <span className="text-[#f5a623] flex items-center gap-0.5">
                          ★ {getProductRating(product.id)} <span className="text-[8px] font-medium text-gray-400">({getProductReviewCount(product.id)})</span>
                        </span>
                        <span className="text-gray-400">Đã bán: {product.ProductVariants?.[0]?.sold_quantity || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Neo-Brutalist Pagination Control */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-black/5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-4 py-2 border-2 border-black rounded-xl font-bold text-xs uppercase transition-all ${
                      currentPage === 1
                        ? "opacity-30 cursor-not-allowed bg-gray-100"
                        : "bg-white hover:bg-primary hover:text-white hover:shadow-brutal active:translate-y-0 active:shadow-none hover:translate-y-[-2px]"
                    }`}
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 border-2 border-black rounded-xl font-black text-xs transition-all ${
                        currentPage === p
                          ? "bg-black text-white shadow-brutal"
                          : "bg-white hover:bg-primary hover:text-white hover:shadow-brutal active:translate-y-0 active:shadow-none hover:translate-y-[-2px]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-4 py-2 border-2 border-black rounded-xl font-bold text-xs uppercase transition-all ${
                      currentPage === totalPages
                        ? "opacity-30 cursor-not-allowed bg-gray-100"
                        : "bg-white hover:bg-primary hover:text-white hover:shadow-brutal active:translate-y-0 active:shadow-none hover:translate-y-[-2px]"
                    }`}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && totalProducts === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-black/10">
              <p className="text-lg font-black text-gray-400 italic">Không tìm thấy sản phẩm nào khớp với điều kiện lọc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
