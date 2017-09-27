const features = [
  'Map',
  'Set',
  'requestAnimationFrame',
];

function browserSupportsAllFeatures() {
  return features.every(f => window[f]);
}

function missingFeatures() {
  return features.filter(f => !window[f]);
}

function loadScript(done) {
  // eslint-disable-next-line prefer-template
  const cdn = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=' + missingFeatures().join();
  const js = document.createElement('script');
  js.src = cdn;
  js.onload = function onLoad() {
    done();
  };
  js.onerror = function onError() {
    // eslint-disable-next-line prefer-template
    done(new Error('Failed to load script ' + cdn));
  };
  document.head.appendChild(js);
}

module.exports = (done) => {
  if (browserSupportsAllFeatures()) {
    done();
  } else {
    loadScript(done);
  }
};
