> ## Documentation Index
> Fetch the complete documentation index at: https://dndkit.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Droppable

> Use the `useDroppable` hook to set up DOM nodes as droppable areas that [draggable](./draggable) elements can be dropped over.

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=b3fcd320f82dcebb0cf0e5646f3d5387" alt="Droppable" data-og-width="1994" width="1994" data-og-height="1192" height="1192" data-path="images/legacy/droppable.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=c8a742f9b1b0da8bbef76ade450bb70d 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=0f0cf25d1cbbb1eb4d765f13a6944f5b 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=40db45e15e1a7e95bee70a1b57c4ddbd 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=f512ff6135d92ee2efe68836baaab851 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=8773a8ddaabaf44b9f0a08aacfae69b1 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/droppable.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=a4c0fbb9209d5d5ac8d2c9ccc7947d8d 2500w" />

## Usage

The `useDroppable` hook isn't opinionated about how you should structure your application.

At minimum though, you need to pass the `setNodeRef` function that is returned by the `useDroppable` hook to a DOM element so that it can register the underlying DOM node and keep track of it to detect collisions and intersections with other draggable elements.

<Info>
  If the concept of `ref` is new to you, we recommend you first check out the [Refs and the DOM article](https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-dom-element) on the React documentation website.
</Info>

```jsx  theme={null}
import {useDroppable} from '@dnd-kit/core';

function Droppable() {
  const {setNodeRef} = useDroppable({
    id: 'unique-id',
  });

  return <div ref={setNodeRef}>/* Render whatever you like within */</div>;
}
```

You can set up as many droppable containers as you want, just make sure they all have a unique `id` so that they can be differentiated. Each droppable needs to have its own unique node though, so make sure you don't try to connect a single droppable to multiple refs.

To set up multiple droppable targets, simply use the `useDroppable` hook as many times as needed.

```jsx  theme={null}
function MultipleDroppables() {
  const {setNodeRef: setFirstDroppableRef} = useDroppable({
    id: 'droppable-1',
  });
  const {setNodeRef: setsecondDroppableRef} = useDroppable({
    id: 'droppable-2',
  });

  return (
    <section>
      <div ref={setFirstDroppableRef}>
        /* Render whatever you like within */
      </div>
      <div ref={setsecondDroppableRef}>
        /* Render whatever you like within */
      </div>
    </section>
  );
}
```

If you need to dynamically render a list of droppable containers, we recommend you create a re-usable Droppable component and render that component as many times as needed:

```jsx  theme={null}
function Droppable(props) {
  const {setNodeRef} = useDroppable({
    id: props.id,
  });

  return <div ref={setNodeRef}>{props.children}</div>;
}

function MultipleDroppables() {
  const droppables = ['1', '2', '3', '4'];

  return (
    <section>
      {droppables.map((id) => (
        <Droppable id={id} key={id}>
          Droppable container id: ${id}
        </Droppable>
      ))}
    </section>
  );
}
```

For more details usage of the `useDroppable` hook, refer to the API documentation section:

<Card href="./droppable/use-droppable">
  useDroppable
</Card>
