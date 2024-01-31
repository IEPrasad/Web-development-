const jsTense = document.querySelector('.tense-name');

function display () {

  if (jsTense.innerText === 'Present Tense #1') {
    jsTense.innerHTML = `
      <div>
        this is the text
      </div>
    `;
    jsTense.classList.add('js-tense');
    console.log(jsTense.classList.contains('js-tense'));
  } else {
    jsTense.innerHTML = `
     Present Tense #1
    `;
    jsTense.classList.remove('js-tense');
    console.log(jsTense.classList.contains('js-tense'));
  }
}