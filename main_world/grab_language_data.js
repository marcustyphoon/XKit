export default function grabLanguageData() {
	const waitForTumblrObject = setInterval(() => {
		if (window.tumblr) {
			clearInterval(waitForTumblrObject);
			window.postMessage({
				languageData: window.tumblr.languageData
			}, `${location.protocol}//${location.host}`);
		}
	}, 100);
}
