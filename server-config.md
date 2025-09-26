# PotalNews - Configuração do Servidor

## Problema: Access Denied (403)

Este erro pode ocorrer por várias razões. Siga os passos abaixo para resolver:

### 1. Verificar Permissões de Arquivo

**Para sistemas Linux/Unix:**
```bash
# Dar permissões corretas aos arquivos
chmod 644 *.js *.json *.md *.html *.css
chmod 755 . api/ client/ uploads/
chmod +x index.js app.js

# Para arquivos específicos do Node.js
chmod 755 index.js app.js
```

**Para Windows/XAMPP:**
- Verifique se o Apache tem permissão para ler os arquivos
- Certifique-se de que não há restrições de firewall

### 2. Configurações do Apache/OpenLiteSpeed

#### Apache (.htaccess já criado)
O arquivo `.htaccess` foi criado com as configurações necessárias.

#### OpenLiteSpeed
Adicione no painel de controle:
```
Document Root: /caminho/para/o/projeto
Index Files: index.js, index.html
Script Handler: lsnode20 (Node.js 20)
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` com:
```env
NODE_ENV=production
PORT=3000
# Suas outras variáveis...
```

### 4. Verificar se o Node.js está instalado

```bash
node --version
npm --version
```

### 5. Instalar dependências

```bash
npm install
npm run build:full
```

### 6. Testar o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 7. Logs de Debug

Para verificar erros específicos, verifique:
- Logs do Apache: `/var/log/apache2/error.log`
- Logs do OpenLiteSpeed: Panel > Actions > Log Viewer
- Logs do Node.js: `console.log` no terminal

### 8. Configurações de Firewall

Certifique-se de que as portas estão abertas:
- Porta 80 (HTTP)
- Porta 443 (HTTPS)
- Porta 3000 ou PORT especificada

### 9. Estrutura de Arquivos Esperada

```
projeto/
├── index.js (entry point principal)
├── app.js (OpenLiteSpeed)
├── .htaccess (Apache)
├── package.json
├── api/
│   └── index.ts
├── client/
│   └── src/
└── dist/ (após build)
```

### 10. Troubleshooting Comum

**Se ainda houver erro 403:**

1. Verifique se o arquivo `index.js` existe e tem permissões corretas
2. Teste acessar diretamente: `http://seudominio.com/index.js`
3. Verifique se há arquivos `.htaccess` conflitantes em diretórios pai
4. Confirme se o módulo Node.js está ativo no servidor

**Para OpenLiteSpeed especificamente:**
- Vá em Virtual Hosts > Seu Host > General > Index Files
- Adicione: `index.js, index.html`
- Em Script Handler, configure Node.js

**Para desenvolvimento local:**
```bash
npm run dev
# Acesse: http://localhost:5000
```