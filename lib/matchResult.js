export const RESULT_LABELS = {
  win: "Vitória",
  draw: "Empate",
  loss: "Derrota",
};

export function resultOf(match) {
  const supportedAtHome = match.supportedTeamId === match.homeTeamId;
  const scored = supportedAtHome ? match.homeScore : match.awayScore;
  const conceded = supportedAtHome ? match.awayScore : match.homeScore;

  if (scored > conceded) {
    return "win";
  }
  if (scored < conceded) {
    return "loss";
  }
  return "draw";
}
