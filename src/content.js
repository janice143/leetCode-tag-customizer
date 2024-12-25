const replace = (difficultyList, customDifficultyReplacement) =>
  difficultyList.forEach((difficulty) =>
    replaceSingle(difficulty, customDifficultyReplacement)
  );

const replaceSingle = (difficulty, customDifficultyReplacement) => {
  if (!difficulty) return;

  const originalText = difficulty.innerText.trim();
  Object.keys(CONFIG).forEach((key) => {
    if (originalText.includes(key)) {
      difficulty.innerText = customDifficultyReplacement?.[CONFIG[key]] || key;
    }
  });
};

async function getStorageData(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data);
      }
    });
  });
}

const KEYS = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
};

const CONFIG = {
  简单: KEYS.easy,
  easy: KEYS.easy,
  Easy: KEYS.easy,
  中等: KEYS.medium,
  medium: KEYS.medium,
  Medium: KEYS.medium,
  困难: KEYS.hard,
  Hard: KEYS.hard
};

let timer;
const debounce = (func, timeout) => {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
};

const SELECTORS = {
  // leetcode.cn/problemset/ and leetcode.com/problemset/*
  ProblemSet: '[role="row"] [role="cell"]:nth-child(5) span',
  // leetcode.cn/studyplan/ and leetcode.com/studyplan/*
  StudyPlan:
    '.flex.w-full.max-w-\\[1020px\\] .flex-col.border-b-\\[1\\.5px\\] p',
  // leetcode.cn/problems/ and leetcode.com/problems/*
  Problems: 'div[class*="text-difficulty-"]'
};

async function replaceDifficultyTags() {
  let customDifficultyReplacement;
  try {
    customDifficultyReplacement = await getStorageData([
      KEYS.easy,
      KEYS.medium,
      KEYS.hard
    ]);
  } catch (e) {
    console.error('Error accessing storage:', e);
  }

  difficultyList = document.querySelectorAll(SELECTORS.ProblemSet);
  replace(difficultyList, customDifficultyReplacement);

  difficultyList = document.querySelectorAll(SELECTORS.StudyPlan);
  replace(difficultyList, customDifficultyReplacement);

  difficultyList = document.querySelectorAll(SELECTORS.Problems);
  replace(difficultyList, customDifficultyReplacement);
}

// 使用 MutationObserver 监听 DOM 变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach(debounce(replaceDifficultyTags, 300));
});

if (
  document.location.href.match(
    /^https?:\/\/(www.)?leetcode.(com|cn)\/(problemset|problems|studyplan)/
  )
) {
  // 开始监听
  observer.observe(document.body, { childList: true, subtree: true });
}
