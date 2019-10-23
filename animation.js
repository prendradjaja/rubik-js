function tween(coordsStart, coordsEnd, frames, frameDuration, callback) {
  const totalChange = subtractCoords(coordsEnd, coordsStart);
  const changePerFrame = multiplyCoords(totalChange, 1 / frames)

  for (let i = 1; i <= frames; i++) {
    let currentCoords = addCoords(
      coordsStart,
      multiplyCoords(changePerFrame, i)
    );
    setTimeout(() => callback(currentCoords), i * frameDuration);
  }
}

function tween3d(coordsStart, coordsEnd, frames, frameDuration, callback) {
  const totalChange = subtractCoords3d(coordsEnd, coordsStart);
  const changePerFrame = multiplyCoords3d(totalChange, 1 / frames)

  for (let i = 1; i <= frames; i++) {
    let currentCoords = addCoords3d(
      coordsStart,
      multiplyCoords3d(changePerFrame, i)
    );
    setTimeout(() => callback(currentCoords), i * frameDuration);
  }
}

function addCoords3d(c1, c2) {
  return {
    r:     c1.r     + c2.r,
    theta: c1.theta + c2.theta,
    phi:   c1.phi   + c2.phi,
  };
}

function subtractCoords3d(c1, c2) {
  return {
    r:     c1.r     - c2.r,
    theta: c1.theta - c2.theta,
    phi:   c1.phi   - c2.phi,
  };
}

function multiplyCoords3d(c, scalar) {
  return {
    r:     c.r     * scalar,
    theta: c.theta * scalar,
    phi:   c.phi   * scalar,
  };
}

