export function formatCurrency(value, currency, digits) {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: digits,
	});
	return formatter.format(value);
}
