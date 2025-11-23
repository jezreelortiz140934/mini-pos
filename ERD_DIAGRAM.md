# SHEARFLOW POS SYSTEM
## Entity Relationship Diagram (ERD)

---

## DATABASE SCHEMA VISUALIZATION

### Visual ERD Representation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SHEARFLOW POS DATABASE SCHEMA                           │
└─────────────────────────────────────────────────────────────────────────────────┘


╔═══════════════════════════╗
║       STYLISTS            ║
╠═══════════════════════════╣
║ PK id (UUID)              ║
║    name (TEXT)            ║
║    contact_number (TEXT)  ║
║    created_at (TIMESTAMP) ║
╚═══════════════════════════╝
          │
          │ 1
          │
          │ Referenced by
          │
          │ N
          ▼
╔═══════════════════════════════════╗
║    WALK_IN_APPOINTMENTS           ║
╠═══════════════════════════════════╣
║ PK id (UUID)                      ║
║    customer_name (TEXT)           ║
║    contact (TEXT)                 ║
║    service (TEXT)                 ║
║ FK stylist_id (UUID) → stylists   ║
║    appointment_time (TIME)        ║
║    created_at (TIMESTAMP)         ║
╚═══════════════════════════════════╝


╔═══════════════════════════╗
║       PRODUCTS            ║
╠═══════════════════════════╣
║ PK id (UUID)              ║
║    name (TEXT)            ║
║    price (DECIMAL)        ║
║    stock (INTEGER)        ║
║    created_at (TIMESTAMP) ║
╚═══════════════════════════╝
          │
          │ Referenced in
          │ (via JSONB)
          │
          ▼
╔═══════════════════════════╗        ╔═══════════════════════════╗
║       SERVICES            ║        ║        ORDERS             ║
╠═══════════════════════════╣        ╠═══════════════════════════╣
║ PK id (UUID)              ║        ║ PK id (UUID)              ║
║    title (TEXT)           ║───────▶║    customer_name (TEXT)   ║
║    description (TEXT)     ║        ║    items (JSONB)          ║
║    price (DECIMAL)        ║        ║    subtotal (DECIMAL)     ║
║    image_url (TEXT)       ║        ║    tax (DECIMAL)          ║
║    created_at (TIMESTAMP) ║        ║    total (DECIMAL)        ║
╚═══════════════════════════╝        ║    status (TEXT)          ║
                                     ║    created_at (TIMESTAMP) ║
                                     ╚═══════════════════════════╝


╔═══════════════════════════════╗
║           SALES               ║
╠═══════════════════════════════╣
║ PK id (UUID)                  ║
║    customer_name (TEXT)       ║
║    service (TEXT)             ║
║    price (DECIMAL)            ║
║    transaction_date (TIME)    ║
║    created_at (TIMESTAMP)     ║
╚═══════════════════════════════╝


┌─────────────────────────────────────────────────────────────────┐
│  LEGEND                                                         │
├─────────────────────────────────────────────────────────────────┤
│  PK = Primary Key                                               │
│  FK = Foreign Key                                               │
│  → = References / Foreign Key Relationship                      │
│  1 = One (Cardinality)                                          │
│  N = Many (Cardinality)                                         │
│  ═══ = Table Border                                             │
│  JSONB = JSON Binary field containing references                │
└─────────────────────────────────────────────────────────────────┘
```

---

## DETAILED TABLE SPECIFICATIONS

### 1. STYLISTS Table

**Purpose:** Stores information about salon staff members who provide services.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each stylist |
| name | TEXT | NOT NULL | Full name of the stylist |
| contact_number | TEXT | NOT NULL | Phone number for contact |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Relationships:**
- One-to-Many with `walk_in_appointments` (One stylist can have many appointments)

**Indexes:**
- Primary key index on `id`

**Sample Data:**
```sql
INSERT INTO stylists (name, contact_number) VALUES
  ('Maria Santos', '0917-123-4567'),
  ('Juan Dela Cruz', '0928-234-5678'),
  ('Ana Reyes', '0939-345-6789');
```

---

### 2. PRODUCTS Table

**Purpose:** Maintains inventory of physical products sold in the salon.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each product |
| name | TEXT | NOT NULL | Product name/title |
| price | DECIMAL(10,2) | NOT NULL | Selling price per unit |
| stock | INTEGER | NOT NULL, DEFAULT 0 | Available quantity in inventory |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Relationships:**
- Referenced in `orders.items` (JSONB array)

**Indexes:**
- Primary key index on `id`
- Recommended: Index on `name` for search performance

**Business Rules:**
- Stock cannot be negative
- Price must be greater than 0
- Name must be unique (recommended constraint)

**Sample Data:**
```sql
INSERT INTO products (name, price, stock) VALUES
  ('Shampoo Professional', 450.00, 25),
  ('Hair Conditioner', 380.00, 30),
  ('Hair Serum', 650.00, 15),
  ('Hair Gel', 220.00, 40);
```

---

### 3. SERVICES Table

**Purpose:** Catalog of services offered by the salon with descriptions and pricing.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each service |
| title | TEXT | NOT NULL | Service name/title |
| description | TEXT | NULL (Optional) | Detailed service description |
| price | DECIMAL(10,2) | NOT NULL | Service price |
| image_url | TEXT | NULL (Optional) | URL to service image |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Relationships:**
- Referenced in `orders.items` (JSONB array)
- Referenced in `walk_in_appointments.service` (text reference)

**Indexes:**
- Primary key index on `id`

**Business Rules:**
- Price must be greater than 0
- Image URL should be valid HTTP/HTTPS URL
- Title should be unique (recommended constraint)

**Sample Data:**
```sql
INSERT INTO services (title, description, price, image_url) VALUES
  ('Haircut and Styling', 'Professional haircut with styling', 500.00, 
   'https://images.unsplash.com/photo-1560066984-138dadb4c035'),
  ('Color and Highlights', 'Hair coloring and highlights service', 1200.00,
   'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e'),
  ('Hair Spa', 'Relaxing hair spa treatment', 1500.00,
   'https://images.unsplash.com/photo-1580618672591-eb180b1a973f');
```

---

### 4. WALK_IN_APPOINTMENTS Table

**Purpose:** Manages walk-in customer appointments and stylist assignments.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each appointment |
| customer_name | TEXT | NOT NULL | Customer's full name |
| contact | TEXT | NOT NULL | Customer's contact number |
| service | TEXT | NOT NULL | Requested service name |
| stylist_id | UUID | FOREIGN KEY (stylists.id) | Assigned stylist reference |
| appointment_time | TIME | NOT NULL | Scheduled appointment time |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Booking timestamp |

**Relationships:**
- Many-to-One with `stylists` (Many appointments can be assigned to one stylist)

**Indexes:**
- Primary key index on `id`
- Foreign key index on `stylist_id`
- Recommended: Composite index on `appointment_time` and `stylist_id`

**Business Rules:**
- Appointment time must be within business hours
- No double booking (same stylist, same time)
- Customer contact must be valid

**Sample Data:**
```sql
INSERT INTO walk_in_appointments 
  (customer_name, contact, service, stylist_id, appointment_time) 
VALUES
  ('Pedro Garcia', '0917-111-2222', 'Haircut', 
   '123e4567-e89b-12d3-a456-426614174000', '14:00:00'),
  ('Sofia Martinez', '0928-333-4444', 'Hair Color',
   '123e4567-e89b-12d3-a456-426614174001', '15:30:00');
```

---

### 5. SALES Table

**Purpose:** Stores summary records of all completed transactions for reporting and analytics.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each sale |
| customer_name | TEXT | NOT NULL | Customer's name |
| service | TEXT | NOT NULL | Summary of services/products purchased |
| price | DECIMAL(10,2) | NOT NULL | Total transaction amount |
| transaction_date | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Date and time of transaction |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Relationships:**
- No direct foreign key relationships (summary table)
- Logically related to `orders` table (same transaction data)

**Indexes:**
- Primary key index on `id`
- Recommended: Index on `transaction_date` for date-range queries
- Recommended: Index on `customer_name` for customer history

**Business Rules:**
- Price must be greater than 0
- Transaction date cannot be in the future
- Service field contains comma-separated list of items

**Sample Data:**
```sql
INSERT INTO sales (customer_name, service, price, transaction_date) VALUES
  ('John Doe', 'Haircut, Shampoo', 950.00, '2025-11-23 14:30:00'),
  ('Jane Smith', 'Hair Color, Conditioning', 2000.00, '2025-11-23 15:15:00');
```

**Usage in Application:**
- Daily sales reports
- Revenue analytics
- Transaction history
- Customer purchase patterns

---

### 6. ORDERS Table

**Purpose:** Stores detailed order information including all line items for complete transaction records.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each order |
| customer_name | TEXT | NULL (Optional) | Customer's name |
| items | JSONB | NOT NULL | Array of order items with details |
| subtotal | DECIMAL(10,2) | NOT NULL | Total before tax |
| tax | DECIMAL(10,2) | NOT NULL | Tax amount |
| total | DECIMAL(10,2) | NOT NULL | Final amount (subtotal + tax) |
| status | TEXT | DEFAULT 'pending' | Order status (pending/completed/cancelled) |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Order creation timestamp |

**Relationships:**
- No direct foreign keys (uses JSONB for flexibility)
- `items` field contains references to products and services

**Indexes:**
- Primary key index on `id`
- Recommended: GIN index on `items` for JSONB queries
- Recommended: Index on `status` for filtering
- Recommended: Index on `created_at` for date queries

**Business Rules:**
- Items array must not be empty
- Total must equal subtotal + tax
- Status must be one of: 'pending', 'completed', 'cancelled'

**JSONB Structure for items:**
```json
[
  {
    "id": "product-uuid",
    "name": "Shampoo Professional",
    "price": 450.00,
    "qty": 2,
    "type": "product"
  },
  {
    "id": "service-uuid",
    "name": "Haircut and Styling",
    "price": 500.00,
    "qty": 1,
    "type": "service"
  }
]
```

**Sample Data:**
```sql
INSERT INTO orders (customer_name, items, subtotal, tax, total, status) VALUES
  ('Alice Brown', 
   '[{"name":"Haircut","price":500,"qty":1,"type":"service"},
     {"name":"Shampoo","price":450,"qty":1,"type":"product"}]'::jsonb,
   950.00, 0.00, 950.00, 'completed');
```

**Usage in Application:**
- Complete order history
- Item-level analytics
- Inventory deduction
- Customer purchase history
- Refund processing

---

## RELATIONSHIPS & CARDINALITY

### Primary Relationships

#### 1. Stylists ↔ Walk-in Appointments
- **Type:** One-to-Many
- **Cardinality:** 1:N
- **Description:** One stylist can be assigned to many appointments, but each appointment has only one stylist
- **Foreign Key:** `walk_in_appointments.stylist_id` → `stylists.id`
- **Referential Integrity:** ON DELETE SET NULL (appointments remain if stylist deleted)
- **Business Logic:** Prevents orphaned appointments while maintaining historical data

```sql
-- Relationship Definition
ALTER TABLE walk_in_appointments
  ADD CONSTRAINT fk_stylist
  FOREIGN KEY (stylist_id) 
  REFERENCES stylists(id)
  ON DELETE SET NULL;
```

#### 2. Products ↔ Orders (Indirect via JSONB)
- **Type:** Many-to-Many (Indirect)
- **Cardinality:** M:N
- **Description:** Products can appear in many orders, and orders can contain many products
- **Implementation:** JSONB array in `orders.items` field
- **Referential Integrity:** Not enforced (allows historical data preservation)
- **Business Logic:** Products remain in order history even if deleted from catalog

#### 3. Services ↔ Orders (Indirect via JSONB)
- **Type:** Many-to-Many (Indirect)
- **Cardinality:** M:N
- **Description:** Services can appear in many orders, and orders can contain many services
- **Implementation:** JSONB array in `orders.items` field
- **Referential Integrity:** Not enforced (allows historical data preservation)
- **Business Logic:** Services remain in order history even if deleted from catalog

#### 4. Sales ↔ Orders (Logical Relationship)
- **Type:** One-to-One (Conceptual)
- **Cardinality:** 1:1
- **Description:** Each checkout creates one sales record and one orders record
- **Implementation:** No foreign key (separate tables for different purposes)
- **Sales Table:** Summary for quick reporting
- **Orders Table:** Detailed breakdown for analysis

---

## DATA FLOW DIAGRAM

### Checkout Process Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                       CHECKOUT TRANSACTION FLOW                       │
└──────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   USER      │
    │  INTERFACE  │
    └──────┬──────┘
           │
           │ 1. Add Products/Services to Cart
           │
           ▼
    ┌──────────────┐
    │  CART STATE  │ (React Component State)
    │  items: []   │
    │  total: 0    │
    └──────┬───────┘
           │
           │ 2. Click Checkout
           │
           ▼
    ┌──────────────────┐
    │  PROMPT DIALOG   │
    │ Enter Customer   │
    │      Name        │
    └──────┬───────────┘
           │
           │ 3. Submit Name
           │
           ▼
    ┌──────────────────────────────────────────┐
    │      CHECKOUT FUNCTION                   │
    │  processCheckout(customerName)           │
    └──────┬───────────────────┬───────────────┘
           │                   │
           │ 4a. Insert        │ 4b. Insert
           │     Summary       │      Details
           │                   │
           ▼                   ▼
    ┏━━━━━━━━━━━━━┓    ┏━━━━━━━━━━━━━┓
    ┃    SALES    ┃    ┃   ORDERS    ┃
    ┃    TABLE    ┃    ┃    TABLE    ┃
    ┃             ┃    ┃             ┃
    ┃ + customer  ┃    ┃ + customer  ┃
    ┃ + service   ┃    ┃ + items[]   ┃
    ┃ + price     ┃    ┃ + subtotal  ┃
    ┃ + date      ┃    ┃ + tax       ┃
    ┃             ┃    ┃ + total     ┃
    ┃             ┃    ┃ + status    ┃
    ┗━━━━━━━━━━━━━┛    ┗━━━━━━━━━━━━━┛
           │                   │
           └────────┬──────────┘
                    │
                    │ 5. Both Inserts Successful
                    │
                    ▼
            ┌───────────────┐
            │   SUCCESS     │
            │ Clear Cart    │
            │ Show Toast    │
            └───────────────┘
```

---

## DATABASE QUERIES REFERENCE

### Common Query Patterns

#### 1. Retrieve All Products with Stock
```sql
SELECT id, name, price, stock 
FROM products 
WHERE stock > 0
ORDER BY name;
```

#### 2. Get Today's Sales Total
```sql
SELECT 
  COUNT(*) as transaction_count,
  SUM(price) as total_revenue,
  AVG(price) as average_transaction
FROM sales
WHERE DATE(transaction_date) = CURRENT_DATE;
```

#### 3. Find Stylist's Appointments
```sql
SELECT 
  a.customer_name,
  a.contact,
  a.service,
  a.appointment_time,
  s.name as stylist_name
FROM walk_in_appointments a
JOIN stylists s ON a.stylist_id = s.id
WHERE s.id = :stylist_id
ORDER BY a.appointment_time;
```

#### 4. Get Order Details with Items
```sql
SELECT 
  id,
  customer_name,
  items,
  subtotal,
  tax,
  total,
  status,
  created_at
FROM orders
WHERE status = 'completed'
ORDER BY created_at DESC;
```

#### 5. Search Products by Name
```sql
SELECT id, name, price, stock
FROM products
WHERE LOWER(name) LIKE LOWER(:search_term)
ORDER BY name;
```

#### 6. Get Sales by Date Range
```sql
SELECT 
  customer_name,
  service,
  price,
  transaction_date
FROM sales
WHERE transaction_date BETWEEN :start_date AND :end_date
ORDER BY transaction_date DESC;
```

#### 7. Calculate Product Revenue
```sql
SELECT 
  item->>'name' as product_name,
  SUM((item->>'qty')::int) as total_quantity,
  SUM((item->>'price')::numeric * (item->>'qty')::int) as total_revenue
FROM orders,
  jsonb_array_elements(items) as item
WHERE item->>'type' = 'product'
  AND status = 'completed'
GROUP BY item->>'name'
ORDER BY total_revenue DESC;
```

#### 8. Find Low Stock Products
```sql
SELECT name, stock, price
FROM products
WHERE stock < 10
ORDER BY stock ASC;
```

---

## INDEXING STRATEGY

### Current Indexes (Automatic)
- Primary Key indexes on all `id` columns
- Foreign Key index on `walk_in_appointments.stylist_id`

### Recommended Additional Indexes

```sql
-- Product Search Performance
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_stock ON products(stock) WHERE stock > 0;

-- Sales Reporting Performance
CREATE INDEX idx_sales_date ON sales(transaction_date);
CREATE INDEX idx_sales_customer ON sales(customer_name);

-- Orders Performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_items ON orders USING GIN (items);

-- Appointments Performance
CREATE INDEX idx_appointments_time ON walk_in_appointments(appointment_time);
CREATE INDEX idx_appointments_stylist_time 
  ON walk_in_appointments(stylist_id, appointment_time);

-- Services Search
CREATE INDEX idx_services_title ON services(title);
```

---

## DATA INTEGRITY RULES

### 1. Referential Integrity
- `walk_in_appointments.stylist_id` must exist in `stylists.id` or be NULL
- Enforced by PostgreSQL foreign key constraint

### 2. Domain Integrity
- All `price` fields must be positive DECIMAL(10,2)
- All `stock` values must be non-negative integers
- `status` in orders must be valid enum value
- Timestamps must be valid timezone-aware dates

### 3. Entity Integrity
- All tables have UUID primary keys
- Primary keys are auto-generated and immutable
- No NULL values allowed in primary keys

### 4. Business Rules
- Products cannot have negative stock
- Appointment times cannot be in the past
- Order totals must match subtotal + tax
- Orders must have at least one item

### 5. Data Validation (Application Level)
```javascript
// Price validation
if (price <= 0) {
  throw new Error('Price must be greater than 0');
}

// Stock validation
if (stock < 0) {
  throw new Error('Stock cannot be negative');
}

// Order items validation
if (!items || items.length === 0) {
  throw new Error('Order must contain at least one item');
}
```

---

## ROW LEVEL SECURITY (RLS)

### Current Security Policies

All tables have RLS enabled with permissive policies for testing:

```sql
-- Enable RLS
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE walk_in_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public Access Policies (Current - Testing Only)
CREATE POLICY "public_read" ON [table] FOR SELECT USING (true);
CREATE POLICY "public_insert" ON [table] FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON [table] FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON [table] FOR DELETE USING (true);
```

### Recommended Production Policies

```sql
-- Admin-only write access
CREATE POLICY "admin_write" ON products 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Public read for active products
CREATE POLICY "public_read_active" ON products 
  FOR SELECT USING (stock > 0);

-- User can only view their own orders
CREATE POLICY "user_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Stylists can view their appointments
CREATE POLICY "stylist_appointments" ON walk_in_appointments
  FOR SELECT USING (stylist_id = auth.uid());
```

---

## BACKUP & RECOVERY STRATEGY

### Supabase Automatic Backups
- **Daily Backups:** Automatic daily backups retained for 7 days (Free Tier)
- **Point-in-Time Recovery:** Available on Pro tier
- **Geographic Redundancy:** Multi-region backup storage

### Manual Backup Commands

```bash
# Export entire database
pg_dump -h db.xxx.supabase.co -U postgres -F c -b -v -f backup.dump

# Export specific table
pg_dump -h db.xxx.supabase.co -U postgres -t products -F c -f products_backup.dump

# Restore from backup
pg_restore -h db.xxx.supabase.co -U postgres -d postgres -v backup.dump
```

### Export to CSV (Alternative)

```sql
-- Export sales data
COPY (SELECT * FROM sales WHERE transaction_date >= '2025-01-01') 
TO '/path/to/sales_export.csv' CSV HEADER;

-- Export orders with JSONB
COPY (
  SELECT 
    id, 
    customer_name, 
    items::text, 
    total, 
    status, 
    created_at 
  FROM orders
) TO '/path/to/orders_export.csv' CSV HEADER;
```

---

## PERFORMANCE OPTIMIZATION

### Query Optimization Tips

1. **Use Indexes Effectively**
   - Create indexes on frequently queried columns
   - Use composite indexes for multi-column queries
   - Monitor query performance with EXPLAIN ANALYZE

2. **Optimize JSONB Queries**
   - Use GIN indexes for JSONB columns
   - Extract frequently accessed JSON fields to regular columns
   - Use `->` for JSON extraction vs `->>` for text

3. **Limit Result Sets**
   - Always use LIMIT for large tables
   - Implement pagination for user interfaces
   - Use date ranges to limit search scope

4. **Connection Pooling**
   - Supabase handles connection pooling automatically
   - Reuse Supabase client instance
   - Avoid creating new clients per request

### Monitoring Queries

```sql
-- Check slow queries (if enabled)
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::text))
FROM pg_tables
WHERE schemaname = 'public';
```

---

## MIGRATION STRATEGY

### Adding New Columns (Safe)

```sql
-- Add optional column
ALTER TABLE products 
ADD COLUMN category TEXT;

-- Add column with default
ALTER TABLE products 
ADD COLUMN is_active BOOLEAN DEFAULT true;
```

### Adding New Tables

```sql
-- Create new table with foreign key
CREATE TABLE product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to existing table
ALTER TABLE products
ADD COLUMN category_id UUID REFERENCES product_categories(id);
```

### Data Migration Pattern

```sql
-- Step 1: Add new column
ALTER TABLE orders ADD COLUMN customer_id UUID;

-- Step 2: Migrate existing data
UPDATE orders 
SET customer_id = (SELECT id FROM customers WHERE name = orders.customer_name);

-- Step 3: After verification, make non-null
ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;
```

---

## ADVANCED FEATURES

### 1. Full-Text Search

```sql
-- Add text search column
ALTER TABLE products 
ADD COLUMN search_vector tsvector;

-- Create trigger for auto-update
CREATE TRIGGER products_search_update
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', name);

-- Search query
SELECT * FROM products
WHERE search_vector @@ to_tsquery('shampoo | conditioner');
```

### 2. Calculated Columns

```sql
-- Add generated column for total revenue
ALTER TABLE orders
ADD COLUMN tax_amount DECIMAL(10,2) GENERATED ALWAYS AS (subtotal * 0.12) STORED;
```

### 3. Triggers for Business Logic

```sql
-- Automatically update product stock on order
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease stock for each product in order
  UPDATE products
  SET stock = stock - (item->>'qty')::int
  FROM jsonb_array_elements(NEW.items) AS item
  WHERE products.id = (item->>'id')::uuid
    AND item->>'type' = 'product';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_stock_update
AFTER INSERT ON orders
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_product_stock();
```

---

## CONCLUSION

This ERD and database documentation provides a comprehensive overview of the ShearFlow POS System's data architecture. The schema is designed for:

✅ **Scalability** - UUID keys and JSONB flexibility  
✅ **Performance** - Proper indexing and query optimization  
✅ **Integrity** - Foreign keys and business rules  
✅ **Security** - RLS policies and access control  
✅ **Maintainability** - Clear structure and documentation  

The database successfully supports all application features while maintaining data consistency and providing excellent query performance.

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2025  
**Database Version:** PostgreSQL 14.x (Supabase)  
**Schema Version:** 1.0  

---

END OF ERD DOCUMENTATION
