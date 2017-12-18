const defaultFeatures = [
  'Map',
  'Set',
  'requestAnimationFrame',
];

function browserSupportsAllFeatures(features) {
  return features.every(f => window[f]);
}

function missingFeatures(features) {
  return features.filter(f => !window[f]);
}

function loadScript(features, done) {
  const cdn =
    `https://cdn.polyfill.io/v2/polyfill.min.js?features=${missingFeatures(features).join()}`;
  const js = document.createElement('script');
  js.src = cdn;
  js.onload = function onLoad() {
    done();
  };
  js.onerror = function onError() {
    done(new Error(`Failed to load script ${cdn}`));
  };
  document.head.appendChild(js);
}

module.exports = (featureList = defaultFeatures, done) => {
  if (browserSupportsAllFeatures(featureList)) {
    done();
  } else {
    loadScript(featureList, done);
  }
};
