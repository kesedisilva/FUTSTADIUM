export function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(iso) {
  if (!iso) {
    return "";
  }
  const [year, month, day] = String(iso).slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export function maskMoney(raw) {
  const digits = String(raw).replace(/\D/g, "").slice(0, 9);
  const value = Number(digits) / 100;
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
