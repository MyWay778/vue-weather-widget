export const dangerChars = {
  safeText: /[&/\\#+()$~%.^'":*?<>{}0-9]/g
};

export default function sanitizeInput(input: string, dangerChars: RegExp): string {
  if (input) {
    return input.replace(dangerChars, '');
  }

  return input;
}
