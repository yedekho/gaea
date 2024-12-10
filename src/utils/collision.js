export function checkCollision(birdRect, pipeRects) {
  return intersects(birdRect, pipeRects.top) || 
         intersects(birdRect, pipeRects.bottom);
}

export function intersects(rect1, rect2) {
  return !(rect1.right < rect2.left || 
           rect1.left > rect2.right || 
           rect1.bottom < rect2.top || 
           rect1.top > rect2.bottom);
}