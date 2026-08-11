function formatPrice(price) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "-";
  }

  return `${numericPrice.toLocaleString("tr-TR")} TL`;
}

export default formatPrice;