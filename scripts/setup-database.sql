-- This is a reference for the Firestore collections structure
-- Firestore is a NoSQL database, so this is just for documentation

-- Collections Structure:

-- users
-- {
--   uid: string,
--   email: string,
--   displayName: string,
--   photoURL: string,
--   isAdmin: boolean,
--   createdAt: timestamp
-- }

-- categories
-- {
--   id: string,
--   name: string,
--   description: string,
--   image: string,
--   productCount: number,
--   createdAt: timestamp,
--   updatedAt: timestamp
-- }

-- products
-- {
--   id: string,
--   name: string,
--   description: string,
--   price: number,
--   image: string,
--   images: array,
--   category: string,
--   categoryId: string,
--   inStock: boolean,
--   stockQuantity: number,
--   featured: boolean,
--   tags: array,
--   createdAt: timestamp,
--   updatedAt: timestamp
-- }

-- orders
-- {
--   id: string,
--   userId: string,
--   items: array,
--   total: number,
--   shippingInfo: object,
--   status: string, -- pending, processing, shipped, delivered, cancelled
--   paymentStatus: string, -- pending, paid, failed, refunded
--   paymentReference: string,
--   createdAt: timestamp,
--   updatedAt: timestamp
-- }

-- carts
-- {
--   userId: string,
--   items: array,
--   updatedAt: timestamp
-- }
