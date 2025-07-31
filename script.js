// API URL for currency conversion (you can replace this with an actual API)
const API_URL = 'https://api.exchangerate-api.com/v4//latest/USD';  // Example API URL

// Fetch and populate currency dropdowns
async function fetchCurrencies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch currencies. Please try again later.");
        }

        const data = await response.json();
        const currencies = Object.keys(data.rates);

        // Populate the dropdowns
        const fromCurrencySelect = document.getElementById('from-currency');
        const toCurrencySelect = document.getElementById('to-currency');

        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            toCurrencySelect.appendChild(option2);
        });

        // Enable sorting and searching
        enableDropdownSearch(currencies);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        alert(error.message);
    }
}

// Convert the currency based on selected options and input amount
async function convertCurrency() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = document.getElementById('amount').value;

    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch conversion data. Please try again later.");
        }

        const data = await response.json();
        if (!data.rates[toCurrency] || !data.rates[fromCurrency]) {
            throw new Error("Invalid currency selection.");
        }

        const rate = data.rates[toCurrency] / data.rates[fromCurrency];
        const convertedAmount = (amount * rate).toFixed(2);

        // Display the converted amount
        document.getElementById('converted-amount').textContent = `${convertedAmount} ${toCurrency}`;
    } catch (error) {
        console.error('Error converting currency:', error);
        alert(error.message);
    }
}

// Enable search functionality for dropdowns
function enableDropdownSearch(currencies) {
    const fromSearchInput = document.getElementById('from-search');
    const toSearchInput = document.getElementById('to-search');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');

    fromSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCurrencies = currencies.filter(currency => currency.toLowerCase().includes(searchTerm));
        fromCurrencySelect.innerHTML = '';  

        filteredCurrencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            fromCurrencySelect.appendChild(option);
        });
    });

    toSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCurrencies = currencies.filter(currency => currency.toLowerCase().includes(searchTerm));
        toCurrencySelect.innerHTML = '';  

        filteredCurrencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            toCurrencySelect.appendChild(option);
        });
    });
}

// Load currencies when the page is ready
fetchCurrencies();
