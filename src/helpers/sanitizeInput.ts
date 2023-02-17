const numbers = '0-9';
const dangerChars = '&/\\#+()$~%.,^\'":*?<>{}';
const cityInput = dangerChars.replace(',', ''); // may input ',' in city input

export const excludedChars = {
  safeText: RegExp(`[${dangerChars}]`, 'g'),
  cityInput: RegExp(`[${cityInput}${numbers}]`, 'g') // only text, without numbers
};

export default function sanitizeInput(input: string, excludedChars: RegExp): string {
  if (input) {
    return input.replace(excludedChars, '');
  }

  return input;
}
