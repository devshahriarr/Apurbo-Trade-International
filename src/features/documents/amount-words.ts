const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function words(n: number): string {
  if (n < 20) return ones[n];
  if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`;
  if (n < 1000) return `${ones[Math.floor(n / 100)]} hundred${n % 100 ? ` ${words(n % 100)}` : ""}`;
  for (const [size, label] of [[1_000_000_000, "billion"], [1_000_000, "million"], [1000, "thousand"]] as const) {
    if (n >= size) return `${words(Math.floor(n / size))} ${label}${n % size ? ` ${words(n % size)}` : ""}`;
  }
  return "zero";
}

export function amountInWords(value: string | number): string {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 999_999_999_999.99) return "";
  const rounded = Math.round(amount * 100);
  const taka = Math.floor(rounded / 100);
  const paisa = rounded % 100;
  return `${words(taka)} taka${paisa ? ` and ${words(paisa)} paisa` : ""} only`;
}
