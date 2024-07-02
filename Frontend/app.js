let editor;
const languageSelect = document.getElementById('language-select');
const convertBtn = document.getElementById('convert-btn');
const debugBtn = document.getElementById('debug-btn');
const qualityBtn = document.getElementById('quality-btn');
const output = document.getElementById('output');

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark'
  });
});

convertBtn.addEventListener('click', async () => {
  const code = editor.getValue();
  const selectedLanguage = languageSelect.value;

  try {
    toggleOutputLoader(true); // Show the loading spinner
    const response = await fetch('http://localhost:3000/convert-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, targetLanguage: selectedLanguage }),
    });
    const data = await response.json();
    output.textContent = `Converted code in ${selectedLanguage}:\n${data.convertedCode}`;
  } catch (error) {
    output.textContent = 'Error converting code.';
    console.error('Error generating code conversion:', error.message);
  } finally {
    toggleOutputLoader(false); // Hide the loading spinner
  }
});

debugBtn.addEventListener('click', async () => {
  const code = editor.getValue();

  try {
    toggleOutputLoader(true); // Show the loading spinner
    const response = await fetch('http://localhost:3000/debug-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    output.textContent = `Debugging...:\n${data.debuggedCode}`;
  } catch (error) {
    output.textContent = 'Error debugging code.';
    console.error('Error debugging code:', error.message);
  } finally {
    toggleOutputLoader(false); // Hide the loading spinner
  }
});

qualityBtn.addEventListener('click', async () => {
  const code = editor.getValue();

  try {
    toggleOutputLoader(true); // Show the loading spinner
    const response = await fetch('http://localhost:3000/check-code-quality', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    output.textContent = `Checking code quality...:\n${data.qualityReport}`;
  } catch (error) {
    output.textContent = 'Error checking code Complexity.';
    console.error('Error checking code Complexity:', error.message);
  } finally {
    toggleOutputLoader(false); // Hide the loading spinner
  }
});

function toggleOutputLoader(show) {
  const outputLoader = document.getElementById('output-loader');
  outputLoader.style.display = show ? 'block' : 'none';
}
