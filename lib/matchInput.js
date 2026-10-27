import {
  parseMoney,
  parsePastDate,
  parseScore,
  requiredId,
} from "./validation.js";

function readFlag(value) {
  return value === true || value === "true" || value === "on";
}

export function readMatchInput(body, supportedTeamId) {
  const errors = [];

  const matchDate = parsePastDate(body.matchDate, "A data do jogo", errors);
  const competitionId = requiredId(body.competitionId, "O campeonato", errors);
  const opponentId = requiredId(body.opponentId, "O adversário", errors);
  const stadiumId = requiredId(body.stadiumId, "O estádio", errors);
  const homeScore = parseScore(body.homeScore, "O placar do mandante", errors);
  const awayScore = parseScore(body.awayScore, "O placar do visitante", errors);
  const ticketPrice = parseMoney(body.ticketPrice, "O preço do ingresso", errors);
  const isHome = readFlag(body.isHome);

  if (opponentId !== null && opponentId === supportedTeamId) {
    errors.push("O adversário não pode ser o time que você torcia nesse jogo.");
  }

  return {
    errors,
    data: {
      supportedTeamId,
      matchDate,
      competitionId,
      homeTeamId: isHome ? supportedTeamId : opponentId,
      awayTeamId: isHome ? opponentId : supportedTeamId,
      homeScore,
      awayScore,
      stadiumId,
      ticketPrice,
    },
  };
}
