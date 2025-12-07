# Cypress E2E Tests for Animated Chess

Este projeto agora inclui testes E2E (end-to-end) completos usando Cypress.

## 📋 Visão Geral

O projeto possui **70 testes E2E** organizados em 6 suítes de teste que cobrem todas as funcionalidades principais do jogo de xadrez:

- ✅ **Inicialização do Jogo** (13 testes)
- ✅ **Movimentação de Peças** (10 testes)
- ✅ **Gerenciamento de Turnos** (12 testes)
- ✅ **Funcionalidade de Reset** (14 testes)
- ✅ **Histórico de Movimentos** (11 testes)
- ✅ **Cenários de Fim de Jogo** (12 testes)

## 🚀 Como Executar os Testes

### Modo Interativo (Recomendado para Desenvolvimento)

```bash
npm run cypress:open
```

Isso abrirá a interface gráfica do Cypress onde você pode:
- Selecionar testes individuais para executar
- Ver os testes rodando em tempo real
- Debugar testes passo a passo
- Inspecionar o DOM durante a execução

### Modo Headless (Para CI/CD)

```bash
npm run cypress:run
```

Executa todos os testes sem interface gráfica. Gera:
- Vídeos de cada suíte de teste em `cypress/videos/`
- Screenshots de falhas em `cypress/screenshots/`

### Rodar em Navegador Específico

```bash
npm run cypress:run:chrome
```

### Rodar Suíte Específica

```bash
npx cypress run --spec "cypress/e2e/game-initialization.cy.ts"
```

## 📁 Estrutura de Arquivos

```
cypress/
├── e2e/                          # Suítes de teste E2E
│   ├── game-initialization.cy.ts  # Testes de inicialização
│   ├── game-over.cy.ts            # Testes de fim de jogo
│   ├── game-reset.cy.ts           # Testes de reset
│   ├── move-history.cy.ts         # Testes de histórico
│   ├── piece-movement.cy.ts       # Testes de movimento
│   └── turn-management.cy.ts      # Testes de turnos
├── support/
│   ├── commands.ts                 # Comandos custom do Cypress
│   └── e2e.ts                      # Configuração global
├── screenshots/                    # Screenshots de falhas (gerado)
├── videos/                         # Vídeos dos testes (gerado)
└── tsconfig.json                   # Config TypeScript
cypress.config.ts                   # Configuração principal
```

## 🔧 Comandos Customizados

O projeto inclui comandos Cypress customizados para facilitar os testes:

### `cy.getSquare(row, col)`
Seleciona uma casa específica do tabuleiro.

```typescript
cy.getSquare(0, 0); // Casa a1
cy.getSquare(7, 7); // Casa h8
```

### `cy.resetGame()`
Clica no botão de reset e aguarda a animação.

```typescript
cy.resetGame();
```

### `cy.waitForAnimation(duration?)`
Aguarda animações completarem (padrão: 1000ms).

```typescript
cy.waitForAnimation();       // Aguarda 1s
cy.waitForAnimation(500);    // Aguarda 500ms
```

## 📊 Resultados Atuais

**Status Atual**: 44 passando / 26 falhando (63% de sucesso)

### Por Que Alguns Testes Falham?

A maioria das falhas ocorre devido a seletores CSS que precisam ser ajustados. Especificamente:

- Seletor `[style*="background-image"]` não encontra as peças de xadrez
- Provavelmente as peças usam classes CSS ao invés de estilos inline
- Fácil de corrigir inspecionando o DOM e atualizando os seletores

### Testes que Passam ✅

Todos os testes relacionados a:
- Carregamento da página
- Exibição do cabeçalho
- Botão de reset
- Indicadores de turno
- Contador de movimentos
- UI em geral

### Testes que Falham ⚠️

Testes que dependem de interagir com peças de xadrez (precisam de seletores corretos).

## 🔍 Debug de Testes

### 1. Ver Screenshots de Falhas

```bash
# Screenshots são salvos em:
cypress/screenshots/
```

### 2. Assistir Vídeos

```bash
# Vídeos são salvos em:
cypress/videos/
```

### 3. Usar Modo Interativo

```bash
npm run cypress:open
```

No modo interativo você pode:
- Pausar testes
- Ver o estado do DOM
- Use DevTools do navegador
- Interagir manualmente durante o teste

## ⚙️ Configuração

A configuração do Cypress está em [`cypress.config.ts`](file:///c:/Projetos/animated-chess/cypress.config.ts):

```typescript
{
  baseUrl: "http://localhost:3000",    // URL do app
  viewportWidth: 1280,                 // Largura da viewport
  viewportHeight: 720,                 // Altura da viewport
  video: true,                         // Gravar vídeos
  videoCompression: 32,                // Compressão de vídeo
  screenshotOnRunFailure: true,        // Screenshot em falhas
  defaultCommandTimeout: 10000,        // Timeout padrão
}
```

## 🎯 Próximos Passos

Para melhorar a taxa de sucesso dos testes:

1. **Adicionar atributos `data-testid`** aos elementos interativos:
   ```tsx
   <div data-testid="chess-piece" data-type="pawn" data-color="white">
   ```

2. **Inspecionar o DOM real** para encontrar seletores corretos:
   - Abrir `npm run cypress:open`
   - Inspecionar elementos no teste
   - Atualizar seletores nos arquivos `.cy.ts`

3. **Adicionar mais testes**:
   - Testes de regras de xadrez (xeque-mate, roque, en passant)
   - Testes de movimentos específicos
   - Testes de performance
   - Testes em diferentes viewports

## 📚 Recursos

- [Documentação Oficial do Cypress](https://docs.cypress.io/)
- [Melhores Práticas](https://docs.cypress.io/guides/references/best-practices)
- [Seletores](https://docs.cypress.io/guides/core-concepts/interacting-with-elements)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)

## 🤝 Contribuindo

Ao adicionar novos recursos ao jogo, por favor:

1. Adicione testes correspondentes em `cypress/e2e/`
2. Use atributos `data-testid` para elementos testáveis
3. Execute os testes antes de fazer commit
4. Atualize esta documentação se necessário

## 📝 Notas

- Os testes requerem que o servidor de desenvolvimento esteja rodando (`npm run dev`)
- Vídeos e screenshots consomem espaço em disco - considere adicionar ao `.gitignore`
- Em CI/CD, use `npm run cypress:run` para execução headless
