
// Global namespace
var Proliance = Proliance || {};

Proliance.NewFolderDialog = function ($, undefined) {

	var dialog = null; // hold instance of dialog 
	var defaults = { template: "NewFolderDialog", backdrop: true, keyboard: true };
	var settings = defaults;
	var folderName;
	var folderType;
	var createButton;

	function defaultLayout() {
		function LL(name, def) { return settings[name] || def; }

		return $("<div id='new-folder-dialog' tabindex='-1' class='modal-dialog new-folder-dialog hide' role='dialog' aria-hidden='true'/>")
			.append($("<div class='modal-header'/>")
				.append($("<h3>" + LL("newFolderCaption", "New Folder") + "</h3>")))
			.append($("<div class='modal-body'/>")

				.append($("<ul/>")
					.append($("<li class='first clearfix'/>")
						.append($("<input id='new-folder-dialog-name' class='TextBox' name='folder-name'/>"))
						.append($("<label class='caption' for='new-folder-dialog-name'>" + LL('folderNameLabel', 'Folder Name:') + "</label>")))

					.append($("<li class='last clearfix'/>")
						.append($("<select id='new-folder-dialog-type' class='SelectBox' name='folder-type'/>"))
						.append($("<label class='caption' for='new-folder-dialog-type'>" + LL('subtypeNameLabel', 'Default Type:') + "</label>")))))

			.append($("<div class='modal-footer'/>")
				.append($('<input class="btn create" aria-hidden="true" value="' + LL('createButtonText', 'Create') + '" type="button"/>'))
		//.append($('<button class="btn create" aria-hidden="true">' + LL('createButtonText','Create')+'</button>'))
				.append($('<button class="btn cancel" data-dismiss="modal" aria-hidden="true">' + LL('cancelButtonText', 'Cancel') + '</button>')));
	}

	function buildDialog() {
		if (dialog) return dialog;

		if (settings && settings.template)
			dialog = $('#' + settings.template);

		if (!dialog || dialog.length === 0)
			dialog = defaultLayout();

		dialog.find(".btn.cancel").click(function () {
			dialog.modal("hide");
		});


		createButton = dialog.find(".btn.create");
		folderName = dialog.find("#new-folder-dialog-name");
		folderType = dialog.find("#new-folder-dialog-type");

		createButton.prop("disabled", $.trim(folderName.val()) === "");  // in jQuery 1.6+ use .prop, not attr
		folderName.keyup(function (e) { createButton.prop("disabled", $.trim(folderName.val()) === ""); });

		dialog.find(".btn.create").click(function () {
			if (settings && settings.newFolderInfoElementID) {
				var newFolderInfoElement = $("#" + settings.newFolderInfoElementID);
				if (newFolderInfoElement && newFolderInfoElement.length === 1) {
					newFolderInfoElement[0].value = JSON.stringify(new FolderInfo($.trim(folderName.val()), folderType.val()));
					//alert(newFolderInfoElement[0].value);
				}
			}
			settings && settings.postBack && settings.postBack();
			dialog.modal("hide");
		});

		// http://stackoverflow.com/questions/317095/how-do-i-add-options-to-a-dropdownlist-using-jquery
		if (settings && settings.subtypeOptions) {
			$.each(settings.subtypeOptions, function (index, pair) {
				folderType.append(
					$('<option></option>').val(pair["key"]).html(pair["value"])
				);
			});
		}

		dialog.bind('shown', function () {
			folderName.val("").focus();
			folderType.removeAttr("selected").find("option:first").attr("selected", "selected");
		});

		return dialog;
	}

	function showDialog() {
		if (!buildDialog()) return; // sorry, can not show the dialog
		dialog.modal("show", settings);
	}

	function setSettings(newSettings, methods) {
		settings = $.extend(defaults, newSettings, methods);
	}

	return { show: showDialog, settings: setSettings };

} (jQuery);
