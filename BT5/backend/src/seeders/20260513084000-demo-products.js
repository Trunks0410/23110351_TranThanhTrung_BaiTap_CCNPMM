"use strict";

export default {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Clear existing data to avoid conflicts
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("variant_attribute_values", null, {});
    await queryInterface.bulkDelete("product_variants", null, {});
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("attribute_values", null, {});
    await queryInterface.bulkDelete("attributes", null, {});

    // 1. Categories
    await queryInterface.bulkInsert("categories", [
      { id: 1, category_name: "Điện thoại", description: "Các loại smartphone cao cấp", created_at: now, updated_at: now },
      { id: 2, category_name: "Smartwatch", description: "Đồng hồ thông minh thể thao", created_at: now, updated_at: now },
      { id: 3, category_name: "Phụ kiện", description: "Tai nghe, cáp sạc, pin dự phòng...", created_at: now, updated_at: now },
    ]);

    // 2. Attributes
    await queryInterface.bulkInsert("attributes", [
      { id: 1, attribute_name: "RAM", created_at: now, updated_at: now },
      { id: 2, attribute_name: "ROM", created_at: now, updated_at: now },
      { id: 3, attribute_name: "Màu sắc", created_at: now, updated_at: now },
    ]);

    // 3. Attribute Values
    await queryInterface.bulkInsert("attribute_values", [
      { id: 1, attribute_id: 1, value_name: "8GB", created_at: now, updated_at: now },
      { id: 2, attribute_id: 1, value_name: "12GB", created_at: now, updated_at: now },
      { id: 3, attribute_id: 2, value_name: "128GB", created_at: now, updated_at: now },
      { id: 4, attribute_id: 2, value_name: "256GB", created_at: now, updated_at: now },
      { id: 5, attribute_id: 2, value_name: "512GB", created_at: now, updated_at: now },
      { id: 6, attribute_id: 3, value_name: "Titan Tự Nhiên", created_at: now, updated_at: now },
      { id: 7, attribute_id: 3, value_name: "Đen Titanium", created_at: now, updated_at: now },
    ]);

    // 4. Products (18 items)
    const productsData = [
      // --- DỰNG SẢN PHẨM: ĐIỆN THOẠI (id: 1 - 8) ---
      {
        id: 1,
        category_id: 1,
        product_name: "iPhone 15 Pro Max",
        description: "Mẫu iPhone mạnh mẽ nhất năm 2024 với khung viền Titan và chip A17 Pro siêu khủng.",
        slug: "iphone-15-pro-max",
        is_active: true,
        is_promotion: true,
        views: 350,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        category_id: 1,
        product_name: "Samsung Galaxy S26 Ultra",
        description: "Siêu phẩm tương lai với màn hình vô cực, bút S-Pen và camera mắt thần 200MP.",
        slug: "samsung-galaxy-s26-ultra",
        is_active: true,
        is_promotion: false,
        views: 240,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        category_id: 1,
        product_name: "Xiaomi 14 Ultra",
        description: "Đỉnh cao nhiếp ảnh di động Leica kết hợp hiệu năng vượt trội từ Snapdragon 8 Gen 3.",
        slug: "xiaomi-14-ultra",
        is_active: true,
        is_promotion: true,
        views: 180,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        category_id: 1,
        product_name: "Google Pixel 8 Pro",
        description: "Trải nghiệm Android thuần khiết nhất với camera AI đỉnh cao từ Google Tensor G3.",
        slug: "google-pixel-8-pro",
        is_active: true,
        is_promotion: false,
        views: 150,
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        category_id: 1,
        product_name: "Oppo Find X7 Ultra",
        description: "Hệ thống 4 camera chính Hasselblad đầu tiên trên thế giới mang lại ảnh chụp nghệ thuật.",
        slug: "oppo-find-x7-ultra",
        is_active: true,
        is_promotion: false,
        views: 95,
        created_at: now,
        updated_at: now,
      },
      {
        id: 6,
        category_id: 1,
        product_name: "iPhone 14 Pro",
        description: "Sở hữu Dynamic Island độc đáo, chip A16 Bionic và camera nâng cấp 48MP.",
        slug: "iphone-14-pro",
        is_active: true,
        is_promotion: true,
        views: 420,
        created_at: now,
        updated_at: now,
      },
      {
        id: 7,
        category_id: 1,
        product_name: "Samsung Galaxy Z Fold5",
        description: "Điện thoại màn hình gập tối tân nhất của Samsung mở rộng không gian làm việc tối đa.",
        slug: "samsung-galaxy-z-fold5",
        is_active: true,
        is_promotion: false,
        views: 310,
        created_at: now,
        updated_at: now,
      },
      {
        id: 8,
        category_id: 1,
        product_name: "Asus ROG Phone 8",
        description: "Quái vật gaming tối thượng cho game thủ với tản nhiệt xịn và màn hình 165Hz siêu mượt.",
        slug: "asus-rog-phone-8",
        is_active: true,
        is_promotion: false,
        views: 210,
        created_at: now,
        updated_at: now,
      },

      // --- DỰNG SẢN PHẨM: SMARTWATCH (id: 9 - 13) ---
      {
        id: 9,
        category_id: 2,
        product_name: "Apple Watch Ultra 2",
        description: "Đồng hồ thám hiểm đỉnh cao dành cho vận động viên dã ngoại chuyên nghiệp.",
        slug: "apple-watch-ultra-2",
        is_active: true,
        is_promotion: true,
        views: 280,
        created_at: now,
        updated_at: now,
      },
      {
        id: 10,
        category_id: 2,
        product_name: "Samsung Galaxy Watch 6",
        description: "Theo dõi sức khỏe toàn diện và giấc ngủ thông minh với viền xoay bezel cổ điển.",
        slug: "samsung-galaxy-watch-6",
        is_active: true,
        is_promotion: false,
        views: 190,
        created_at: now,
        updated_at: now,
      },
      {
        id: 11,
        category_id: 2,
        product_name: "Garmin Fenix 7 Pro",
        description: "GPS chuyên dụng cao cấp, pin năng lượng mặt trời siêu khủng cho những hành trình dài ngày.",
        slug: "garmin-fenix-7-pro",
        is_active: true,
        is_promotion: false,
        views: 220,
        created_at: now,
        updated_at: now,
      },
      {
        id: 12,
        category_id: 2,
        product_name: "Xiaomi Watch S3",
        description: "Thiết kế viền đồng hồ có thể thay đổi linh hoạt cùng hệ điều hành HyperOS mượt mà.",
        slug: "xiaomi-watch-s3",
        is_active: true,
        is_promotion: true,
        views: 140,
        created_at: now,
        updated_at: now,
      },
      {
        id: 13,
        category_id: 2,
        product_name: "Huawei Watch GT 4",
        description: "Đồng hồ thời trang sang trọng, pin lên tới 14 ngày, tương thích tốt cả iOS và Android.",
        slug: "huawei-watch-gt-4",
        is_active: true,
        is_promotion: false,
        views: 110,
        created_at: now,
        updated_at: now,
      },

      // --- DỰNG SẢN PHẨM: PHỤ KIỆN (id: 14 - 18) ---
      {
        id: 14,
        category_id: 3,
        product_name: "AirPods Pro 2 USB-C",
        description: "Chống ồn chủ động xuất sắc, chip H2 thông minh và sạc MagSafe USB-C tiện lợi.",
        slug: "airpods-pro-2-usb-c",
        is_active: true,
        is_promotion: true,
        views: 490,
        created_at: now,
        updated_at: now,
      },
      {
        id: 15,
        category_id: 3,
        product_name: "Sony WF-1000XM5",
        description: "Tai nghe chống ồn tốt nhất thế giới, mang đến chất âm Hi-Res chân thực đỉnh cao.",
        slug: "sony-wf-1000xm5",
        is_active: true,
        is_promotion: false,
        views: 270,
        created_at: now,
        updated_at: now,
      },
      {
        id: 16,
        category_id: 3,
        product_name: "Marshall Motif II A.N.C.",
        description: "Tai nghe đậm chất rock biểu tượng với thiết kế da cá tính và chất âm mạnh mẽ.",
        slug: "marshall-motif-ii",
        is_active: true,
        is_promotion: true,
        views: 320,
        created_at: now,
        updated_at: now,
      },
      {
        id: 17,
        category_id: 3,
        product_name: "Sạc nhanh Anker GaN 65W",
        description: "Củ sạc siêu nhỏ gọn công nghệ GaN, sạc nhanh cho cả laptop, điện thoại và máy tính bảng.",
        slug: "sac-nhanh-anker-gan-65w",
        is_active: true,
        is_promotion: false,
        views: 250,
        created_at: now,
        updated_at: now,
      },
      {
        id: 18,
        category_id: 3,
        product_name: "Pin sạc dự phòng Shargeek Storm2",
        description: "Thiết kế vỏ trong suốt cyberpunk độc đáo, màn hình IPS hiển thị công suất sạc 100W.",
        slug: "pin-sac-du-phong-shargeek-storm2",
        is_active: true,
        is_promotion: false,
        views: 400,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("products", productsData);

    // 5. Product Variants (Tương ứng 18 sản phẩm)
    const variantsData = [
      // iPhone 15 Pro Max (id: 1)
      { id: 1, product_id: 1, sku: "IP15PM-256-NATURAL", price: 29990000, stock_quantity: 50, sold_quantity: 120, created_at: now, updated_at: now },
      { id: 2, product_id: 1, sku: "IP15PM-512-NATURAL", price: 33990000, stock_quantity: 25, sold_quantity: 45, created_at: now, updated_at: now },
      // Samsung Galaxy S26 Ultra (id: 2)
      { id: 3, product_id: 2, sku: "S26U-256-BLACK", price: 35990000, stock_quantity: 30, sold_quantity: 85, created_at: now, updated_at: now },
      // Xiaomi 14 Ultra (id: 3)
      { id: 4, product_id: 3, sku: "XM14U-512-WHITE", price: 28990000, stock_quantity: 40, sold_quantity: 45, created_at: now, updated_at: now },
      // Google Pixel 8 Pro (id: 4)
      { id: 5, product_id: 4, sku: "GP8P-128-BLUE", price: 19990000, stock_quantity: 15, sold_quantity: 20, created_at: now, updated_at: now },
      // Oppo Find X7 Ultra (id: 5)
      { id: 6, product_id: 5, sku: "OPX7U-256-BROWN", price: 22490000, stock_quantity: 20, sold_quantity: 60, created_at: now, updated_at: now },
      // iPhone 14 Pro (id: 6)
      { id: 7, product_id: 6, sku: "IP14P-128-GOLD", price: 24490000, stock_quantity: 35, sold_quantity: 110, created_at: now, updated_at: now },
      // Samsung Galaxy Z Fold5 (id: 7)
      { id: 8, product_id: 7, sku: "ZFOLD5-256-BLUE", price: 37990000, stock_quantity: 10, sold_quantity: 30, created_at: now, updated_at: now },
      // Asus ROG Phone 8 (id: 8)
      { id: 9, product_id: 8, sku: "ROG8-256-GRAY", price: 25990000, stock_quantity: 12, sold_quantity: 15, created_at: now, updated_at: now },
      
      // Apple Watch Ultra 2 (id: 9)
      { id: 10, product_id: 9, sku: "AWU2-49-ORANGE", price: 21990000, stock_quantity: 30, sold_quantity: 95, created_at: now, updated_at: now },
      // Samsung Galaxy Watch 6 (id: 10)
      { id: 11, product_id: 10, sku: "SGW6-44-SILVER", price: 6990000, stock_quantity: 40, sold_quantity: 75, created_at: now, updated_at: now },
      // Garmin Fenix 7 Pro (id: 11)
      { id: 12, product_id: 11, sku: "GMF7P-47-BLACK", price: 22990000, stock_quantity: 15, sold_quantity: 40, created_at: now, updated_at: now },
      // Xiaomi Watch S3 (id: 12)
      { id: 13, product_id: 12, sku: "XMWS3-BLACK", price: 3290000, stock_quantity: 100, sold_quantity: 130, created_at: now, updated_at: now },
      // Huawei Watch GT 4 (id: 13)
      { id: 14, product_id: 13, sku: "HWGT4-46-BROWN", price: 5490000, stock_quantity: 50, sold_quantity: 50, created_at: now, updated_at: now },

      // AirPods Pro 2 (id: 14)
      { id: 15, product_id: 14, sku: "APP2-USBC", price: 5790000, stock_quantity: 200, sold_quantity: 150, created_at: now, updated_at: now },
      // Sony WF-1000XM5 (id: 15)
      { id: 16, product_id: 15, sku: "SONY-XM5-BLACK", price: 6190000, stock_quantity: 80, sold_quantity: 80, created_at: now, updated_at: now },
      // Marshall Motif II (id: 16)
      { id: 17, product_id: 16, sku: "MS-MOTIF2-BLACK", price: 4990000, stock_quantity: 60, sold_quantity: 65, created_at: now, updated_at: now },
      // Sạc nhanh Anker GaN 65W (id: 17)
      { id: 18, product_id: 17, sku: "ANKER-GAN-65W", price: 890000, stock_quantity: 500, sold_quantity: 200, created_at: now, updated_at: now },
      // Pin sạc dự phòng Shargeek Storm2 (id: 18)
      { id: 19, product_id: 18, sku: "SHARGEEK-STORM2", price: 5990000, stock_quantity: 25, sold_quantity: 35, created_at: now, updated_at: now },
    ];

    await queryInterface.bulkInsert("product_variants", variantsData);

    // 6. variant_attribute_values
    await queryInterface.bulkInsert("variant_attribute_values", [
      { variant_id: 1, attribute_value_id: 1, created_at: now, updated_at: now },
      { variant_id: 1, attribute_value_id: 4, created_at: now, updated_at: now },
      { variant_id: 1, attribute_value_id: 6, created_at: now, updated_at: now },
      { variant_id: 2, attribute_value_id: 1, created_at: now, updated_at: now },
      { variant_id: 2, attribute_value_id: 5, created_at: now, updated_at: now },
      { variant_id: 3, attribute_value_id: 2, created_at: now, updated_at: now },
      { variant_id: 3, attribute_value_id: 4, created_at: now, updated_at: now },
    ]);

    // 7. Product Images (Ảnh chất lượng từ Unsplash)
    const imagesData = [
      { product_id: 1, image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 2, image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 3, image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 4, image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 5, image_url: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 6, image_url: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 7, image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 8, image_url: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },

      { product_id: 9, image_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 10, image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 11, image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 12, image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 13, image_url: "https://images.unsplash.com/photo-1617625884240-1a10b34b868a?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },

      { product_id: 14, image_url: "https://images.unsplash.com/photo-1588449668338-d15168637ddf?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 15, image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 16, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 17, image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
      { product_id: 18, image_url: "https://images.unsplash.com/photo-1622445262465-2481c8573226?q=80&w=600&auto=format&fit=crop", is_main: true, created_at: now, updated_at: now },
    ];

    await queryInterface.bulkInsert("product_images", imagesData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("variant_attribute_values", null, {});
    await queryInterface.bulkDelete("product_variants", null, {});
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("attribute_values", null, {});
    await queryInterface.bulkDelete("attributes", null, {});
    await queryInterface.bulkDelete("categories", null, {});
  },
};
