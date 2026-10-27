export function normalizeNumber(text) {
  if (text.includes(",") && text.includes(".")) {
    return text.replace(/\./g, "").replace(",", ".");
  }
  if (text.includes(",")) {
    return text.replace(",", ".");
  }
  return text;
}

export function requiredText(value, field, errors) {
  const text = String(value ?? "").trim();
  if (text === "") {
    errors.push(`${field} é obrigatório.`);
  }
  return text;
}

export function requiredId(value, field, errors) {
  const text = String(value ?? "").trim();
  const number = Number.parseInt(text, 10);
  if (!/^\d+$/.test(text) || !Number.isInteger(number) || number <= 0) {
    errors.push(`${field} é obrigatório.`);
    return null;
  }
  return number;
}

export function parseMoney(value, field, errors) {
  const text = String(value ?? "").replace(/R\$/gi, "").trim();
  if (text === "") {
    errors.push(`${field} é obrigatório.`);
    return 0;
  }
  const number = Number(normalizeNumber(text));
  if (!Number.isFinite(number)) {
    errors.push(`${field} precisa ser um valor válido.`);
    return 0;
  }
  if (number < 0) {
    errors.push(`${field} não pode ser negativo.`);
    return 0;
  }
  return Math.round(number * 100) / 100;
}

export function parseScore(value, field, errors) {
  const text = String(value ?? "").trim();
  if (!/^\d{1,2}$/.test(text)) {
    errors.push(`${field} precisa ser um número de 0 a 99.`);
    return 0;
  }
  return Number(text);
}

export function parsePastDate(value, field, errors) {
  const text = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    errors.push(`${field} é obrigatória.`);
    return "";
  }
  const date = new Date(`${text}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${field} não é uma data válida.`);
    return "";
  }
  const limit = new Date();
  limit.setHours(23, 59, 59, 999);
  if (date > limit) {
    errors.push(`${field} não pode estar no futuro.`);
    return "";
  }
  return text;
}
