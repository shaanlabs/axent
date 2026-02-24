/**
 * Format number as Indian Rupees (INR)
 * @param amount - Amount in rupees
 * @param showDecimals - Whether to show decimal places (default: false)
 * @returns Formatted currency string with ₹ symbol
 */
export function formatINR(amount: number, showDecimals: boolean = false): string {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
    };

    return new Intl.NumberFormat('en-IN', options).format(amount);
}

/**
 * Format number in Indian numbering system (lakhs and crores)
 * @param amount - Amount to format
 * @returns Formatted string like "2.5L" or "1.2Cr"
 */
export function formatIndianNumber(amount: number): string {
    if (amount >= 10000000) {
        // Crores
        return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
        // Lakhs
        return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
        // Thousands
        return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format price with unit (per day, per week, etc.)
 * @param price - Price amount
 * @param unit - Price unit ('day', 'week', 'month')
 * @returns Formatted price string
 */
export function formatPriceWithUnit(price: number, unit: string): string {
    return `${formatINR(price)}/${unit}`;
}
