# Backend Developer Quick Start Guide

## 🚀 Quick Setup for Testing

### 1. Start Your Backend API
Make sure your fraud detection API is running on `http://localhost:8000` with the following endpoints:
- `GET /api/fraud` - Returns all transactions
- `GET /api/fraud/{wallet_id}` - Returns transactions for specific wallet

### 2. Launch Frontend
```bash
cd "D:\Dorahacks ai module\frontend"
# Double-click index.html or use a local server
```

### 3. Quick Test Checklist ✅

#### Basic Functionality Test (5 minutes)
1. **Global Transactions**: Leave wallet field empty → Click "Fetch Transactions"
   - ✅ Should call `GET /api/fraud`
   - ✅ Should display all transactions in table
   - ✅ Should show transaction count and risk statistics

2. **Specific Wallet**: Enter `0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5` → Click "Fetch Transactions"
   - ✅ Should call `GET /api/fraud/0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5`
   - ✅ Should display wallet-specific transactions

3. **Error Handling**: Stop your API → Try fetching
   - ✅ Should show "Unable to connect to the server" message

## 🎯 Expected API Response Format

Your API should return data in one of these formats:

```json
// Format 1: Direct array
[
  {
    "transaction_id": "123",
    "wallet_address": "0x742d35cc...",
    "amount": 1500.50,
    "risk_level": "high",
    "fraud_probability": 0.85
  }
]

// Format 2: Wrapped in object
{
  "transactions": [ /* array of transactions */ ],
  "count": 10
}

// Format 3: Data wrapper
{
  "data": [ /* array of transactions */ ],
  "status": "success"
}
```

## 🎨 Visual Testing

### Risk Level Color Coding
- **High Risk**: Red background with red indicator dot
- **Medium Risk**: Orange background with orange indicator dot  
- **Low Risk**: Green background with green indicator dot
- **Unknown**: Gray background with gray indicator dot

### Loading States
- Spinner appears during API calls
- Button shows "Loading..." and is disabled
- Previous results are hidden during new requests

## 🔧 Common API Issues to Check

### CORS Issues
If you see CORS errors in browser console:
```javascript
// Add to your API server
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Response Format Issues
- Ensure `transaction_id` field exists (converted to transaction hash display)
- Ensure `risk_level` is one of: "high", "medium", "low" 
- Ensure `fraud_probability` is a decimal between 0-1

### Status Code Issues
- `200`: Success - data displayed
- `404`: Not found - "No transactions found" message
- `400`: Bad request - "Invalid wallet address" message  
- `500`: Server error - "Server error occurred" message

## 🐛 Troubleshooting

### Frontend Not Loading Data
1. Check browser console for errors
2. Check Network tab to see if API calls are made
3. Verify API is running on correct port (8000)
4. Check API response format matches expected structure

### Styling Issues
1. Verify CSS file is loading properly
2. Check browser compatibility (Chrome/Firefox recommended)
3. Test responsive design with browser dev tools

### Form Validation Issues
1. Test with invalid wallet addresses (should show validation error)
2. Test with valid addresses (should pass validation)
3. Verify empty field is allowed (for global transactions)

## 📊 Sample Test Data

For testing, your API could return sample data like:
```json
[
  {
    "transaction_id": "1",
    "wallet_address": "0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5",
    "amount": 1000.00,
    "risk_level": "high",
    "fraud_probability": 0.95
  },
  {
    "transaction_id": "2", 
    "wallet_address": "0x8ba1f109551bd432803012645hac136c20fb6040",
    "amount": 500.50,
    "risk_level": "medium", 
    "fraud_probability": 0.65
  },
  {
    "transaction_id": "3",
    "wallet_address": "0x1234567890123456789012345678901234567890",
    "amount": 250.25,
    "risk_level": "low",
    "fraud_probability": 0.15
  }
]
```

## 🎯 Success Criteria

The frontend is working correctly when:
- ✅ All API calls are made successfully
- ✅ Data displays correctly in the table
- ✅ Color coding matches risk levels
- ✅ Loading states work properly
- ✅ Error handling shows appropriate messages
- ✅ Form validation works for wallet addresses
- ✅ Clear button resets the interface
- ✅ Transaction summary shows correct counts

---

**Need Help?** Check the detailed `test_plan.md` for comprehensive testing scenarios or review the browser console for specific error messages.
