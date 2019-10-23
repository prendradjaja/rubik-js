const allPositive = {
  x: {
    face: 'F',
    opposite: 'B',
    clockwise: false
  },
  y: {
    face: 'U',
    opposite: 'D',
    clockwise: false
  },
  z: {
    face: 'L',
    opposite: 'R',
    clockwise: false
  }
};

function interpretMove(cube, axis, direction) {
  let move = { ...allPositive[axis] };
  if (direction < 0) {
    move.clockwise = !move.clockwise;
  }
  if (cube.position[axis] < 0) {
    move.clockwise = !move.clockwise;
    move.face = move.opposite;
  }
  const modifier = move.clockwise ? '' : "'";
  return move.face + modifier;
}
