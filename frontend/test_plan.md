# Frontend Test Plan - Fraud Detection Dashboard

## Overview
This test plan covers manual testing scenarios for the fraud detection dashboard frontend application to ensure all functionality works correctly across different scenarios and environments.

## Test Environment Setup
- **Frontend**: Local HTML/CSS/JS files served via browser
- **Backend**: API server running on `http://localhost:8000`
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, Tablet, Mobile

---

## Test Case 1: Empty Wallet Input (Global Transactions)

### Objective
Test the application with empty wallet input to fetch global transactions.

### Steps
1. Open the fraud detection dashboard
2. Leave the wallet address field empty
3. Click "Fetch Transactions" button
4. Observe the behavior

### Expected Results
- ✅ Loading state should appear (spinner and "Loading..." button text)
- ✅ API call should be made to `/api/fraud` (without wallet parameter)
- ✅ Global transactions should be displayed in the table
- ✅ Transaction summary should show total count and risk statistics
- ✅ Loading state should disappear after data loads
- ✅ Color-coding should be applied based on risk levels

### Test Data
- Input: Empty wallet field
- Expected API endpoint: `GET /api/fraud`

---

## Test Case 2: Valid Wallet Address

### Objective
Test the application with a valid Ethereum wallet address.

### Steps
1. Open the fraud detection dashboard
2. Enter a valid Ethereum wallet address (e.g., `0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5`)
3. Click "Fetch Transactions" button
4. Observe the behavior

### Expected Results
- ✅ Wallet address validation should pass
- ✅ Loading state should appear
- ✅ API call should be made to `/api/fraud/{wallet_address}`
- ✅ Wallet-specific transactions should be displayed
- ✅ Transaction summary should show filtered results
- ✅ Loading state should disappear after data loads

### Test Data
- Input: `0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5`
- Expected API endpoint: `GET /api/fraud/0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5`

### Additional Valid Wallet Tests
- Test with different valid wallet formats
- Test with mixed case addresses
- Test with all lowercase addresses
- Test with all uppercase addresses

---

## Test Case 3: Invalid Wallet Address Validation

### Objective
Test client-side validation for invalid wallet addresses.

### Steps
1. Open the fraud detection dashboard
2. Try entering invalid wallet addresses:
   - Too short: `0x123`
   - Missing 0x prefix: `742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5`
   - Invalid characters: `0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5z`
   - Too long: `0x742d35cc6634c0532925a3b8d6f6e6ab7b09ffe5123`
3. Attempt to submit the form

### Expected Results
- ✅ Browser validation should prevent form submission
- ✅ Custom validation message should appear
- ✅ Form should not submit until valid address is entered
- ✅ Validation should clear when valid address is entered

---

## Test Case 4: Error Handling (Backend Unavailable)

### Objective
Test error handling when the backend API is unavailable.

### Steps
1. Stop the backend API server
2. Open the fraud detection dashboard
3. Enter any wallet address or leave empty
4. Click "Fetch Transactions" button
5. Observe error handling

### Expected Results
- ✅ Loading state should appear initially
- ✅ After timeout, loading state should disappear
- ✅ User-friendly error message should appear: "Unable to connect to the server. Please check if the API is running and try again."
- ✅ No transaction table should be displayed
- ✅ Button should be re-enabled for retry

### Additional Error Scenarios
- **404 Error**: Test with non-existent wallet
- **400 Error**: Test server-side validation errors
- **500 Error**: Test server errors
- **Network timeout**: Test slow network conditions

---

## Test Case 5: Color-Coding Verification

### Objective
Verify that risk-level color coding works correctly.

### Steps
1. Fetch transactions that include different risk levels
2. Examine the table rows and risk indicators
3. Verify color consistency

### Expected Results
- ✅ **High Risk**: Red background (`#ffebee`) with red border (`#f44336`)
- ✅ **Medium Risk**: Orange background (`#fff3e0`) with orange border (`#ff9800`)
- ✅ **Low Risk**: Green background (`#e8f5e8`) with green border (`#4caf50`)
- ✅ **Unknown Risk**: Gray background (`#f5f5f5`) with gray border (`#9e9e9e`)
- ✅ Risk indicators (●) should match the row colors
- ✅ Risk statistics should accurately count each risk level

### Test Data Required
- Transactions with `risk_level`: "high", "medium", "low", null/undefined

---

## Test Case 6: Responsive Design Testing

### Objective
Test the application's responsive design across different screen sizes.

### Screen Size Categories
- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024, 1024x768
- **Mobile**: 375x667, 414x896, 360x640

### Tests for Each Screen Size

#### Desktop (≥1200px)
- ✅ Full table width with all columns visible
- ✅ Form centered with adequate padding
- ✅ Buttons side-by-side
- ✅ Typography scales appropriately

#### Tablet (768px - 1199px)
- ✅ Table remains readable with adjusted column widths
- ✅ Form adapts to medium screen size
- ✅ Touch-friendly button sizes
- ✅ Adequate spacing between elements

#### Mobile (≤767px)
- ✅ Table scrolls horizontally if needed
- ✅ Form stacks vertically
- ✅ Buttons stack or wrap appropriately
- ✅ Text remains readable
- ✅ Touch targets are at least 44px
- ✅ Wallet address input remains functional

### Responsive Testing Tools
- Browser developer tools
- Physical devices
- Online testing tools (BrowserStack, etc.)

---

## Test Case 7: Loading States

### Objective
Ensure loading states appear and disappear appropriately.

### Scenarios to Test

#### Normal Loading Flow
1. Click "Fetch Transactions"
2. Observe loading state
3. Wait for data to load
4. Verify loading state disappears

### Expected Behaviors
- ✅ **Loading Spinner**: Visible during API call
- ✅ **Button State**: Disabled with "Loading..." text
- ✅ **Table Hiding**: Previous results hidden during new request
- ✅ **Error Clearing**: Previous error messages cleared
- ✅ **State Reset**: All states properly reset after completion

#### Edge Cases
- ✅ Multiple rapid clicks (should not create multiple requests)
- ✅ Loading state during slow network
- ✅ Loading state interruption (page refresh during load)

---

## Test Case 8: Data Display and Formatting

### Objective
Verify that transaction data is displayed correctly with proper formatting.

### Data Points to Verify
- ✅ **Transaction Hash**: Properly formatted (0x prefix, correct length)
- ✅ **Risk Score**: Displayed as percentage with 2 decimal places
- ✅ **Risk Level**: Proper capitalization and spelling
- ✅ **Summary Statistics**: Accurate counts for each risk category
- ✅ **Empty States**: Proper handling when no transactions found

### Data Formatting Tests
- Transaction ID to hash conversion
- Percentage formatting
- Currency formatting (if applicable)
- Date formatting (if applicable)

---

## Test Case 9: Form Functionality

### Objective
Test all form-related functionality and interactions.

### Form Tests
- ✅ **Form Submission**: Both button click and Enter key
- ✅ **Input Validation**: Real-time validation feedback
- ✅ **Clear Results**: Button clears all data and resets form
- ✅ **Form Reset**: Proper state management after clear
- ✅ **Focus Management**: Proper tab order and focus states
- ✅ **Accessibility**: Proper labels, ARIA attributes

---

## Test Case 10: Browser Compatibility

### Objective
Ensure the application works across different browsers.

### Browsers to Test
- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

### Features to Verify
- ✅ CSS Grid/Flexbox support
- ✅ Fetch API support
- ✅ ES6+ JavaScript features
- ✅ Form validation
- ✅ Event handling
- ✅ Local storage (if used)

---

## Test Case 11: Performance Testing

### Objective
Test application performance with various data loads.

### Performance Scenarios
- ✅ **Small Dataset**: 10-50 transactions
- ✅ **Medium Dataset**: 100-500 transactions  
- ✅ **Large Dataset**: 1000+ transactions
- ✅ **Memory Usage**: Monitor for memory leaks
- ✅ **Rendering Time**: Table rendering performance

---

## Test Case 12: Security and Input Sanitization

### Objective
Ensure the application handles potentially malicious input safely.

### Security Tests
- ✅ **XSS Prevention**: Script injection attempts in wallet field
- ✅ **Input Sanitization**: Special characters and encoded content
- ✅ **API Security**: Proper error handling without exposing internals
- ✅ **CSRF Protection**: If applicable

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Backend API server running on localhost:8000
- [ ] Frontend files accessible via web server or file:// protocol
- [ ] Test data prepared (various wallet addresses)
- [ ] Multiple browsers available for testing
- [ ] Different devices/screen sizes available

### Test Execution
- [ ] Execute each test case systematically
- [ ] Document any failures with screenshots
- [ ] Note browser/device-specific issues
- [ ] Record actual vs expected results
- [ ] Verify fixes after issues are resolved

### Post-Test
- [ ] Compile test results report
- [ ] Prioritize any identified issues
- [ ] Document any recommendations for improvements
- [ ] Plan regression testing after fixes

---

## Known Issues to Address

Based on code review, the following issues should be fixed before testing:

1. **Missing HTML Elements**: `loadingSpinner` and `errorMessage` elements are referenced in JavaScript but don't exist in HTML
2. **CSS Syntax Error**: Line 120 in style.css has incomplete property
3. **Table Structure**: HTML table is missing wallet, amount, and probability columns that JavaScript tries to populate

These issues should be resolved before executing the test plan for accurate results.
