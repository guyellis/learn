const defaultFeatures: readonly string[] = ['Map', 'Set', 'requestAnimationFrame'];

function browserSupportsAllFeatures(features: readonly string[]): boolean {
  return features.every((f) => (window as unknown as Record<string, unknown>)[f]);
}

function missingFeatures(features: readonly string[]): string[] {
  return features.filter((f) => !(window as unknown as Record<string, unknown>)[f]);
}

function loadScript(features: readonly string[], done: (error?: Error) => void): void {
  const cdn = `https://cdn.polyfill.io/v2/polyfill.min.js?features=${missingFeatures(features).join()}`;
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

export default (
  featureList: readonly string[] = defaultFeatures,
  done: (error?: Error) => void,
): void => {
  if (browserSupportsAllFeatures(featureList)) {
    done();
  } else {
    loadScript(featureList, done);
  }
};
