const test = ["W-3-1 x N-3-1", "W-3-1 x N-4-1", "W-3-1 x C-3-1", "W-3-1 x S-3-1", "W-6-1 x W-6-2", "W-7-1 x C-7-1", "W-8-1 x N-8-1", "W-8-1 x C-8-1", "W-10-1 x C-10-1", "W-11-1 x W-12-1", "W-11-1 x C-11-1", "W-12-1 x C-11-1", "W-13-1 x C-13-1", "W-15-1 x W-16-1", "W-15-1 x W-17-1", "W-15-1 x W-18-1", "W-16-1 x W-17-1", "W-16-1 x W-18-1", "W-17-1 x W-18-1", "N-3-1 x N-4-1", "N-3-1 x C-3-1", "N-3-1 x S-3-1", "N-4-1 x C-3-1", "N-4-1 x S-3-1", "N-5-1 x C-5-1", "N-7-1 x C-7-1", "N-12-1 x N-13-1", "N-12-1 x N-13-3", "N-12-1 x N-14-1", "N-12-1 x N-15-1", "N-12-1 x N-16-1", "N-12-1 x N-17-1", "N-12-1 x N-18-1", "N-12-1 x C-13-1", "N-13-1 x N-13-3", "N-13-1 x N-14-1", "N-13-1 x N-15-1", "N-13-1 x N-16-1", "N-13-1 x N-17-1", "N-13-1 x N-18-1", "N-13-1 x C-13-1", "N-13-3 x N-14-1", "N-13-3 x N-15-1", "N-13-3 x N-16-1", "N-13-3 x N-17-1", "N-13-3 x N-18-1", "N-13-3 x C-13-1", "N-14-1 x N-15-1", "N-14-1 x N-16-1", "N-14-1 x N-17-1", "N-14-1 x N-18-1", "N-14-1 x C-13-1", "N-15-1 x N-16-1", "N-15-1 x N-17-1", "N-15-1 x N-18-1", "N-15-1 x C-13-1", "N-16-1 x N-17-1", "N-16-1 x N-18-1", "N-16-1 x C-13-1", "N-17-1 x N-18-1", "N-17-1 x C-13-1", "N-17-1 x C-17-1", "N-18-1 x C-13-1", "N-18-1 x C-17-1", "C-1-1 x C-2-1", "C-1-1 x C-3-1", "C-2-1 x C-3-1", "C-3-1 x S-3-1", "C-6-1 x C-7-1", "C-7-1 x S-7-1", "C-7-1 x S-8-1", "C-9-1 x S-9-1", "C-10-1 x S-10-1", "C-11-1 x C-12-1", "C-11-1 x S-10-1", "C-12-1 x S-10-1", "C-13-1 x S-13-1", "C-15-1 x C-16-1", "C-18-1 x C-19-1", "S-4-1 x S-5-1", "S-4-1 x S-6-1", "S-5-1 x S-6-1", "S-7-1 x S-8-1", "S-16-1 x S-17-1", "S-16-1 x S-18-1", "S-16-1 x S-19-1", "S-17-1 x S-18-1", "S-17-1 x S-19-1", "S-18-1 x S-19-1", "E-1-1 x E-2-1", "E-1-1 x E-3-1", "E-1-1 x E-3-4", "E-1-1 x E-4-1", "E-2-1 x E-3-1", "E-2-1 x E-3-4", "E-2-1 x E-4-1", "E-3-2 x E-3-4", "E-3-4 x E-4-1", "E-6-1 x E-7-1"];

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
      { id: x, burrow: xData[0], depth: xData[1], index: yData[2] },
      { id: y, burrow: yData[0], depth: yData[1], index: yData[2] },
    ]
  });

  for (const bnuy of mappedBnuyData) {
    const coupleName = `${bnuy[0].id} X ${bnuy[1].id}`;
    const discovered = verifyDiscovered(data.progress, coupleName);
    const wrapper = createElement('div')
    const bnuyA = createElementWithText('span', bnuy[0].id);
    const bnuyB = createElementWithText('span', bnuy[1].id);
    const bnuySeparator = createElement('span');
    wrapper.setAttribute('data-mated', discovered);
    bnuyA.setAttribute('data-burrow-area', bnuy[0].burrow);
    bnuyA.setAttribute('data-burrow-depth', bnuy[0].depth);
    isTempleBunny(bnuy[0].burrow, bnuy[0].depth) && bnuyA.setAttribute('data-temple-bunny', '')
    isHellBunny(bnuy[0].burrow, bnuy[0].depth) && bnuyA.setAttribute('data-hell-bunny', '')
    isVoidBunny(bnuy[0].burrow) && bnuyA.setAttribute('data-void-bunny', '')
    bnuyA.classList.add('text-gigabun');
    bnuyB.setAttribute('data-burrow-area', bnuy[1].burrow);
    bnuyB.setAttribute('data-burrow-depth', bnuy[1].depth);
    isTempleBunny(bnuy[1].burrow, bnuy[1].depth) && bnuyB.setAttribute('data-temple-bunny', '')
    isHellBunny(bnuy[1].burrow, bnuy[1].depth) && bnuyB.setAttribute('data-hell-bunny', '')
    isVoidBunny(bnuy[1].burrow) && bnuyB.setAttribute('data-void-bunny', '')
    bnuyB.classList.add('text-gigabun');
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
