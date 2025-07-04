const currencies = [
    { code: "USD", name: "Dólar Americano", flag: "🇺🇸"},
    { code: "BRL", name: "Real Brasileiro", flag: "BR"},
    { code: "EUR", name: "Euro", flag: "EU"},
    { code: "JPY", name: "Iene Japonês", flag: "JP"},
    { code: "GBP", name: "Libra Esterlina", flag: "GB"}
]

const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');

currencies.forEach(currency => {
    const optionFrom = document.createElement('option');
    optionFrom.value = currency.code;
    optionFrom.textContent = `${currency.flag} ${currency.code} ${currency.name}`;
    fromCurrency.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = currency.code;
    optionTo.textContent = `${currency.flag} ${currency.code} ${currency.name}`;
    toCurrency.appendChild(optionTo);
});

fromCurrency.value = "BRL";
toCurrency.value = "USD";

const convertBtn = document.getElementById('convertBtn');
const fromAmountInput = document.getElementById('fromAmount');
const toAmountInput = document.getElementById('toAmount');
const rateDisplay = document.getElementById('rate');
const trendDisplay = document.getElementById('trend');
const swapBtn = document.getElementById('swapBtn');

convertBtn.addEventListener('click', async () => {
    const amount = parseFloat(fromAmountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if(isNaN(amount)) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    const url = `https://api.exchangerate.host/convert?access_key=09732c177d431e82535af1d41d2d9ffb
&from=${from}&to=${to}&amount=${amount}`;
    const res = await fetch(url);
    const data = await res.json();

    console.log(data)

    toAmountInput.value = data.result.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2});
    rateDisplay.textContent = `${data.query.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})} ${data.query.from} = ${data.result.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4})} ${data.query.to}`;
});

swapBtn.addEventListener('click', () => {
    const swap = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = swap; 
});