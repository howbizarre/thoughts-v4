---
title: "One entry point for multiple sites"
date: "2024-02-27T07:43:58.000Z"
draft: false
tags: ["vue", "vue-router"]
slug: "one-entry-point-multiple-sites"
navigation: false
competence: "pro"
---

We have an application that represents a microsite, and when you load it, you see a login page. Our clients provide it to their users. After a user logs in, data related to the client they belong to and the permissions assigned by our client are loaded.

<!--more-->

With the development of the application, our clients started requesting the microsite to work on their own domain. To carry their brand. To add "rich" content to the otherwise "plain" login screen. To expand its functionalities - and most of the requested functionalities were highly personalized.

We had two options - to separate the application for each client and add everything the client needs, or to add additional configuration that allows the application to be personalized. In both cases, the server-side *back-end* would not change. Only the *front-end* part would be personalized according to the client.

We quickly dismissed the first option. We are a small team and maintaining multiple installations and versions would require resources that we didn't want to allocate. That's why we decided to go with a single entry point for all clients and different configurations for each. We call it **PROFILES**.

---

## Profiles

> How do we recognize the profile?

This was the first question that stood before us. When a user loads the application, it should start showing different fonts, logos, background images, etc. on the login screen. We immediately needed to know if the client supports more than one language, if additional controls are loaded, such as registration, feedback form, etc.

Then we decided that based on the domain that calls the application, we will tell the *back-end* which profile it is. However, this led to a small, but unpleasant, fluctuation of the application because it loaded something common to all and after the *back-end* received the domain, we performed a *postback* redirection of the application to the specific profile. To avoid this flicker - we moved the logic to the *front-end* part of the application.

In the `main.ts` file, we turn to the *back-end* to return the profile identifier.

```typescript
// main.ts
const profileId: string = await whatMyProfileIs("api/profile/id");
```

Just that - a super-fast operation that returns a string identifier. No *postback*, no 301 redirection, no unnecessary requests to the *back-end*. How *back-end* understands what the context is, I will tell you some other time.

The next step is to activate the profile in the application. Just to add - the application has an administrative part that allows us and to some extent the client, to configure the profile. So when we get the profile identifier, we load its configuration. We use a function in the `main.ts` file.

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

Then we load the configuration and pass it to the application.

```typescript
// main.ts
const config = await loadClientConfiguration(`/tote/${profileId}.json`);
Object.freeze(config);

app.provide("clientConfig", config);
app.provide("clientId", profileId);
```

This is the entire logic for loading the profile and propagating it in the application.

## Routing

Each profile, except the default one, loads its own routing. With it, we can easily activate additional plugins for the *Vue* engine.

We add the additional router to the standard and filter it based on the profile. Then we add it to the main routing.

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

Easy to add, easy to maintain. It provides freedom for expansion, for each profile, regardless of the others. It works fast and without issues. I simplified the example a bit, but it gives a good idea of how you can extend the usage of *Vue Router*.

With this implementation, we encountered a small problem. When activating the *Vue* engine in `main.ts`, we add the following lines:

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

This way, *Vue Router* & *Vue App* load independently and the profile doesn't reach the router on time. That's why we created an additional function and asynchronously load the router there.

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

The whole solution for one entry point and multiple sites worked with these few simple changes.

---

::note
I am omitting some of the object implementations in the article - they are not essential but only serve to suggest what business logic is behind them.
::

---

::note
"I use the term **back-end** quite loosely. I wondered if it might just be a server, but in our case, that's not quite the correct definition.
::

---

::comments
---
discussions: https://github.com/howbizarre/thoughts/discussions/7
---
::