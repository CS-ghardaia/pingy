### Complete example: Lifting state up

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/index.md

A complete example demonstrating how to lift state up to share it between components.

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

--------------------------------

### Full example of nested components

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/index.md

An interactive example showing MyButton nested within MyApp.

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

--------------------------------

### Products array for list rendering

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/index.md

An example array of products to be rendered as a list.

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

--------------------------------

### Example of compiled code

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/react-compiler/installation.md

An example of JavaScript code after being processed by React Compiler, demonstrating the automatic memoization logic added by the compiler.

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
```

--------------------------------

### Complex expressions and styling with JavaScript variables

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/index.md

An interactive example demonstrating string concatenation in alt and dynamic styling using style attribute with JavaScript variables.

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

--------------------------------

### Returning multiple JSX tags

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/index.md

Example of wrapping multiple JSX tags into a shared parent using an empty <>...</> wrapper.

```js
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

--------------------------------

### Complete example: App.js

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/components/common.md

Root component for the styling example.

```js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

--------------------------------

### Symmetrical setup and cleanup

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useEffect.md

An example demonstrating symmetrical setup and cleanup logic for an Effect, where cleanup undoes the setup.

```js
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

--------------------------------

### Complete example using createElement

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/createElement.md

A full working example demonstrating `createElement` for both HTML elements and custom components, including associated CSS.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

--------------------------------

### Basic usage example

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/preloadModule.md

An example of calling `preloadModule` with a module URL and the required `as` option.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

--------------------------------

### Full Example of `use` with Context and Conditionals

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/use.md

This comprehensive example demonstrates providing context, consuming it with `use` in multiple components, and conditionally rendering based on context and props.

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

--------------------------------

### Try React

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/installation.md

You don't need to install anything to play with React. Try editing this sandbox! You can edit it directly or open it in a new tab by pressing the "Fork" button in the upper right corner.

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

--------------------------------

### Install React and React DOM with npm

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Command to install React 19 and React DOM 19 using npm.

```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
```

--------------------------------

### Migrating `ReactDOM.render` to `createRoot`

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Example showing how to replace `ReactDOM.render` with `ReactDOM.createRoot`.

```js
// Before
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// After
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

--------------------------------

### Install React Compiler with npm

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/react-compiler/installation.md

Install `babel-plugin-react-compiler` as a development dependency using npm.

```bash
npm install -D babel-plugin-react-compiler@latest
```

--------------------------------

### Install React Compiler with Yarn

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/react-compiler/installation.md

Install `babel-plugin-react-compiler` as a development dependency using Yarn.

```bash
yarn add -D babel-plugin-react-compiler@latest
```

--------------------------------

### Complete React app example with createRoot

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/client/createRoot.md

A full example demonstrating the use of `createRoot` with an HTML entry point, main JavaScript file, and a simple React App component.

```html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

--------------------------------

### Full example of keyed Fragments in a list

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/Fragment.md

This example demonstrates rendering a list of posts, where each post is wrapped in a keyed `Fragment` to ensure proper list rendering and reconciliation.

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

--------------------------------

### Install React and React DOM with Yarn

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Command to install React 19 and React DOM 19 using Yarn.

```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
```

--------------------------------

### React.createFactory (Before)

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Example of using React.createFactory before React 19.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

--------------------------------

### Installation commands

Source: https://github.com/reactjs/react.dev/blob/main/README.md

Commands to navigate into the project root and install dependencies.

```shell
cd react.dev
```

```shell
yarn
```

--------------------------------

### Initial setup for useCounter and useInterval refactoring

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/reusing-logic-with-custom-hooks.md

An interactive example demonstrating the `useCounter` hook before the `useInterval` hook is fully implemented, showing the `App.js`, original `useCounter.js`, and an empty `useInterval.js`.

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js
// Write your Hook here!
```

--------------------------------

### Avoid cleanup without setup

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useEffect.md

An example of cleanup logic without corresponding setup logic, which is considered a code smell.

```js
useEffect(() => {
  // 
 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

--------------------------------

### useLayoutEffect(setup, dependencies?)

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useLayoutEffect.md

Call `useLayoutEffect` to perform layout measurements before the browser repaints the screen. It takes a setup function and an optional array of dependencies.

```APIDOC
## useLayoutEffect(setup, dependencies?)

### Description
Call `useLayoutEffect` to perform the layout measurements before the browser repaints the screen. It takes a setup function and an optional array of dependencies.

### Method
Hook

### Parameters
#### Hook Parameters
- **setup** (function) - Required - The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. After your component commits to the DOM and before the browser repaints the screen, React will run your setup function. After every commit with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. Before your component is removed from the DOM, React will run your cleanup function.
- **dependencies** (array) - Optional - The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the `Object.is` comparison. If you omit this argument, your Effect will re-run after every commit of the component.

### Returns
`useLayoutEffect` returns `undefined`.

### Caveats
- `useLayoutEffect` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a component and move the Effect there.
- When Strict Mode is on, React will **run one extra development-only setup+cleanup cycle** before the first real setup. This is a stress-test that ensures that your cleanup logic "mirrors" your setup logic and that it stops or undoes whatever the setup is doing. If this causes a problem, implement the cleanup function.
- If some of your dependencies are objects or functions defined inside the component, there is a risk that they will **cause the Effect to re-run more often than needed.** To fix this, remove unnecessary object and function dependencies. You can also extract state updates and non-reactive logic outside of your Effect.
- Effects **only run on the client.** They don't run during server rendering.
- The code inside `useLayoutEffect` and all state updates scheduled from it **block the browser from repainting the screen.** When used excessively, this makes your app slow. When possible, prefer `useEffect`.
- If you trigger a state update inside `useLayoutEffect`, React will execute all remaining Effects immediately including `useEffect`.
```

--------------------------------

### Install React Compiler with pnpm

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/react-compiler/installation.md

Install `babel-plugin-react-compiler` as a development dependency using pnpm.

```bash
pnpm install -D babel-plugin-react-compiler@latest
```

--------------------------------

### Install Parcel

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/build-a-react-app-from-scratch.md

Command to install Parcel as a development dependency.

```bash
npm install --save-dev parcel
```

--------------------------------

### Importing useState

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/index.md

How to import the useState Hook from React.

```js
import { useState } from 'react';
```

--------------------------------

### Full Example: Theme Context with Provider and Consumer

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useContext.md

This comprehensive example demonstrates creating a `ThemeContext`, providing a default 'dark' value, and consuming it in nested `Panel` and `Button` components, along with associated styling.

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

--------------------------------

### Counter example with useReducer

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useReducer.md

A complete interactive example demonstrating useReducer for a counter.

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

--------------------------------

### Full Example: Preloading Data with `use` and Suspense

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/use.md

This comprehensive example demonstrates preloading data on hover using `fetchData`, `useTransition`, and the `use` Hook within a Suspense boundary. Hovering over artist buttons fetches album data, which is then consumed by the `Albums` component.

```js
import { Suspense, useState, useTransition } from 'react';\nimport Albums from './Albums.js';\nimport { fetchData } from './data.js';\n\nexport default function App() {\n  const [artistId, setArtistId] = useState('the-beatles');\n  const [isPending, startTransition] = useTransition();\n\n  return (\n    <>\n      <div>\n        {['the-beatles', 'led-zeppelin', 'pink-floyd'].map(id => (\n          <button\n            key={id}\n            onMouseEnter={() => {\n              fetchData(`/${id}/albums`);\n            }}\n            onClick={() => {\n              startTransition(() => {\n                setArtistId(id);\n              });\n            }}\n          >\n            {id === 'the-beatles' ? 'The Beatles' :\n             id === 'led-zeppelin' ? 'Led Zeppelin' :\n             'Pink Floyd'}\n          </button>\n        ))}\n      </div>\n      <Suspense key={artistId} fallback={<Loading />}>\n        <Albums artistId={artistId} />\n      </Suspense>\n    </>\n  );\n}\n\nfunction Loading() {\n  return <h2>Loading...</h2>;\n}
```

```js
import { use } from 'react';\nimport { fetchData } from './data.js';\n\nexport default function Albums({ artistId }) {\n  const albums = use(fetchData(`/${artistId}/albums`));\n  return (\n    <ul>\n      {albums.map(album => (\n        <li key={album.id}>\n          {album.title} ({album.year})\n        </li>\n      ))}\n    </ul>\n  );\n}
```

```js
// Note: the way you would do data fetching depends on\n// the framework that you use together with Suspense.\n// Normally, the caching logic would be inside a framework.\n\nlet cache = new Map();\n\nexport function fetchData(url) {\n  if (!cache.has(url)) {\n    const promise = getData(url);\n    // Set status fields so React can read the value\n    // synchronously if the Promise resolves before\n    // `use` is called (e.g. when preloading on hover).\n    promise.status = 'pending';\n    promise.then(\n      value => {\n        promise.status = 'fulfilled';\n        promise.value = value;\n      },\n      reason => {\n        promise.status = 'rejected';\n        promise.reason = reason;\n      },\n    );\n    cache.set(url, promise);\n  }\n  return cache.get(url);\n}\n\nasync function getData(url) {\n  if (url.startsWith('/the-beatles/albums')) {\n    return await getAlbums('the-beatles');\n  } else if (url.startsWith('/led-zeppelin/albums')) {\n    return await getAlbums('led-zeppelin');\n  } else if (url.startsWith('/pink-floyd/albums')) {\n    return await getAlbums('pink-floyd');\n  } else {\n    throw Error('Not implemented');\n  }\n}\n\nasync function getAlbums(artistId) {\n  // Add a fake delay to make waiting noticeable.\n  await new Promise(resolve => {\n    setTimeout(resolve, 800);\n  });\n\n  if (artistId === 'the-beatles') {\n    return [{\n      id: 13,\n      title: 'Let It Be',\n      year: 1970\n    }, {\n      id: 12,\n      title: 'Abbey Road',\n      year: 1969\n    }, {\n      id: 11,\n      title: 'Yellow Submarine',\n      year: 1969\n    }];\n  } else if (artistId === 'led-zeppelin') {\n    return [{\n      id: 10,\n      title: 'Coda',\n      year: 1982\n    }, {\n      id: 9,\n      title: 'In Through the Out Door',\n      year: 1979\n    }, {\n      id: 8,\n      title: 'Presence',\n      year: 1976\n    }];\n  } else {\n    return [{\n      id: 7,\n      title: 'The Wall',\n      year: 1979\n    }, {\n      id: 6,\n      title: 'Animals',\n      year: 1977\n    }, {\n      id: 5,\n      title: 'Wish You Were Here',\n      year: 1975\n    }];\n  }\n}
```

```css
button { margin-right: 10px; }
```

--------------------------------

### Before: `ReactDOM.findDOMNode` usage

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Example showing the usage of `ReactDOM.findDOMNode` before migration.

```js
// Before
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

--------------------------------

### Component Usage

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/use-client.md

An example of a component usage.

```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

--------------------------------

### Install react-shallow-renderer

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Command to install react-shallow-renderer directly.

```bash
npm install react-shallow-renderer --save-dev
```

--------------------------------

### Move state up to MyApp

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/index.md

First, *move the state up* from `MyButton` into `MyApp`.

```js
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}
```

--------------------------------

### Component Definition

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/use-client.md

An example of a component definition.

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

--------------------------------

### Migrating `unmountComponentAtNode` to `root.unmount`

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Example showing how to replace `unmountComponentAtNode` with `root.unmount`.

```js
// Before
unmountComponentAtNode(document.getElementById('root'));

// After
root.unmount();
```

--------------------------------

### Module pattern factories (Before)

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Example of a module pattern factory before React 19.

```js
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

--------------------------------

### Full Pre-rendering with Activity Example

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2025/04/23/react-labs-view-transitions-activity-and-more.md

A complete example demonstrating pre-rendering with `<Activity>` and `<ViewTransition>` across multiple React components (App, Details, Home) to improve user experience by loading data and rendering content ahead of time.

```js
import { Activity, ViewTransition, use } from "react"; import Details from "./Details"; import Home from "./Home"; import { useRouter } from "./router"; import {fetchVideos} from './data';

export default function App() {
  const { url } = useRouter();
  const videoId = url.split("/").pop();
  const videos = use(fetchVideos());

  return (
    <ViewTransition>
      {/* Render videos in Activity to pre-render them */}
      {videos.map(({id}) => (
        <Activity key={id} mode={videoId === id ? 'visible' : 'hidden'}>
          <Details id={id}/>
        </Activity>
      ))}
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
    </ViewTransition>
  );
}
```

```js
import { use, Suspense, ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content.
  // If this is pre-rendered then the fallback
  // won't need to show.
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details({id}) {
  const { url, navigateBack } = useRouter();
  const video = use(fetchVideo(id));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js
import { useId, useState, use, useDeferredValue, ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when")
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what")
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');

  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
```

--------------------------------

### Migrating `ReactDOM.hydrate` to `hydrateRoot`

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

Example showing how to replace `ReactDOM.hydrate` with `ReactDOM.hydrateRoot`.

```js
// Before
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// After
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

--------------------------------

### Your own component (Solution)

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/your-first-component.md

An example of a 'Congratulations' component.

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

--------------------------------

### Complete example using JSX

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/createElement.md

A full working example demonstrating JSX for both HTML elements and custom components, including associated CSS, for comparison with `createElement`.

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

--------------------------------

### Opting out a component from compilation

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/react-compiler/installation.md

Example of using the 'use no memo' directive to temporarily prevent React Compiler from optimizing a specific component.

```js
function ProblematicComponent() {
  "use no memo";
  // Component code here
}
```

--------------------------------

### Preloading a font

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/preload.md

Example demonstrating how to preload a stylesheet and a font using `preload`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

--------------------------------

### Complete example: styles.css

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/components/common.md

CSS for the Avatar component.

```css
.avatar {
  border-radius: 50%;
}
```

--------------------------------

### Full example with custom transition types

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/ViewTransition.md

A complete Sandpack example showing how to define custom enter/exit transition types and trigger them with buttons.

```js
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition
      enter={{
        'add-video-back': 'slide-in-back',
        'add-video-forward': 'slide-in-forward',
      }}
      exit={{
        'remove-video-back': 'slide-in-forward',
        'remove-video-forward': 'slide-in-back',
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-back');
              } else {
                addTransitionType('add-video-back');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-forward');
              } else {
                addTransitionType('add-video-forward');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ➡️
        </button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

--------------------------------

### Example of Resuming a Prerender

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/server/resume.md

This example demonstrates how to use `prerender` to initially render a React application, aborting it to postpone certain parts, and then using `resume` to continue rendering from the postponed state. It includes an HTML shell, the main React application, and helper functions for flushing streams and simulating asynchronous operations.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```javascript
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } = "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // In a real app, this is where you would put your html and body.
  // We're just using tags here we can include in an existing body for demonstration purposes
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Layer 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // We're immediately aborting in a macrotask.
  // Any data fetching that's not available synchronously, or in a microtask, will not have finished.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Layer 2
  // Just waiting here for demonstration purposes.
  // In a real app, the prelude and postponed state would've been serialized in Layer 1 and Layer would deserialize them.
  // The prelude content could be flushed immediated as plain HTML while
  // React is continuing to render from where the prerender left off.
  await sleep(2000);

  // You would get the cookies from the incoming HTTP request
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Layer 3
  // Just waiting here for demonstration purposes.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));
```

```javascript
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  for await (const chunk of readable) {
    const partialHTML = decoder.decode(chunk);
    document.write(partialHTML);
  }
}

// This doesn't need to be an error.
// You can use any other means to check if an error during prerender was
// from an intentional abort or a real error.
export class Postponed extends Error {}

// We're just hardcoding a session here.
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

--------------------------------

### Full example with initializer function

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useReducer.md

A complete interactive example demonstrating the use of an initializer function with `useReducer` to manage a todo list, ensuring the initial state is computed only once.

```js
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

--------------------------------

### Install Vite

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/build-a-react-app-from-scratch.md

Command to create a new React TypeScript project using Vite.

```bash
npm create vite@latest my-app -- --template react-ts
```

--------------------------------

### Correctly passing options to createRoot

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/client/createRoot.md

This example illustrates the correct way to pass options to createRoot() and avoid the common mistake of passing them to root.render().

```js
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = createRoot(container, {onUncaughtError});
root.render(<App />);
```

--------------------------------

### Install ESLint plugin

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/react-compiler/installation.md

Command to install the ESLint plugin for React Hooks, which includes compiler rules for React Compiler.

```bash
npm install -D eslint-plugin-react-hooks@latest
```

--------------------------------

### InputEvent handler function example

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/components/common.md

Example of using the onBeforeInput event handler.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

--------------------------------

### Basic useReducer Example

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useReducer.md

An example demonstrating how to import and use `useReducer` within a functional component.

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

--------------------------------

### Your own component (Starter)

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/your-first-component.md

An empty sandbox to write your own component from scratch.

```js
// Write your component below!


```

--------------------------------

### FriendList Component Re-rendering Example

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/react-compiler/introduction.md

An example demonstrating how React components re-render all children by default when state changes, and how React Compiler optimizes this.

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```

--------------------------------

### Annotation mode example

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-compiler/directives/use-memo.md

Illustrates which functions are optimized in annotation mode.

```js
// ✅ Optimized with "use memo"
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ Not optimized (no directive)
function ProductList({ products }) {
  // ...
}
```

--------------------------------

### Waiting for all content to load for crawlers and static generation

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-dom/server/renderToPipeableStream.md

This example shows how to use the `onAllReady` callback to wait for all content to load before piping the response, specifically for crawlers or static generation, while regular users still get a streamed experience.

```js
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

--------------------------------

### Valid

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/eslint-plugin-react-hooks/lints/purity.md

Example of correct code for this rule, showing how to get a stable ID using initial state.

```js
// ✅ Stable IDs from initial state
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

--------------------------------

### Example `gating` configuration

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react-compiler/gating.md

A basic configuration for the `gating` option.

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```