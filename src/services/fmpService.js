const DEFAULT_FMP_KEY = "GJaGtHdggEtpz6erXjYrSNchdFk8FJwm";

export const FMP_API_KEY =
  (typeof process !== "undefined" && process?.env?.FMP_API_KEY) ||
  DEFAULT_FMP_KEY;

export const FMP_BASE_URL = "https://financialmodelingprep.com/stable";

export async function obterCotacaoFMP(symbol) {
  const cleanSymbol = symbol.trim().toUpperCase();
  const url = `${FMP_BASE_URL}/quote?symbol=${encodeURIComponent(cleanSymbol)}&apikey=${FMP_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`[FMP] Erro ao buscar cotação para ${cleanSymbol}:`, error);
    return null;
  }
}

export async function obterPerfilFMP(symbol) {
  const cleanSymbol = symbol.trim().toUpperCase();
  const url = `${FMP_BASE_URL}/profile?symbol=${encodeURIComponent(cleanSymbol)}&apikey=${FMP_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`[FMP] Erro ao buscar perfil corporativo para ${cleanSymbol}:`, error);
    return null;
  }
}

export async function obterDemonstracaoResultadosFMP(symbol) {
  const cleanSymbol = symbol.trim().toUpperCase();
  const url = `${FMP_BASE_URL}/income-statement?symbol=${encodeURIComponent(cleanSymbol)}&apikey=${FMP_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error(`[FMP] Erro ao buscar DRE para ${cleanSymbol}:`, error);
    return null;
  }
}

export default {
  obterCotacaoFMP,
  obterPerfilFMP,
  obterDemonstracaoResultadosFMP,
};
