//* TITLE Quick Tags **//
//* VERSION 0.6.10 **//
//* DESCRIPTION Quickly add tags to posts **//
//* DETAILS Allows you to create tag bundles and add tags to posts without leaving the dashboard. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.quick_tags = new Object({

	running: false,

	button_icon:" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAaRJREFUOBGlk7FKw1AUhnMjQSpZpIsP4KCLHUQ3h+oLuDkLxSWlSd7AooNbSkmLeQAfw3ZxKDpVEH0EF52EUqKp/x+SEq7NTYIXLufmnNPvnv/cUzEcDjfn8/mNEKKhaZqOnV0/+JiYpnnVarU+s4G8s/A8L0DwIi+Bflz2ZhhG07Ksd1UeY3pSGc/nOB9mt67rR/BPF4vFThiG48FgsMVE1aLEWCZALzifYo9oHcd5sm37AZWd4Ls0VO5ZB9WYAHSw49Vutz+qQGVgH5V+gdRPeJWhotfrPaKqA/aOMrMg+ez7fh29vIe/gfyVD8UKv/lDJKzTqlYZ+QROCImiCAX4dRWQsSKojqG9RnWvyG1Qzn+hgrdyvgAboZe7+JzyVVkJY6ol97RWq+3Hr8x/ACDHbDQAlSrF8N/yUg7/bDbbXo5NAm1WgWJCzgDyExVdTMlzLDlxxCaRP+aNcOTKJwzxO+StwXZd172E1f4A6SyC5sFygSqoCqYEroLyAdgzWSZz07VSchqkleSnoWXPUkdqC4FMlKC5sBRaygZBsIH+7RUl/wJcdCuw4Tjk5QAAAABJRU5ErkJggg==",
	button_ok_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAcBJREFUOBGlk79KA0EQxmc2F2JCFEQLH8BCMZoiJJ2F+gJiESVWNjYJWgmWES0EC0mIoA9wChY21sZGMCRVJEEfwUYtDInC5dadIyuXNXeXw4Vj/83+br5vZ3Ffnx9vgXnMEeLAkYGtIUAXESuaFj08TT++27Ych5jT5y44wLZjhNgQ0JewFl46Sdde3eJoj1mZ0YCxLS0Aqb4PtUUBq3POZzpG537vOjnlCZQyGZpNg+OqYUKZ+sJGs1bI1B/4SGTFD7TPM+B8BzhErb6Xytla9c0PtB+IWASEljCtaJfmB4pZPVYF4EnyjmTaQeo4e5OawK/2nfA07nRRDBEM66CphVSAOh8mUyb8qtDBLnRLlIEKUedeUBYMjh0Jz54tGULOf6HiMQBQfbWNTllkO2uViCgVykTNTp2rnk6OhhLWLdMLiGjhZTLab6aiKs7pR1T8H5/f079lQ1B6Xn6guavYOudQIiACHhQyjSdLMi3IRvLpmdEf3eT3YLpILUCw0mYjT4w/QFr0gjrBHIFuUDeYK3AQlC7A8kyRSbGyDZQsN6m3y5frds/kmuw9gRRoh7rBJHSoPn+biOxexha8gn8AF6tJ8Q8uzcUAAAAASUVORK5CYII=",
	preferences: {
		"sep0": {
			text: "Options",
			type: "separator"
		},
		"append_not_replace": {
			text: "Append, do not replace tags when adding them",
			value: true,
			default: true
		},
		"show_in_new_post": {
			text: "Enable Quick Tags in new post popup",
			value: true,
			default: true
		},
		"show_in_one_click_postage": {
			text: "Enable Quick Tags in One-Click Postage popup",
			value: true,
			default: true
		},
		"append_not_replace_one_click": {
			text: "Also append and do not replace tags when adding them using One-Click Postage",
			value: false,
			default: false
		},
		"hide_new_bundle_button": {
			text: "Hide the new bundle button at the end of One-Click Postage",
			value: false,
			default: false
		},
		"sep1": {
			text: "My Tag Bundles",
			type: "separator"
		}
	},

	tag_array: [],

	processing: false,

	cancel_menu_close: function() {
		clearTimeout(XKit.extensions.quick_tags.menu_closer_int);
		XKit.extensions.quick_tags.user_on_box = true;
	},

	menu_close: function() {
		// Only close the menu if it doesn't have keyboard or mouse focus
		if ($("#xkit-quick-tags-window").find('input:focus').length === 0 &&
				$('#xkit-quick-tags-window:hover').length === 0) {
			XKit.extensions.quick_tags.user_on_box = false;
			XKit.extensions.quick_tags.menu_closer_int = setTimeout(function() { XKit.extensions.quick_tags.close_window(); }, 500);
		}
	},

	run: async function() {
		XKit.interface.form_key() || await XKit.interface.async_form_key();

		this.running = true;

		XKit.tools.init_css("quick_tags");

		XKit.interface.post_window.create_control_button("xkit-quick-tags-window", this.button_icon, "Quick Tags in a window!");

		$(document).on("mouseover", "#xkit-quick-tags-window", XKit.extensions.quick_tags.cancel_menu_close);
		$(document).on("mouseout", "#xkit-quick-tags-window", XKit.extensions.quick_tags.menu_close);

		$(document).on('mouseover', '.xkit-quick-tags, .xkit-quick-tags-window', XKit.extensions.quick_tags.move_window);
		$(document).on('mouseout', '.xkit-quick-tags, .xkit-quick-tags-window', XKit.extensions.quick_tags.menu_close);

		$(document).on('click', '.xkit-tag', XKit.extensions.quick_tags.button_clicked);
		$(document).on('click', '.xkit-tag-add', XKit.extensions.quick_tags.add_button_clicked);

		XKit.interface.post_window_listener.add("quick_tags", XKit.extensions.quick_tags.post_window);

		if (XKit.page.react) {
			XKit.interface.react.create_control_button("xkit-quick-tags", this.button_icon, "Quick Tags!", "", this.button_ok_icon).then(() => {
				XKit.post_listener.add("quick_tags", XKit.extensions.quick_tags.do_posts);

				this.do_posts();
			});
		}
	},

	post_window: function() {
		if (XKit.extensions.quick_tags.preferences.show_in_new_post.value) {
			XKit.interface.post_window.add_control_button("xkit-quick-tags-window", "data-in-window=\"true\"");
		}
	},

	submit: async function(tags, button) {

		// Are we in post window?
		if ($(button).attr('data-in-window') === "true") {
			if (XKit.extensions.quick_tags.preferences.append_not_replace.value !== true) {
				XKit.interface.post_window.remove_all_tags();
			}
			XKit.interface.post_window.add_tag(tags.split(","));
			XKit.interface.switch_control_button($(button), false);
			return;
		}

		// Find the post object.
		var m_post = await XKit.interface.react.find_post($(button).attr('data-post-id'));

		var m_button = $(button);

		// Fetch info about it!
		if (!m_post.error) {
			XKit.interface.fetch(m_post, async function(data) {
				try {
					if (data.status !== 200) throw data;
					const { id: post_id, tags: current_tags = '' } = data.data.post;

					const current_tags_array = current_tags.split(',').map(tag => tag.trim()).filter(Boolean);
					const add_tags_array = tags.split(',').map(tag => tag.replaceAll('#', '').trim()).filter(Boolean);

					if (
						XKit.extensions.quick_tags.preferences.append_not_replace.value === false &&
						current_tags_array.length
					) {
						await XKit.interface.mass_edit([post_id], { mode: 'remove', tags: current_tags_array });
						current_tags_array.splice(0);
					}

					await XKit.interface.mass_edit([post_id], { mode: 'add', tags: add_tags_array });
					current_tags_array.push(...add_tags_array);

					await XKit.interface.react.update_view.tags(m_post, current_tags_array.join(','));
				} catch (error) {
					if (error.status) {
						XKit.window.show("Unable to edit post", `Server responded with status ${error.status}: ${error.message}.<br /><pre style="user-select: text;">${JSON.stringify(error, null, 2)}</pre>`, "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					} else if (error.json) {
						const response = await error.json();
						XKit.window.show("Unable to edit post", `Server responded with status ${response.meta.status}: ${response.meta.msg}.<br /><pre style="user-select: text;">${JSON.stringify(response, null, 2)}</pre>`, "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					} else {
						XKit.window.show("Unable to edit post", `<pre style="user-select: text;">${error}</pre>`, "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					}
				} finally {
					XKit.interface.switch_control_button($(m_button), false);
				}
			}, false);
		} else {
			XKit.window.show("Unable to edit post", "Something went wrong, my apologies.<br/>Please try again later or file a bug report with the error code:<br/>QT02", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		}

		XKit.extensions.quick_tags.user_on_box = false;
		XKit.extensions.quick_tags.close_window();
	},

	custom_tag: function() {

		XKit.interface.switch_control_button($(XKit.extensions.quick_tags.current_button), true);
		XKit.extensions.quick_tags.close_window();

		var m_tags = $("#xkit-tag-input").val();
		XKit.extensions.quick_tags.submit(m_tags, XKit.extensions.quick_tags.current_button);

	},

	button_clicked: function(e) {

		var obj = $(e.target);

		if ($(obj).hasClass("xkit-tag") === false) {
			obj = $(obj).parent();
		}

		XKit.interface.switch_control_button($(XKit.extensions.quick_tags.current_button), true);
		XKit.extensions.quick_tags.close_window();

		var m_tags = $(obj).attr('data-tags');

		var m_one_click = $(obj).attr('data-one-click-postage');
		if (m_one_click !== "true") {
			XKit.extensions.quick_tags.submit(m_tags, XKit.extensions.quick_tags.current_button);
		} else {
			if (XKit.extensions.quick_tags.preferences.append_not_replace_one_click.value !== true) {
				$("#x1cpostage_tags").val(m_tags);
			} else {
				if ($("#x1cpostage_tags").val() === "") {
					$("#x1cpostage_tags").val(m_tags);
				} else {
					var m_u_tags = $("#x1cpostage_tags").val();
					if (typeof m_u_tags === "undefined" || m_u_tags == "null") {
						m_u_tags = "";
					}
					$("#x1cpostage_tags").val(m_u_tags + "," + m_tags);
				}
			}
		}
	},

	add_button_clicked: function() {
		XKit.extensions.quick_tags.add_bundle_ui();
	},

	menu_closer_int: 0,
	user_on_box: false,
	current_button: "",

	close_window: function() {
		if (XKit.extensions.quick_tags.user_on_box === false) {
			$("#xkit-quick-tags-window").fadeOut('fast');
		}
	},

	load_tag_prefs: function() {

		// Get the user tags.
		var user_tags = XKit.storage.get("quick_tags", "user_tags");
		var user_tag_array = [];

		try {
			user_tag_array = JSON.parse(user_tags);
		} catch (e) {
		}

		XKit.extensions.quick_tags.tag_array = user_tag_array;

		return user_tag_array;

	},

	render_tags_from_array: function(user_tag_array, for_one_click) {

		var m_user_tags = "";

		if (user_tag_array.length !== 0) {

			var showNumbers = for_one_click && typeof XKit.extensions.one_click_postage != "undefined" && XKit.extensions.one_click_postage.preferences.enable_keyboard_shortcuts.value;

			for (var tag in user_tag_array) {

				var m_title = user_tag_array[tag].title;
				var m_tags = user_tag_array[tag].tags;

				var add_data = "";
				if (for_one_click === true) {
					add_data = "data-one-click-postage=\"true\"";
				}

				m_user_tags = m_user_tags + "<div " + add_data + " data-tags=\"" + m_tags + "\" class=\"xkit-tag user\"><div class=\"xkit-tag-name\">" + m_title;

				if (showNumbers && tag < 9) {
					// force javascript to treat tag as a number instead of string concatenation
					var shortcutNumber = parseInt(tag) + 1;
					m_user_tags = m_user_tags + "<span style=\"opacity:.7;float:right\">" +  shortcutNumber + "</span>";
				}

				m_user_tags = m_user_tags + "</div>";

				if (for_one_click !== true) {
					m_user_tags = m_user_tags + "<div class=\"xkit-tag-data\">" + m_tags + "</div>";
				}
				m_user_tags = m_user_tags + "</div>";

			}

		}

		return m_user_tags;

	},

	render_add_bundle_button: function(user_tag_array) {
		var m_add_button = "";

		if (user_tag_array.length === 0 &&
			!XKit.extensions.quick_tags.preferences.hide_new_bundle_button.value) {
			m_add_button = "<div class=\"xkit-tag-add\"><div class=\"xkit-tag-name\">+ Add tag bundle</div>";
		}

		return m_add_button;
	},

	move_window: function(e) {

		var obj = $(e.target);

		if ($(obj).hasClass("xkit-interface-working") === true) { return; }

		var user_tag_array = XKit.extensions.quick_tags.load_tag_prefs();
		var m_user_tags = XKit.extensions.quick_tags.render_tags_from_array(user_tag_array);
		var m_add_button = XKit.extensions.quick_tags.render_add_bundle_button(user_tag_array);

		var add_class = "nano";
		var add_class_2 = "content";
		if (user_tag_array.length <= 3) {
			add_class = "no-scroll-needed";
			add_class_2 = "";
		}

		// Let's create our popup first.
		var m_html = "<div id=\"xkit-quick-tags-window\">" +
					"<div id=\"xkit-quick-tags-user-tags\" class=\"" + add_class + "\">" +
						"<div class=\"" + add_class_2 + "\">" + m_user_tags + m_add_button + "</div>" +
					"</div>" +
					"<div class=\"xkit-tag-other\">" +
						"<input id=\"xkit-tag-input\" placeholder=\"new tags (comma separated)\" type=\"text\">" +
					"</div>" +
				"</div>";

		$("#xkit-quick-tags-window").remove();
		$("body").append(m_html);

		$("#xkit-tag-input").bind("keydown", function(event) {
			if (event.which == 13) {
				XKit.extensions.quick_tags.custom_tag();
			}
			event.stopPropagation();
			event.stopImmediatePropagation();
		});

		if ($(obj).attr('data-in-window') === "true") {
			$("#xkit-quick-tags-window, #xkit-quick-tags-user-tags").addClass("no-other-section");
			$(".xkit-tag-other").css("display", "none");
		} else {
			$("#xkit-quick-tags-window, #xkit-quick-tags-user-tags").removeClass("no-other-section");
			$(".xkit-tag-other").css("display", "block");
		}

		clearTimeout(XKit.extensions.quick_tags.menu_closer_int);

		if (user_tag_array.length >= 4) {
			setTimeout(function() {
				$("#xkit-quick-tags-user-tags").nanoScroller();
				$("#xkit-quick-tags-user-tags").nanoScroller({ scroll: 'top' });
			}, 100);
		}

		var offset = $(obj).offset();

		var box_left = offset.left - ($("#xkit-quick-tags-window").width() / 2) + 10;
		var box_top = offset.top - ($("#xkit-quick-tags-window").height() + 7);

		XKit.extensions.quick_tags.user_on_box = true;
		XKit.extensions.quick_tags.current_button = $(obj);

		$("#xkit-quick-tags-window").css("top", box_top + "px");
		$("#xkit-quick-tags-window").css("left", box_left + "px");
		$("#xkit-quick-tags-window").fadeIn('fast');

	},

	show: function(button, post) {

		// if (m_post.error == true) { return; }



	},

	return_for_one_click_postage: function() {

		var user_tag_array = XKit.extensions.quick_tags.load_tag_prefs();
		var m_user_tags = XKit.extensions.quick_tags.render_tags_from_array(user_tag_array, true);
		var m_add_button = XKit.extensions.quick_tags.render_add_bundle_button(user_tag_array);

		return m_user_tags + m_add_button;

	},

	do_posts: async function() {
		if (XKit.extensions.quick_tags.processing === true) {
			return;
		}

		if (XKit.interface.where().inbox) {
			return;
		}

		XKit.extensions.quick_tags.processing = true;
		var $posts = await XKit.interface.react.get_posts("xkit-quick-tags-done", true);

		$posts
			.addClass("xkit-quick-tags-done")
			.each(function() {
				XKit.interface.react.add_control_button($(this), "xkit-quick-tags", "");
			});

		XKit.extensions.quick_tags.processing = false;
	},

	destroy: function() {

		this.running = false;

		XKit.interface.post_window_listener.remove("quick_tags");
		XKit.post_listener.remove("quick_tags");

		$(document).off("mouseover", "#xkit-quick-tags-window", XKit.extensions.quick_tags.cancel_menu_close);
		$(document).off("mouseout", "#xkit-quick-tags-window", XKit.extensions.quick_tags.menu_close);

		$(document).off('mouseover', '.xkit-quick-tags, .xkit-quick-tags-window', XKit.extensions.quick_tags.move_window);
		$(document).off('mouseout', '.xkit-quick-tags, .xkit-quick-tags-window', XKit.extensions.quick_tags.menu_close);

		$(document).off('click', '.xkit-tag', XKit.extensions.quick_tags.button_clicked);
		$(document).off('click', '.xkit-tag-add', XKit.extensions.quick_tags.add_button_clicked);

		$("#xkit-tag-input").unbind("focus");
		$("#xkit-tag-input").unbind("blur");
		$("#xkit-tag-input").unbind("keydown");

		$("#xkit-quick-tags-window").remove();
		$(".xkit-quick-tags, .xkit-quick-tags-window").remove();

	},

	create_div: function(obj, id, max) {

		var m_html =	"<div data-id=\"" + id + "\" class=\"xkit-quick-tags-cp-tag\">" +
					"<div class=\"xkit-tag-title\">" + obj.title + "</div>" +
					"<div class=\"xkit-tag-tags\">" + obj.tags + "</div>";

		m_html = m_html + "<div class=\"xkit-quick-tags-cp-down\">&nbsp;</div>";

		if (id === 0) {
			m_html = m_html + "<div class=\"xkit-quick-tags-cp-up\" style=\"display: none;\">&nbsp;</div>";
		} else {
			m_html = m_html + "<div class=\"xkit-quick-tags-cp-up\">&nbsp;</div>";
		}

		m_html = m_html + "</div>";

		return m_html;

	},

	check_div_move_buttons: function() {

		var m_count = 0;

		$(".xkit-quick-tags-cp-tag").each(function() {

			if (m_count === 0) {
				$(this).find(".xkit-quick-tags-cp-up").css("display", "none");
			} else {
				$(this).find(".xkit-quick-tags-cp-up").css("display", "block");
			}

			if ($(this).is(":last-child")) {
				$(this).find(".xkit-quick-tags-cp-down").css("display", "none");
			} else {
				$(this).find(".xkit-quick-tags-cp-down").css("display", "block");
			}

			m_count++;

		});

	},

	save_div_positions: function() {

		var temp_array = [];

		$(".xkit-quick-tags-cp-tag").each(function() {

			var m_object = {};
			m_object.title = $(this).find(".xkit-tag-title").text();
			m_object.tags = $(this).find(".xkit-tag-tags").text();

			temp_array.push(m_object);

		});

		XKit.storage.set("quick_tags", "user_tags", JSON.stringify(temp_array));
		XKit.extensions.xkit_preferences.restart_extension("quick_tags");

	},

	cpanel: function(m_div) {

		if ($("#xkit-quick-tags-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-quick-tags-custom-panel").remove();
		}

		XKit.extensions.quick_tags.load_tag_prefs();

		var m_html = "<div id=\"xkit-quick-tags-custom-panel\"><div id=\"quick-tags-toolbar\"><div id=\"quick-tags-add-button\" class=\"xkit-button\">Add new tag bundle</div></div>";

		if (XKit.extensions.quick_tags.tag_array.length <= 0) {
			m_html = m_html + "<div id=\"xkit-quick-tags-none\"><b>You have no tag bundles.</b><br/>Create some by clicking on the button above to quickly tag your posts.</div>";
		} else {
			for (var i = 0; i < XKit.extensions.quick_tags.tag_array.length; i++) {
				if (XKit.extensions.quick_tags.tag_array[i] !== "") {
					m_html = m_html + XKit.extensions.quick_tags.create_div(XKit.extensions.quick_tags.tag_array[i], i, XKit.extensions.quick_tags.tag_array.length);
				}
			}
		}

		$(m_div).append(m_html);

		$(".xkit-quick-tags-cp-down").click(function() {

			var box = $(this).parent();
			$(box).next().after($(box));

			XKit.extensions.quick_tags.check_div_move_buttons();
			XKit.extensions.quick_tags.save_div_positions();

		});

		$(".xkit-quick-tags-cp-up").click(function() {

			var box = $(this).parent();
			$(box).prev().before($(box));

			XKit.extensions.quick_tags.check_div_move_buttons();
			XKit.extensions.quick_tags.save_div_positions();

		});

		$("#quick-tags-add-button").click(function() {
			XKit.extensions.quick_tags.add_bundle_ui();
		});

		$(".xkit-quick-tags-cp-tag").click(function(event) {

			if ($(event.target).hasClass("xkit-quick-tags-cp-up") || $(event.target).hasClass("xkit-quick-tags-cp-down")) { return; }

			var m_id = $(this).attr('data-id');

			var m_tags = XKit.extensions.quick_tags.tag_array[m_id].tags;
			var m_title = XKit.extensions.quick_tags.tag_array[m_id].title;
			XKit.window.show("Edit bundle", "<b>Bundle Title</b><input type=\"text\" maxlength=\"40\" value=\"" + m_title + "\" placeholder=\"eg: Doctor Who\" class=\"xkit-textbox\" id=\"xkit-quick-tags-add-title\"><b>Bundled Tags, comma separated</b><input value=\"" + m_tags + "\" type=\"text\" maxlength=\"250\" placeholder=\"eg: Doctor Who, Dr. Who, Non-Medical Tv Show Doctor\" class=\"xkit-textbox\" id=\"xkit-quick-tags-add-tags\">", "question", "<div class=\"xkit-button default\" id=\"xkit-quick-tags-create-bundle\">Save Bundle</div><div class=\"xkit-button\" id=\"xkit-quick-tags-delete-bundle\">Delete This Bundle</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-quick-tags-delete-bundle").click(function() {

				XKit.extensions.quick_tags.tag_array.splice(m_id, 1);

				XKit.storage.set("quick_tags", "user_tags", JSON.stringify(XKit.extensions.quick_tags.tag_array));

				XKit.window.close();
				XKit.extensions.quick_tags.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("quick_tags");

			});

			$("#xkit-quick-tags-create-bundle").click(function() {

				var $title = $("#xkit-quick-tags-add-title");
				var title = $title.val();
				var $tags = $("#xkit-quick-tags-add-tags");
				var tags = $tags.val();
				var quit = false;

				if ($.trim(title) === "") {
					$title
						.css("border-color", "red")
						.attr("placeholder", "Please enter a name for your bundle.")
						.click(function() {
							$title
								.removeAttr("style")
								.attr("placeholder", "eg: Doctor Who")
								.off("click");
						});
					quit = true;
				}

				if ($.trim(tags) === "") {
					$tags
						.css("border-color", "red")
						.attr("placeholder", "Please enter the tags for your bundle.")
						.click(function() {
							$tags
								.removeAttr("style")
								.attr("placeholder", "eg: Doctor Who, Dr. Who, Non-Medical Tv Show Doctor")
								.off("click");
						});
					quit = true;
				}

				if (quit) { return; }

				XKit.extensions.quick_tags.tag_array[m_id].title = title;
				XKit.extensions.quick_tags.tag_array[m_id].tags = tags;

				XKit.storage.set("quick_tags", "user_tags", JSON.stringify(XKit.extensions.quick_tags.tag_array));

				XKit.window.close();
				XKit.extensions.quick_tags.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("quick_tags");

			});


		});

		$(".xkit-quick-tags-tag-delete").click(function() {

			try {

				var m_id = $(this).attr('data-id');

				XKit.extensions.quick_tags.tag_array.splice(m_id, 1);

				XKit.storage.set("quick_tags", "user_tags", JSON.stringify(XKit.extensions.quick_tags.tag_array));

				XKit.extensions.quick_tags.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("quick_tags");

			} catch (e) {

				console.log("quick-tags cp delete -> " + e.message);

			}

		});

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		XKit.extensions.quick_tags.infoCpanel(m_div);
	},

	infoCpanel: function(m_div) {

		$('.xkit-quick-tags-cp-info').remove();
		$(m_div).prepend(`
			<div class="xkit-quick-tags-cp-info">
				<p>
					The <a href="https://github.com/AprilSylph/XKit-Rewritten#readme" target="_blank">XKit Rewritten</a> extension includes a new version of this script. It fixes post formatting becoming broken when tags are added and adds a quick tag button to the post editor!
				</p>
				<p>
					To migrate easily, <a href="https://github.com/AprilSylph/XKit-Rewritten#installation" target="_blank">install XKit Rewritten</a> and enable its Quick Tags feature in your browser toolbar, then refresh this page and press this button to copy your tag bundles:
				</p>
				<button class="xkit-button" id="xkit-quick-tags-cp-export">Copy tag bundles to XKit Rewritten</button>
			</div>
		`);

		$('#xkit-quick-tags-cp-export').on('click', async function() {
			if (!XKit.extensions.quick_tags.tag_array.length) {
				XKit.window.show(
					'Nothing to Copy',
					"You don't have any tag bundles to copy!",
					'error',
					'<div id="xkit-close-message" class="xkit-button default">OK</div>',
				);
				return;
			}

			this.setAttribute('disabled', '');
			this.classList.add('disabled');

			let succeeded = false;

			window.addEventListener('xkit-quick-tags-migration-success', () => { succeeded = true; }, { once: true });
			window.dispatchEvent(new CustomEvent('xkit-quick-tags-migration', { detail: JSON.stringify(XKit.extensions.quick_tags.tag_array) }));

			setTimeout(() => {
				this.removeAttribute('disabled');
				this.classList.remove('disabled');

				if (succeeded) {
					XKit.extensions.xkit_preferences.close();
				} else {
					XKit.window.show(
						'Failure',
						'Make sure you have installed XKit Rewritten v0.23.5 or later, have refreshed the page, and have enabled Quick Tags.',
						'error',
						'<div id="xkit-close-message" class="xkit-button default">OK</div>',
					);
				}
			}, 500);
		});
	},

	add_bundle_ui: function() {

		XKit.window.show("Create new bundle", "<b>Bundle Title</b><input type=\"text\" maxlength=\"40\" placeholder=\"eg: Doctor Who\" class=\"xkit-textbox\" id=\"xkit-quick-tags-add-title\"><b>Bundled Tags, comma separated</b><input type=\"text\" maxlength=\"250\" placeholder=\"eg: Doctor Who, Dr. Who, Non-Medical Tv Show Doctor\" class=\"xkit-textbox\" id=\"xkit-quick-tags-add-tags\">", "question", "<div class=\"xkit-button default\" id=\"xkit-quick-tags-create-bundle\">Create Bundle</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-quick-tags-create-bundle").click(function() {

			var $title = $("#xkit-quick-tags-add-title");
			var title = $title.val();
			var $tags = $("#xkit-quick-tags-add-tags");
			var tags = $tags.val();
			var quit = false;

			if ($.trim(title) === "") {
				$title
					.css("border-color", "red")
					.attr("placeholder", "Please enter a name for your bundle.")
					.click(function() {
						$title
							.removeAttr("style")
							.attr("placeholder", "eg: Doctor Who")
							.off("click");
					});
				quit = true;
			}

			if ($.trim(tags) === "") {
				$tags
					.css("border-color", "red")
					.attr("placeholder", "Please enter the tags for your bundle.")
					.click(function() {
						$tags
							.removeAttr("style")
							.attr("placeholder", "eg: Doctor Who, Dr. Who, Non-Medical Tv Show Doctor")
							.off("click");
					});
				quit = true;
			}

			if (quit) { return; }

			var m_object = {};
			m_object.title = title;
			m_object.tags = tags;
			XKit.extensions.quick_tags.tag_array.push(m_object);

			XKit.storage.set("quick_tags", "user_tags", JSON.stringify(XKit.extensions.quick_tags.tag_array));

			XKit.window.close();
			XKit.extensions.xkit_preferences.restart_extension("quick_tags");
			$('.xkit-extension.selected[data-extension-id="quick_tags"]').click();
		});

	}

});
