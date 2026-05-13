import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  getProducts, 
  getProductDetail 
} from "@/services/productApi";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RefreshCcw 
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProductDetail(slug!);
        if (response.success) {
          const data = response.data.product;
          setProduct(data);
          setSimilarProducts(response.data.similarProducts);
          
          // Mặc định chọn biến thể đầu tiên
          if (data.ProductVariants && data.ProductVariants.length > 0) {
            setSelectedVariant(data.ProductVariants[0]);
          }

          // Mặc định ảnh chính
          const mainImg = data.ProductImages?.find((img: any) => img.is_main);
          setActiveImage(mainImg?.image_url || "");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < selectedVariant?.stock_quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-black">Sản phẩm không tồn tại.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-8">
        <Link to="/" className="hover:text-black">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-400">{product.Category?.category_name}</span>
        <span>/</span>
        <span className="text-black">{product.product_name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Left: Images */}
        <div className="lg:col-span-7">
          <div className="bg-[#f5f5f5] border-2 border-black rounded-[40px] p-10 mb-6 flex items-center justify-center min-h-[500px]">
            <img src={activeImage || "https://placehold.co/600x600?text=No+Image"} alt={product.product_name} className="max-h-[400px] object-contain mix-blend-multiply" />
          </div>
          
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={4}
            navigation
            className="product-thumbs"
          >
            {product.ProductImages?.map((img: any, idx: number) => (
              <SwiperSlide key={idx}>
                <button 
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-full bg-[#f5f5f5] border-2 rounded-2xl p-2 transition-all ${
                    activeImage === img.image_url ? "border-primary" : "border-black/5 hover:border-black"
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-20 object-contain mix-blend-multiply" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5">
          <div className="mb-8">
            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
              {product.Category?.category_name}
            </span>
            <h1 className="text-4xl font-black italic uppercase leading-none mb-4 tracking-tighter">
              {product.product_name}
            </h1>
            <div className="flex items-center space-x-4">
               <p className="text-3xl font-black text-primary">
                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant?.price || 0)}
               </p>
               <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black">
                 Đã bán {selectedVariant?.sold_quantity || 0}
               </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 font-bold leading-relaxed mb-10">
            {product.description}
          </p>

          {/* Variant Selection (RAM/ROM) */}
          <div className="mb-10">
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-4">Chọn phiên bản</h4>
            <div className="grid grid-cols-2 gap-3">
              {product.ProductVariants?.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant)}
                  className={`border-2 rounded-2xl p-4 text-left transition-all ${
                    selectedVariant?.id === variant.id 
                    ? "border-black bg-black text-white shadow-brutal" 
                    : "border-black/10 hover:border-black"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase opacity-60">
                    {variant.AttributeValues?.map((av: any) => av.value_name).join(" / ")}
                  </p>
                  <p className="font-black text-sm">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Inventory & Quantity */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
               <h4 className="text-[11px] font-black uppercase tracking-widest">Số lượng</h4>
               <p className="text-[11px] font-bold text-gray-400">
                 Kho hàng: <span className={selectedVariant?.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                   {selectedVariant?.stock_quantity > 0 ? `${selectedVariant.stock_quantity} sản phẩm` : "Hết hàng"}
                 </span>
               </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center border-2 border-black rounded-2xl overflow-hidden">
                <button 
                  onClick={decrementQuantity}
                  className="px-4 py-3 hover:bg-black hover:text-white transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-black">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-4 py-3 hover:bg-black hover:text-white transition-colors"
                  disabled={quantity >= selectedVariant?.stock_quantity}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase transition-all ${
                  selectedVariant?.stock_quantity > 0 
                  ? "bg-primary text-white border-2 border-black hover:shadow-brutal active:translate-y-1" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={selectedVariant?.stock_quantity <= 0}
              >
                <ShoppingCart size={20} />
                {selectedVariant?.stock_quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 border-t-2 border-black/5 pt-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <p className="text-[10px] font-black">Bảo hành 12 tháng</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Truck size={16} />
              </div>
              <p className="text-[10px] font-black">Giao hàng 2h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((p: any) => (
            <Link to={`/product/${p.slug}`} key={p.id} className="group">
              <div className="bg-[#f5f5f5] border-2 border-black rounded-[32px] p-6 mb-4 relative overflow-hidden transition-all group-hover:shadow-brutal">
                <img 
                  src={p.ProductImages?.find((i: any) => i.is_main)?.image_url} 
                  className="w-full h-48 object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-500" 
                  alt="" 
                />
              </div>
              <h3 className="font-black text-sm mb-2">{p.product_name}</h3>
              <p className="font-black text-primary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.ProductVariants?.[0]?.price || 0)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
