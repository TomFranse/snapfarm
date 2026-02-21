> ## Documentation Index
> Fetch the complete documentation index at: https://dndkit.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Collision detection algorithms

If you're familiar with how 2D games are built, you may have come across the notion of collision detection algorithms.

One of the simpler forms of collision detection is between two rectangles that are axis aligned — meaning rectangles that are not rotated. This form of collision detection is generally referred to as [Axis-Aligned Bounding Box](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Axis-Aligned_Bounding_Box) (AABB).

The built-in collision detection algorithms assume a rectangular bounding box.

> The bounding box of an element is the smallest possible rectangle (aligned with the axes of that element's user coordinate system) that entirely encloses it and its descendants.\
> – Source: [MDN](https://developer.mozilla.org/en-US/docs/Glossary/bounding_box)

This means that even if the draggable or droppable nodes look round or triangular, their bounding boxes will still be rectangular:

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/axis-aligned-rectangle.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=7cba168a3c21f4bbe5e923d959909177" alt="Axis-aligned bounding boxes" data-og-width="2366" width="2366" data-og-height="1714" height="1714" data-path="images/legacy/axis-aligned-rectangle.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/axis-aligned-rectangle.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=47b9368a042bc66a8d05c293c9d107f1 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/axis-aligned-rectangle.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=12702312959d64ca2a9f81d0be0bc8fe 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/axis-aligned-rectangle.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=9d9ac83841f17ece2622ddd38431ead1 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/axis-aligned-rectangle.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=15dc6bcb04974e53b54423cc33648de7 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/axis-aligned-rectangle.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=85d6b727f111fe03952362d809cb52ed 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/axis-aligned-rectangle.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=cfb48afe36add70d152f04c0cfefc592 2500w" />

If you'd like to use other shapes than rectangles for detecting collisions, build your own [custom collision detection algorithm](./collision-detection-algorithms#custom-collision-detection-strategies).

## Rectangle intersection

By default, [`DndContext`](./dnd-context) uses the **rectangle intersection** collision detection algorithm.

The algorithm works by ensuring there is no gap between any of the 4 sides of the rectangles. Any gap means a collision does not exist.

This means that in order for a draggable item to be considered **over** a droppable area, there needs to be an intersection between both rectangles:

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/rectangle-intersection.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=8a8985027d559a43d1ea5d669f7df78b" alt="Rectangle intersection" data-og-width="2176" width="2176" data-og-height="1082" height="1082" data-path="images/legacy/rectangle-intersection.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/rectangle-intersection.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=727515d2cb0640964d1b556e72942215 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/rectangle-intersection.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=0b5653dae035595c991905f11b796034 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/rectangle-intersection.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=02e4739cc3fa2a07d7fa4e3335c9c989 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/rectangle-intersection.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=84f1ca68b938ebd80bdbf0cfc1245fc5 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/rectangle-intersection.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=fa247af0f368402084af0d1edbd8f10e 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/rectangle-intersection.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=327400c2b2b079e92198a7e7ce88ae92 2500w" />

## Closest center

While the rectangle intersection algorithm is well suited for most drag and drop use cases, it can be unforgiving, since it requires both the draggable and droppable bounding rectangles to come into direct contact and intersect.

For some use cases, such as [sortable](../../presets/sortable/) lists, using a more forgiving collision detection algorithm is recommended.

As its name suggests, the closest center algorithm finds the droppable container who's center is closest to the center of the bounding rectangle of the active draggable item:

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=af9881394b9c174972d814be8d57afb7" alt="Closest center" data-og-width="2216" width="2216" data-og-height="1926" height="1926" data-path="images/legacy/closest-center.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=505cc8886cd15f1962d7a7069497d158 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=fb110c824310769e56d337ee60a796a3 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=49e71bf514ff74f7aed42187350dc4db 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=51a76deac224b5e9f86a7cc4ec0cc044 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=b8ffd46e8d3165230da0153a633977c2 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=7d2f89d6c27bd1c748605624b9fbd06f 2500w" />

## Closest corners

Like to the closest center algorithm, the closest corner algorithm doesn't require the draggable and droppable rectangles to intersect.

Rather, it measures the distance between all four corners of the active draggable item and the four corners of each droppable container to find the closest one.

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=ea172928c2267d996d8f858cb91ab34d" alt="Closest corners" data-og-width="1510" width="1510" data-og-height="1190" height="1190" data-path="images/legacy/closest-corners.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=bcef845213df3ab88ee2c1173c01dd00 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=ccd13baaf0c6bd3caf0b95f4009ab645 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=c32d7d04aa863c3dfc0ab231d8e3cafd 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=bdd848c5d7d1ba36dd46a814f048df0a 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=6c72ae5713bdc0c87e60f9620042b32b 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=99149e64de455e554947dd9d1917cc8f 2500w" />

The distance is measured from the top left corner of the draggable item to the top left corner of the droppable bounding rectangle, top right to top right, bottom left to bottom left, and bottom right to bottom right.

### **When should I use the closest corners algorithm instead of closest center?**

In most cases, the **closest center** algorithm works well, and is generally the recommended default for sortable lists because it provides a more forgiving experience than the **rectangle intersection algorithm**.

In general, the closest center and closest corners algorithms will yield the same results. However, when building interfaces where droppable containers are stacked on top of one another, for example, when building a Kanban, the closest center algorithm can sometimes return the underlaying droppable of the entire Kanban column rather than the droppable areas within that column.

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center-kanban.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=468abf852c739498c97898673eac2866" alt="Closest center is 'A', though the human eye would likely expect 'A2'" data-og-width="2798" width="2798" data-og-height="2286" height="2286" data-path="images/legacy/closest-center-kanban.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center-kanban.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=cd338f8159544a7bb0c11fdc809ebaa4 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center-kanban.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=6cba856e0cdf645cd2d4d66c3868a4b0 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center-kanban.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=aefd2ee41ac5efd6e8b13fc3f5a6ce21 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center-kanban.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=fb08b5e97c14d36eae561ef216420712 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center-kanban.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=7e71fceb49e687df1d29049bead547dc 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-center-kanban.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=0245db56753c2a42d5828738b01de66d 2500w" />

In those situations, the **closest corners** algorithm is preferred and will yield results that are more aligned with what the human eye would predict:

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners-kanban.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=cc0ec09323da0a3be2ff75ee90d8879a" alt="Closest corners is 'A2', as the human eye would expect." data-og-width="2798" width="2798" data-og-height="2286" height="2286" data-path="images/legacy/closest-corners-kanban.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners-kanban.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=dbf6bede1b7860dafe80cb08bf5a288d 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners-kanban.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=9a991bc0821d52b68716ebfb79f3ad65 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners-kanban.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=cf3a70a3ad01714790495e715b9e4104 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners-kanban.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=db751da2a0a6e9ed0516d5c49ef6f7c0 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners-kanban.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=f736d1184f728d77255e5d0e1ff05dc3 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/closest-corners-kanban.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=19d288286b1e6d468f30e5144d836ade 2500w" />

## Pointer within

As its name suggests, the pointer within collision detection algorithm only registers collision when the pointer is contained within the bounding rectangle of other droppable containers.

This collision detection algorithm is well suited for high precision drag and drop interfaces.

<Info>
  As its name suggests, this collision detection algorithm **only works with pointer-based sensors**. For this reason, we suggest you use [composition of collision detection algorithms](#composition-of-existing-algorithms) if you intend to use the `pointerWithin` collision detection algorithm so that you can fall back to a different collision detection algorithm for the Keyboard sensor.
</Info>

## Custom collision detection algorithms

In advanced use cases, you may want to build your own collision detection algorithms if the ones provided out of the box do not suit your use case.

You can either write a new collision detection algorithm from scratch, or compose two or more existing collision detection algorithms.

### Composition of existing algorithms

Sometimes, you don't need to build custom collision detection algorithms from scratch. Instead, you can compose existing collision algorithms to augment them.

A common example of this is when using the `pointerWithin` collision detection algorithm. As its name suggest, this collision detection algorithm depends on pointer coordinates, and therefore does not work when using other sensors like the Keyboard sensor. It's also a very high precision collision detection algorithm, so it can sometimes be helpful to fall back to a more tolerant collision detection algorithm when the `pointerWithin` algorithm does not return any collisions.

```javascript  theme={null}
import {pointerWithin, rectIntersection} from '@dnd-kit/core';

function customCollisionDetectionAlgorithm(args) {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args);
}
```

Another example where composition of existing algorithms can be useful is if you want some of your droppable containers to have a different collision detection algorithm than the others.

For instance, if you were building a sortable list that also supported moving items to a trash bin, you may want to compose both the `closestCenter` and `rectangleIntersection` collision detection algorithms.

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=450b8af821a9542b30e8f01aa2588fcc" alt="Use the closest corners algorithm for all droppables except 'trash'." data-og-width="2798" width="2798" data-og-height="2286" height="2286" data-path="images/legacy/custom-collision-detection.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=7009b2113721504eaf97243537ec381b 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=fd4704d3f42b65c0ccac2ffe51b9f626 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=44deeb083a454c5072e510e0be30d3dc 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=00a307bd27e4d0e499b1669814e6d638 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=2a0603f776bdbabb9c52b2ef45cda603 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=895ced45b0a5f1127d79a785f04c88c4 2500w" />

<img src="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection-intersection.png?fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=e508f3ccf296589dde53cb53f0d02ac1" alt="Use the intersection detection algorithm for the 'trash' droppable." data-og-width="2798" width="2798" data-og-height="2286" height="2286" data-path="images/legacy/custom-collision-detection-intersection.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection-intersection.png?w=280&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=8082570047dd806369141ea23629865f 280w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection-intersection.png?w=560&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=1ffe4cb83a0d7af31336a247ff55949d 560w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection-intersection.png?w=840&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=becd030c6108ae64fc6a59d4b23aa623 840w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection-intersection.png?w=1100&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=5bbc14607458d4bfb47db5faa85fc625 1100w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection-intersection.png?w=1650&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=babed75fe4db20a7a759578569b47ff1 1650w, https://mintcdn.com/dnd-kit/mkvHCrAQiGvjrBWI/images/legacy/custom-collision-detection-intersection.png?w=2500&fit=max&auto=format&n=mkvHCrAQiGvjrBWI&q=85&s=7e7b2822406fcb4417f1ec6d01cea3fd 2500w" />

From an implementation perspective, the custom intersection algorithm described in the example above would look like:

```javascript  theme={null}
import {closestCorners, rectIntersection} from '@dnd-kit/core';

function customCollisionDetectionAlgorithm({droppableContainers, ...args}) {
  // First, let's see if the `trash` droppable rect is intersecting
  const rectIntersectionCollisions = rectIntersection({
    ...args,
    droppableContainers: droppableContainers.filter(({id}) => id === 'trash'),
  });

  // Collision detection algorithms return an array of collisions
  if (rectIntersectionCollisions.length > 0) {
    // The trash is intersecting, return early
    return rectIntersectionCollisions;
  }

  // Compute other collisions
  return closestCorners({
    ...args,
    droppableContainers: droppableContainers.filter(({id}) => id !== 'trash'),
  });
}
```

### Building custom collision detection algorithms

For advanced use cases or to detect collision between non-rectangular or non-axis aligned shapes, you'll want to build your own collision detection algorithms.

Here's an example to [detect collisions between circles](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Circle_Collision) instead of rectangles:

```javascript  theme={null}
/**
 * Sort collisions in descending order (from greatest to smallest value)
 */
export function sortCollisionsDesc(
  {data: {value: a}},
  {data: {value: b}}
) {
  return b - a;
}

function getCircleIntersection(entry, target) {
  // Abstracted the logic to calculate the radius for simplicity
  var circle1 = {radius: 20, x: entry.offsetLeft, y: entry.offsetTop};
  var circle2 = {radius: 12, x: target.offsetLeft, y: target.offsetTop};

  var dx = circle1.x - circle2.x;
  var dy = circle1.y - circle2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle1.radius + circle2.radius) {
    return distance;
  }

  return 0;
}

/**
 * Returns the circle that has the greatest intersection area
 */
function circleIntersection({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  const collisions = [];

  for (const droppableContainer of droppableContainers) {
    const {id} = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect) {
      const intersectionRatio = getCircleIntersection(rect, collisionRect);

      if (intersectionRatio > 0) {
        collisions.push({
          id,
          data: {droppableContainer, value: intersectionRatio},
        });
      }
    }
  }

  return collisions.sort(sortCollisionsDesc);
};
```

To learn more, refer to the implementation of the built-in collision detection algorithms.
