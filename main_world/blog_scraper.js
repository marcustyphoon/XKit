export default function() {
	var blogs = [];
	try {
		var models = Tumblr.dashboardControls.allTumblelogs;
		models.filter(function(model) {
			return model.attributes.hasOwnProperty("is_current");
		}).forEach(function(model) {
			blogs.push(model.attributes.name);
		});
	} catch (e) {} finally {
		window.postMessage({
			xkit_blogs: blogs
		}, window.location.protocol + "//" + window.location.host);
	}
}
