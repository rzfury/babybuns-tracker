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
  if (burrowArea === 'C' && depth === 13) return true;
  // TODO: Add other specification for temple bnuy, I still dont know
  return false;
}

function isHellBunny(burrowArea, depth) {
  if (burrowArea === 'C' && depth >= 13) return true;
  // TODO: Add other specification for hell bnuy, I still dont know
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
