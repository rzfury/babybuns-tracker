/**
 * @param {string} bun
 */
function getBurrowArea(bun) {
  return bun.split('-')[0];
}

/**
 * @param {string} bun
 */
function getBurrowDepth(bun) {
  return bun.split('-')[1];
}

function isTempleBunny(burrowArea, depth) {
  depth = parseInt(depth)

  if (burrowArea === 'C' && depth === 13) return true;
  if (burrowArea === 'W' && (depth >= 13 && depth <= 18)) return true;
  if (burrowArea === 'N' && (depth >= 12 && depth <= 18)) return true;
  if (burrowArea === 'S' && (depth >= 13 && depth <= 20)) return true;
  if (burrowArea === 'E' && (depth === 13)) return true; // temporary
  // TODO: Add other classification for temple bnuy, I still dont know

  return false;
}

function isHellBunny(burrowArea, depth) {
  depth = parseInt(depth)

  if (burrowArea === 'C' && (depth > 14 && depth <= 26)) return true;
  if (burrowArea === 'W' && (depth >= 19 && depth <= 26)) return true;
  if (burrowArea === 'N' && (depth >= 19 && depth <= 23)) return true;
  if (burrowArea === 'S' && (depth >= 21 && depth <= 23)) return true;
  if (burrowArea === 'E' && (depth >= 14 && depth <= 22)) return true;
  // TODO: Add other classification for hell bnuy, I still dont know

  return false;
}

function isVoidBunny(burrowArea) {
  return burrowArea === 'NE?' || burrowArea === 'NW?' || burrowArea === 'SE?' || burrowArea === 'SW?';
}

function verifyDiscovered(dataLookup, buns) {
  const snub = buns.split("X").reverse().join("X").replace("X", " X ");
  const a = dataLookup.includes(buns);
  const b = dataLookup.includes(snub)
  return a || b;
}
