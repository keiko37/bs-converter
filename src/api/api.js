async function fetchCompare(fromCurrency, toCurrency) {
  let params = new URLSearchParams({
    ids: fromCurrency,
    vs_currencies: toCurrency,
  });
  try {
    let response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?${params}`
    );
    if (!response.ok) {
      Promise.reject(response);
    }
    let result = await response.json();
    return result[fromCurrency][toCurrency];
  } catch (error) {
    console.log('Error in fetchCompare:', error);
    return 0;
  }
}

async function fetchHistory(currencyValue, vsCurrensyId) {
  const params = new URLSearchParams({
    vs_currency: vsCurrensyId,
    days: 14,
    interval: 'daily',
  });
  try {
    let response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${currencyValue}/market_chart?${params}`
    );
    if (!response.ok) {
      Promise.reject(response);
    }
    let result = await response.json();
    return result['prices'];
  } catch (error) {
    console.log('Error in fetchHistory', error);
    return [];
  }
}

export { fetchCompare, fetchHistory };
