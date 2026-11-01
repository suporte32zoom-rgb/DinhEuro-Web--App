# 🚀 DinhEuro - Guia Definitivo de CI/CD, Git Webhook & Deploy na Hostinger

Este documento atua como o manual oficial de engenharia DevOps e Frontend para garantir que todas as atualizações do portal **DinhEuro** (cotações ao vivo, dupla conversão USD/BRL, banner da Binance, LGPD, PWA e portfólio) cheguem em tempo real ao **GitHub** e reflitam instantaneamente na **Hostinger**.

---

## 🔍 1. Diagnóstico do Problema Raiz: Por que o Deploy Não Atualizava?

Haviam 3 fatores combinados que impediam as atualizações de chegarem à produção:

1. **A pasta `dist/` estava bloqueada no `.gitignore`**:
   - Por padrão de templates React, a pasta `dist/` vinha ignorada pelo Git.
   - Quando o desenvolvedor rodava `npm run build` e dava `git commit`, o Git ignorava os novos arquivos compilados.
   - O GitHub recebia o código-fonte, mas **não recebia a nova pasta `dist/`**.
   - Como o Git Deployment da Hostinger faz apenas `git pull` de arquivos (e não executa build Node.js automático na hospedagem compartilhada), a Hostinger ficava servindo a versão antiga de semanas atrás.

2. **Conflito entre `vite.config.js` e `vite.config.ts`**:
   - O arquivo `vite.config.js` continha aliases divergentes (`@` para `./src` em vez de `.`) e `sourcemap: true`, inflando o bundle e causando inconsistências no empacotamento.
   - Ambos os arquivos foram sincronizados com `emptyOutDir: true` para que a cada build a pasta `dist/` seja 100% limpa e recriada com hashes únicos de cache-busting.

3. **Cache de Borda da Hostinger (LiteSpeed Cache & Browser Cache)**:
   - Sem cabeçalhos restritivos de no-cache para o `index.html`, os servidores LiteSpeed da Hostinger mantinham o HTML antigo em cache, fazendo os usuários continuarem baixando os JS antigos.

---

## 🛠️ 2. O Que Foi Corrigido na Estrutura do Projeto

1. **`.gitignore` Atualizado**:
   - A pasta `dist/` **NÃO está mais ignorada**. Agora ela é rastreada e versionada, garantindo que o GitHub e a Hostinger recebam os arquivos finais compilados a cada commit.

2. **`vite.config.ts` e `vite.config.js` Otimizados**:
   - `emptyOutDir: true`: Garante que arquivos órfãos de builds anteriores sejam deletados antes de gerar novos.
   - `sourcemap: false`: Remove arquivos pesados `.map` da produção, tornando o push e o deploy ultra-rápidos.
   - `rollupOptions`: Saída de arquivos com hash criptográfico (`assets/[name]-[hash].js` e `.css`), forçando a atualização imediata no navegador do usuário.

3. **`public/.htaccess` e `dist/.htaccess` Reforçados**:
   - Cabeçalhos `Cache-Control: no-cache, no-store, must-revalidate` para `index.html`, `sw.js` e `manifest.json`.
   - Regras de roteamento SPA para que rotas como `/termos-de-uso`, `/politica-de-privacidade` e `/disclaimer` nunca deem erro 404.

4. **Novo Workflow de CI/CD (`.github/workflows/deploy.yml`)**:
   - Valida automaticamente o build a cada push no GitHub para garantir zero erros em produção.

---

## 📋 3. Fluxo Exato de Publicação (Passo a Passo)

### Passo 1: Gerar a Build Limpa no seu Computador
Sempre que fizer alterações no código (App, componentes, cotações, banners), execute no terminal:
```bash
# 1. Compilar os arquivos dinâmicos e limpar a pasta dist
npm run build:clean
```
Isso executará a limpeza de arquivos antigos e compilará todos os componentes com novos hashes em `dist/`.

### Passo 2: Commitar e Enviar ao GitHub
```bash
git add .
git commit -m "feat: atualizacoes do portal DinhEuro e build de producao"
git push origin main
```
Agora o GitHub receberá tanto o código-fonte quanto a pasta `dist/` atualizada!

---

## 🌐 4. Como Configurar a Hostinger (Webhook & Publicação Automática)

Na Hostinger, você possui duas formas recomendadas para servir a aplicação:

### Opção 1 (Recomendada): Repositório Git com Webhook Automático no hPanel
1. Acesse o **hPanel da Hostinger** ([hpanel.hostinger.com](https://hpanel.hostinger.com)).
2. Vá no seu domínio > Seção **Avançado** > Clique em **Git**.
3. Se já tiver um repositório configurado:
   - **Branch**: `main`
   - **Diretório de Instalação**: Deixe vazio (raiz `/`) ou aponte para `public_html`.
4. Copie a **URL do Webhook** fornecida pela Hostinger (ex: `https://webhook.site/hostinger-deploy...`).
5. No seu repositório no **GitHub**:
   - Vá em **Settings** > **Webhooks** > Clique em **Add webhook**.
   - No campo **Payload URL**, cole a URL copiada da Hostinger.
   - **Content type**: selecione `application/json`.
   - **Which events would you like to trigger this webhook?**: `Just the push event`.
   - Clique em **Add webhook**.
6. Agora, a cada `git push`, a Hostinger executará o `git pull` instantaneamente!

> **Configuração do Document Root na Hostinger**:
> Se o repositório estiver na raiz e o build estiver na pasta `dist/`:
> - No hPanel, vá em **Sites** > Selecione o domínio > **Configurações do Site** ou **Redirecionamentos / Document Root**.
> - Certifique-se de que o diretório público do domínio aponta para a pasta onde os arquivos `index.html` e `assets/` estão instalados (por exemplo, `public_html/dist` ou copiados para `public_html`).

---

### Opção 2: Envio Direto via Gerenciador de Arquivos (FTP / hPanel)
Se preferir publicar manualmente via Gerenciador de Arquivos:
1. Abra o **Gerenciador de Arquivos** no hPanel.
2. Navegue até a pasta `public_html/`.
3. Selecione e delete os arquivos antigos (ou mova para backup).
4. Envie o conteúdo interno da pasta `dist/` (o arquivo `index.html`, a pasta `assets/`, o arquivo `.htaccess`, ícones e manifest).
5. Pronto! O site estará imediatamente no ar.

---

## 🧹 5. Procedimento para Limpar o Cache e Forçar Atualização Imediata

Se você fez o deploy e o site ainda parece mostrar a versão antiga, siga este checklist:

1. **Limpar o LiteSpeed Cache no hPanel**:
   - No hPanel da Hostinger, procure por **LiteSpeed** ou **Cache Manager**.
   - Clique em **Purgar Tudo** (Flush All / Purge Cache).

2. **Limpar o Cache do Navegador**:
   - No navegador, aperte `Ctrl + Shift + R` (Windows/Linux) ou `Cmd + Shift + R` (Mac) para recarregar sem cache.
   - No modo Mobile / PWA, feche a aba ou acesse em aba anônima para confirmar o carregamento da nova versão.

3. **Verificar o Service Worker do PWA**:
   - Como o DinhEuro possui PWA com Service Worker (`sw.js`), ele atualiza em segundo plano. O `.htaccess` foi configurado especificamente para que o `sw.js` nunca fique preso em cache.
