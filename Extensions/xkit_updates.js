//* TITLE XKit Updates **//
//* VERSION 2.1.3 **//
//* DESCRIPTION Provides automatic updating of extensions **//
//* DEVELOPER new-xkit **//
XKit.extensions.xkit_updates = new Object({

	running: false,

	default_interval: 18000000,
	min_interval: 3600000,
	max_interval: 86400000,

	preferences: {
		"show_notifications": {
			text: "Show update notifications",
			default: true,
			value: true
		},
	},

	run: function() {
		try {
			XKit.tools.init_css("xkit_updates");
			this.running = true;
			XKit.extensions.xkit_updates.get_list();
		} catch (e) {
			XKit.extensions.xkit_updates.show_update_failure();
		}
	},

	to_update: "",
	to_update_index: 0,
	updated_list: "",
	updated_list_versions: "",

	get_list: function(force_mode) {

		if (force_mode) {
			$("#xkit-forced-auto-updates-message").html("Fetching the latest changes from XKit servers...");
		}

		XKit.download.page("list.php", function(mdata) {

			if (mdata.server_down === true) {

				XKit.extensions.xkit_updates.show_update_failure();
				return;
			}

			XKit.extensions.xkit_updates.to_update_index = 0;
			XKit.extensions.xkit_updates.to_update = [];
			XKit.extensions.xkit_updates.updated_list = [];
			XKit.extensions.xkit_updates.updated_list_versions = [];

			for (var extension in mdata.extensions) {

				if (force_mode) {

					var check_this = false;
					if (XKit.installed.check(mdata.extensions[extension].name)) {

						if (XKit.extensions.xkit_updates.shouldUpdate(XKit.tools.parse_version(XKit.installed.get(mdata.extensions[extension].name).version), XKit.tools.parse_version(mdata.extensions[extension].version))) {
							check_this = true;
						}

						if (mdata.extensions[extension].name.substring(0, 5) === "xkit_") {
							// Always update internals no matter what.
							check_this = true;
						}

						if (check_this) {
							XKit.extensions.xkit_updates.to_update.push(mdata.extensions[extension].name);
						}
					}

				} else {

					if (XKit.installed.check(mdata.extensions[extension].name)) {
						if (XKit.extensions.xkit_updates.shouldUpdate(XKit.tools.parse_version(XKit.installed.get(mdata.extensions[extension].name).version), XKit.tools.parse_version(mdata.extensions[extension].version))) {
							XKit.extensions.xkit_updates.to_update.push(mdata.extensions[extension].name);
						}
					}

				}

			}

			if (XKit.extensions.xkit_updates.to_update.length > 0) {
				$("body").append("<div id=\"xkit-updating-indicator\">XKit Auto-Update</div>");
				if (force_mode) {
					$("#xkit-forced-auto-updates-message").html("Downloading extensions from the servers...");
				}
				XKit.extensions.xkit_updates.update_next(force_mode);
			} else {
				var ms = (new Date()).getTime();
				XKit.storage.set("xkit_updates", "last_update_check", ms);
				console.log("Update complete: no new extensions");
			}

		});

	},

	show_update_failure: function() {

		XKit.notifications.add("<b>Could not update New XKit:</b><br/>" +
			"I could not reach the New XKit servers to update myself. " +
			"You might be running an old and buggy version of New XKit. Click here for details.",
			"error", true, function() {

				XKit.window.show("Auto-Update failed.",

					"New XKit automatically updates itself from time to time in the background " +
					"to bring you the latest features and bug fixes. Unfortunately, it was " +
					"unable to contact the servers and download the latest updates. This " +
					"might be a temporary server error or a problem with your connection." +
					"<br/><br/>" +
					"We recommend troubleshooting immediately. <b>It's important to fix this issue</b> - " +
					"if you don't, you'll be running out-of-date versions of extensions, " +
					"which may not work properly or cause problems.",

					"error",

					'<a href="https://new-xkit-extension.tumblr.com" class="xkit-button">New XKit Blog</a>' +
					'<a href="https://new-xkit-support.tumblr.com" class="xkit-button">New XKit Support</a>' +
					'<div class="xkit-button" id="xkit-close-message">OK</div>'
				);
			});

	},

	update_next: function(force_mode) {

		if (XKit.extensions.xkit_updates.to_update_index >= XKit.extensions.xkit_updates.to_update.length) {

			var ms = (new Date()).getTime();
			XKit.storage.set("xkit_updates", "last_update_check", ms);

			// Completed all?

			if (!force_mode) {

				var to_show = XKit.tools.get_setting("xkit_show_update_notifications", "true");

				if (to_show === "true") {
					var suffix = "";

					if (XKit.extensions.xkit_updates.updated_list.length !== 1) {
						suffix = "s";
					}

					XKit.notifications.add("XKit updated " + XKit.extensions.xkit_updates.updated_list.length + " extension" + suffix + ". Click here to view them.", "ok", true, function() {
						var m_result = "";
						for (var i = 0; i < XKit.extensions.xkit_updates.updated_list.length; i++) {
							m_result = m_result + "<br/>" + XKit.extensions.xkit_updates.updated_list[i] + " &middot; " + XKit.extensions.xkit_updates.updated_list_versions[i];
						}
						XKit.window.show("Auto-Update results", "<b>XKit updated the following extension" + suffix + ":</b>" + m_result, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					});

				}

			} else {

				XKit.window.show("Complete!", "<b>XKit updated all the extensions with version mismatch.</b><br/>Changes will be active when you refresh the page.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

			}

			$("#xkit-updating-indicator").remove();
			return;
		}

		if (force_mode) {
			$("#xkit-forced-auto-updates-message").html("Downloading " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index] + " (" + (XKit.extensions.xkit_updates.to_update_index + 1) + " of " + XKit.extensions.xkit_updates.to_update.length + ")");
		}


		XKit.extensions.xkit_updates.update(XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index], function(mdata) {

			if (mdata.errors === true) {
				if (mdata.error_not_found === true) {
					// Probably removed.
					console.log("Can not update " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index] + ": not found.");
				} else {
					XKit.extensions.xkit_updates.show_update_failure();
					return;
				}
			}

			XKit.extensions.xkit_updates.updated_list.push(mdata.title);
			XKit.extensions.xkit_updates.updated_list_versions.push(mdata.version);
			console.log("Updated " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index]);
			XKit.extensions.xkit_updates.to_update_index++;
			XKit.extensions.xkit_updates.update_next(force_mode);

		});

	},

	update: function(extension_id, callback) {

		var m_result = {};


		XKit.install(extension_id, function(mdata) {

			if (mdata.errors) {
				if (mdata.storage_error === true) {
					m_result.errors = true;
					m_result.error = "Can't store data on browser";
					callback(m_result);
					return;
				}
				if (mdata.server_down === true) {
					m_result.errors = true;
					m_result.error = "Can't reach servers";
					callback(m_result);
				} else {
					if (mdata.file === "not_found") {
						m_result.errors = true;
						m_result.error_not_found = true;
						m_result.error = "Extension can't be found: It might've been removed from the extension gallery.";
						callback(m_result);
					} else {
						m_result.errors = true;
						m_result.error = "Unknown error. Code: #UPDATE-1026";
						callback(m_result);
					}
				}
				return;
			}

			try {
				// Try evaling the script.
				// If it's working, then move to the next one.
				m_result.errors = false;
				m_result.error = "";
				m_result.title = mdata.title;
				m_result.version = mdata.version;
				callback(m_result);
			} catch (e) {
				m_result.errors = true;
				m_result.error = "UP-ER:" + e.message;
				callback(m_result);
			}

		});

	},

	shouldUpdate: function(versionCurrent, versionRemote) {
		if (versionRemote.major > versionCurrent.major) {
			return true;
		}
		if ((versionRemote.minor > versionCurrent.minor) && (versionRemote.major >= versionCurrent.major)) {
			return true;
		}
		if ((versionRemote.patch > versionCurrent.patch) && (versionRemote.major >= versionCurrent.major) && (versionRemote.minor >= versionCurrent.minor)) {
			return true;
		}
		return false;
	},

	destroy: function() {
		this.running = false;
	}

});
