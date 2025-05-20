let processes = [];
let blocks = [];

function initialize() {
  const numProcesses = parseInt(document.getElementById('num-processes').value);
  const numBlocks = parseInt(document.getElementById('num-blocks').value);

  if (isNaN(numProcesses) || isNaN(numBlocks) || numProcesses <= 0 || numBlocks <= 0) {
    alert('Please enter valid positive numbers for processes and blocks.');
    return;
  }

  const inputFieldsDiv = document.getElementById('input-fields');
  inputFieldsDiv.innerHTML = '';

  // process input fields
  const processContainer = document.createElement('div');
  processContainer.innerHTML = '<h3 class="text-xl mt-4 mb-2">Process Sizes:</h3>';
  for (let i = 0; i < numProcesses; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'p-2 bg-gray-800 border border-gray-700 rounded w-full mb-2';
    input.placeholder = `Process ${i + 1} Size`;
    input.required = true;
    input.min = 1;
    processContainer.appendChild(input);
  }

  //block input fields
  const blockContainer = document.createElement('div');
  blockContainer.innerHTML = '<h3 class="text-xl mt-4 mb-2">Block Sizes:</h3>';
  for (let i = 0; i < numBlocks; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'p-2 bg-gray-800 border border-gray-700 rounded w-full mb-2';
    input.placeholder = `Block ${i + 1} Size`;
    input.required = true;
    input.min = 1;
    blockContainer.appendChild(input);
  }

  inputFieldsDiv.appendChild(processContainer);
  inputFieldsDiv.appendChild(blockContainer);
}

function collectInputs() {
  processes = [];
  blocks = [];

  const processInputs = document.querySelectorAll('#input-fields div:first-child input');
  const blockInputs = document.querySelectorAll('#input-fields div:last-child input');

  processInputs.forEach(input => {
    const value = parseInt(input.value);
    if (isNaN(value) || value <= 0) {
      alert('Please enter valid positive numbers for all process sizes.');
      throw new Error('Invalid process input');
    }
    processes.push(value);
  });

  blockInputs.forEach(input => {
    const value = parseInt(input.value);
    if (isNaN(value) || value <= 0) {
      alert('Please enter valid positive numbers for all block sizes.');
      throw new Error('Invalid block input');
    }
    blocks.push(value);
  });
}

function displayAllocation(allocated, blocks) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'memory-container';

  blocks.forEach((blockSize, index) => {
    const blockDiv = document.createElement('div');
    blockDiv.className = 'memory-block';
    blockDiv.style.width = `${blockSize / Math.max(...blocks) * 100}%`;
    blockDiv.textContent = `Block ${index + 1} (${blockSize})`;

    const processSize = allocated.get(index);
    if (processSize !== undefined) {
      const processDiv = document.createElement('div');
      processDiv.className = 'process-block';
      processDiv.style.width = `${processSize / blockSize * 100}%`;
      processDiv.textContent = `Process (${processSize})`;
      blockDiv.appendChild(processDiv);
    }

    container.appendChild(blockDiv);
  });

  outputDiv.appendChild(container);

  // Calculate fragmentation
  let internalFragmentation = 0;
  allocated.forEach((processSize, blockIndex) => {
    internalFragmentation += blocks[blockIndex] - processSize;
  });
  let externalFragmentation = 0;
  processes.forEach(processSize => {
    let allocatedFlag = false;
    allocated.forEach((allocatedProcessSize) => {
      if (processSize === allocatedProcessSize) {
        allocatedFlag = true;
      }
    });
    if (!allocatedFlag) {
      externalFragmentation += processSize;
    }
  });

  // Display fragmentation values
  const fragmentationDiv = document.createElement('div');
  fragmentationDiv.className = 'fragmentation-info';
  fragmentationDiv.innerHTML = `
    <p>Internal Fragmentation: ${internalFragmentation}</p>
    <p>External Fragmentation: ${externalFragmentation}</p>
  `;
  outputDiv.appendChild(fragmentationDiv);
}

function firstFit() {
  const allocated = new Map();
  let internalFragmentation = 0;
  let externalFragmentation = 0;
  const tempBlocks = [...blocks];

  processes.forEach(process => {
    let allocatedIndex = -1;
    for (let i = 0; i < tempBlocks.length; i++) {
      if (process <= tempBlocks[i]) {
        allocatedIndex = i;
        break;
      }
    }

    if (allocatedIndex !== -1) {
      allocated.set(allocatedIndex, process);
      internalFragmentation += tempBlocks[allocatedIndex] - process;
      tempBlocks[allocatedIndex] -= process;
    } else {
      externalFragmentation += process;
    }
  });

  displayAllocation(allocated, blocks);
}

function nextFit() {
  const allocated = new Map();
  let internalFragmentation = 0;
  let externalFragmentation = 0;
  let lastIndex = 0;
  const tempBlocks = [...blocks];

  processes.forEach(process => {
    let allocatedIndex = -1;
    let attempts = 0;
    while (attempts < tempBlocks.length) {
      let currentIndex = (lastIndex + attempts) % tempBlocks.length;
      if (process <= tempBlocks[currentIndex]) {
        allocatedIndex = currentIndex;
        break;
      }
      attempts++;
    }

    if (allocatedIndex !== -1) {
      allocated.set(allocatedIndex, process);
      internalFragmentation += tempBlocks[allocatedIndex] - process;
      tempBlocks[allocatedIndex] -= process;
      lastIndex = (allocatedIndex + 1) % tempBlocks.length;
    } else {
      externalFragmentation += process;
    }
  });

  displayAllocation(allocated, blocks);
}

function bestFit() {
  const allocated = new Map();
  let internalFragmentation = 0;
  let externalFragmentation = 0;
  const tempBlocks = [...blocks];

  processes.forEach(process => {
    let bestIndex = -1;
    let minDiff = Infinity;

    for (let i = 0; i < tempBlocks.length; i++) {
      if (process <= tempBlocks[i] && tempBlocks[i] - process < minDiff) {
        bestIndex = i;
        minDiff = tempBlocks[i] - process;
      }
    }

    if (bestIndex !== -1) {
      allocated.set(bestIndex, process);
      internalFragmentation += tempBlocks[bestIndex] - process;
      tempBlocks[bestIndex] -= process;
    } else {
      externalFragmentation += process;
    }
  });

  displayAllocation(allocated, blocks);
}

function worstFit() {
  const allocated = new Map();
  let internalFragmentation = 0;
  let externalFragmentation = 0;
  const tempBlocks = [...blocks];

  processes.forEach(process => {
    let worstIndex = -1;
    let maxDiff = -1;

    for (let i = 0; i < tempBlocks.length; i++) {
      if (process <= tempBlocks[i] && tempBlocks[i] - process > maxDiff) {
        worstIndex = i;
        maxDiff = tempBlocks[i] - process;
      }
    }

    if (worstIndex !== -1) {
      allocated.set(worstIndex, process);
      internalFragmentation += tempBlocks[worstIndex] - process;
      tempBlocks[worstIndex] -= process;
    } else {
      externalFragmentation += process;
    }
  });

  displayAllocation(allocated, blocks);
}

function runSimulation() {
  try {
    collectInputs();
    const algorithm = document.getElementById('algorithm').value;

    switch (algorithm) {
      case 'firstFit': firstFit(); break;
      case 'bestFit': bestFit(); break;
      case 'worstFit': worstFit(); break;
      case 'nextFit': nextFit(); break;
      default: alert('Please select a valid algorithm');
    }
  } catch (error) {
    console.error('Simulation error:', error);
  }
}
