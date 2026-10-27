import db from "../lib/db.js";
import { hashPassword } from "../lib/password.js";

const STADIUMS = [
  ["Neo Química Arena", "São Paulo"],
  ["Allianz Parque", "São Paulo"],
  ["MorumBIS", "São Paulo"],
  ["Canindé", "São Paulo"],
  ["Vila Belmiro", "Santos"],
  ["Maracanã", "Rio de Janeiro"],
  ["Estádio Nilton Santos", "Rio de Janeiro"],
  ["São Januário", "Rio de Janeiro"],
  ["Arena do Grêmio", "Porto Alegre"],
  ["Beira-Rio", "Porto Alegre"],
  ["Arena MRV", "Belo Horizonte"],
  ["Mineirão", "Belo Horizonte"],
  ["Independência", "Belo Horizonte"],
  ["Arena Fonte Nova", "Salvador"],
  ["Barradão", "Salvador"],
  ["Ligga Arena", "Curitiba"],
  ["Couto Pereira", "Curitiba"],
  ["Nabi Abi Chedid", "Bragança Paulista"],
  ["Campos Maia", "Mirassol"],
  ["Mangueirão", "Belém"],
  ["Curuzu", "Belém"],
  ["Arena Condá", "Chapecó"],
  ["Arena Castelão", "Fortaleza"],
  ["Ilha do Retiro", "Recife"],
  ["Aflitos", "Recife"],
  ["Alfredo Jaconi", "Caxias do Sul"],
  ["Arena Pantanal", "Cuiabá"],
  ["Serrinha", "Goiânia"],
  ["Antônio Accioly", "Goiânia"],
  ["Onésio Brasileiro Alvarenga", "Goiânia"],
  ["Ressacada", "Florianópolis"],
  ["Heriberto Hülse", "Criciúma"],
  ["Rei Pelé", "Maceió"],
  ["Germano Krüger", "Ponta Grossa"],
  ["Carlos Zamith", "Manaus"],
  ["Jorge Ismael de Biasi", "Novo Horizonte"],
  ["Moisés Lucarelli", "Campinas"],
  ["Brinco de Ouro da Princesa", "Campinas"],
  ["Distrital do Inamar", "Diadema"],
  ["Major José Levy Sobrinho", "Limeira"],
  ["1º de Maio", "São Bernardo do Campo"],
  ["Benitão", "Rio Claro"],
  ["Santa Cruz", "Ribeirão Preto"],
  ["La Bombonera", "Buenos Aires"],
  ["Monumental de Núñez", "Buenos Aires"],
  ["José Amalfitani", "Buenos Aires"],
  ["El Cilindro", "Avellaneda"],
  ["Libertadores de América", "Avellaneda"],
  ["Jorge Luis Hirschi", "La Plata"],
  ["Gran Parque Central", "Montevidéu"],
  ["Campeón del Siglo", "Montevidéu"],
  ["Monumental David Arellano", "Santiago"],
  ["Estadio Nacional", "Santiago"],
  ["Defensores del Chaco", "Assunção"],
  ["La Nueva Olla", "Assunção"],
  ["Rodrigo Paz Delgado", "Quito"],
  ["Monumental Banco Pichincha", "Guayaquil"],
  ["Monumental de Ate", "Lima"],
  ["Alejandro Villanueva", "Lima"],
  ["Atanasio Girardot", "Medellín"],
  ["Hernando Siles", "La Paz"],
];

const TEAMS = [
  ["Corinthians", "Neo Química Arena"],
  ["Palmeiras", "Allianz Parque"],
  ["São Paulo", "MorumBIS"],
  ["Santos", "Vila Belmiro"],
  ["Flamengo", "Maracanã"],
  ["Fluminense", "Maracanã"],
  ["Botafogo", "Estádio Nilton Santos"],
  ["Vasco da Gama", "São Januário"],
  ["Grêmio", "Arena do Grêmio"],
  ["Internacional", "Beira-Rio"],
  ["Atlético-MG", "Arena MRV"],
  ["Cruzeiro", "Mineirão"],
  ["Bahia", "Arena Fonte Nova"],
  ["Vitória", "Barradão"],
  ["Athletico-PR", "Ligga Arena"],
  ["Coritiba", "Couto Pereira"],
  ["Red Bull Bragantino", "Nabi Abi Chedid"],
  ["Mirassol", "Campos Maia"],
  ["Remo", "Mangueirão"],
  ["Chapecoense", "Arena Condá"],
  ["Fortaleza", "Arena Castelão"],
  ["Ceará", "Arena Castelão"],
  ["Sport", "Ilha do Retiro"],
  ["Náutico", "Aflitos"],
  ["Juventude", "Alfredo Jaconi"],
  ["Cuiabá", "Arena Pantanal"],
  ["Goiás", "Serrinha"],
  ["Atlético-GO", "Antônio Accioly"],
  ["Vila Nova", "Onésio Brasileiro Alvarenga"],
  ["América-MG", "Independência"],
  ["Avaí", "Ressacada"],
  ["Criciúma", "Heriberto Hülse"],
  ["CRB", "Rei Pelé"],
  ["Operário-PR", "Germano Krüger"],
  ["Amazonas", "Carlos Zamith"],
  ["Paysandu", "Curuzu"],
  ["Novorizontino", "Jorge Ismael de Biasi"],
  ["Ponte Preta", "Moisés Lucarelli"],
  ["Guarani", "Brinco de Ouro da Princesa"],
  ["Portuguesa", "Canindé"],
  ["Água Santa", "Distrital do Inamar"],
  ["Inter de Limeira", "Major José Levy Sobrinho"],
  ["São Bernardo", "1º de Maio"],
  ["Velo Clube", "Benitão"],
  ["Botafogo-SP", "Santa Cruz"],
  ["Boca Juniors", "La Bombonera"],
  ["River Plate", "Monumental de Núñez"],
  ["Vélez Sarsfield", "José Amalfitani"],
  ["Racing", "El Cilindro"],
  ["Independiente", "Libertadores de América"],
  ["Estudiantes", "Jorge Luis Hirschi"],
  ["Nacional", "Gran Parque Central"],
  ["Peñarol", "Campeón del Siglo"],
  ["Colo-Colo", "Monumental David Arellano"],
  ["Universidad de Chile", "Estadio Nacional"],
  ["Olimpia", "Defensores del Chaco"],
  ["Cerro Porteño", "La Nueva Olla"],
  ["LDU Quito", "Rodrigo Paz Delgado"],
  ["Barcelona de Guayaquil", "Monumental Banco Pichincha"],
  ["Universitario", "Monumental de Ate"],
  ["Alianza Lima", "Alejandro Villanueva"],
  ["Atlético Nacional", "Atanasio Girardot"],
  ["Bolívar", "Hernando Siles"],
];

const COMPETITIONS = ["Brasileirão", "Paulista", "Copa do Brasil", "Libertadores"];

const EXAMPLE_MATCHES = [
  ["2026-10-25", "Brasileirão", "Vitória", true, 1, 1, "Neo Química Arena", 90],
  ["2026-10-05", "Brasileirão", "Palmeiras", false, 2, 1, "Allianz Parque", 180],
  ["2026-09-20", "Brasileirão", "Santos", true, 2, 0, "Neo Química Arena", 120],
  ["2026-09-13", "Brasileirão", "Coritiba", true, 3, 1, "Neo Química Arena", 85],
  ["2026-08-30", "Brasileirão", "São Paulo", false, 0, 0, "MorumBIS", 150],
  ["2026-08-16", "Brasileirão", "Chapecoense", true, 4, 2, "Neo Química Arena", 80],
  ["2026-07-23", "Libertadores", "Cerro Porteño", true, 2, 1, "Neo Química Arena", 220],
  ["2026-05-14", "Copa do Brasil", "Athletico-PR", true, 2, 2, "Neo Química Arena", 110],
  ["2026-04-09", "Copa do Brasil", "Remo", false, 2, 0, "Mangueirão", 95],
  ["2026-03-08", "Paulista", "Novorizontino", true, 1, 0, "Neo Química Arena", 60],
  ["2026-02-22", "Paulista", "Ponte Preta", false, 1, 2, "Moisés Lucarelli", 70],
];

function run() {
  const already = db.prepare("SELECT COUNT(*) AS total FROM teams").get().total;
  if (already > 0) {
    console.log("O banco já possui dados. Nada foi alterado.");
    return;
  }

  const insertStadium = db.prepare("INSERT INTO stadiums (name, city) VALUES (?, ?)");
  for (const [name, city] of STADIUMS) {
    insertStadium.run(name, city);
  }

  const stadiumId = new Map(
    db.prepare("SELECT id, name FROM stadiums").all().map((row) => [row.name, row.id]),
  );

  const insertTeam = db.prepare("INSERT INTO teams (name, stadium_id) VALUES (?, ?)");
  for (const [name, stadium] of TEAMS) {
    insertTeam.run(name, stadiumId.get(stadium));
  }

  const teamId = new Map(
    db.prepare("SELECT id, name FROM teams").all().map((row) => [row.name, row.id]),
  );

  const insertCompetition = db.prepare("INSERT INTO competitions (name) VALUES (?)");
  for (const name of COMPETITIONS) {
    insertCompetition.run(name);
  }

  const competitionId = new Map(
    db.prepare("SELECT id, name FROM competitions").all().map((row) => [row.name, row.id]),
  );

  const corinthians = teamId.get("Corinthians");

  db.prepare(
    "INSERT INTO users (name, email, password_hash, team_id) VALUES (?, ?, ?, ?)",
  ).run("Torcedor", "torcedor@exemplo.com", hashPassword("123456"), corinthians);

  const userId = db.prepare("SELECT id FROM users ORDER BY id LIMIT 1").get().id;

  const insertMatch = db.prepare(`
    INSERT INTO matches
      (user_id, supported_team_id, match_date, competition_id,
       home_team_id, away_team_id, home_score, away_score, stadium_id, ticket_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const [date, competition, opponent, isHome, homeScore, awayScore, stadium, price] of EXAMPLE_MATCHES) {
    insertMatch.run(
      userId,
      corinthians,
      date,
      competitionId.get(competition),
      isHome ? corinthians : teamId.get(opponent),
      isHome ? teamId.get(opponent) : corinthians,
      homeScore,
      awayScore,
      stadiumId.get(stadium),
      price,
    );
  }

  console.log(
    `${STADIUMS.length} estádios, ${TEAMS.length} times, ${COMPETITIONS.length} campeonatos, ` +
      `1 usuário e ${EXAMPLE_MATCHES.length} jogos criados.`,
  );
}

run();
