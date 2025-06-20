# Shop Admin Dashboard Testing Guide

## Overview
This guide covers the testing and validation of the Shop Admin Dashboard. The dashboard has been designed for simplicity, focusing on inventory management and basic analytics without the complexities of order processing or customer management.

## Testing Environment
- Backend URL: http://localhost:5000
- Frontend URL: http://localhost:3000
- Test Credentials:
  - Email: shop_admin@medtrax.com
  - Password: password123

## Features to Test

### 1. Dashboard Overview
- [ ] Dashboard loads with correct shop information
- [ ] Stats cards show accurate counts (total items, value, low stock, expiring soon)
- [ ] Alerts for low stock and expiring items appear correctly
- [ ] Recent inventory list shows the 5 most recently added items

### 2. Inventory Management
- [ ] Complete inventory list loads correctly
- [ ] Search functionality finds items by name, manufacturer, or SKU
- [ ] Category filter works correctly
- [ ] Stock status filter works correctly
- [ ] Prescription requirement filter works correctly
- [ ] Item details are displayed correctly (pricing, stock levels, expiry)

### 3. Inventory Operations
- [ ] Add new inventory item with required fields
- [ ] Edit existing inventory item
- [ ] Update stock quantity
- [ ] Delete inventory item
- [ ] Validation prevents saving invalid data

### 4. Analytics
- [ ] Page visits counter displays
- [ ] Contact clicks counter displays
- [ ] Conversion rate calculates correctly
- [ ] Category distribution displays correctly
- [ ] Weekly performance chart renders properly

## Test Cases

### Dashboard Overview

1. **Dashboard Stats**
   - Login as shop admin
   - Navigate to dashboard
   - Verify that all stats match the data in the database
   - Expected: Stats for total items, total value, low stock, and expiring items are accurate

2. **Alerts**
   - Items with stock below minimum level should trigger low stock alerts
   - Items expiring within 30 days should trigger expiry alerts
   - Expected: Alert banners show with correct counts and item details

### Inventory Management

3. **Add Inventory Item**
   - Click "Add Item" button
   - Fill out all required fields
   - Submit form
   - Expected: New item appears in inventory list with success message

4. **Edit Inventory Item**
   - Find an existing item
   - Click "Edit" button
   - Modify some fields
   - Submit form
   - Expected: Item details update with success message

5. **Update Stock**
   - Find an existing item
   - Click "Update Stock"
   - Enter new stock quantity
   - Confirm
   - Expected: Stock quantity updates with success message

6. **Delete Inventory Item**
   - Find an existing item
   - Click "Delete" button
   - Confirm deletion
   - Expected: Item removed from inventory with success message

7. **Search and Filters**
   - Enter search term
   - Apply category filter
   - Apply stock status filter
   - Expected: Results match all criteria
   - Click "Clear Filters"
   - Expected: All filters reset, showing full inventory

### Analytics

8. **Analytics Overview**
   - Navigate to Analytics tab
   - Verify visit and contact click metrics
   - Check category distribution
   - Review weekly performance chart
   - Expected: All analytics visualizations load correctly

## Error Handling

9. **Form Validation**
   - Try submitting add/edit form with missing required fields
   - Expected: Form shows validation errors
   - Try entering invalid data (negative stock, negative price)
   - Expected: Form prevents submission with appropriate error messages

10. **API Error Handling**
    - Simulate network error (disable network temporarily)
    - Perform any operation
    - Expected: User-friendly error message appears

## Responsive Design

11. **Mobile Responsiveness**
    - Open dashboard on mobile device or use device emulation
    - Test all major functions
    - Expected: All features work correctly with appropriate layout adjustments

## Notes
- This implementation follows the simplified requirements for the Shop Admin Dashboard
- No order management features are included
- Customer profiles and purchase history are not included
- Focus is on inventory visibility and basic analytics

## Conclusion
After completing these tests, the Shop Admin Dashboard should be fully functional according to the specified requirements. Document any issues found during testing for further improvements.
