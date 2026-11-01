/**
 * DinhEuro Finanças - Serviço Financial Modeling Prep (FMP)
 * Suporte a cotações em tempo real, perfil corporativo, DRE (demonstrações financeiras) e busca.
 */

const DEFAULT_FMP_KEY = "GJaGtHdggEtpz6erXjYrSNchdFk8FJwm";

export const FMP_API_KEY =
  (typeof process !== "undefined" && process?.env?.FMP_API_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any)?.env?.VITE_FMP_API_KEY) ||
  DEFAULT_FMP_KEY;

export const FMP_BASE_URL = "https://financialmodelingprep.com/stable";

export interface FMPQuote {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
  change: number;
  volume: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50?: number;
  priceAvg200?: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

export interface FMPCompanyProfile {
  symbol: string;
  price: number;
  marketCap: number;
  beta?: number;
  lastDividend?: number;
  range?: string;
  change?: number;
  changePercentage?: number;
  volume?: number;
  averageVolume?: number;
  companyName: string;
  currency: string;
  exchange: string;
  exchangeFullName?: string;
  industry?: string;
  website?: string;
  description?: string;
  ceo?: string;
  sector?: string;
  country?: string;
  fullTimeEmployees?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  image?: string;
  ipoDate?: string;
  isActivelyTrading?: boolean;
}

export interface FMPIncomeStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  fiscalYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  operatingExpenses?: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted?: number;
}

export interface FMPSearchResult {
  symbol: string;
  name: string;
  currency?: string;
  stockExchange?: string;
  exchangeShortName?: string;
}

/**
 * 1. Busca cotação em tempo real via FMP
 */
export async function obterCotacaoFMP(symbol: string): Promise<FMPQuote | null> {
  const cleanSymbol = symbol.trim().toUpperCase();

  // No browser, usa proxy local para evitar CORS e ocultar credenciais
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/fmp/quote?symbol=${encodeURIComponent(cleanSymbol)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.price !== undefined) return data as FMPQuote;
      }
    } catch {
      // continua para fallback
    }
  }

  const url = `${FMP_BASE_URL}/quote?symbol=${encodeURIComponent(cleanSymbol)}&apikey=${FMP_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? (data[0] as FMPQuote) : null;
  } catch (error) {
    console.error(`[FMP] Erro ao buscar cotação para ${cleanSymbol}:`, error);
    return null;
  }
}

/**
 * 2. Busca perfil institucional da empresa via FMP
 */
export async function obterPerfilFMP(symbol: string): Promise<FMPCompanyProfile | null> {
  const cleanSymbol = symbol.trim().toUpperCase();

  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/fmp/profile?symbol=${encodeURIComponent(cleanSymbol)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.companyName) return data as FMPCompanyProfile;
      }
    } catch {
      // continua para fallback
    }
  }

  const url = `${FMP_BASE_URL}/profile?symbol=${encodeURIComponent(cleanSymbol)}&apikey=${FMP_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? (data[0] as FMPCompanyProfile) : null;
  } catch (error) {
    console.error(`[FMP] Erro ao buscar perfil corporativo para ${cleanSymbol}:`, error);
    return null;
  }
}

/**
 * 3. Busca demonstração de resultados (DRE / Income Statement) via FMP
 */
export async function obterDemonstracaoResultadosFMP(
  symbol: string
): Promise<FMPIncomeStatement[] | null> {
  const cleanSymbol = symbol.trim().toUpperCase();

  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/fmp/financials?symbol=${encodeURIComponent(cleanSymbol)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data as FMPIncomeStatement[];
      }
    } catch {
      // continua para fallback
    }
  }

  const url = `${FMP_BASE_URL}/income-statement?symbol=${encodeURIComponent(cleanSymbol)}&apikey=${FMP_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? (data as FMPIncomeStatement[]) : null;
  } catch (error) {
    console.error(`[FMP] Erro ao buscar DRE para ${cleanSymbol}:`, error);
    return null;
  }
}

/**
 * 4. Pesquisa de símbolos / empresas via FMP
 */
export async function buscarAtivosFMP(query: string): Promise<FMPSearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/fmp/search?query=${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data as FMPSearchResult[];
      }
    } catch {
      // continua para fallback
    }
  }

  const url = `${FMP_BASE_URL}/search-symbol?query=${encodeURIComponent(cleanQuery)}&apikey=${FMP_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? (data as FMPSearchResult[]) : [];
  } catch (error) {
    console.error(`[FMP] Erro na busca para ${cleanQuery}:`, error);
    return [];
  }
}
