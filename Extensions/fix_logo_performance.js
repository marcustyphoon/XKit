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
