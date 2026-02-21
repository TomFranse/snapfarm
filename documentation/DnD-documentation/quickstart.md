> ## Documentation Index
> Fetch the complete documentation index at: https://dndkit.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Quickstart

> Eager to get started? This quick start guide will help you familiarize yourself with the core concepts of dnd kit.

<Info>
  Before getting started, make sure you have followed the installation steps outlined in the [Installation guide](./installation).
</Info>

### Context provider

First, we'll set up the general structure of the app. In order for the [`useDraggable`](../api-documentation/draggable/use-draggable) and [`useDroppable`](../api-documentation/droppable/use-droppable) hooks to function correctly, you'll need to ensure that the components where they are used are wrapped within a [`<DndContext />`](../api-documentation/context-provider/dnd-context) component:

```jsx App.jsx theme={null}
import React from 'react';
import {DndContext} from '@dnd-kit/core';

import {Draggable} from './Draggable';
import {Droppable} from './Droppable';

function App() {
  return (
    <DndContext>
      <Draggable />
      <Droppable />
    </DndContext>
  );
}
```

### Droppable

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=b3fcd320f82dcebb0cf0e5646f3d5387" alt="Droppable" data-og-width="1994" width="1994" data-og-height="1192" height="1192" data-path="images/legacy/droppable.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=c8a742f9b1b0da8bbef76ade450bb70d 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=0f0cf25d1cbbb1eb4d765f13a6944f5b 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=40db45e15e1a7e95bee70a1b57c4ddbd 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=f512ff6135d92ee2efe68836baaab851 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=8773a8ddaabaf44b9f0a08aacfae69b1 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=a4c0fbb9209d5d5ac8d2c9ccc7947d8d 2500w" />

Next, let's set up your first **Droppable** component. To do so, we'll be using the `useDroppable` hook.\
\
The `useDroppable` hook isn't opinionated about how your app should be structured. At minimum though, it requires you pass a [ref](https://reactjs.org/docs/refs-and-the-dom.html) to the DOM element that you would like to become droppable. You'll also need to provide a unique `id` attribute to all your droppable components.

When a **draggable** element is moved over your droppable element, the `isOver` property will become true.

```jsx Droppable.jsx theme={null}
import React from 'react';
import {useDroppable} from '@dnd-kit/core';

function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
```

### Draggable

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=5f1c2e0dda0c8b7db80d9a152c804cab" alt="Draggable" data-og-width="1742" width="1742" data-og-height="658" height="658" data-path="images/legacy/draggable.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=32cebea7161728231774f1255d18ba5a 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=513533528f57565ed32997cbb5ff295b 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=7339c488d21daa604376d98c4fe593a8 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=f56b9085c191a7d61cdc4ced50ba23cd 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=9954a3470bc0a33d7920b94afd8c517c 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=148e51cf34eedaef8202946fb9522b3e 2500w" />

Next, let's take a look at implementing our first **Draggable** component. To do so, we'll be using the `useDraggable` hook.

The `useDraggable` hook isn't opinionated about how your app should be structured. It does however require you to be able to attach listeners and a ref to the DOM element that you would like to become draggable. You'll also need to provide a unique `id` attribute to all your draggable components.

After a draggable item is picked up, the `transform` property will be populated with the `translate` coordinates you'll need to move the item on the screen.

The `transform` object adheres to the following shape: `{x: number, y: number, scaleX: number, scaleY: number}`

```jsx Draggable.jsx theme={null}
import React from 'react';
import {useDraggable} from '@dnd-kit/core';

function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
```

As you can see from the example above, it really only takes just a few lines to transform your existing components into draggable components.

<Success>
  **Tips:**

  * For performance reasons, we recommend you use **`transform`** over other positional CSS properties to move the dragged element.
  * You'll likely want to alter the **`z-index`** of your Draggable component to ensure it appears on top of other elements.
  * If your item needs to move from one container to another, we recommend you use the [`<DragOverlay>`](../api-documentation/draggable/drag-overlay) component.
</Success>

Converting the `transform` object to a string can feel tedious. Fear not, you can avoid having to do this by hand by importing the `CSS` utility from the `@dnd-kit/utilities` package:

```jsx  theme={null}
import {CSS} from '@dnd-kit/utilities';

// Within your component that receives `transform` from `useDraggable`:
const style = {
  transform: CSS.Translate.toString(transform),
};
```

### Assembling all the pieces

Once you've set up your **Droppable** and **Draggable** components, you'll want to come back to where you set up your [`<DndContext>`](../api-documentation/context-provider/) component so you can add event listeners to be able to respond to the different events that are fired.

In this example, we'll assume you want to move your `<Draggable>` component from outside into your `<Droppable>` component:

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable-droppable.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=b51f16464391e34d72c05a7701272667" alt="A draggable item is moved towards a droppable container" data-og-width="1964" width="1964" data-og-height="1422" height="1422" data-path="images/legacy/draggable-droppable.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable-droppable.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=c5375780f53599f43291027affdc10c1 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable-droppable.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=fa536df0998bf6238d37650a6d7b3f35 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable-droppable.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=6af843113b3399fb61c620daa4cb74b4 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable-droppable.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=035d7936070d3f756182718f5b90ac02 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable-droppable.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=766e4802eea9c73f333247fc18870c71 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/draggable-droppable.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=9ccc8beb4523fb30f2c0cc1354930351 2500w" />

To do so, you'll want to listen to the `onDragEnd` event of the `<DndContext>` to see if your draggable item was dropped over your droppable:

<CodeGroup>
  ```jsx App.jsx theme={null}
  import React, {useState} from 'react';
  import {DndContext} from '@dnd-kit/core';

  import {Droppable} from './Droppable';
  import {Draggable} from './Draggable';

  function App() {
    const [isDropped, setIsDropped] = useState(false);
    const draggableMarkup = <Draggable>Drag me</Draggable>;

    return (
      <DndContext onDragEnd={handleDragEnd}>
        {!isDropped ? draggableMarkup : null}
        <Droppable>{isDropped ? draggableMarkup : 'Drop here'}</Droppable>
      </DndContext>
    );

    function handleDragEnd(event) {
      if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }
  ```

  ```jsx Droppable.jsx theme={null}
  import React from 'react';
  import {useDroppable} from '@dnd-kit/core';

  export function Droppable(props) {
    const {isOver, setNodeRef} = useDroppable({
      id: 'droppable',
    });
    const style = {
      color: isOver ? 'green' : undefined,
    };

    return (
      <div ref={setNodeRef} style={style}>
        {props.children}
      </div>
    );
  }
  ```

  ```jsx Draggable.jsx theme={null}
  import React from 'react';
  import {useDraggable} from '@dnd-kit/core';

  export function Draggable(props) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: 'draggable',
    });
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    return (
      <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {props.children}
      </button>
    );
  }
  ```
</CodeGroup>

That's it! You've set up your first [**Droppable**](../api-documentation/droppable) \*\*\*\* and [\*\*Draggable\*\*](../api-documentation/draggable) components.

### Pushing things a bit further

The example we've set up above is a bit simplistic. In a real world example, you may have multiple droppable containers, and you may also want to be able to drag your items back out of the droppable containers once they've been dragged within them.

Here's a slightly more complex example that contains multiple **Droppable** containers:

<CodeGroup>
  ```jsx App.jsx theme={null}
  import React, {useState} from 'react';
  import {DndContext} from '@dnd-kit/core';

  import {Droppable} from './Droppable';
  import {Draggable} from './Draggable';

  function App() {
    const containers = ['A', 'B', 'C'];
    const [parent, setParent] = useState(null);
    const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

    return (
      <DndContext onDragEnd={handleDragEnd}>
        {parent === null ? draggableMarkup : null}

        {containers.map((id) => (
          // We updated the Droppable component so it would accept an `id`
          // prop and pass it to `useDroppable`
          <Droppable key={id} id={id}>
            {parent === id ? draggableMarkup : 'Drop here'}
          </Droppable>
        ))}
      </DndContext>
    );

    function handleDragEnd(event) {
      const {over} = event;

      // If the item is dropped over a container, set it as the parent
      // otherwise reset the parent to `null`
      setParent(over ? over.id : null);
    }
  }

  ```

  ```jsx Droppable.jsx theme={null}
  import React from 'react';
  import {useDroppable} from '@dnd-kit/core';

  export function Droppable(props) {
    const {isOver, setNodeRef} = useDroppable({
      id: props.id,
    });
    const style = {
      color: isOver ? 'green' : undefined,
    };

    return (
      <div ref={setNodeRef} style={style}>
        {props.children}
      </div>
    );
  }
  ```

  ```jsx Draggable.jsx theme={null}
  import React from 'react';
  import {useDraggable} from '@dnd-kit/core';

  export function Draggable(props) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: props.id,
    });
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    return (
      <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {props.children}
      </button>
    );
  }
  ```
</CodeGroup>

We hope this quick start guide has given you a glimpse of the simplicity and power of @dnd-kit. There's much more to learn, and we encourage you to keep reading about all of the different options you can pass to `<DndContext>` , `useDroppable` and `useDraggable` by reading their respective API documentation.
