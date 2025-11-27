# Database Migrations

This folder contains SQL migration scripts to improve the ShearFlow database schema.

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open each migration file in order (001, 002, 003, 004)
4. Copy and paste the SQL content
5. Click **Run** to execute

### Option 2: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db reset
# Or apply individual migrations
psql -h your-host -U postgres -d your-db -f 001_improve_products_table.sql
```

## Migrations Overview

### 001_improve_products_table.sql
**Adds to `products` table:**
- `category` - Product categorization (shampoo, conditioner, styling, treatment, tools)
- `image_url` - Product image URL
- `is_active` - Active status flag
- `supplier` - Supplier/brand name
- `sku` - Stock Keeping Unit
- `description` - Detailed product description
- Indexes for performance
- Check constraint for positive stock

### 002_improve_services_table.sql
**Adds to `services` table:**
- `duration` - Service duration in minutes
- `category` - Service categorization (haircut, coloring, treatment, styling, spa)
- `is_active` - Active status flag
- `image_url` - Service image URL
- Indexes for performance
- Check constraint for positive duration

### 003_improve_orders_table.sql
**Adds to `orders` table:**
- `payment_method` - Payment type (cash, card, gcash, paymaya, bank_transfer)
- `payment_status` - Status (pending, completed, failed, refunded)
- `discount` - Discount amount
- `notes` - Order notes
- `user_id` - Reference to user who created the order

**Creates new `order_items` table:**
Normalized structure to replace JSON items column:
- `id` - Primary key
- `order_id` - Foreign key to orders
- `item_type` - Type (product, service, walkin)
- `item_id` - ID of the item
- `item_name` - Name of the item
- `quantity` - Quantity ordered
- `unit_price` - Price per unit
- `total_price` - Total for this line item
- Automatic migration of existing JSON data

### 004_improve_sales_table.sql
**Adds to `sales` table:**
- `order_id` - Reference to orders table
- `payment_method` - Payment type
- `user_id` - User who processed the sale
- `stylist_id` - Stylist who provided the service
- `notes` - Additional notes

**Creates helpful views:**
- `daily_sales_summary` - Aggregated daily sales with totals
- `sales_by_service` - Revenue breakdown by service
- `sales_by_stylist` - Performance metrics by stylist

## After Migration

### Update Your Code

After applying migrations, update your components to use the new fields:

#### Products Component
```javascript
// Add category dropdown
<select name="category">
  <option value="shampoo">Shampoo</option>
  <option value="conditioner">Conditioner</option>
  <option value="styling">Styling</option>
  <option value="treatment">Treatment</option>
  <option value="tools">Tools</option>
</select>

// Add image upload
<input type="file" name="image" />

// Add supplier field
<input type="text" name="supplier" placeholder="Supplier" />
```

#### Services Component
```javascript
// Add duration field
<input type="number" name="duration" placeholder="Duration (minutes)" />

// Add category dropdown
<select name="category">
  <option value="haircut">Haircut</option>
  <option value="coloring">Coloring</option>
  <option value="treatment">Treatment</option>
  <option value="styling">Styling</option>
  <option value="spa">Spa</option>
</select>
```

#### Checkout Process
```javascript
// Add payment method selection
<select name="payment_method">
  <option value="cash">Cash</option>
  <option value="card">Card</option>
  <option value="gcash">GCash</option>
  <option value="paymaya">PayMaya</option>
  <option value="bank_transfer">Bank Transfer</option>
</select>

// Add discount field
<input type="number" name="discount" placeholder="Discount" />

// Add notes field
<textarea name="notes" placeholder="Order notes"></textarea>
```

## Benefits

✅ **Better Data Organization** - Normalized structure reduces redundancy
✅ **Improved Queries** - Indexes speed up common operations
✅ **Data Integrity** - Foreign keys and constraints prevent invalid data
✅ **Business Intelligence** - Views provide quick insights
✅ **Scalability** - Proper structure supports growth
✅ **Payment Tracking** - Multiple payment methods supported
✅ **Inventory Management** - Better product categorization and tracking

## Rollback

If you need to rollback, you can:
1. Drop the new columns: `ALTER TABLE table_name DROP COLUMN column_name;`
2. Drop the order_items table: `DROP TABLE order_items;`
3. Drop the views: `DROP VIEW view_name;`

However, **backup your database first** before applying any migrations!

## Support

After applying migrations, test thoroughly:
1. Add new products with categories
2. Create orders with payment methods
3. Check that inventory updates work
4. Verify sales reports show new data

If you encounter issues, check the Supabase logs in your dashboard.
