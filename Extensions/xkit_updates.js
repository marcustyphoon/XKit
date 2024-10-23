//* TITLE XKit Updates **//
//* VERSION 2.1.3 **//
//* DESCRIPTION Provides automatic updating of extensions **//
//* DEVELOPER new-xkit **//
XKit.extensions.xkit_updates = new Object({

	running: false,

	run: function() {
		this.running = true;
	},

	destroy: function() {
		this.running = false;
	}

});
