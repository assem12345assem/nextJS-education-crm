/**
 * Format a date in the format "MMMM dd, yyyy".
 * @param date The date to format.
 * @returns The formatted date string.
 */
export function formatDate(date: Date): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}
