/** @type {HTMLDivElement} */
const cliThingy = document.getElementById('cli-thingy');
/** @type {HTMLDivElement} */
const bnuyForm = document.getElementById('bnuy-export-data-wrapper');
/** @type {HTMLTextAreaElement} */
const textarea = document.getElementById('exported-data');
/** @type {HTMLSelectElement} */
const bnuyCategory = document.getElementById('bnuy-category');
/** @type {HTMLButtonElement} */
const checkBnuyBtn = document.getElementById('check-bunnies');
/** @type {HTMLDivElement} */
const bnuyList = document.getElementById('bnuy-list');
/** @type {HTMLButtonElement} */
const showUnmatedBtn = document.getElementById('show-unmated');

const data = {
  coupleData: {
    all: [],
    upper_temple: [],
    upper_temple_hell: [],
    void: [],
    bugs: []
  },
  progress: [],
  discovered: 0,
}

async function onLoad() {
  checkBnuyBtn.addEventListener('click', (e) => {
    Array.from(document.getElementById('bnuy-list').children).forEach(c => c.remove());
    parseAndStoreProgress();
    onCheckBunnies();
  });

  showUnmatedBtn.addEventListener('click', (e) => {
    const showUnmated = !(bnuyList.getAttribute('data-show-unmated') === 'true');
    bnuyList.setAttribute('data-show-unmated', showUnmated.toString());
    showUnmatedBtn.textContent = `${showUnmated ? 'HIDE' : 'SHOW'} UNMATED`;
  });

  try {
    const elLoadThingy = createElementWithText('div', 'Loading known baby bnuy data...');
    cliThingy.append(elLoadThingy);

    const lastCsvUpdate = await loadJSON('/csv/csv_info.json').catch(e => { throw e; });
    cliThingy.append(createElementWithText('div', `Last Update: ${new Intl.DateTimeFormat().format(Date.parse(lastCsvUpdate.last_updated))}`));

    data.coupleData.all = await loadCSV("/csv/Pâquerette's Baby-Hunting Progress - All Babies.csv").catch(e => { throw e; });
    data.coupleData.upper_temple = await loadCSV("/csv/Pâquerette's Baby-Hunting Progress - Upper+Temple Babies.csv").catch(e => { throw e; });
    data.coupleData.upper_temple_hell = await loadCSV("/csv/Pâquerette's Baby-Hunting Progress - Upper+Temple+Hell Babies (No Void).csv").catch(e => { throw e; });
    data.coupleData.void = await loadCSV("/csv/Pâquerette's Baby-Hunting Progress - Void Babies.csv").catch(e => { throw e; });
    data.coupleData.bugs = await loadCSV("/csv/Pâquerette's Baby-Hunting Progress - Bugs Bunnies.csv").catch(e => { throw e; });
    updateText(elLoadThingy, 'Loading known baby bnuy data... DONE');
    cliThingy.append(createElementWithText('div', 'Known bnuy data successfully loaded!'));

    await waitFor(1000);

    Array.from(cliThingy.children).forEach(el => el.remove());
    bnuyForm.setAttribute('data-show', 'true');
  }
  catch (err) {
    console.error(err);
  }
}

function parseAndStoreProgress() {
  data.discovered = 0;
  data.progress.length = 0;

  const category = arrSwitch(
    bnuyCategory.value,
    [
      ['upper_temple', 'Upper + Temple'],
      ['upper_temple_hell', 'Upper + Temple + Hell (No Void)'],
      ['void', 'Void Only'],
      ['all', 'All'],
      ['bugs', 'Bugs Only']
    ],
    'Upper + Temple'
  );
  /** @type {HTMLSpanElement} */
  const categoryText = document.getElementById('category-name');
  categoryText.textContent = category;

  const value = textarea.value.toUpperCase().split('\n').map(s => s.trim());
  value.forEach(s => {
    data.progress.push(s);
  });
}

function onCheckBunnies() {
  const dataLookup = arrSwitch(
    bnuyCategory.value,
    [
      ['upper_temple', data.coupleData.upper_temple],
      ['upper_temple_hell', data.coupleData.upper_temple_hell],
      ['void', data.coupleData.void],
      ['all', data.coupleData.all],
      ['bugs', data.coupleData.bugs]
    ],
    data.coupleData.upper_temple
  );

  const mappedBnuyData = dataLookup.map(c => {
    const couple = c.toUpperCase();
    const [x, y] = couple.split('X').map(s => s.trim());
    const xData = x.split('-');
    const yData = y.split('-');
    return [
      { id: x, burrow: xData[0], depth: xData[1], index: xData[2] },
      { id: y, burrow: yData[0], depth: yData[1], index: yData[2] },
    ]
  });

  for (const bnuy of mappedBnuyData) {
    const coupleName = `${bnuy[0].id} X ${bnuy[1].id}`;
    const discovered = verifyDiscovered(data.progress, coupleName);
    const wrapper = createElement('div');
    wrapper.setAttribute('data-mated', discovered);
    
    const bnuyABurrow = createElementWithText('span', `${bnuy[0].burrow}-`);
    const bnuyADepth = createElementWithText('span', `${bnuy[0].depth}-${bnuy[0].index}`);
    const bnuyA = createElement('span', [bnuyABurrow, bnuyADepth]);
    bnuyABurrow.classList.add('burrow');
    bnuyADepth.classList.add('depth');
    bnuyA.setAttribute('data-burrow-area', bnuy[0].burrow);
    bnuyA.setAttribute('data-burrow-depth', bnuy[0].depth);
    isTempleBunny(bnuy[0].burrow, bnuy[0].depth) && bnuyA.setAttribute('data-temple-bunny', '')
    isHellBunny(bnuy[0].burrow, bnuy[0].depth) && bnuyA.setAttribute('data-hell-bunny', '')
    isVoidBunny(bnuy[0].burrow) && bnuyA.setAttribute('data-void-bunny', '')
    bnuyA.classList.add('text-gigabun');
    
    const bnuyBBurrow = createElementWithText('span', `${bnuy[1].burrow}-`);
    const bnuyBDepth = createElementWithText('span', `${bnuy[1].depth}-${bnuy[1].index}`);
    const bnuyB = createElement('span', [bnuyBBurrow, bnuyBDepth]);
    bnuyBBurrow.classList.add('burrow');
    bnuyBDepth.classList.add('depth');
    bnuyB.setAttribute('data-burrow-area', bnuy[1].burrow);
    bnuyB.setAttribute('data-burrow-depth', bnuy[1].depth);
    isTempleBunny(bnuy[1].burrow, bnuy[1].depth) && bnuyB.setAttribute('data-temple-bunny', '')
    isHellBunny(bnuy[1].burrow, bnuy[1].depth) && bnuyB.setAttribute('data-hell-bunny', '')
    isVoidBunny(bnuy[1].burrow) && bnuyB.setAttribute('data-void-bunny', '')
    bnuyB.classList.add('text-gigabun');

    const bnuySeparator = createElement('span');
    bnuySeparator.innerHTML = '&nbsp;X&nbsp;';
    bnuySeparator.classList.add('text-gigabun');

    wrapper.append(bnuyA, bnuySeparator, bnuyB);
    bnuyList.append(wrapper)

    if (discovered) {
      data.discovered++;
    }
  }

  /** @type {HTMLSpanElement} */
  const collectedText = document.getElementById('collected');
  collectedText.textContent = data.discovered;

  /** @type {HTMLSpanElement} */
  const totalBnuyText = document.getElementById('outof');
  totalBnuyText.textContent = dataLookup.length;

  /** @type {HTMLDivElement} */
  const comparisonWrapper = document.getElementById('comparison-wrapper');
  comparisonWrapper.setAttribute('data-show', 'true');
}

window.onload = function () {
  onLoad()
}
