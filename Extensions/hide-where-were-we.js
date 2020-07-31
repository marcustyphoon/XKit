//* TITLE hide-where-were-we **//
//* VERSION 1.0.0 **//
//* DESCRIPTION	**//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.hide_where_were_we = new Object({

	running: false,

	run: async function() {
		this.running = true;

		await XKit.css_map.getCssMap();

		XKit.tools.add_css(`${XKit.css_map.keyToCss('newPostIndicator')} { display: none !important; }`, "xkit_tweaks_hide_newPostIndicator");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("xkit_tweaks_hide_newPostIndicator");
	}

});
