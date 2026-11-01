/**
 * Saubhagya Sarees — Database Seed Script
 *
 * Run: npx prisma db push && npx tsx prisma/seed.ts
 *
 * WARNING: Never run this against a production database without explicit intent.
 * The admin password is read from environment variables.
 */

import { PrismaClient, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Saubhagya Sarees database...\n");

  // ─── ADMIN USER ───────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@saubhagyasarees.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME || "Atelier Director";

  if (!adminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD environment variable is required. Set it in .env.local"
    );
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashed,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        adminProfile: {
          create: {
            employeeId: "EMP-001",
            department: "Management",
          },
        },
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // ─── DEMO CUSTOMER ────────────────────────────────────────────────────────
  const demoCustomerEmail = "customer@saubhagyasarees.com";
  const existingCustomer = await prisma.user.findUnique({ where: { email: demoCustomerEmail } });
  if (!existingCustomer) {
    const hashed = await bcrypt.hash("Customer@2026!", 12);
    const customer = await prisma.user.create({
      data: {
        email: demoCustomerEmail,
        name: "Ananya Deshmukh",
        password: hashed,
        role: "CUSTOMER",
        status: "ACTIVE",
        customerProfile: {
          create: {
            phone: "9876543210",
          },
        },
        addresses: {
          create: {
            fullName: "Ananya Deshmukh",
            phone: "9876543210",
            addressLine: "Flat 402, Royal Palms, Lane 7, Koregaon Park",
            city: "Pune",
            state: "Maharashtra",
            pinCode: "411001",
            type: "Home",
            isDefault: true,
          },
        },
      },
    });
    console.log(`✅ Demo customer created: ${demoCustomerEmail}`);
  } else {
    console.log(`ℹ️  Demo customer already exists: ${demoCustomerEmail}`);
  }

  // ─── CATEGORIES ───────────────────────────────────────────────────────────
  const categories = [
    { name: "Sarees", slug: "sarees", description: "Authentic handloom and designer sarees" },
    { name: "Lehengas", slug: "lehengas", description: "Bridal and festive lehengas" },
    { name: "Kurtis", slug: "kurtis", description: "Handcrafted kurtis and kurta sets" },
    { name: "Gowns", slug: "gowns", description: "Fusion and designer gowns" },
    { name: "Men's Wear", slug: "men", description: "Traditional men's ethnic wear" },
    { name: "Kids' Wear", slug: "kids", description: "Kids ethnic wear and sets" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: { ...cat, isActive: true },
      update: {},
    });
  }
  console.log("✅ Categories seeded");

  // ─── COLLECTIONS ──────────────────────────────────────────────────────────
  const collections = [
    { name: "Bridal Wear", slug: "bridal-wear", title: "Royal Bridal Collection", description: "Finest bridal silks for the most cherished occasion", isFeatured: true },
    { name: "Festive Picks", slug: "festive-picks", title: "Festive Picks", description: "Celebrate every occasion with radiant ethnic wear", isFeatured: true },
    { name: "Heritage Loom", slug: "heritage-loom", title: "Threads of Tradition", description: "Certified heritage looms and heirloom silks", isFeatured: true },
    { name: "Best Sellers", slug: "best-sellers", title: "Best Sellers", description: "Our most-loved creations by discerning patrons" },
    { name: "New Arrivals", slug: "new-arrivals", title: "New Arrivals", description: "Fresh additions to our atelier collection" },
    { name: "Wedding Collection", slug: "wedding-collection", title: "Wedding Collection", description: "Complete wedding trousseau for the Indian bride" },
  ];

  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      create: { ...col, isActive: true },
      update: {},
    });
  }
  console.log("✅ Collections seeded");

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────
  const sareeCategory = await prisma.category.findUnique({ where: { slug: "sarees" } });
  const kidsCategory = await prisma.category.findUnique({ where: { slug: "kids" } });

  const productsData = [
    {
      slug: "ruby-red-kanjivaram-silk-saree",
      title: "Ruby Red Kanjivaram Silk Saree",
      sku: "VAS-KANJ-101",
      description: "A crowning jewel in our heritage bridal collection. Handcrafted by master weavers in Kanchipuram using pure mulberry silk and authentic gold-dipped silver zari threads. Features traditional peacock and temple border motifs with an opulent brocade pallu.",
      priceInPaise: 1850000,
      originalPriceInPaise: 2200000,
      categoryId: sareeCategory?.id,
      status: "PUBLISHED" as ProductStatus,
      isFeatured: true,
      bestSeller: true,
      fabric: "Kanjivaram",
      weave: "Authentic Korvai Handloom Weave",
      origin: "Kanchipuram, Tamil Nadu",
      length: "5.5 metres plus blouse piece (0.8 metre)",
      blousePiece: "Contrast Ruby & Gold Brocade Silk Included",
      zariType: "Pure Silver Zari (Gold-dipped)",
      work: JSON.stringify(["Zari", "Handwork"]),
      colors: JSON.stringify(["Red", "Gold"]),
      occasions: JSON.stringify(["Wedding", "Festive", "Engagement"]),
      careInstructions: "Strictly Dry Clean Only. Store wrapped in pure muslin cloth.",
      artisanNotes: "Woven over 28 days by master weaver Shri Ramanathan in Kanchipuram.",
      weight: "880 grams",
      rating: 4.9,
      reviewCount: 38,
      publishedAt: new Date(),
      images: [
        { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80", isMain: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 },
        { url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80", sortOrder: 2 },
      ],
      stockQuantity: 12,
      collectionSlugs: ["bridal-wear", "best-sellers"],
    },
    {
      slug: "royal-blue-banarasi-brocade-saree",
      title: "Royal Blue Banarasi Katan Silk Saree",
      sku: "VAS-BAN-202",
      description: "A majestic Banarasi Katan silk saree woven with intricate Kadwa floral jaal in antique gold zari. The deep royal blue base radiates timeless nobility for grand evening receptions and royal celebrations.",
      priceInPaise: 2400000,
      originalPriceInPaise: 2850000,
      categoryId: sareeCategory?.id,
      status: "PUBLISHED" as ProductStatus,
      isFeatured: true,
      fabric: "Banarasi",
      weave: "Traditional Kadwa Banarasi Handloom",
      origin: "Varanasi, Uttar Pradesh",
      length: "5.5 metres plus blouse piece",
      blousePiece: "Unstitched Royal Blue silk with gold border",
      work: JSON.stringify(["Zari"]),
      colors: JSON.stringify(["Blue", "Gold"]),
      occasions: JSON.stringify(["Wedding", "Party", "Festive"]),
      careInstructions: "Dry clean only",
      artisanNotes: "Woven in Varanasi by multigenerational family guild.",
      weight: "820 grams",
      rating: 4.8,
      reviewCount: 24,
      publishedAt: new Date(),
      images: [
        { url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80", isMain: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 },
      ],
      stockQuantity: 8,
      collectionSlugs: ["heritage-loom"],
    },
    {
      slug: "champagne-gold-tissue-silk-saree",
      title: "Champagne Gold Tissue Silk Saree",
      sku: "VAS-TIS-401",
      description: "Glimmering metallic gold tissue warp intermeshed with pure mulberry silk weft. Light, airy, yet luxuriously resplendent under evening chandeliers.",
      priceInPaise: 1950000,
      categoryId: sareeCategory?.id,
      status: "PUBLISHED" as ProductStatus,
      isNewArrival: true,
      fabric: "Pure Silk",
      work: JSON.stringify(["Zari", "Handwork"]),
      colors: JSON.stringify(["Gold"]),
      occasions: JSON.stringify(["Party", "Engagement", "Wedding"]),
      careInstructions: "Dry clean only",
      weight: "620 grams",
      rating: 4.7,
      reviewCount: 18,
      publishedAt: new Date(),
      images: [
        { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80", isMain: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 },
      ],
      stockQuantity: 5,
      collectionSlugs: ["new-arrivals", "festive-picks"],
    },
    {
      slug: "peacock-blue-kanjivaram-bridal-saree",
      title: "Peacock Blue Kanjivaram Bridal Silk Saree",
      sku: "VAS-KANJ-102",
      description: "A grand double-warp Kanchipuram silk saree with contrasting crimson and gold mayil (peacock) motifs and a regal brocade pallu.",
      priceInPaise: 2890000,
      categoryId: sareeCategory?.id,
      status: "PUBLISHED" as ProductStatus,
      isFeatured: true,
      fabric: "Kanjivaram",
      weave: "Traditional Korvai Interlock Weave",
      origin: "Kanchipuram, Tamil Nadu",
      length: "5.5 metres plus blouse piece",
      blousePiece: "Contrast crimson silk blouse with heavy sleeve zari",
      work: JSON.stringify(["Zari", "Handwork"]),
      colors: JSON.stringify(["Blue", "Gold"]),
      occasions: JSON.stringify(["Wedding", "Engagement"]),
      careInstructions: "Strictly dry clean",
      artisanNotes: "Certified with Silk Mark and GI Tag.",
      weight: "920 grams",
      rating: 5.0,
      reviewCount: 15,
      publishedAt: new Date(),
      images: [
        { url: "https://images.unsplash.com/photo-1610030469668-935cb8a6a2aa?auto=format&fit=crop&w=1000&q=80", isMain: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 },
      ],
      stockQuantity: 3,
      collectionSlugs: ["bridal-wear", "best-sellers"],
    },
    {
      slug: "powder-blue-hand-painted-silk-saree",
      title: "Powder Blue Hand-Painted Pure Silk Saree",
      sku: "VAS-SLK-505",
      description: "Serene powder blue pure Bangalore silk saree individually painted by hand with lotus flora and silver liquid foil outlines.",
      priceInPaise: 1580000,
      originalPriceInPaise: 1850000,
      categoryId: sareeCategory?.id,
      status: "PUBLISHED" as ProductStatus,
      isSale: true,
      fabric: "Pure Silk",
      work: JSON.stringify(["Handwork", "Print"]),
      colors: JSON.stringify(["Blue", "Gold"]),
      occasions: JSON.stringify(["Party", "Engagement", "Casual"]),
      careInstructions: "Dry clean only",
      artisanNotes: "Each piece is an original one-of-a-kind art piece.",
      weight: "580 grams",
      rating: 4.8,
      reviewCount: 21,
      publishedAt: new Date(),
      images: [
        { url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80", isMain: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80", sortOrder: 1 },
      ],
      stockQuantity: 7,
      collectionSlugs: ["festive-picks"],
    },
  ];

  for (const { images, stockQuantity, collectionSlugs, ...productData } of productsData) {
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images,
          },
          inventory: {
            create: {
              quantity: stockQuantity,
              lowStockThreshold: 3,
            },
          },
        },
      });

      // Link to collections
      for (const colSlug of collectionSlugs) {
        const collection = await prisma.collection.findUnique({ where: { slug: colSlug } });
        if (collection) {
          await prisma.collectionProduct.upsert({
            where: { collectionId_productId: { collectionId: collection.id, productId: product.id } },
            create: { collectionId: collection.id, productId: product.id },
            update: {},
          });
        }
      }
    }
  }
  console.log("✅ Products seeded");

  // ─── DEMO COUPONS ─────────────────────────────────────────────────────────
  const coupons = [
    {
      code: "WELCOME10",
      type: "PERCENTAGE" as const,
      discountValue: 10,
      maxDiscountPaise: 200000, // ₹2000 max
      minCartPaise: 500000, // ₹5000 min
      perUserLimit: 1,
      firstOrderOnly: true,
      description: "10% off your first order (up to ₹2000)",
    },
    {
      code: "FESTIVE500",
      type: "FIXED" as const,
      discountValue: 500,
      minCartPaise: 1000000, // ₹10,000 min
      description: "Flat ₹500 off on orders above ₹10,000",
    },
    {
      code: "SAUBHAGYA",
      type: "PERCENTAGE" as const,
      discountValue: 15,
      maxDiscountPaise: 500000, // ₹5000 max
      minCartPaise: 1500000, // ₹15,000 min
      description: "15% off on premium collection (up to ₹5000)",
    },
    {
      code: "FREESHIP",
      type: "FREE_SHIPPING" as const,
      discountValue: 0,
      minCartPaise: 300000, // ₹3000 min
      description: "Free standard shipping on your order",
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      create: { ...coupon, isActive: true },
      update: {},
    });
  }
  console.log("✅ Demo coupons seeded");

  // ─── CMS SECTIONS ─────────────────────────────────────────────────────────
  const cmsSections = [
    {
      key: "announcement-bar",
      title: "Free Insured Worldwide Shipping on Orders Above ₹10,000 | Silk Mark Certified Sarees | WhatsApp: +91 98200 12345",
    },
    {
      key: "hero",
      title: "The Heritage of Every Happy Occasion",
      subtitle: "Handcrafted silks and heirloom weaves, curated for life's most cherished celebrations.",
      content: JSON.stringify({
        primaryCta: "Explore Bridal Collection",
        primaryCtaLink: "/collections/bridal-wear",
        secondaryCta: "Heritage Looms",
        secondaryCtaLink: "/collections/heritage-loom",
      }),
    },
    {
      key: "grace-in-bloom",
      title: "Grace in Bloom",
      subtitle: "Botanical Whispers & Sheer Drapes",
      content: JSON.stringify({ viewAllHref: "/collections/sarees?fabrics=Organza" }),
    },
    {
      key: "in-the-spotlight",
      title: "In the Spotlight",
      subtitle: "Celebrated Masterpieces & Most Coveted",
      content: JSON.stringify({ viewAllHref: "/collections/best-sellers" }),
    },
    {
      key: "threads-of-tradition",
      title: "Threads of Tradition",
      subtitle: "Certified Heritage Looms & Heirloom Silks",
      content: JSON.stringify({ viewAllHref: "/collections/heritage-loom" }),
    },
  ];

  for (const section of cmsSections) {
    await prisma.cMSSection.upsert({
      where: { key: section.key },
      create: { ...section, isActive: true },
      update: {},
    });
  }
  console.log("✅ CMS sections seeded");

  // ─── STORE SETTINGS ────────────────────────────────────────────────────────
  const storeSettings = [
    { key: "store_name", value: "Saubhagya Sarees Atelier" },
    { key: "store_email", value: "concierge@saubhagyasarees.com" },
    { key: "store_phone", value: "+91 98200 12345" },
    { key: "currency", value: "INR" },
    { key: "gst_rate", value: "18" },
    { key: "gst_inclusive", value: "true" },
    { key: "free_shipping_threshold_paise", value: "1000000" },
    { key: "express_shipping_paise", value: "50000" },
    { key: "standard_shipping_paise", value: "10000" },
    { key: "return_window_days", value: "7" },
    { key: "payment_gateway", value: "demo" }, // Change to 'razorpay' in production
  ];

  for (const setting of storeSettings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      create: setting,
      update: { value: setting.value },
    });
  }
  console.log("✅ Store settings seeded");

  console.log("\n🎉 Database seeding complete!\n");
  console.log("   Admin Login: /admin/login");
  console.log(`   Email: ${adminEmail}`);
  console.log("   Password: (value of SEED_ADMIN_PASSWORD)\n");
  console.log("   Demo Customer Login: /account/login");
  console.log("   Email: customer@saubhagyasarees.com");
  console.log("   Password: Customer@2026!\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

