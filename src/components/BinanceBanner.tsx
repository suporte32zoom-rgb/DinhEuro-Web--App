import React from 'react';

interface BinanceBannerProps {
  referralId?: string;
  referralUrl?: string;
}

export const BinanceBanner: React.FC<BinanceBannerProps> = ({
  referralId = "CPA_00UI0GEENV",
  referralUrl = "https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00UI0GEENV"
}) => {
  return (
    <aside className="dinheuro-binance-banner" style={{
      background: 'linear-gradient(135deg, #181a20 0%, #0b0e11 100%)',
      border: '1px solid #f0b90b',
      borderRadius: '16px',
      padding: '24px',
      color: '#ffffff',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      width: '100%',
      boxShadow: '0 10px 25px rgba(240, 185, 11, 0.15)',
      margin: '20px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Brilho decorativo no fundo */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        background: 'rgba(240, 185, 11, 0.12)',
        filter: 'blur(40px)',
        borderRadius: '50%'
      }} />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Lado Esquerdo: Logo Binance + Textos */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <svg width="135" height="28" viewBox="0 0 148 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.25 12.56L15.47 7.78L10.69 12.56L15.47 17.34L20.25 12.56ZM15.47 0L2.73 12.56L7.51 17.34L15.47 9.56L23.43 17.34L28.21 12.56L15.47 0ZM15.47 25.12L10.69 20.34L15.47 15.56L20.25 20.34L15.47 25.12ZM2.73 12.56L0 15.29L15.47 30.76L30.94 15.29L28.21 12.56L23.43 17.34L15.47 25.12L7.51 17.34L2.73 12.56Z" fill="#F0B90B"/>
              <path d="M43.87 23.5H38.56V7.47H43.87C46.85 7.47 49 9.17 49 11.83C49 13.56 48.06 14.8 46.73 15.35C48.33 15.87 49.5 17.27 49.5 19.12C49.5 21.84 47.16 23.5 43.87 23.5ZM43.34 10.97H41.56V13.88H43.34C44.42 13.88 45.19 13.25 45.19 12.43C45.19 11.6 44.42 10.97 43.34 10.97ZM43.68 17.06H41.56V20.02H43.68C44.86 20.02 45.69 19.34 45.69 18.54C45.69 17.74 44.86 17.06 43.68 17.06Z" fill="#F0B90B"/>
              <path d="M54.5 7.47H57.5V23.5H54.5V7.47Z" fill="#F0B90B"/>
              <path d="M62.5 7.47H65.5V23.5H62.5V7.47Z" fill="#F0B90B"/>
            </svg>
            <span style={{
              background: 'rgba(240, 185, 11, 0.15)',
              color: '#f0b90b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(240, 185, 11, 0.3)'
            }}>
              PARCEIRO OFICIAL
            </span>
          </div>

          <h4 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
            Abra sua conta na maior corretora de cripto do mundo
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#eaecef', lineHeight: 1.5 }}>
            Compre Bitcoin, Ethereum, Solana e mais de 350 moedas com as menores taxas do mercado.
          </p>
        </div>

        {/* Lado Direito: Botão de Conversão */}
        <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
          <a
            href={referralUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#f0b90b',
              color: '#0b0e11',
              fontWeight: 700,
              fontSize: '15px',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(240, 185, 11, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fcd535';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f0b90b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cadastrar na Binance agora &rarr;
          </a>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#848e9c' }}>
            ID de Indicação: <strong style={{ color: '#f0b90b' }}>{referralId}</strong>
          </div>
        </div>
      </div>
    </aside>
  );
};