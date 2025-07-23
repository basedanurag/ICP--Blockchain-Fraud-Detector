# Testing Guide for Fraud Detection Frontend

This guide will help backend developers test the frontend application for the fraud detection module. Ensure that the backend API is properly functioning to facilitate effective frontend testing.

## Prerequisites

- Ensure the backend API is running on `http://localhost:8000`
- Verify that the frontend files are available in the `D:\Dorahacks ai module\frontend` directory
- Use a compatible web browser (e.g., Chrome, Firefox, Edge)

## Steps to Test the Frontend

1. **Navigate to the Frontend Directory**
   ```
   cd "D:\Dorahacks ai module\frontend"
   ```

2. **Open the Frontend in a Browser**
   - Double-click on `index.html` to open it directly in a web browser for testing.

3. **Testing Scenarios**

   ### Test with Empty Wallet Input (Global Transactions)
   - Leave the wallet address field blank and click "Fetch Transactions."
   - Verify global transactions display with correct risk summaries.

   ### Test with Valid Wallet Address
   - Enter a valid Ethereum wallet address.
   - Click "Fetch Transactions" to view wallet-specific transactions.

   ### Test Error Handling
   - Stop the backend service and attempt to fetch transactions.
   - Ensure an appropriate error message is displayed.

   ### Verify Color-Coding
   - Check that rows are color-coded according to risk levels (High: Red, Medium: Orange, Low: Green).

   ### Responsive Design
   - Test the UI on different screen sizes and devices to ensure proper layout and functionality.

4. **Additional Functional Tests**

   - **Loading States**: Ensure loading spinner and button states are correctly managed during API requests.
   - **Form Validation**: Check wallet address validation and error messages.
   - **Data Formatting**: Verify that data is displayed and formatted correctly in the table.

5. **Utilizing the Test Plan**
   - Follow the detailed test cases in `test_plan.md` for comprehensive testing coverage.

6. **Reporting Issues**
   - Document any bugs or issues encountered during testing.
   - Screenshot errors and include steps to reproduce for the development team.

By following this guide, backend developers can efficiently test the frontend UI in conjunction with the backend services to ensure full feature functionality and integration accuracy.
