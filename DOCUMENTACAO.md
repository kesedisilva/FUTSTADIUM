# Caderno de Jogos — Documentação

Documento completo do sistema: o que ele faz, como rodar, o que cada tela entrega, o que vai para o banco e de onde cada dado vem.

---

## 1. O que é o sistema

Um registro pessoal dos jogos de futebol que você foi assistir **no estádio**. Você cadastra cada ida e o sistema transforma esses registros em retrospecto de vitórias, empates e derrotas, aproveitamento, estádios visitados e gasto com ingressos.

Cada pessoa tem a própria conta e o próprio time do coração. Os dados de uma conta nunca aparecem para outra.

A inspiração é o aplicativo Futbology, reduzido ao essencial. De lá vêm a ideia de arquivo pessoal do torcedor e o acompanhamento ao longo do tempo. Ficaram de fora as duas coisas que o tornariam pesado: a base mundial de estádios e a integração com resultados reais. Aqui tudo é digitado por você, escolhendo de listas já prontas no banco.

---

## 2. Como rodar

### Pré-requisito

Apenas o **Node 24 ou superior**. Para conferir:

```
node --version
```

Se o comando não for reconhecido, instale em [nodejs.org](https://nodejs.org). Não precisa de Docker, banco de dados instalado, nem nada além disso.

### Subindo com um comando

Abra o terminal **dentro da pasta do projeto** — aquela onde está o arquivo `dev.bat` — e rode:

```
.\dev.bat
```

No PowerShell o prefixo `.\` é obrigatório. No Prompt de Comando basta `dev.bat`.

Três maneiras de abrir o terminal já na pasta certa:

- No Explorador de Arquivos, entre na pasta do projeto, clique na barra de endereço, digite `powershell` e pressione Enter.
- Ou clique com o botão direito dentro da pasta e escolha "Abrir no Terminal".
- Ou, se preferir navegar na mão, use `cd` com o caminho onde você salvou o projeto.

Também funciona dando **dois cliques** no `dev.bat` pelo Explorador de Arquivos, sem terminal nenhum.

O `dev.bat` faz quatro coisas em sequência:

1. Confere se o Node existe e avisa se não existir
2. Roda `npm install` se a pasta `node_modules` não estiver lá
3. Cria o banco com os dados de exemplo se `data/caderno.db` não existir
4. Sobe o servidor de desenvolvimento

Quando terminar, ele imprime:

```
  Caderno de Jogos
  http://localhost:3000
  Ctrl+C para encerrar
```

### O endereço

**http://localhost:3000**

Para encerrar, `Ctrl+C` no terminal.

### Entrando

A conta de exemplo já vem criada:

| Campo | Valor |
|---|---|
| E-mail | `torcedor@exemplo.com` |
| Senha | `123456` |
| Time | Corinthians |

Ou crie a sua em **http://localhost:3000/cadastro**.

### Passo a passo manual

Se preferir rodar cada etapa separadamente:

```
npm install
npm run seed
npm run dev
```

### Comandos disponíveis

| Comando | O que faz |
|---|---|
| `.\dev.bat` | Faz tudo e sobe o servidor |
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run seed` | Cria o banco com os dados de exemplo (não faz nada se já houver dados) |
| `npm test` | Roda os 57 testes automatizados |
| `npm run build` | Gera a versão de produção |
| `npm start` | Sobe a versão de produção (precisa do build antes) |

---

## 3. As telas

São dez páginas. As quatro primeiras exigem login; as demais são públicas.

### 3.1 Painel — `/`

A tela inicial depois do login. Mostra quatro indicadores grandes no topo:

| Indicador | O que é | De onde vem |
|---|---|---|
| **Jogos** | Quantas idas ao estádio você registrou | Contagem das linhas de `matches` da sua conta |
| **Aproveitamento** | Percentual dos pontos possíveis | `(3 × vitórias + empates) ÷ (3 × jogos)`, calculado na leitura |
| **Estádios** | Quantos estádios diferentes você visitou | Estádios distintos entre os seus jogos |
| **Gasto** | Soma de todos os ingressos, com a média por jogo abaixo | Soma de `ticket_price`, dividida pelo total de jogos |

Abaixo, o **Retrospecto**: os números de vitórias, empates e derrotas em verde, amarelo e vermelho, com uma barra proporcional entre os três. Ao lado, a lista de **Estádios visitados** com quantas vezes você foi em cada um, ordenada da mais visitada para a menos.

Se você ainda não tem jogos, a tela mostra um convite para cadastrar o primeiro.

### 3.2 Jogos — `/jogos`

O histórico completo, do jogo mais recente para o mais antigo. Cada linha traz data, placar no formato do placar eletrônico, badge colorido com o resultado, estádio com cidade, campeonato e o preço do ingresso, mais os botões de **Editar** e **Excluir**.

Em telas com menos de 1080px de largura, cada linha vira um cartão empilhado com os rótulos ao lado dos valores, para não precisar rolar a tabela para o lado.

Excluir pede confirmação antes.

### 3.3 Novo jogo — `/jogos/novo`

O formulário de cadastro. Sete campos:

| Campo | Tipo | Observação |
|---|---|---|
| Data do jogo | seletor de data | Não aceita data no futuro |
| Campeonato | seleção | Brasileirão, Paulista, Copa do Brasil ou Libertadores |
| Adversário | seleção | Lista todos os times menos o seu |
| Mando de campo | Em casa / Fora | Define de que lado o seu time entra |
| Placar | dois campos numéricos | Mandante à esquerda, de 0 a 99 |
| Estádio | seleção | Já vem preenchido com o estádio do mandante |
| Preço do ingresso | texto com máscara | Digitando `9000` aparece `R$ 90,00` |

Três comportamentos que o formulário faz sozinho:

- **Os nomes dos times trocam de lado** no placar quando você alterna entre "Em casa" e "Fora", e os gols já digitados trocam junto.
- **O estádio é sugerido automaticamente**: em casa, o seu; fora, o do adversário. Você pode trocar se o jogo foi em campo neutro.
- **Você nunca escolhe o seu próprio time** como adversário, porque ele não aparece na lista.

Todos os campos são obrigatórios e são validados duas vezes: o navegador impede o envio e o servidor recusa de novo. Isso importa porque validação só no navegador se contorna em segundos.

### 3.4 Editar jogo — `/jogos/[id]/editar`

O mesmo formulário, já preenchido com os dados do jogo. Só abre para jogos da sua própria conta — tentar abrir o jogo de outra pessoa responde "não encontrado".

### 3.5 Perfil — `/perfil`

Duas seções:

**Time do coração** — troca o time que você torce. Vale para os jogos que você cadastrar daqui em diante; os já registrados não mudam (veja a seção 5.3).

**Trocar senha** — pede a senha atual, a nova e a confirmação. A senha atual é conferida antes de qualquer alteração.

### 3.6 Entrar — `/login`

E-mail e senha, com botão de olho para mostrar ou ocultar a senha. Links para criar conta e para "Esqueci minha senha".

### 3.7 Criar conta — `/cadastro`

Nome, e-mail, senha, confirmação da senha e time do coração. Os dois campos de senha têm o botão de olho, cada um independente do outro.

Ao criar a conta você já entra logado.

### 3.8 Esqueci minha senha — `/esqueci-senha`

Você informa o e-mail e o sistema gera um link de redefinição. A resposta é sempre a mesma, exista a conta ou não: *"Se esse e-mail estiver cadastrado, enviamos um link de redefinição."* Isso impede que alguém descubra quais e-mails estão cadastrados testando um por um.

### 3.9 Caixa de entrada — `/caixa-de-entrada`

**Esta tela é uma simulação.** O projeto roda só na sua máquina e não envia e-mail de verdade. Em vez de enviar, ele grava a mensagem no banco e mostra aqui, com o botão para abrir o link de redefinição.

Num sistema real essa tela não existiria: o lugar dela seria o seu provedor de e-mail. Ela é pública e sem login de propósito — quem esqueceu a senha não conseguiria chegar nela de outro jeito.

### 3.10 Nova senha — `/redefinir-senha?token=...`

Aberta pelo link da caixa de entrada. Pede a nova senha e a confirmação. Se o link estiver sem token, expirado ou já usado, a tela avisa e pede um novo.

---

## 4. As funcionalidades

### Cadastro e sessão

Qualquer pessoa cria conta escolhendo nome, e-mail, senha e time. A senha nunca é guardada como você digitou: o sistema gera um **hash com `scrypt`** e um sal aleatório diferente para cada senha. Nem quem abrir o arquivo do banco consegue ler as senhas.

Depois do login, a sessão é um **cookie assinado**, marcado como `httpOnly` (o JavaScript da página não consegue lê-lo) e `sameSite: lax`. O cookie guarda o seu id e uma assinatura HMAC; alterar o id invalida a assinatura e o sistema recusa.

### Registro de jogos

Criar, listar, editar e excluir. Todo jogo pertence a uma conta, e **toda consulta ao banco filtra pelo dono**. Não existe caminho pelo qual um usuário leia ou altere o jogo de outro.

### Estatísticas

Calculadas na hora da leitura, nunca gravadas. Isso significa que não existe a possibilidade de o painel discordar dos jogos: se os números batem, é porque saem dos mesmos dados.

### Recuperação de senha

Fluxo completo com token de uso único e validade de 30 minutos. Detalhado na seção 6.

---

## 5. O banco de dados

### Onde fica

Um arquivo único: **`data/caderno.db`**. É SQLite, lido pelo módulo `node:sqlite`, que já vem dentro do Node 24 — não há banco instalado nem serviço rodando.

Apagar esse arquivo apaga tudo. Rodar `npm run seed` depois recria com os dados de exemplo.

### Como olhar o conteúdo

```
node --input-type=module -e "const {default:db}=await import('./lib/db.js');console.table(db.prepare('SELECT * FROM matches').all())"
```

Troque `matches` pelo nome de qualquer tabela.

### As sete tabelas

#### `stadiums` — estádios

| Coluna | Tipo | De onde vem |
|---|---|---|
| `id` | INTEGER | Automático |
| `name` | TEXT | Semeado por `scripts/seed.js` |
| `city` | TEXT | Semeado |

61 estádios. **Você nunca cadastra um estádio** — eles já vêm prontos e você só escolhe da lista. É isso que garante que o contador de estádios visitados esteja certo: se o nome fosse digitado, "Neo Química Arena" e "Neo Quimica Arena" virariam dois estádios diferentes e o número principal do painel passaria a mentir.

#### `teams` — times

| Coluna | Tipo | De onde vem |
|---|---|---|
| `id` | INTEGER | Automático |
| `name` | TEXT | Semeado |
| `stadium_id` | INTEGER | Semeado, aponta para `stadiums` |

63 times: os 20 da Série A, clubes da Série B, os paulistas que não estão nas duas, e os sul-americanos que costumam aparecer na Libertadores. Cada um aponta para o seu estádio, e é daí que sai a sugestão automática no formulário.

#### `competitions` — campeonatos

| Coluna | Tipo | De onde vem |
|---|---|---|
| `id` | INTEGER | Automático |
| `name` | TEXT | Semeado |

Quatro: Brasileirão, Paulista, Copa do Brasil e Libertadores.

#### `users` — contas

| Coluna | Tipo | De onde vem |
|---|---|---|
| `id` | INTEGER | Automático |
| `name` | TEXT | Digitado no cadastro |
| `email` | TEXT | Digitado no cadastro, único, guardado em minúsculas |
| `password_hash` | TEXT | Gerado a partir da senha com `scrypt`, no formato `sal:hash` |
| `team_id` | INTEGER | Escolhido no cadastro, alterável no perfil |
| `created_at` | TEXT | Preenchido pelo banco |

#### `matches` — os jogos

| Coluna | Tipo | De onde vem |
|---|---|---|
| `id` | INTEGER | Automático |
| `user_id` | INTEGER | Da sessão de quem está logado, nunca do formulário |
| `supported_team_id` | INTEGER | Cópia do time do usuário **no momento do cadastro** |
| `match_date` | TEXT | Do formulário, no formato `AAAA-MM-DD` |
| `competition_id` | INTEGER | Seleção do formulário |
| `home_team_id` | INTEGER | Calculado pelo servidor a partir do adversário e do mando |
| `away_team_id` | INTEGER | Idem |
| `home_score` | INTEGER | Do formulário, 0 a 99 |
| `away_score` | INTEGER | Do formulário, 0 a 99 |
| `stadium_id` | INTEGER | Seleção do formulário |
| `ticket_price` | REAL | Do formulário, com a máscara removida (`R$ 1.250,50` vira `1250.5`) |
| `created_at` | TEXT | Preenchido pelo banco |

Apagar uma conta apaga os jogos dela junto, por `ON DELETE CASCADE`.

#### `password_resets` — pedidos de recuperação

| Coluna | Tipo | De onde vem |
|---|---|---|
| `id` | INTEGER | Automático |
| `user_id` | INTEGER | Conta que pediu |
| `token_hash` | TEXT | **Hash SHA-256** do token; o token em si nunca é gravado |
| `expires_at` | INTEGER | Momento do pedido mais 30 minutos |
| `used_at` | TEXT | Preenchido quando o link é usado ou invalidado |
| `created_at` | TEXT | Preenchido pelo banco |

#### `emails` — caixa de entrada simulada

| Coluna | Tipo | De onde vem |
|---|---|---|
| `id` | INTEGER | Automático |
| `recipient` | TEXT | E-mail da conta |
| `subject` | TEXT | Montado pelo servidor |
| `body` | TEXT | Montado pelo servidor |
| `link` | TEXT | Caminho de redefinição com o token |
| `created_at` | TEXT | Preenchido pelo banco |

Substitui o servidor de e-mail. Em produção essa tabela não existiria.

### 5.1 De onde vem cada dado, em resumo

- **Listas prontas** (estádios, times, campeonatos) vêm do `scripts/seed.js` e nunca são digitadas.
- **Dados seus** (nome, e-mail, senha, time) vêm do cadastro.
- **Jogos** vêm do formulário, mas três campos são decididos pelo servidor: o dono, o time apoiado e quem foi mandante.
- **Números do painel** não vêm de lugar nenhum: são calculados na hora a partir dos jogos.

### 5.2 O que nunca é gravado

**O resultado do jogo.** Não existe coluna de vitória, empate ou derrota. O resultado sai da comparação do placar com o time que você torcia, feita no momento da leitura. Assim é impossível o resultado gravado discordar do placar gravado.

**O total e o aproveitamento.** Saem da soma dos jogos, sempre.

**A senha e o token de recuperação.** Só os hashes vão para o banco.

### 5.3 Por que cada jogo guarda o time que você torcia

Esta é a decisão de modelagem mais importante do sistema.

O time do coração pode ser trocado no perfil. Se o resultado fosse calculado usando o seu time **atual**, trocar de time reescreveria a história: um Palmeiras 3x0 Santos que você viu como palmeirense viraria uma derrota no dia em que você virasse corintiano, e o Palmeiras sumiria de uma partida que ele jogou.

Por isso cada jogo grava, na coluna `supported_team_id`, o time que você torcia **naquele momento**. Trocar de time muda só o padrão dos próximos cadastros. O banco ainda reforça isso com uma trava: `CHECK (supported_team_id IN (home_team_id, away_team_id))` — é impossível gravar um jogo em que o time apoiado não esteja em campo.

---

## 6. Recuperação de senha, passo a passo

1. Em `/esqueci-senha` você informa o e-mail.
2. Se a conta existir, o servidor sorteia um token aleatório de 32 bytes, guarda o **hash** dele em `password_resets` com validade de 30 minutos, e invalida os pedidos anteriores da mesma conta.
3. Em vez de enviar e-mail, grava a mensagem na tabela `emails`.
4. A resposta é sempre genérica, exista a conta ou não.
5. Você abre `/caixa-de-entrada`, encontra a mensagem e clica no link.
6. Em `/redefinir-senha?token=...` você escolhe a nova senha e confirma.
7. O servidor confere o token, marca como usado e grava o novo hash.
8. O mesmo link não funciona uma segunda vez.

**Por que o token vai em hash:** se alguém copiar o arquivo do banco, não consegue redefinir a senha de ninguém — teria o hash, não o token.

---

## 7. Como o sistema é organizado

```
caderno-de-jogos/
├── dev.bat                 sobe tudo com um comando
├── scripts/seed.js         dados de exemplo
├── app/
│   ├── layout.js           barra superior e navegação
│   ├── globals.css         todo o visual do sistema
│   ├── page.js             painel
│   ├── jogos/              lista, cadastro e edição
│   ├── login/ cadastro/ perfil/
│   ├── esqueci-senha/ redefinir-senha/ caixa-de-entrada/
│   └── api/                camada de back
├── components/             formulários e botões do navegador
├── lib/                    banco, validações, regras e consultas
├── data/caderno.db         o banco
└── tests/                  testes automatizados
```

### As três camadas

| Camada | Onde está | Responsabilidade |
|---|---|---|
| **Front** | `app/*/page.js` e `components/` | As telas e os formulários |
| **Back** | `app/api/**/route.js` e `lib/` | Receber a requisição, validar e decidir |
| **Banco** | `lib/db.js`, `lib/matches.js` | O SQL e o arquivo SQLite |

Exemplo do caminho de um cadastro de jogo:

```
components/MatchForm.js     você preenche e envia        FRONT
app/api/matches/route.js    recebe o POST                BACK
lib/matchInput.js           converte e valida os campos  BACK
lib/matches.js              monta e executa o INSERT     BANCO
app/jogos/page.js           mostra na lista              FRONT
```

Nenhum SQL existe fora de `lib/`. Toda consulta de jogo filtra pelo usuário da sessão.

### Arquivos de `lib/`

| Arquivo | Responsabilidade |
|---|---|
| `db.js` | Abre o SQLite, cria as tabelas e liga as chaves estrangeiras |
| `matches.js` | Todo o SQL de jogos, sempre com escopo de usuário |
| `matchInput.js` | Converte o formulário em campos do banco e valida |
| `matchResult.js` | Decide vitória, empate ou derrota |
| `stats.js` | Soma os números do painel |
| `validation.js` | Valida data, placar, preço e ids |
| `password.js` | Gera e confere o hash da senha |
| `passwordRules.js` | Regras de tamanho e confirmação |
| `passwordReset.js` | Tokens de recuperação e caixa de entrada |
| `session.js` | Lê e grava o cookie de sessão |
| `sessionToken.js` | Assina e confere o conteúdo do cookie |
| `format.js` | Formata dinheiro e data para exibição |

---

## 8. Referência das rotas

### Páginas

| Rota | Tela | Precisa login |
|---|---|---|
| `/` | Painel | sim |
| `/jogos` | Lista de jogos | sim |
| `/jogos/novo` | Cadastrar jogo | sim |
| `/jogos/[id]/editar` | Editar jogo | sim |
| `/perfil` | Time do coração e troca de senha | sim |
| `/login` | Entrar | não |
| `/cadastro` | Criar conta | não |
| `/esqueci-senha` | Pedir link de redefinição | não |
| `/caixa-de-entrada` | Caixa de entrada simulada | não |
| `/redefinir-senha` | Definir nova senha | não |

Quem não está logado e tenta abrir uma página protegida é mandado para `/login`.

### API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/matches` | Lista os seus jogos |
| POST | `/api/matches` | Cadastra um jogo |
| GET | `/api/matches/[id]` | Abre um jogo seu |
| PUT | `/api/matches/[id]` | Edita um jogo seu |
| DELETE | `/api/matches/[id]` | Exclui um jogo seu |
| GET | `/api/stats` | Números do painel |
| GET | `/api/catalog` | Times, estádios e campeonatos |
| POST | `/api/auth/register` | Cria conta e já entra |
| POST | `/api/auth/login` | Entra |
| POST | `/api/auth/logout` | Sai |
| POST | `/api/auth/forgot` | Pede link de redefinição |
| POST | `/api/auth/reset` | Redefine a senha pelo link |
| PUT | `/api/profile` | Troca o time do coração |
| PUT | `/api/profile/password` | Troca a senha |

Toda rota responde **401** sem sessão, **400** com dados inválidos (acompanhado da lista de erros) e **404** quando o jogo pertence a outra conta.

---

## 9. Validações

| Campo | Regra |
|---|---|
| Data do jogo | Obrigatória, formato válido, nunca no futuro |
| Placar | Obrigatório, só dígitos, de 0 a 99 |
| Preço | Obrigatório, aceita zero, nunca negativo; aceita `1.250,50`, `1250,50` e `1250.50` |
| Adversário | Obrigatório e diferente do time que você torcia no jogo |
| Campeonato e estádio | Obrigatórios e precisam existir no banco |
| E-mail | Obrigatório, formato válido, não pode repetir |
| Senha | Mínimo de 6 caracteres e igual à confirmação |
| Senha atual | Confere contra o hash antes de permitir a troca |

Todas valem **nos dois lados**: o navegador impede e o servidor recusa de novo.

---

## 10. O visual

Fundo preto, texto claro e verde-limão nos destaques. Tipografia Archivo nos títulos e números, Inter no corpo. Vitória em verde, empate em amarelo e derrota em vermelho, sempre nas mesmas cores em toda a aplicação.

As fontes são baixadas na primeira compilação e ficam embutidas no projeto. Depois disso, o sistema não depende de internet para nada.

**Responsividade:** todas as telas se adaptam de 320px até 1920px, sem rolagem lateral em lugar nenhum. A barra de navegação quebra em linhas no celular, as tabelas viram cartões empilhados abaixo de 1080px, os números grandes encolhem conforme a largura e o placar do formulário empilha em telas estreitas.

---

## 11. O que foi testado

**57 testes automatizados** (`npm test`), cobrindo validação de campos, derivação de resultado, cálculo do painel, hash de senha, assinatura de sessão, tokens de recuperação e isolamento entre contas. Cada teste que toca o banco usa um arquivo temporário próprio.

**71 verificações de ponta a ponta** contra o sistema rodando, incluindo os caminhos de erro: senha errada, e-mail duplicado, data futura, adversário inválido, preço negativo, id inexistente, token reusado e tentativa de abrir o jogo de outra conta.

**120 combinações de responsividade**: as 10 telas em 12 larguras, de 320px a 1920px.

Também foi verificado que, apagando a pasta `data`, o `dev.bat` recria o banco do zero e tudo volta a funcionar.

---

## 12. Solução de problemas

**`O termo 'dev.bat' não é reconhecido`** — o terminal não está na pasta do projeto, ou faltou o `.\` exigido pelo PowerShell. Confira a pasta com `dir`.

**Porta 3000 ocupada** — já existe um servidor rodando. Feche o terminal anterior, ou descubra o processo com `netstat -ano | findstr :3000` e encerre pelo PID.

**Quero zerar o banco** — pare o servidor, apague `data/caderno.db` e rode `npm run seed`. Com o servidor rodando o arquivo fica travado e não dá para apagar.

**Esqueci a senha da conta de exemplo** — use o fluxo de "Esqueci minha senha": o link aparece em `/caixa-de-entrada`.

**As fontes não carregam** — só acontece na primeira compilação sem internet. Depois disso ficam embutidas.

---

## 13. Limites conhecidos

Coisas que o sistema deliberadamente **não** faz, para você não ser pego de surpresa:

- **Não envia e-mail de verdade.** A caixa de entrada é simulada, e por isso é pública.
- **Não tem recurso social.** Nada de ranking entre usuários, perfil público ou seguir alguém. Cada conta é um caderno fechado.
- **Só registra jogo no estádio.** Jogo assistido pela televisão não entra.
- **Só registra jogo do seu time.** Não dá para cadastrar uma final entre dois times que não são o seu.
- **Não busca resultados de API externa.** Tudo é digitado, escolhendo de listas prontas.
- **Foi feito para rodar na sua máquina.** Antes de publicar em qualquer servidor, defina a variável de ambiente `SESSION_SECRET` com um valor aleatório: sem ela o sistema assina os cookies com um valor que está no código.

---

## 14. Divisão das entregas

| AC | Funcionalidade | Front | Back | Banco |
|---|---|---|---|---|
| 1 | Cadastrar jogo e ver a lista | formulário e listagem | `POST` e `GET /api/matches` | `matches` |
| 2 | Editar e excluir jogo | formulário de edição e confirmação | `PUT` e `DELETE` | atualização e remoção |
| 3 | Painel de estatísticas | indicadores e retrospecto | `GET /api/stats` | somas e contagens |
| 4 | Cadastro, login, logout e time do coração | telas de conta e perfil | rotas de sessão | `users` |
| 5 | Recuperação de senha | três telas do fluxo | `forgot` e `reset` | `password_resets` e `emails` |

Todas as cinco entregam as três camadas, e a primeira é funcionalidade de negócio, não login.
