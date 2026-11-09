# Explicação linha a linha do workflow

O arquivo explicado é `.github/workflows/workflow.yaml`.

```yaml
name: CI/CD - GitHub Pages
```
Define o nome que aparece na lista de execuções do GitHub Actions.

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```
Define os eventos que iniciam o workflow. `push` inicia após envio de commits para `main`. `pull_request` inicia para uma PR cujo destino é `main`.

```yaml
permissions:
  contents: read
```
Define as permissões padrão dos jobs: eles podem ler o conteúdo do repositório. O job de publicação declara abaixo permissões adicionais específicas.

```yaml
concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true
```
Agrupa execuções que usam a mesma referência Git (branch ou referência da PR). Se uma execução nova do grupo começar, cancela a anterior que ainda estiver em andamento.

```yaml
jobs:
```
Inicia a lista de jobs do workflow. Jobs são conjuntos de etapas executados por runners do GitHub Actions.

```yaml
  ci:
    name: Verificar projeto
    runs-on: ubuntu-latest
```
Cria o job identificado internamente como `ci`, com o nome exibido `Verificar projeto`, em um runner Ubuntu mantido pelo GitHub.

```yaml
    steps:
```
Inicia as etapas executadas em sequência pelo job `ci`.

```yaml
      - name: Baixar o código do repositório
        uses: actions/checkout@v4
```
Usa a action oficial `checkout` para disponibilizar no runner os arquivos e o commit que disparou a execução.

```yaml
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
```
Usa `setup-node` para instalar/configurar Node.js versão 22 no runner. O Node é necessário para executar a verificação de sintaxe JavaScript.

```yaml
      - name: Verificar sintaxe do JavaScript
        run: node --check script.js
```
Executa um comando de terminal. `node --check` analisa a sintaxe do arquivo sem executar seu comportamento. O comando retorna erro se encontrar sintaxe inválida, fazendo o job falhar.

```yaml
  deploy:
    name: Publicar no GitHub Pages
    needs: ci
```
Cria o job `deploy`. `needs: ci` exige que o job `ci` termine com sucesso antes do início do deploy.

```yaml
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```
Restringe o deploy a eventos `push` na referência da branch `main`. A condição exclui eventos de PR e outros tipos de execução.

```yaml
    runs-on: ubuntu-latest
```
Executa o job de publicação em um runner Ubuntu.

```yaml
    permissions:
      contents: read
      pages: write
      id-token: write
```
Define as permissões necessárias para este job: leitura do conteúdo do repositório, publicação no Pages e emissão de um token de identidade usado pelo processo seguro de deploy.

```yaml
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
```
Associa o job ao ambiente `github-pages`. A URL do ambiente é preenchida com o endereço retornado pela etapa identificada como `deployment`.

```yaml
    steps:
```
Inicia as etapas do job de deploy, executadas em sequência.

```yaml
      - name: Baixar o código do repositório
        uses: actions/checkout@v4
```
Baixa os arquivos do commit que será publicado para o runner.

```yaml
      - name: Configurar GitHub Pages
        uses: actions/configure-pages@v5
```
Prepara a configuração do GitHub Pages para a publicação feita pelo workflow.

```yaml
      - name: Preparar arquivos estáticos para publicação
        uses: actions/upload-pages-artifact@v3
        with:
          path: .
```
Empacota e envia como artefato de Pages os arquivos a partir de `.` (a raiz do repositório). Não há comando de build porque o site já é estático.

```yaml
      - name: Publicar no GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
Usa a action de deploy para publicar no GitHub Pages o artefato preparado na etapa anterior. `id: deployment` permite referenciar saídas desta etapa, como a URL do site usada no ambiente.
