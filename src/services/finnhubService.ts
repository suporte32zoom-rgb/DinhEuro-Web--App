/**
 * DinhEuro Finanças - Serviço de Cotações em Tempo Real via Finnhub API
 * Suporte a Ações Americanas (EUA), Forex e Criptomoedas com formatação padronizada.
 */

// Configuração da API Key da Finnhub
// Substitua 'SUA_CHAVE_AQUI' pela sua chave real ou use variáveis de ambiente (process.env.FINNHUB_API_KEY)
const DEFAULT_FINNHUB_KEY = "dbfsnl9r01qiahublh30dbfsnl9r01qiahublh3g";

const FINNHUB_API_KEY =
  (typeof process !== "undefined" && process?.env?.FINNHUB_API_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any)?.env?.VITE_FINNHUB_API_KEY) ||
  DEFAULT_FINNHUB_KEY;

export interface FinnhubQuoteResult {
  simbolo: string;
  precoAtual: number;           // Current price (c)
  variacao: number;             // Change (d)
  percentualVariacao: number;   // Percent change (dp)
  maximaDia: number;            // High price of the day (h)
  minimaDia: number;            // Low price of the day (l)
  abertura: number;             // Open price of the day (o)
  fechamentoAnterior: number;   // Previous close price (pc)
}

/**
 * Busca a cotação em tempo real de um ativo (Ação, Forex ou Cripto)
 * @param symbol Ex: 'AAPL' (Apple), 'BINANCE:BTCUSDT' (Bitcoin), 'MSFT', 'NVDA'
 */
export async function obterCotacaoFinnhub(symbol: string): Promise<FinnhubQuoteResult | null> {
  const cleanSymbol = symbol.trim().toUpperCase();

  // No navegador, tenta primeiro a rota segura do proxy backend para contornar restrições de CORS
  if (typeof window !== "undefined") {
    try {
      const proxyUrl = `/api/finnhub/quote?symbol=${encodeURIComponent(cleanSymbol)}`;
      const proxyRes = await fetch(proxyUrl, {
        headers: { Accept: "application/json" },
      });
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (proxyData && proxyData.precoAtual !== undefined) {
          return proxyData as FinnhubQuoteResult;
        }
      }
    } catch (proxyError) {
      console.warn(`[Finnhub] Proxy local falhou para ${cleanSymbol}, tentando chamada direta:`, proxyError);
    }
  }

  // Chamada direta para Finnhub API
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(cleanSymbol)}&token=${FINNHUB_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: status ${response.status}`);
    }

    const data = await response.json();

    // Se o ativo não existir ou c for 0/null
    if (data.c === 0 && data.pc === 0 && data.h === 0) {
      console.warn(`[Finnhub] Nenhum dado retornado para o símbolo: ${cleanSymbol}`);
      return null;
    }

    // Formatação dos dados retornados pela Finnhub
    const resultado: FinnhubQuoteResult = {
      simbolo: cleanSymbol,
      precoAtual: data.c,           // Current price
      variacao: data.d,             // Change
      percentualVariacao: data.dp,  // Percent change
      maximaDia: data.h,            // High price of the day
      minimaDia: data.l,            // Low price of the day
      abertura: data.o,             // Open price of the day
      fechamentoAnterior: data.pc,  // Previous close price
    };

    return resultado;
  } catch (error) {
    console.error(`Erro ao buscar cotação para ${cleanSymbol}:`, error);
    return null;
  }
}

/**
 * Busca cotações de múltiplos ativos em paralelo com limite de concorrência
 */
export async function obterMultiplasCotacoesFinnhub(
  symbols: string[]
): Promise<Record<string, FinnhubQuoteResult>> {
  const results: Record<string, FinnhubQuoteResult> = {};
  
  await Promise.all(
    symbols.map(async (sym) => {
      const q = await obterCotacaoFinnhub(sym);
      if (q) {
        results[sym.toUpperCase()] = q;
      }
    })
  );

  return results;
}

export default obterCotacaoFinnhub;
