# Estrutura do workflow

O arquivo `.github/workflows/workflow.yaml` automatiza a verificação do projeto e, quando o código chega à branch `main`, a publicação no GitHub Pages.

## Fluxo

1. O workflow inicia em um `push` para `main` ou quando um Pull Request tem `main` como branch de destino.
2. O job `ci` baixa o repositório, configura Node.js e verifica a sintaxe de `script.js` com `node --check`.
3. O job `deploy` depende do sucesso do `ci`. Ele prepara e publica os arquivos estáticos no GitHub Pages somente em um `push` para `main`.

## Decisões e pontos positivos

- **Uma verificação adequada ao projeto:** `node --check script.js` detecta erros de sintaxe sem executar a aplicação no navegador.
- **Sem instalação de dependências:** o repositório não contém `package.json` ou outro manifesto de pacotes. O projeto usa HTML, CSS e JavaScript estáticos, então não há dependências locais para instalar. O Node.js é configurado para executar a verificação.
- **Pull Requests são verificados:** uma PR direcionada a `main` executa o CI. O deploy fica restrito a `push` em `main`, que normalmente ocorre após o merge; assim, uma PR ainda não integrada não publica sobre o site.
- **Deploy condicionado ao CI:** `needs: ci` impede a publicação se a verificação falhar.
- **Permissões delimitadas:** o workflow tem leitura do conteúdo por padrão, e o job de deploy recebe as permissões específicas de Pages e identidade necessárias para publicar.
- **Artefato estático:** o conteúdo do repositório é enviado ao GitHub Pages sem etapa de build, coerente com o formato atual do site.

## Itens para revisar/aprovar

- **Configuração do Pages no repositório:** em *Settings → Pages*, a origem de publicação precisa estar configurada como **GitHub Actions**. Caso esteja configurada para uma branch, este workflow não será a origem ativa do deploy.
- **Verificação escolhida:** `node --check` valida somente a sintaxe de `script.js`; não valida HTML/CSS, links, imagens ou comportamento visual. Confirme que esse nível atende à atividade.
- **Conteúdo publicado:** o artefato inclui os arquivos rastreados e também o diretório `.github`. Se desejar limitar a publicação aos arquivos do site, será necessário definir explicitamente esse conjunto de caminhos.

## Observações de escopo

O repositório está na branch `main`, que é a branch usada pelos gatilhos definidos. O job de deploy não é executado para eventos de Pull Request; a PR passa pelo CI e a publicação ocorre quando a alteração é enviada à `main`.
