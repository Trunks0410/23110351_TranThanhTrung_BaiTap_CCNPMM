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
      { id: 1, category_name: "Điện thoại", description: "Các loại smartphone", created_at: now, updated_at: now },
      { id: 2, category_name: "Smartwatch", description: "Đồng hồ thông minh", created_at: now, updated_at: now },
      { id: 3, category_name: "Phụ kiện", description: "Tai nghe, cáp sạc...", created_at: now, updated_at: now },
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

    // 4. Products
    await queryInterface.bulkInsert("products", [
      {
        id: 1,
        category_id: 1,
        product_name: "iPhone 15 Pro Max",
        description: "Mẫu iPhone mạnh mẽ nhất năm 2024 với khung viền Titan.",
        slug: "iphone-15-pro-max",
        is_active: true,
        is_promotion: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        category_id: 1,
        product_name: "Samsung Galaxy S26 Ultra",
        description: "Siêu phẩm tương lai với màn hình vô cực và camera 500MP.",
        slug: "samsung-galaxy-s26-ultra",
        is_active: true,
        is_promotion: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 5. Variants for iPhone 15 Pro Max
    await queryInterface.bulkInsert("product_variants", [
      {
        id: 1,
        product_id: 1,
        sku: "IP15PM-256-NATURAL",
        price: 29990000,
        stock_quantity: 50,
        sold_quantity: 120,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        product_id: 1,
        sku: "IP15PM-512-NATURAL",
        price: 33990000,
        stock_quantity: 25,
        sold_quantity: 45,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        product_id: 1,
        sku: "IP15PM-256-BLACK",
        price: 29990000,
        stock_quantity: 40,
        sold_quantity: 80,
        created_at: now,
        updated_at: now,
      },
      // Samsung variants
      {
        id: 4,
        product_id: 2,
        sku: "S26U-256-BLACK",
        price: 35990000,
        stock_quantity: 30,
        sold_quantity: 85,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 6. Link Variants to Attributes (variant_attribute_values)
    await queryInterface.bulkInsert("variant_attribute_values", [
      // IP15PM-256-NATURAL (8GB, 256GB, Titan Tự Nhiên)
      { variant_id: 1, attribute_value_id: 1, created_at: now, updated_at: now },
      { variant_id: 1, attribute_value_id: 4, created_at: now, updated_at: now },
      { variant_id: 1, attribute_value_id: 6, created_at: now, updated_at: now },
      
      // IP15PM-512-NATURAL (8GB, 512GB, Titan Tự Nhiên)
      { variant_id: 2, attribute_value_id: 1, created_at: now, updated_at: now },
      { variant_id: 2, attribute_value_id: 5, created_at: now, updated_at: now },
      { variant_id: 2, attribute_value_id: 6, created_at: now, updated_at: now },

      // IP15PM-256-BLACK (8GB, 256GB, Đen Titanium)
      { variant_id: 3, attribute_value_id: 1, created_at: now, updated_at: now },
      { variant_id: 3, attribute_value_id: 4, created_at: now, updated_at: now },
      { variant_id: 3, attribute_value_id: 7, created_at: now, updated_at: now },

      // S26U-256-BLACK (12GB, 256GB, Đen Titanium)
      { variant_id: 4, attribute_value_id: 2, created_at: now, updated_at: now },
      { variant_id: 4, attribute_value_id: 4, created_at: now, updated_at: now },
      { variant_id: 4, attribute_value_id: 7, created_at: now, updated_at: now },
    ]);

    // 7. Product Images
    await queryInterface.bulkInsert("product_images", [
      {
        product_id: 1,
        image_url: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1692845702708",
        is_main: true,
        created_at: now,
        updated_at: now,
      },
      {
        product_id: 2,
        image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop",
        is_main: true,
        created_at: now,
        updated_at: now,
      },
    ]);
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
