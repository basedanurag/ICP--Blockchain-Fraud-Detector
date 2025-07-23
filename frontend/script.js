// API base URL
const API_BASE_URL = 'http://localhost:8000';

// DOM elements
const fetchButton = document.getElementById('fetch-transactions');
const walletInput = document.getElementById('wallet-address');
const loadingSpinner = document.getElementById('loadingSpinner');
const transactionsTable = document.getElementById('transactions-table');
const errorMessage = document.getElementById('errorMessage');
const transactionTableBody = document.querySelector('#transactions-table tbody');
const statusContainer = document.getElementById('status-container');
const clearButton = document.getElementById('clear-results');
const transactionForm = document.getElementById('transaction-form');

// Event listeners
fetchButton.addEventListener('click', handleFetchTransactions);
clearButton.addEventListener('click', clearResults);
transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFetchTransactions();
});

// Basic wallet address validation
walletInput.addEventListener('input', function() {
    const value = this.value.trim();
    if (value === '') {
        this.setCustomValidity('');
        return;
    }
    
    // Check if it's a valid Ethereum address format
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(value)) {
        this.setCustomValidity('Please enter a valid Ethereum wallet address (42 characters starting with 0x)');
    } else {
        this.setCustomValidity('');
    }
});

// Function to get wallet input value (empty string if not provided)
function getWalletInputValue() {
    const value = walletInput.value.trim();
    return value || '';
}

// Main function to handle fetching transactions
async function handleFetchTransactions() {
    const walletId = getWalletInputValue();
    
    // Show loading state
    showLoadingState();
    
    try {
        const transactions = await fetchTransactions(walletId);
        handleSuccess(transactions);
    } catch (error) {
        handleError(error);
    }
}

// API call logic
async function fetchTransactions(walletId) {
    let url;
    
    // If wallet is empty: GET /api/fraud
    // If wallet provided: GET /api/fraud/${walletId}
    if (walletId === '') {
        url = `${API_BASE_URL}/api/fraud`;
    } else {
        url = `${API_BASE_URL}/api/fraud/${walletId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
}

// Loading state management
function showLoadingState() {
    // Show spinner
    loadingSpinner.style.display = 'block';
    // Hide table
    transactionsTable.style.display = 'none';
    // Hide error message
    hideErrorMessage();
    // Disable button
    fetchButton.disabled = true;
    fetchButton.textContent = 'Loading...';
}

function hideLoadingState() {
    // Hide spinner
    loadingSpinner.style.display = 'none';
    // Enable button
    fetchButton.disabled = false;
    fetchButton.textContent = 'Fetch Transactions';
}

// Error handling with user-friendly messages
function handleError(error) {
    hideLoadingState();
    
    let userFriendlyMessage;
    
    if (error.message.includes('Failed to fetch')) {
        userFriendlyMessage = 'Unable to connect to the server. Please check if the API is running and try again.';
    } else if (error.message.includes('HTTP 404')) {
        userFriendlyMessage = 'No transactions found for the specified wallet address.';
    } else if (error.message.includes('HTTP 400')) {
        userFriendlyMessage = 'Invalid wallet address format. Please check your input and try again.';
    } else if (error.message.includes('HTTP 500')) {
        userFriendlyMessage = 'Server error occurred. Please try again later.';
    } else {
        userFriendlyMessage = 'An unexpected error occurred. Please try again.';
    }
    
    showErrorMessage(userFriendlyMessage);
    console.error('API Error:', error);
}

function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideErrorMessage() {
    errorMessage.style.display = 'none';
}

// Function to reset the form and results
function clearResults() {
    walletInput.value = '';
    transactionTableBody.innerHTML = '';
    document.getElementById('transaction-summary').style.display = 'none';
    transactionsTable.style.display = 'none';
    hideErrorMessage();
    walletInput.setCustomValidity('');
}

// Update the transaction summary and risk statistics
function updateSummaryAndStatistics(transactions) {
    const summaryContainer = document.getElementById('transaction-summary');
    const transactionCount = document.getElementById('transaction-count');
    const riskStatistics = document.getElementById('risk-statistics');
    
    const riskLevels = transactions.reduce((acc, transaction) => {
        const risk = (transaction.risk_level || 'unknown').toLowerCase();
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
    }, { high: 0, medium: 0, low: 0, unknown: 0 });

    transactionCount.textContent = `Transaction Count: ${transactions.length}`;
    
    let statsText = `Risk Statistics - High: ${riskLevels.high}, Medium: ${riskLevels.medium}, Low: ${riskLevels.low}`;
    if (riskLevels.unknown > 0) {
        statsText += `, Unknown: ${riskLevels.unknown}`;
    }
    riskStatistics.textContent = statsText;
    
    summaryContainer.style.display = 'block';
}

// Success handler to process and display transactions
function handleSuccess(data) {
    hideLoadingState();
    
    // Process the data - handle both array and object responses
    let transactions = [];
    
    if (Array.isArray(data)) {
        transactions = data;
    } else if (data.transactions && Array.isArray(data.transactions)) {
        transactions = data.transactions;
    } else if (data.data && Array.isArray(data.data)) {
        transactions = data.data;
    } else {
        handleError(new Error('Invalid response format'));
        return;
    }
    
    if (transactions.length === 0) {
        showErrorMessage('No transactions found.');
        return;
    }
    
    displayTransactions(transactions);
    updateSummaryAndStatistics(transactions);
    transactionsTable.style.display = 'table';
}

// Function to map transaction_id to tx_hash for display
function mapTransactionIdToHash(transactionId) {
    // If the transaction_id is already a hash format (starts with 0x), return as is
    if (typeof transactionId === 'string' && transactionId.startsWith('0x')) {
        return transactionId;
    }
    
    // If it's a numeric ID, convert to a mock hash format for display
    // In a real application, this would map to actual transaction hashes
    if (typeof transactionId === 'number' || !isNaN(transactionId)) {
        return `0x${transactionId.toString().padStart(64, '0')}`;
    }
    
    // Return as is if it's already a string that looks like a hash
    return transactionId;
}

// Function to populate table rows with color-coding based on risk_level
function displayTransactions(transactions) {
    // Clear existing rows
    transactionTableBody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Apply color-coding based on risk_level
        const riskClass = getRiskClass(transaction.risk_level);
        row.className = riskClass;
        
        // Create table cells
        const txHashCell = document.createElement('td');
        const walletCell = document.createElement('td');
        const amountCell = document.createElement('td');
        const riskCell = document.createElement('td');
        const probabilityCell = document.createElement('td');
        
        // Populate cell data
        txHashCell.textContent = mapTransactionIdToHash(transaction.transaction_id);
        walletCell.textContent = transaction.wallet_address || 'N/A';
        amountCell.textContent = transaction.amount ? `$${parseFloat(transaction.amount).toLocaleString()}` : 'N/A';
        riskCell.textContent = transaction.risk_level || 'Unknown';
        probabilityCell.textContent = transaction.fraud_probability ? 
            `${(parseFloat(transaction.fraud_probability) * 100).toFixed(2)}%` : 'N/A';
        
        // Add risk level indicator
        const riskIndicator = document.createElement('span');
        riskIndicator.className = `risk-indicator ${riskClass}`;
        riskIndicator.textContent = '●';
        riskCell.prepend(riskIndicator);
        riskCell.prepend(' ');
        
        // Append cells to row
        row.appendChild(txHashCell);
        row.appendChild(walletCell);
        row.appendChild(amountCell);
        row.appendChild(riskCell);
        row.appendChild(probabilityCell);
        
        // Append row to table body
        transactionTableBody.appendChild(row);
    });
}

// Helper function to get CSS class based on risk level
function getRiskClass(riskLevel) {
    if (!riskLevel) return 'risk-unknown';
    
    const risk = riskLevel.toLowerCase();
    
    switch (risk) {
        case 'high':
            return 'risk-high';
        case 'medium':
            return 'risk-medium';
        case 'low':
            return 'risk-low';
        default:
            return 'risk-unknown';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading spinner and table initially
    loadingSpinner.style.display = 'none';
    transactionsTable.style.display = 'none';
    hideErrorMessage();
});
