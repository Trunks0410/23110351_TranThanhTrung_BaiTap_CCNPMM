import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProducts } from "@/services/productApi";
import axiosInstance from "@/lib/axiosInstance";
import { Search as SearchIcon, Filter, X, ChevronDown, Plus } from "lucide-react";

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
        const params: any = {
          search: searchQuery,
          category_id: selectedCategory,
          min_price: minPrice,
          max_price: maxPrice,
          type: sort === "new" ? "new" : sort === "bestseller" ? "bestseller" : undefined,
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
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("new");
    setSearchParams({});
  };

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

            {/* Sort Filter */}
            <div className="mb-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Sắp xếp</h3>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-gray-50 border-2 border-black/5 rounded-xl px-4 py-2 text-xs font-bold focus:border-black focus:outline-none transition-all appearance-none"
              >
                <option value="new">Mới nhất</option>
                <option value="bestseller">Bán chạy nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
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
            <p className="text-sm font-bold text-gray-400">
              {loading ? "Đang tìm kiếm..." : `Tìm thấy ${products.length} sản phẩm phù hợp`}
            </p>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="animate-pulse bg-gray-100 rounded-[32px] h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link to={`/product/${product.slug}`} key={product.id} className="group">
                  <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-4 relative overflow-hidden transition-all group-hover:shadow-brutal h-[300px] flex items-center justify-center">
                    <img 
                      src={product.ProductImages?.[0]?.image_url} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-500" 
                      alt="" 
                    />
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-brutal">
                      <Plus size={20} />
                    </button>
                  </div>
                  <h3 className="font-black text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">{product.product_name}</h3>
                  <p className="font-black text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.ProductVariants?.[0]?.price || 0)}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
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
