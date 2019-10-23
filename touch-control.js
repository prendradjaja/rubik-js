// todo dedupe mouse/touch stuff

const BALL_ID = 'drag-demo-ball';
const DRAG_DEMO_ID = 'drag-demo';
const TOUCH_CONTROLLER_ID = 'touch-controller';

const ballCenterCoords = { x: 200, y: 150 };
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
  moveCameraFromOffset({ x: 0, y: 0 });

  touchController.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', handleMouseMove);

  // touchController.addEventListener('touchstart', () => console.log('touch start'));
  // touchController.addEventListener('touchend', () => console.log('touch end'));
  // touchController.addEventListener('touchmove', () => console.log('touch move'));

  touchController.addEventListener('touchstart', handleTouchStart);
  touchController.addEventListener('touchend', handleTouchEnd);
  touchController.addEventListener('touchmove', handleTouchMove);
}

function handleTouchStart(event) {
    console.log('touch start!')
  state.dragStartCoords = getCoordsFromTouchEvent(event);
  state.ballDragStartCoords = { ...state.ballCoords };
}

function handleTouchEnd() {
  state.dragStartCoords = null;
  state.ballCoords = { ...ballCenterCoords };
  renderBall();
  tween3d(
    offsetToSphericalCoords(state.offset),
    offsetToSphericalCoords({x:0,y:0}),
    15,
    10,
    sCoords3d => {
      moveCameraFromSphericalCoords(sCoords3d);
    }
  );
}

function handleTouchMove(event) {
  if (isDragging()) {
    const offset = subtractCoords(
      getCoordsFromTouchEvent(event),
      state.dragStartCoords
    );
    state.ballCoords = addCoords(ballCenterCoords, offset);
    state.offset = offset;
    renderBall();
    moveCameraFromOffset(offset);
  }
}

function handleMouseDown(event) {
  state.dragStartCoords = getCoordsFromMouseEvent(event);
  state.ballDragStartCoords = { ...state.ballCoords };
}

function handleMouseUp() {
  state.dragStartCoords = null;
  state.ballCoords = { ...ballCenterCoords };
  renderBall();
  tween3d(
    offsetToSphericalCoords(state.offset),
    offsetToSphericalCoords({x:0,y:0}),
    15,
    10,
    sCoords3d => {
      moveCameraFromSphericalCoords(sCoords3d);
    }
  );
}

function handleMouseMove(event) {
  if (isDragging()) {
    const offset = subtractCoords(
      getCoordsFromMouseEvent(event),
      state.dragStartCoords
    );
    state.ballCoords = addCoords(ballCenterCoords, offset);
    state.offset = offset;
    renderBall();
    moveCameraFromOffset(offset);
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

function multiplyCoords(c, scalar) {
  return {
    x: c.x * scalar,
    y: c.y * scalar,
  };
}

function renderBall() {
  const ball = document.getElementById(BALL_ID);
  ball.style.left = state.ballCoords.x + 'px';
  ball.style.top = state.ballCoords.y + 'px';
}

function switchAxes(cCoords3d) {
  return {
    x: cCoords3d.x,
    y: cCoords3d.z,
    z: cCoords3d.y
  };
}

function offsetToSphericalCoords(offset2d) {
  offset2d = invertHorizontally(offset2d);
  offset2d = invertVertically(offset2d);

  const xScalar = 1/500;
  const yScalar = 1/600;
  const restingVerticalAngle = Math.PI * 1/8;

  const clippedVerticalAngle = clip(
    offset2d.y * yScalar * Math.PI,
    -3/8 * Math.PI,
    1/8 * Math.PI
  );
  return {
    r: 50,
    theta: clip(
      offset2d.x * xScalar * Math.PI,
      -3/4 * Math.PI,
      3/4 * Math.PI,
    ),
    phi: (Math.PI / 2) - clippedVerticalAngle - restingVerticalAngle
  };
}

function clip(value, min, max) {
  return Math.max(
    Math.min(value, max),
    min
  );
}

function sphericalToCartesian(sCoords3d) {
  const c = sCoords3d;
  return {
    x: c.r * Math.sin(c.phi) * Math.cos(c.theta),
    y: c.r * Math.sin(c.phi) * Math.sin(c.theta),
    z: c.r * Math.cos(c.phi)
  }
}

function moveCamera(cCoords3d) {
  const c = cCoords3d;
  window.camera.position = new THREE.Vector3(c.x, c.y, c.z);
  window.camera.lookAt(window.scene.position);
}

function invertHorizontally(offset) {
  return { x: -offset.x, y: offset.y };
}

function invertVertically(offset) {
  return { x: offset.x, y: -offset.y };
}

function moveCameraFromOffset(offset) {
  const sCoords3d = offsetToSphericalCoords(offset);
  const cCoords3d = sphericalToCartesian(sCoords3d);
  const coords = switchAxes(cCoords3d);
  moveCamera(coords);
}

function moveCameraFromSphericalCoords(sCoords3d) {
  const cCoords3d = sphericalToCartesian(sCoords3d);
  const coords = switchAxes(cCoords3d);
  moveCamera(coords);
}
