---
title: "Parcel & Robots"
date: "2024-02-28T12:35:23.000Z"
draft: false
tags: ["parcel"]
slug: "parceljs-and-robotstxt"
navigation: false
competence: "geek"
---

Има различни начини, да окажете на *ParcelJS*, кои файлове са статични и не трябва да преминават през билд трансформацията, но ако са малък брой, можете да активирате `transformers` плъгина и след това да ги окажете директно в билд скрипта в `package.json` файла.

<!--more-->

```json
// package.json
{
  "scripts": {
    "build": "parcel build src/index.html src/robots.txt src/favicon.ico"
  }
}
```

По този начин `robots.txt` и `favicon.ico` няма да бъде обработван от [ParcelJS](https://parceljs.org/) и ще бъде директно прехвърлен в билд директории.

## Transformers плъгина

За да заработи правилно горния билд скрипт, трябва да добавите в `.parcelrc` файла следния код:

```json
// .parcelrc
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{txt,ico}": ["@parcel/transformer-raw"]
  }
}
```

*ParcelJS* не само, че няма да добави хешове към имената, на файловете, но и линкнантите обектите във файловете, които се процесват няма да бъдат променени.

---

::comments
---
discussions: https://github.com/howbizarre/thoughts/discussions/8
---
::