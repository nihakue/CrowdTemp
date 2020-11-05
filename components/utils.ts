export function formatCurrencyLabel(amount) {
    return Intl.NumberFormat('en-uk', {style: 'currency', currency: 'GBP', notation: 'compact'}).format(Math.floor(amount));
}
