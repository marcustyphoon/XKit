//* TITLE fix_logo_performance **//
//* VERSION 1.0.0 **//
//* DESCRIPTION	**//
//* DEVELOPER marcustyphoon **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.fix_logo_performance = new Object({

	running: false,

	run: async function() {
		this.running = true;

		await XKit.css_map.getCssMap();
		this.remove_logo_animation();

	},

	remove_logo_animation: function() {

		XKit.tools.add_css(`
			#pattern-rainbowColorList {
				display: none;
			}
			svg[fill="url('#pattern-rainbowColorList')"] {
				fill: var(--white-on-dark);
			}
		`, "fix_logo_performance");

		$("#pattern-rainbowColorList").remove();

	},

	fix_logo: function() {

		//this doesn't work until you mouse over it once since it starts animating on tumblr page load

		const logoSelector = XKit.css_map.keyToCss("logo");

		const $svg = $(logoSelector).find("svg").attr("id", "logo");

		$svg.find("animate")
			.attr("begin", "logo.mouseover")
			.attr("end", "logo.mouseleave");
	},

	destroy: function() {
		this.running = false;
		//not worth the effort
	}

});
