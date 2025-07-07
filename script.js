const currencies = [
    { code: "USD", name: "Dólar Americano", flag: "https://img.icons8.com/color/48/usa.png" },
    { code: "BRL", name: "Real Brasileiro", flag: "https://img.icons8.com/color/48/brazil.png" },
    { code: "EUR", name: "Euro", flag: "https://img.icons8.com/color/48/flag-of-europe.png" },
    { code: "JPY", name: "Iene Japonês", flag: "https://img.icons8.com/color/48/japan.png" },
    { code: "GBP", name: "Libra Esterlina", flag: "https://img.icons8.com/color/48/great-britain.png" }
]

const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');

currencies.forEach(currency => {
    const optionFrom = document.createElement('option');
    optionFrom.value = currency.code;
    optionFrom.textContent = `${currency.code} - ${currency.name}`;
    optionFrom.setAttribute('data-custom-properties', JSON.stringify({
        flag: currency.flag,
        code: currency.code,
        name: currency.name
    }));
    fromCurrency.appendChild(optionFrom);

    const optionTo = optionFrom.cloneNode(true);
    toCurrency.appendChild(optionTo);
});

fromCurrency.value = "BRL";
toCurrency.value = "USD";

// Ativando Tom Select nos dois selects
const fromSelect = new TomSelect("#fromCurrency", {
    controlInput: null,
    render: {
        option: (data, escape) => {
            const { flag, code, name } = JSON.parse(data.customProperties || '{}');
            return `<div class="flag-option"><img src="${flag}"> <span class="code">${escape(code)}</span> <span class="name">${escape(name)}</span></div>`;
        },
        item: (data, escape) => {
            const { flag, code, name } = JSON.parse(data.customProperties || '{}');
            return `<div class="flag-option"><img src="${flag}"> <span class="code">${escape(code)}</span> <span class="name">${escape(name)}</span></div>`;
        }
    }
});

const toSelect = new TomSelect("#toCurrency", {
    controlInput: null,
    render: {
        option: (data, escape) => {
            const { flag, code, name } = JSON.parse(data.customProperties || '{}');
            return `<div class="flag-option"><img src="${flag}"> <span class="code">${escape(code)}</span> <span class="name">${escape(name)}</span></div>`;
        },
        item: (data, escape) => {
            const { flag, code, name } = JSON.parse(data.customProperties || '{}');
            return `<div class="flag-option"><img src="${flag}"> <span class="code">${escape(code)}</span> <span class="name">${escape(name)}</span></div>`;
        }
    }
});

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

    if (isNaN(amount)) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    const url = `https://api.exchangerate.host/convert?access_key=09732c177d431e82535af1d41d2d9ffb&from=${from}&to=${to}&amount=${amount}`;
    const res = await fetch(url);
    const data = await res.json();

    console.log(data)

    toAmountInput.value = data.result.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    rateDisplay.textContent = `${data.query.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.query.from} = ${data.result.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${data.query.to}`;
});

swapBtn.addEventListener('click', () => {
    const fromValue = fromSelect.getValue();
    const toValue = toSelect.getValue();

    fromSelect.setValue(toValue);
    toSelect.setValue(fromValue);
});

