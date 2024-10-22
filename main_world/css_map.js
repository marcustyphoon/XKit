export default () => {
	if (!window.tumblr) {
		return null;
	}
	return window.tumblr.getCssMap();
};
