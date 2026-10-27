function round(value, places) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function summarize(matches) {
  const stadiums = new Map();
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let totalSpent = 0;

  for (const match of matches) {
    if (match.result === "win") {
      wins += 1;
    } else if (match.result === "draw") {
      draws += 1;
    } else {
      losses += 1;
    }

    totalSpent += match.ticketPrice;

    const visited = stadiums.get(match.stadium.id);
    if (visited) {
      visited.visits += 1;
    } else {
      stadiums.set(match.stadium.id, {
        stadiumId: match.stadium.id,
        name: match.stadium.name,
        visits: 1,
      });
    }
  }

  const games = matches.length;

  return {
    games,
    wins,
    draws,
    losses,
    winRate: games === 0 ? 0 : round(((3 * wins + draws) / (3 * games)) * 100, 1),
    totalSpent: round(totalSpent, 2),
    averagePerMatch: games === 0 ? 0 : round(totalSpent / games, 2),
    stadiumVisits: [...stadiums.values()].sort((a, b) => b.visits - a.visits),
  };
}
