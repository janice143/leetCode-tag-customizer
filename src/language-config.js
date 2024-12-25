const translations = {
  en: {
    title: 'Customize Difficulty Tags',
    suggestionsTitle: 'Suggestions',
    suggestionsSubtitle: 'Click on the suggestion to fill the blank.',
    difficultyHeader: 'Difficulty',
    suggestionsHeader: 'Suggestions',
    easyLabel: 'Easy',
    mediumLabel: 'Medium',
    hardLabel: 'Hard',
    easyInputLabel: 'Easy Tag',
    mediumInputLabel: 'Medium Tag',
    hardInputLabel: 'Hard Tag',
    saveButton: 'Save',
    saveButtonSuccess:
      'Changes saved! Refresh the LeetCode page to see the updates.',
    easyLabelOption3: 'Simple',
    mediumLabelOption3: 'Manageable',
    hardLabelOption3: 'Challenging'
  },
  zh: {
    title: '自定义难度标签',
    suggestionsTitle: '建议选项',
    suggestionsSubtitle: '点击建议选项以填充空白。',
    difficultyHeader: '难度',
    suggestionsHeader: '建议',
    easyLabel: '简单',
    mediumLabel: '中等',
    hardLabel: '困难',
    easyInputLabel: '简单标签',
    mediumInputLabel: '中等标签',
    hardInputLabel: '困难标签',
    saveButton: '保存',
    saveButtonSuccess: '更改已保存！刷新 LeetCode 页面以查看更新。',
    easyLabelOption3: '拿捏',
    mediumLabelOption3: '稳住',
    hardLabelOption3: '有点东西'
  }
};

const setLanguage = (lang) => {
  document.getElementById('title').innerText = translations[lang].title;
  document.getElementById('suggestions-title').innerText =
    translations[lang].suggestionsTitle;
  document.getElementById('suggestions-subtitle').innerText =
    translations[lang].suggestionsSubtitle;
  document.getElementById('difficulty-header').innerText =
    translations[lang].difficultyHeader;
  document.getElementById('suggestions-header').innerText =
    translations[lang].suggestionsHeader;
  document.getElementById('easy-label').innerText =
    translations[lang].easyLabel;
  document.getElementById('medium-label').innerText =
    translations[lang].mediumLabel;
  document.getElementById('hard-label').innerText =
    translations[lang].hardLabel;
  document.getElementById('easy-input-label').innerText =
    translations[lang].easyInputLabel;
  document.getElementById('medium-input-label').innerText =
    translations[lang].mediumInputLabel;
  document.getElementById('hard-input-label').innerText =
    translations[lang].hardInputLabel;
  document.getElementById('save').innerText = translations[lang].saveButton;

  document.getElementById('easy-label-option3').innerText =
    translations[lang].easyLabelOption3;
  document
    .getElementById('easy-label-option3')
    .setAttribute('data-easy', translations[lang].easyLabelOption3);

  document.getElementById('medium-label-option3').innerText =
    translations[lang].mediumLabelOption3;
  document
    .getElementById('medium-label-option3')
    .setAttribute('data-medium', translations[lang].mediumLabelOption3);

  document.getElementById('hard-label-option3').innerText =
    translations[lang].hardLabelOption3;
  document
    .getElementById('hard-label-option3')
    .setAttribute('data-hard', translations[lang].hardLabelOption3);
};

document.addEventListener('DOMContentLoaded', () => {
  const radioOptions = document.querySelectorAll('input[name="language"]');

  chrome.storage.sync.get('lang', ({ lang }) => {
    radioOptions.forEach((radio) => {
      if (radio.value === lang) {
        radio.checked = true;
        setLanguage(lang);
      }
    });
  });

  // 语言切换
  radioOptions.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      const lang = event.target.value;
      chrome.storage.sync.set({ lang });
      setLanguage(lang);
    });
  });
});
