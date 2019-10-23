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
