# 🎮 Animated Chess

Um jogo de xadrez moderno e interativo com animações fluidas e uma interface elegante, construído com React e TypeScript.

![Chess Game Preview](public/preview.png)

## ✨ Características

- 🎨 Interface moderna e responsiva
- 🎭 Animações fluidas para todas as peças
- 🎯 Validação de movimentos em tempo real
- 📱 Design responsivo para todos os dispositivos
- 🏆 Sistema de pontuação

## 🚀 Tecnologias

- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animações
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Next.js](https://nextjs.org/) - Framework React para produção

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/animated-chess.git
```

2. Instale as dependências:

```bash
cd animated-chess
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎮 Como Jogar

1. Selecione uma peça clicando nela
2. As casas válidas para movimento serão destacadas
3. Clique na casa desejada para mover a peça
4. O jogo alterna automaticamente entre os jogadores
5. Capture peças adversárias movendo para suas casas
6. O objetivo é dar xeque-mate ao rei adversário

## 🎨 Animações

O jogo inclui várias animações para tornar a experiência mais imersiva:

- **Idle**: Peças com animação suave de respiração
- **Walk**: Movimento fluido ao trocar de posição
- **Attack**: Animação de ataque ao capturar peças
- **Hit**: Efeito visual quando uma peça é atacada
- **Death**: Animação de desaparecimento quando capturada

## 📱 Responsividade

O jogo é totalmente responsivo e funciona em:

- Desktop
- Tablet
- Smartphone
- Orientação paisagem e retrato

## 🧪 Testes E2E

O projeto inclui **70 testes E2E** usando Cypress que cobrem todas as funcionalidades principais:

```bash
# Executar testes em modo interativo
npm run cypress:open

# Executar testes em modo headless
npm run cypress:run
```

Cobertura de testes:
- ✅ Inicialização do jogo (13 testes)
- ✅ Movimentação de peças (10 testes)
- ✅ Gerenciamento de turnos (12 testes)
- ✅ Sistema de reset (14 testes)
- ✅ Histórico de movimentos (11 testes)
- ✅ Cenários de fim de jogo (12 testes)

Para mais informações, consulte [cypress/README.md](cypress/README.md).


## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT

## 👥 Autores

- José Trovarelli Neto - [@Trovarelli](https://github.com/Trovarelli)

## 🙏 Agradecimentos

- [Chess.com](https://www.chess.com/) pela inspiração
- [Framer Motion](https://www.framer.com/motion/) pelas animações
- [Tailwind CSS](https://tailwindcss.com/) pelo design

---

⭐️ Se você gostou do projeto, não se esqueça de dar uma estrela!
