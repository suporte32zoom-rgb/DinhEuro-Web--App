import React from "react";
import { BrandLogo, DINHEURO_LOGO_URL } from "./BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        paddingBottom: "max(24px, env(safe-area-inset-bottom))",
      }}
      className="w-full border-t border-[#21262d] bg-[#0e1117] text-[#8b949e] pt-10 pb-12 sm:pb-16 mt-12"
      id="main-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Footer Row: Brand and Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showText={true} showSubtitle={false} />
            <span className="text-xs text-[#8b949e] hidden sm:inline">
              — Portal Financeiro & Inteligência de Mercados Globais
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-[#e6edf3] cursor-pointer transition-colors">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-[#e6edf3] cursor-pointer transition-colors">Privacidade & LGPD</span>
            <span>•</span>
            <span className="hover:text-[#e6edf3] cursor-pointer transition-colors">Fontes de Dados</span>
            <span>•</span>
            <span className="hover:text-[#e6edf3] cursor-pointer transition-colors">API de Cotações</span>
          </div>
        </div>

        {/* Bottom Footer Row: Disclaimer on the Left + Official Original Logo on the Right */}
        <div className="border-t border-[#21262d] pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Disclaimer & Copyright */}
          <div className="text-[11px] leading-relaxed text-[#8b949e]/80 space-y-1.5 flex-1 max-w-4xl pr-0 md:pr-6">
            <p>
              <strong className="text-[#8b949e]">Aviso Legal:</strong> As cotações e gráficos exibidos no portal DinhEuro.com são fornecidos para fins estritamente informativos e educacionais e não constituem recomendação de compra ou venda de quaisquer ativos, títulos ou contratos futuros. Dados de bolsas podem conter atrasos normativos de até 15 minutos dependendo da praça financeira. Criptoativos e Câmbio com transmissão 24/7.
            </p>
            <p>
              © {new Date().getFullYear()} DinhEuro.com. Todos os direitos reservados.
            </p>
          </div>

          {/* Canto Inferior Direito: Logo Original / Marca d'água oficial DinhEuro */}
          <div className="flex items-center gap-3 self-end md:self-center shrink-0 group select-none">
            <div className="flex flex-col text-right">
              <span className="text-xs font-black tracking-tight text-[#e6edf3] group-hover:text-white transition-colors">
                Dinh<span className="text-[#00c853]">Euro</span>
              </span>
              <span className="text-[10px] font-mono text-[#8b949e]">
                Identidade Oficial
              </span>
            </div>
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-0.5 shadow-md shadow-black/50 ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 group-hover:scale-105 transition-all overflow-hidden shrink-0">
              <img
                src={DINHEURO_LOGO_URL}
                alt="Logo Original DinhEuro"
                className="w-full h-full object-contain rounded-full select-none"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
