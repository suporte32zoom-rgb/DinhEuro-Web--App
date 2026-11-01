// Configuração da API Key da Finnhub
// Substitua 'SUA_CHAVE_AQUI' pela sua chave real ou use variáveis de ambiente (process.env.FINNHUB_API_KEY)
const DEFAULT_KEY = 'dbfsnl9r01qiahublh30dbfsnl9r01qiahublh3g';
const FINNHUB_API_KEY = (typeof process !== 'undefined' && process.env && process.env.FINNHUB_API_KEY) || DEFAULT_KEY;

/**
 * Busca a cotação em tempo real de um ativo (Ação, Forex ou Cripto)
 * @param {string} symbol Ex: 'AAPL' (Apple), 'BINANCE:BTCUSDT' (Bitcoin)
 */
async function obterCotacaoFinnhub(symbol) {
  const cleanSymbol = symbol.trim().toUpperCase();

  // Se executado no navegador, tenta primeiro a rota segura de proxy backend
  if (typeof window !== 'undefined') {
    try {
      const proxyUrl = `/api/finnhub/quote?symbol=${encodeURIComponent(cleanSymbol)}`;
      const proxyRes = await fetch(proxyUrl);
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (proxyData && proxyData.precoAtual !== undefined) {
          return proxyData;
        }
      }
    } catch {
      // continua para a chamada direta
    }
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(cleanSymbol)}&token=${FINNHUB_API_KEY}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: status ${response.status}`);
    }

    const data = await response.json();

    // Formatação dos dados retornados pela Finnhub
    const resultado = {
      simbolo: cleanSymbol,
      precoAtual: data.c,      // Current price
      variacao: data.d,        // Change
      percentualVariacao: data.dp, // Percent change
      maximaDia: data.h,       // High price of the day
      minimaDia: data.l,       // Low price of the day
      abertura: data.o,        // Open price of the day
      fechamentoAnterior: data.pc // Previous close price
    };

    return resultado;
  } catch (error) {
    console.error(`Erro ao buscar cotação para ${cleanSymbol}:`, error);
    return null;
  }
}

export { obterCotacaoFinnhub, FINNHUB_API_KEY };
export default obterCotacaoFinnhub;
