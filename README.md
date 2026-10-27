# Caderno de Jogos

Registro pessoal dos jogos de futebol que você foi assistir no estádio. Você cadastra cada ida e o sistema transforma isso em retrospecto, aproveitamento, estádios visitados e quanto gastou com ingressos.

## Funcionalidades

**Painel** — jogos registrados, aproveitamento, estádios diferentes visitados e gasto total, com o retrospecto de vitórias, empates e derrotas e a lista de idas a cada estádio.

**Jogos** — cadastro, listagem, edição e exclusão. O formulário pede o adversário e se o jogo foi em casa ou fora; os lados do placar se invertem sozinhos e o estádio é sugerido pelo mandante.

**Conta** — cadastro aberto, login, logout, troca do time do coração e troca de senha. Todo campo de senha tem botão para mostrar e ocultar, e cadastro e troca pedem confirmação.

**Recuperação de senha** — fluxo completo de "esqueci minha senha" com token de uso único e validade de 30 minutos. Como o projeto roda só na sua máquina, nenhum e-mail é enviado de verdade: a mensagem vai para uma caixa de entrada simulada em `/caixa-de-entrada`, de onde você abre o link.

## Tecnologias

- Node 24
- Next.js 16 com App Router
- JavaScript, sem TypeScript
- CSS puro escrito à mão, sem framework
- SQLite pelo módulo `node:sqlite`, embutido no Node
- `node --test` como runner

Nenhuma dependência além do Next e do React. Não há ORM, biblioteca de CSS nem serviço externo.

## Pré-requisitos

Apenas o **Node 24 ou superior**:

```
node --version
```

Se o comando não for reconhecido, instale em [nodejs.org](https://nodejs.org).

## Como rodar do zero

Abra o terminal **dentro da pasta do projeto** — aquela onde está o `dev.bat` — e execute:

```
.\dev.bat
```

No PowerShell o prefixo `.\` é obrigatório. No Prompt de Comando basta `dev.bat`. Para abrir o terminal já na pasta certa: no Explorador de Arquivos, entre na pasta, clique na barra de endereço, digite `powershell` e pressione Enter. Dois cliques no `dev.bat` também funcionam.

O comando instala as dependências se faltarem, cria o banco com dados de exemplo na primeira execução e sobe o servidor. Quando aparecer o endereço, abra `http://localhost:3000`.

Para entrar com a conta de exemplo: **torcedor@exemplo.com** com a senha **123456**. Ou crie a sua em `/cadastro`.

### Passo a passo manual

```
npm install
npm run seed
npm run dev
```

## Ver o banco de dados

O banco é um arquivo único em `data/caderno.db`. Para inspecionar sem ferramenta externa:

```
node --input-type=module -e "const {default:db}=await import('./lib/db.js');console.table(db.prepare('SELECT * FROM matches').all())"
```

Troque `matches` por `teams`, `stadiums`, `competitions` ou `users` para ver as outras tabelas.

## Testes

```
npm test
```

São 57 testes cobrindo validação de campos, derivação de resultado, agregações do painel, hash de senha, assinatura de sessão e o isolamento de dados entre contas. Cada teste que toca o banco usa um arquivo temporário próprio.

## Estrutura

```
caderno-de-jogos/
├── dev.bat                 sobe tudo com um comando
├── scripts/seed.js         dados de exemplo
├── app/
│   ├── layout.js           barra superior e navegação
│   ├── globals.css         design system inteiro
│   ├── page.js             painel
│   ├── jogos/              lista, cadastro e edição
│   ├── login/ cadastro/ perfil/
│   └── api/                camada de back
├── components/             formulários e botões de cliente
├── lib/                    banco, validação, regras e consultas
├── data/                   banco de dados
└── tests/
```

## Camadas

```
app/api/matches/route.js    recebe a requisição, responde HTTP   (BACK)
lib/matchInput.js           converte e valida o formulário       (BACK)
lib/matches.js              SQL, sempre com escopo de usuário    (BANCO)
app/jogos/page.js           a tela                               (FRONT)
```

Nenhum SQL aparece fora de `lib/`. Toda consulta filtra pelo usuário da sessão.

## Banco de dados

| Tabela | Conteúdo |
|---|---|
| `stadiums` | estádios com cidade |
| `teams` | times, cada um apontando para o seu estádio |
| `competitions` | Brasileirão, Paulista, Copa do Brasil e Libertadores |
| `users` | contas, com senha em hash e o time do coração |
| `matches` | os jogos que você foi |
| `password_resets` | tokens de recuperação, guardados em hash |
| `emails` | caixa de entrada simulada |

Três decisões sustentam o modelo:

**Nada de texto livre.** Time, estádio e campeonato são sempre seleção sobre tabelas semeadas. Se o estádio fosse digitado, "Neo Química Arena" e "Neo Quimica Arena" virariam dois, e o contador principal do app passaria a mentir.

**Cada jogo guarda o time que você torcia na época.** Por isso trocar o time do coração no perfil não altera o resultado de nenhum jogo já registrado — só muda o padrão dos próximos.

**O resultado nunca é gravado.** Vitória, empate e derrota saem da comparação do placar com o time apoiado, na hora da leitura. O aproveitamento é a fórmula de pontos, `(3 × vitórias + empates) / (3 × jogos)`, que é o uso corrente no futebol brasileiro.

## Rotas

| Método | Rota | Função |
|---|---|---|
| GET | `/` | painel |
| GET | `/jogos` | lista de jogos |
| GET POST | `/jogos/novo` | cadastro |
| GET | `/jogos/[id]/editar` | edição |
| GET | `/login`, `/cadastro`, `/perfil` | conta |
| GET | `/esqueci-senha`, `/caixa-de-entrada`, `/redefinir-senha` | recuperação de senha |
| GET POST | `/api/matches` | listar e criar |
| GET PUT DELETE | `/api/matches/[id]` | abrir, editar e excluir |
| GET | `/api/stats` | números do painel |
| GET | `/api/catalog` | times, estádios e campeonatos |
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` | sessão |
| POST | `/api/auth/forgot`, `/api/auth/reset` | recuperação de senha |
| PUT | `/api/profile/password` | trocar a própria senha |
| PUT | `/api/profile` | trocar o time do coração |

Toda rota de API responde 401 sem sessão, e 404 quando o jogo pertence a outra conta.

## Solução de problemas

**`O termo 'dev.bat' não é reconhecido`** — o terminal não está na pasta do projeto, ou faltou o `.\` exigido pelo PowerShell.

**Porta 3000 ocupada** — feche o terminal anterior, ou descubra o processo com `netstat -ano | findstr :3000` e encerre pelo PID.

**Quero zerar o banco** — pare o servidor, apague `data/caderno.db` e rode `npm run seed`. Com o servidor rodando o arquivo fica travado e não pode ser apagado.

**As fontes não carregam** — Archivo e Karla são baixadas e embutidas na primeira compilação. Depois disso o app não depende mais de internet.

## Se um dia for publicar

O projeto foi feito para rodar na própria máquina. Antes de colocar em qualquer servidor, defina a variável `SESSION_SECRET` com um valor aleatório: sem ela o sistema assina os cookies com um valor que está no código, e quem tiver o fonte conseguiria forjar uma sessão. Em uso local isso não muda nada, porque quem alcança o código já alcança o arquivo do banco.

## Entregas

| AC | Funcionalidade | Front | Back | Banco |
|---|---|---|---|---|
| 1 | Cadastrar jogo e ver a lista | formulário e listagem | `POST` e `GET /api/matches` | `matches` |
| 2 | Editar e excluir jogo | edição e confirmação | `PUT` e `DELETE` | atualização e remoção |
| 3 | Painel de estatísticas | indicadores e retrospecto | `GET /api/stats` | somas e contagens |
| 4 | Cadastro, login e time do coração | telas de conta e perfil | rotas de sessão | `users` |
