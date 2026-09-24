function findJsonStart(value: string) {
  const objectIndex = value.indexOf("{");
  const arrayIndex = value.indexOf("[");

  if (objectIndex === -1) {
    return arrayIndex;
  }

  if (arrayIndex === -1) {
    return objectIndex;
  }

  return Math.min(objectIndex, arrayIndex);
}

function findBalancedJsonEnd(value: string, startIndex: number) {
  const openingCharacter = value[startIndex];
  const closingCharacter =
    openingCharacter === "{"
      ? "}"
      : openingCharacter === "["
        ? "]"
        : null;

  if (!closingCharacter) {
    return -1;
  }

  let depth = 0;
  let isInsideString = false;
  let isEscaped = false;

  for (let index = startIndex; index < value.length; index += 1) {
    const character = value[index];

    if (isInsideString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (character === "\\") {
        isEscaped = true;
        continue;
      }

      if (character === "\"") {
        isInsideString = false;
      }

      continue;
    }

    if (character === "\"") {
      isInsideString = true;
      continue;
    }

    if (character === openingCharacter) {
      depth += 1;
      continue;
    }

    if (character === closingCharacter) {
      depth -= 1;

      if (depth === 0) {
        return index + 1;
      }
    }
  }

  return -1;
}

export function parseJsonResponse<T>(value: string): T {
  const normalizedValue = value.trim().replace(/^\uFEFF/, "");

  try {
    return JSON.parse(normalizedValue) as T;
  } catch (error) {
    const startIndex = findJsonStart(normalizedValue);

    if (startIndex === -1) {
      throw error;
    }

    const endIndex = findBalancedJsonEnd(normalizedValue, startIndex);

    if (endIndex === -1) {
      throw error;
    }

    return JSON.parse(normalizedValue.slice(startIndex, endIndex)) as T;
  }
}
