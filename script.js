const currencies = [
    { code: "USD", name: "Dólar Americano", flag: "https://img.icons8.com/color/48/usa.png" },
    { code: "BRL", name: "Real Brasileiro", flag: "https://img.icons8.com/color/48/brazil.png" },
    { code: "EUR", name: "Euro", flag: "https://img.icons8.com/color/48/flag-of-europe.png" },
    { code: "JPY", name: "Iene Japonês", flag: "https://img.icons8.com/color/48/japan.png" },
    { code: "GBP", name: "Libra Esterlina", flag: "https://img.icons8.com/color/48/great-britain.png" },
    { code: "INR", name: "Rúpia Indiana", flag: "https://img.icons8.com/color/48/india.png" },
    { code: "CAD", name: "Dólar Canadense", flag: "https://img.icons8.com/color/48/canada.png" },
    { code: "AUD", name: "Dólar Australiano", flag: "https://img.icons8.com/color/48/australia-flag--v1.png" },
    { code: "MXN", name: "Peso Mexicano", flag: "https://img.icons8.com/color/48/mexico.png" },
    { code: "ARS", name: "Peso Argentino", flag: "https://img.icons8.com/color/48/argentina.png" },
    { code: "CLP", name: "Peso Chileno", flag: "https://img.icons8.com/color/48/chile.png" },
    { code: "CNY", name: "Yuan Chinês", flag: "https://img.icons8.com/color/48/china.png" },
    { code: "DKK", name: "Coroa Dinamarquesa", flag: "https://img.icons8.com/color/48/denmark.png" },
    { code: "EGP", name: "Libra Egípcia", flag: "https://img.icons8.com/color/48/egypt.png" },
    { code: "ISK", name: "Coroa Islandesa", flag: "https://img.icons8.com/color/48/iceland.png" },
    { code: "JMD", name: "Dólar Jamaicano", flag: "https://img.icons8.com/color/48/jamaica.png" },
    { code: "KRW", name: "Won Sul-coreano", flag: "https://img.icons8.com/color/48/south-korea.png" },
    { code: "UYU", name: "Peso Uruguaio", flag: "https://img.icons8.com/color/48/uruguay.png" },
    { code: "NOK", name: "Coroa Norueguesa", flag: "https://img.icons8.com/color/48/norway.png" },
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

async function converterMoeda() {
    const amount = parseFloat(fromAmountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount)) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    const url = `https://api.exchangerate.host/convert?access_key=f1ed1c9f0cc877d1575f5097d32b5412&from=${from}&to=${to}&amount=${amount}`;
    const res = await fetch(url);
    const data = await res.json();

    console.log(data)

    toAmountInput.value = data.result.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    rateDisplay.textContent = `${data.query.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.query.from} = ${data.result.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${data.query.to}`;

    carregarHistorico(from, to);
}

function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

const debouncedConverter = debounce(converterMoeda, 500); // 500ms de atraso

fromAmountInput.addEventListener('input', debouncedConverter);
fromCurrency.addEventListener('change', converterMoeda);
toCurrency.addEventListener('change', converterMoeda);
convertBtn.addEventListener('click', converterMoeda);


swapBtn.addEventListener('click', () => {
    const fromValue = fromSelect.getValue();
    const toValue = toSelect.getValue();

    fromSelect.setValue(toValue);
    toSelect.setValue(fromValue);

    converterMoeda();
});

async function carregarHistorico(fromCurrency, toCurrency) {
    const endDate = new Date().toISOString().split('T')[0]; // data atual
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // últimos 30 dias
    const formattedStartDate = startDate.toISOString().split('T')[0];

    const url = `https://api.apilayer.com/exchangerates_data/timeseries?start_date=${formattedStartDate}&end_date=${endDate}&base=${fromCurrency}&symbols=${toCurrency}`;

    const response = await fetch(url, {
        headers: {
            apikey: 'QiuOKSbWhs9RyEqQo4zyD3DzkOynZ2sB'
        }
    });
    const data = await response.json();

    if (!data.success) {
        console.error("Erro na API:", data);
        alert("Erro ao carregar histórico. Veja o console para detalhes.");
        return;
    }

    const labels = Object.keys(data.rates);
    const values = labels.map(date => data.rates[date][toCurrency]);

    desenharGrafico(labels, values, `${fromCurrency} → ${toCurrency}`);
}

function desenharGrafico(labels, dados, titulo) {
    const ctx = document.getElementById('exchangeChart').getContext('2d');

    // Destroi gráfico antigo se existir
    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: titulo,
                data: dados,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 6
                    }
                },
                y: {
                    ticks: {
                        maxTicksLimit: 6,
                    }
                }
            }
        }
    });

    document.getElementById('exchangeChart').style.display = 'block';
}


