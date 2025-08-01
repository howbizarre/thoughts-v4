---
title: "Една входна точка за множество сайтове"
date: "2024-02-27T07:43:58.000Z"
draft: false
tags: ["vue", "vue-router"]
slug: "one-entry-point-multiple-sites"
navigation: false
competence: "pro"
---

Имаме приложение, което представлява микросайт и когато го заредите, виждате страница за вход. Нашите клиенти го предоставят на своите потребители и след като потребител влезе, се зареждат данни, свързани, както с клиента, към който принадлежат, така и с правата, зададени му от нашия клиент.

<!--more-->

С развитието на приложението, клиентите ни започнаха да искат микросайта да заработи на техен домейн. Да носи техния бранд. Да се добави "богато" съдържание към иначе "постния" екран за вход. Да се разширят функционалностите му - а повечето от исканите функционалности бяха силно персонализирани.

Пред нас имаше 2 пътя - да разделим приложението за всеки клиент и в него да добавим всичко, от което клиента има нужда, или да добавим допълнителна конфигурация, която да позволи на приложение да се персонализира. И при двата варианта, сървърната back-end част нямаше да се променя. Само front-end частта щеше да се персонализира спрямо клиента.

Бързо отхвърлихме първия вариант. Ние сме малък екип и поддръжката на множество инсталации и версии щеше да отнема ресурс, който не искахме да отделяме. Затова се насочихме към една входна точка за всички клиенти и различни конфигурации за всеки. Наричаме го **ПРОФИЛИ**.

---

## Профили

> Как да разпознаваме профила?

Това беше първия въпрос, който стоеше пред нас. Когато потребител зареди приложението то трябва още на входния екран да започне да показва различни шрифтове, лого, картинки за фон и др. Веднага трябваше да знае, дали клиента поддържа повече от един език, дали се зареждат допълнителни контроли, като регистрация, форма за обратна връзка и т.н.

Тогава решихме, че на базата на домейна, който извикваше приложението ще казваме на *beck-end*, кой е профила. Това обаче доведе до малка, но неприятна, флуктуация на приложението, защото зареждаше нещо, общо за всички и след като *beck-end* получи, кой е домейна, извършвахме *postback* пренасочване на приложението към конкретния профил. За да избегнем това премигване - изнесохме логика във *front-end* частта на приложението.

В `main.ts` файла се обръщаме към *beck-end*, да ни върне идентификатора на профила.

```typescript
// main.ts
const profileId: string = await whatMyProfileIs("api/profile/id");
```

Само това - свръх бърза операция, която връща един стрингов идентификатор. Няма *postback*, няма 301 пренасочване, няма излишни заявки към *beck-end*. Как *beck-end* разбира кой е контекста ще ви разкажа някой друг път.

Следващата стъпка е да активираме профила в приложението. Само да добавя - към приложението има административна част, която ни позволява, а донякъде и на клиента, да се конфигурира профила. Така че като получим идентификатора на профила да зареждаме конфигурацията му. Използваме функция в `main.ts` файла.

```typescript
// main.ts
async function loadClientConfiguration(configStore: string): Promise<Config> {
  try {
    const response = await fetch(configStore);
    const config = await response.json();

    return config;
  } catch (error) {
    Logger.fatal("Failed to load client configuration", error);
  }
}
```

След което зареждане конфигурацията и я подаваме на приложението.

```typescript
// main.ts
const config = await loadClientConfiguration(`/tote/${profileId}.json`);
Object.freeze(config);

app.provide("clientConfig", config);
app.provide("clientId", profileId);
```

Това е цялата логика по зареждането на профила и популяризирането му в приложението.

## Рутинг

Всеки профил, освен стандартния, зарежда и собствен рутинг. С него лесно може да активираме и допълнителни плъгини към *Vue* енджина.

В стандартния рутер добавяме добавяме допълнителния рутер и филтрираме спрямо профила. След което го добавяме към основния рутинг.
  
```typescript
// router/index.ts
import { customRoutes } from "@/router/custom";

const customRoute: Array<RouteRecordRaw> = clientId ? customRoutes[clientId] : [];

if (customRoute?.length > 0) {
  routes.push(...customRoute);
}

const history = createWebHashHistory();
const router = createRouter({ history, routes });
```

Лесно за добавяне, лесно за поддръжка. Дава свобода за разширяване, за всеки профил, независимо от останалите. Работи бързо и без проблемно. Малко опростих примера, но дава добра представа как може да разширите начина на използване на *Vue Router*.

При тази реализация се натъкнахме на малък проблем. При стандартното активиране на *Vue енджина* в `main.ts` добавяме следните редове:

```typescript
// main.ts
import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { whatMyProfileIs } from "@/endpoints/profile";
import Logger from "@/system/fs/workers/logger";

const profileId: string = await whatMyProfileIs("api/profile/id");
const config = await loadClientConfiguration(`/tote/${profileId}.json`);
Object.freeze(config);

const app = createApp(App);

app.provide("clientConfig", config);
app.provide("clientId", profileId);

app.use(router);
app.mount("#app");

async function loadClientConfiguration(configStore: string): Promise<Config> {
  try {
    const response = await fetch(configStore);
    const config = await response.json();

    return config;
  } catch (error) {
    Logger.fatal("Failed to load client configuration", error, { "predef": 500 });
  }
}
```

По този начин Vue Router & Vue App се зареждат независимо и профила не достига до рутера на време. Затова направихме допълнителна ф-ия и там асинхронно зареждаме рутера.

```typescript
// main.ts
import { createApp } from "vue";
import App from "@/App.vue";
import { whatMyProfileIs } from "@/endpoints/profile";
import Logger from "@/system/fs/workers/logger";

BigBang();

async function BigBang(): Promise<void> {
  const profileId: string = await whatMyProfileIs("api/profile/id");

  if (profileId) {
    const app = createApp(App);

    const config = await loadClientConfiguration(`/tote/${profileId}.json`);
    Object.freeze(config);

    const { default: router } = await import("@/router");

    app.use(router);

    app.provide("clientConfig", config);
    app.provide("clientId", profileId);

    await router.isReady();
    app.mount("#app");
  }
}

async function loadClientConfiguration(configStore: string): Promise<Config> {
  try {
    const response = await fetch(configStore);
    const config = await response.json();

    return config;
  } catch (error) {
    Logger.fatal("Failed to load client configuration", error, { "predef": 500 });
  }
}
```

Цялото решение за една входна точка и множество сайтове заработи с тези няколко простички изменения.

---

::note
Изпускам част от имплементацията на обектите в статията - те не са съществени, а служат само да подскажат каква бизнес логика стои зад тях.
::

---

::note
"Използвам думата **back-end** доста примитивно. Чудех се, дали да не е просто сървър, но при нас това, не е съвсем правилно определение.
::

---

::comments
---
discussions: https://github.com/howbizarre/thoughts/discussions/7
---
::