const BALL_ID = 'drag-demo-ball';
const DRAG_DEMO_ID = 'drag-demo';
const TOUCH_CONTROLLER_ID = 'touch-controller';

const state = {
  ballCoords: { x: 100, y: 100 },
  // Where the mouse was when user started dragging. Null if not dragging.
  dragStartCoords: null,
  // Where the ball was when user started dragging. Null if not dragging.
  ballDragStartCoords: null,
};

function hideTouchControl() {
  [BALL_ID, DRAG_DEMO_ID, TOUCH_CONTROLLER_ID]
    .map(id => document.getElementById(id))
    .forEach(el => el.style.display = 'none');
}

function initTouchControl() {
  const touchController = document.getElementById(TOUCH_CONTROLLER_ID);
  const ball = document.getElementById(BALL_ID);
  renderBall();

  touchController.addEventListener('mousedown', handleMouseDown);
  touchController.addEventListener('mouseup', handleMouseUp);
  touchController.addEventListener('mousemove', handleMouseMove);
  // todo touch events
}

function handleTouchStart(event) {
  state.dragStartCoords = state.getCoordsFromTouchEvent(event);
  state.ballDragStartCoords = { ...state.ballCoords };
}

function handleTouchEnd() {
  state.dragStartCoords = null;
}

function handleTouchMove(event) {
  if (isDragging()) {
    const offset = subtractCoords(
      getCoordsFromTouchEvent(event),
      state.dragStartCoords
    );
    state.ballCoords = addCoords(state.ballDragStartCoords, offset);
  }
}

function handleMouseDown(event) {
  state.dragStartCoords = getCoordsFromMouseEvent(event);
  state.ballDragStartCoords = { ...state.ballCoords };
}

function handleMouseUp() {
  state.dragStartCoords = null;
}

function handleMouseMove(event) {
  if (isDragging()) {
    const offset = subtractCoords(
      getCoordsFromMouseEvent(event),
      state.dragStartCoords
    );
    state.ballCoords = addCoords(state.ballDragStartCoords, offset);
    renderBall();
  }
}

function getCoordsFromTouchEvent(event) {
  return {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
}

function getCoordsFromMouseEvent(event) {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function isDragging() {
  return !!state.dragStartCoords;
}

function addCoords(c1, c2) {
  return {
    x: c1.x + c2.x,
    y: c1.y + c2.y,
  };
}

function subtractCoords(c1, c2) {
  return {
    x: c1.x - c2.x,
    y: c1.y - c2.y,
  };
}

function renderBall() {
  const ball = document.getElementById(BALL_ID);
  ball.style.left = state.ballCoords.x + 'px';
  ball.style.top = state.ballCoords.y + 'px';
}
