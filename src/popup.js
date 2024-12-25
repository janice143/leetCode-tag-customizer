const KEYS = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
};

function validateInput(value) {
  if (!value) {
    return {
      isValid: false,
      message: 'Input is empty.'
    };
  }

  const MAX_CN_CHARS = 6;
  const MAX_OTHER_CHARS = 20;

  // Regular expression to match Chinese characters
  const chineseRegex = /[\u4e00-\u9fa5]/g;

  // Count the number of Chinese characters
  const chineseCount = (value.match(chineseRegex) || []).length;

  // Count the number of non-Chinese characters
  const restCount = value.length - chineseCount;

  // Total length
  // const totalLength = chineseCount + restCount;

  // Validation
  if (chineseCount > MAX_CN_CHARS) {
    return {
      isValid: false,
      message: `太多中文字符（最多 ${MAX_CN_CHARS} 个）。`
    };
  }

  if (restCount > MAX_OTHER_CHARS) {
    return {
      isValid: false,
      message: `Too many characters (max ${MAX_OTHER_CHARS}).`
    };
  }

  return { isValid: true, message: 'Input is valid.' };
}

function copyToInput(inputId, suggestion) {
  const input = document.getElementById(inputId);
  input.value = suggestion;
}

document.addEventListener('DOMContentLoaded', () => {
  const easyInput = document.getElementById('easy');
  const mediumInput = document.getElementById('medium');
  const hardInput = document.getElementById('hard');
  const saveButton = document.getElementById('save');

  // Load saved tags from storage
  chrome.storage.sync.get([KEYS.easy, KEYS.medium, KEYS.hard], (data) => {
    if (data[KEYS.easy]) easyInput.value = data[KEYS.easy];
    if (data[KEYS.medium]) mediumInput.value = data[KEYS.medium];
    if (data[KEYS.hard]) hardInput.value = data[KEYS.hard];
  });

  // Save changes to storage
  saveButton.addEventListener('click', () => {
    const easy = easyInput.value.trim();
    const medium = mediumInput.value.trim();
    const hard = hardInput.value.trim();

    const { isValid: easy_isValid, message: easy_message } =
      validateInput(easy);
    const { isValid: medium_isValid, message: medium_message } =
      validateInput(medium);
    const { isValid: hard_isValid, message: hard_message } =
      validateInput(hard);

    if (!easy_isValid || !medium_isValid || !hard_isValid) {
      alert(
        `Invalid input:\n\nEasy: ${easy_message}\nMedium: ${medium_message}\nHard: ${hard_message}`
      );
      return;
    }

    chrome.storage.sync.set(
      { [KEYS.easy]: easy, [KEYS.medium]: medium, [KEYS.hard]: hard },
      async () => {
        chrome.storage.sync.get('lang', ({ lang }) => {
          alert(
            translations[lang].saveButtonSuccess ||
              'Changes saved! Refresh the LeetCode page to see the updates.'
          );
          // destroy the popup
          window.close();
        });
      }
    );
  });
});

document
  .querySelectorAll('.recommendation-panel .easy-copy')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const easy = element.getAttribute('data-easy');
      const medium = element.getAttribute('data-medium');
      const hard = element.getAttribute('data-hard');

      if (easy) document.getElementById('easy').value = easy;
      if (medium) document.getElementById('medium').value = medium;
      if (hard) document.getElementById('hard').value = hard;
    });
  });
