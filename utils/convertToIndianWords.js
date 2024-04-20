export default function convertToIndianWords(number) {
  number = +number;
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertToWords(num) {
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    );
  }

  if (number === 0) return "Zero";

  if (number === 10000) return "Ten Thousand";

  let words = "";
  if (number < 100) {
    words = convertToWords(number);
  } else if (number < 1000) {
    words =
      ones[Math.floor(number / 100)] +
      " Hundred " +
      convertToWords(number % 100);
  } else if (number < 10000) {
    const thousand = Math.floor(number / 1000);
    const remainder = number % 1000;
    if (remainder === 0) {
      words = ones[thousand] + " Thousand";
    } else {
      words = ones[thousand] + " Thousand " + convertToIndianWords(remainder);
    }
  }

  return words.trim();
}
