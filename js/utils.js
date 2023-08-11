// ---- TECHNICAL

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {HTMLElement[] | undefined} subs
 */
function createElement(tagName, subs = []) {
  const el = document.createElement(tagName);
  if (subs) {
    subs.forEach(sub => el.append(sub));
  }
  return el;
}

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {string} id
 * @param {HTMLElement[] | undefined} subs
 */
function createElementWithId(tagName, id, subs = []) {
  const el = createElement(tagName, subs);
  el.id = id;
  return el;
}

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {string} text 
 */
function createElementWithText(tagName, text) {
  return createElement(tagName, [document.createTextNode(text)]);
}

/**
 * @param {HTMLElement | string} el
 * @param {string} newText
 */
function updateText(el, newText) {
  if (typeof (el) === 'string') {
    const elem = document.querySelector(el);
    if (elem) elem.textContent = newText
    else console.warn(`No element with selector "${el}" was found!`);
  }
  else {
    el.textContent = newText;
  }
}

/**
 * @param {HTMLElement} el 
 * @param {string[]} classes 
 */
function addClass(el, classes = []) {
  el.classList.add(...classes);
}

/**
 * @param {number} ms 
 * @returns {Promise<void>}
 */
async function waitFor(ms = 1) {
  return new Promise(y => setTimeout(y, ms));
}

/**
 * @param {string} url 
 */
async function loadJSON(url = '') {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(async (res) => {
        resolve(await res.json())
      })
      .catch(reject)
  });
}

/**
 * @param {string} url 
 */
async function loadCSV(url) {
  return new Promise((resolve, reject) => {
    const data = [];
    Papa.parse(url, {
      download: true,
      step: function (row) {
        if (Array.isArray(row.data)) {
          if (row.data[0] === '#') return;
          data.push(row.data[1]);
        }
      },
      complete: function () {
        resolve(data)
      },
      error: function (err) {
        reject(err)
      }
    })
  });
}

function arrSwitch(value, lookupArray, defaultValue = null) {
  let result = defaultValue;
  for (let i = 0; i < lookupArray.length; i++) {
    if (value === lookupArray[i][0]) {
      result = lookupArray[i][1];
      break;
    }
  }
  return result;
}
