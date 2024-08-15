export default function send() {
	/* globals tumblr */
	let blogs = [];
	Promise.race([
		new Promise((resolve) => setTimeout(resolve, 30000)),
		(async () => {
			const {response} = await tumblr.apiFetch("/v2/user/info", {
				queryParams: {'fields[blogs]': 'name'},
			});
			blogs = response.user.blogs.map(blog => blog.name);
		})()
	]).finally(() => {
		window.postMessage({
			xkit_blogs: blogs
		}, window.location.protocol + "//" + window.location.host);
	});
}
