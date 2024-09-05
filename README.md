# classmix

[![npm version](https://img.shields.io/npm/v/@m00nbyte/classmix.svg)](https://www.npmjs.org/package/@m00nbyte/classmix) [![npm downloads](https://img.shields.io/npm/dm/@m00nbyte/classmix)](https://www.npmjs.org/package/@m00nbyte/classmix)

---

## Description

Combines class names conditionally, ensuring uniqueness and proper formatting.

## Installation

```bash
npm install -D @m00nbyte/classmix
yarn add -D @m00nbyte/classmix
```

## Usage

```js
import cm from '@m00nbyte/classmix';

cm('c1', 'c2', 'c3');
// Result => 'c1 c2 c3'
```

## Parameters

### `...args`

A list of arguments that can be strings, arrays of strings, objects where keys are class names and values are booleans, or nested arrays with the same structure.

#### Possible parameter types

#### `string`

Represents a single class name. This type allows individual class names to be added directly.

#### `string[]`

Represents an array of class names. You can group multiple class names together within an array.

#### `{ [key: string]: boolean }`

Each key-value pair in the object corresponds to a class name, and the boolean value indicates whether the class should be included or not.

#### `(string | string[] | { [key: string]: boolean } | ...)[]`

Each nested array can contain elements of the same types described above, enabling complex structures where arrays can contain strings, arrays of strings, objects, or even further nested arrays.

## Examples

<!-- prettier-ignore-->
```js
import cm from '@m00nbyte/classmix';

cm(
    // strings
    'c1', 'c2', 'c3',

    // objects
    { c4: true, c5: false, c6: null },

    // arrays
    ['c5', 'c6', ['c7', { c8: true }]],

    // conditions
    true ? 'c9' : '',
    !false ? 'c10' : '',
    true && 'c11',
    !false && 'c12',

    // ignored
    [
        // duplicates
        'c12', 'c12',

        // falsy
        null, false, undefined, 0
    ]
);
// Result => 'c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12'
```

### Sorting Tailwind Classes

[prettier-plugin-tailwindcss | Sorting classes in function calls](https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file#sorting-classes-in-function-calls)

#### Example

```json
// .prettierrc
{
    "plugins": ["prettier-plugin-tailwindcss"],
    "tailwindFunctions": ["cm"]
}
```

Now, any classes in `cm()` function calls will be sorted:

<!-- prettier-ignore-->
```jsx
import cm from '@m00nbyte/classmix';

function Page() {
    let classes = cm(
        'bg-stone-900 px-4 py-2 text-base text-white',
        {
            'bg-white text-stone-900': isLightMode
        }
    );

    return (
        <div className={classes}>
            {children}
        </button>
    );
}

export default Page;
```

## Contribution

Feel free to submit issues or pull requests.

## Like my work?

This project needs a :star: from you.
Don't forget to leave a star.

<a href="https://www.buymeacoffee.com/m00nbyte" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="217" height="60">
</a>

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
