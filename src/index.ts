export type cmArgs =
    | string
    | number
    | {
          [key: string]: boolean | Function;
      }
    | cmArgs[];

/**
 * Conditionally joins class names together, removing duplicates and filtering out falsy values recursively.
 *
 * @param {cmArgs[]} args - Class names to be joined.
 * @returns {string} - The concatenated class names.
 */
const cm = (...args: cmArgs[]): string =>
    args
        .flatMap((item) =>
            item
                ? // If item is an array, recursively process its elements
                  Array.isArray(item)
                    ? cm(...item)
                    : // If item is a string or a number, remove whitespace and trim
                    ['string', 'number'].some((type) => typeof item === type)
                    ? `${item}`.replace(/^\s+|\s+(?=\s)|\s+$/g, '')
                    : // If item is a object, check for class instance
                      typeof item === 'object' &&
                      // If item is a class, check for `toString`
                      (item.constructor !== Object && typeof item.toString === 'function'
                          ? item.toString()
                          : // If item is a object, filter and reduce entries
                            Object.entries(item).reduce(
                                (keys, [key, value]) => (
                                    value &&
                                        keys.push(
                                            // check for `toString` and execute it or use the key
                                            (key === 'toString' && typeof value === 'function' && value()) || key
                                        ),
                                    keys
                                ),
                                [] as string[]
                            ))
                : []
        )
        // Exclude items with empty values and duplicate items
        .filter((item, index, self) => item && self.indexOf(item) === index)
        // Join remaining items into a single string
        .join(' ');

export default cm;
