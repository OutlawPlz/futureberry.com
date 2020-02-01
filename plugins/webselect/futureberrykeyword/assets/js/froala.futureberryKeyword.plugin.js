(function ($) {
    const FroalaEditor = $.FroalaEditor;

    $.oc.richEditorButtons.splice(3, 0, 'keyword');

    Object.assign(FroalaEditor.POPUP_TEMPLATES, {
        'futureberry.popup': '[_CUSTOM_LAYER_]'
    });

    Object.assign(FroalaEditor.DEFAULTS, {
        popupButtons: ['popupClose', '|', 'popupButton1', 'popupButton2'],
    });

    FroalaEditor.PLUGINS.futureberry = function (editor) {
        function initPopup () {
            let template = FroalaEditor.POPUP_TEMPLATES.customPopup;
            if (typeof template == 'function') template = template.apply(editor);

            template = {
                custom_layer:
                    `<div id="fr-keyword-insert-layer" class="fr-layer fr-active fr-keyword-insert-layer">
                        <div class="fr-input-line">
                            <input id="fr-keyword-insert-layer-label" type="text" name="label"
                                   class="fr-keyword-attr" placeholder="Label" tabindex="1" dir="auto">
                        </div>
                        <div class="fr-input-line">
                            <input id="fr-keyword-insert-layer-video" type="text" name="url"
                                   class="fr-keyword-attr" placeholder="Video URL" tabindex="1" dir="auto">
                        </div>
                        <div class="fr-action-buttons">
                            <button class="fr-command fr-submit" role="button" data-cmd="keywordInsert" href="#" tabindex="4" type="button">Insert</button>
                        </div>
                    </div>`
            };

            editor.popups.onHide('futureberry.popup', function () {
                clearKeywordValues();
            });

            return editor.popups.create('futureberry.popup', template);
        }

        function showPopup () {
            let $popup = editor.popups.get('futureberry.popup');

            if ( ! $popup) $popup = initPopup();

            editor.popups.setContainer('futureberry.popup', editor.$tb);

            let $btn = editor.$tb.find('.fr-command[data-cmd="keyword"]');

            let left = $btn.offset().left + $btn.outerWidth() / 2;
            let top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

            setKeywordValues();

            editor.popups.show('futureberry.popup', left, top, $btn.outerHeight());
        }

        function hidePopup () {
            editor.popups.hide('futureberry.popup');
        }

        function getKeywordValues () {
            let $popup = editor.popups.get('futureberry.popup');

            let label = $popup.find('input.fr-keyword-attr[name="label"]').val();
            let url = $popup.find('input.fr-keyword-attr[name="url"]').val();

            return {
                label: label.trim(),
                videoUrl: url.trim(),
            }
        }

        function setKeywordValues () {
            let $popup = editor.popups.get('futureberry.popup');
            let element = editor.selection.element();

            if (element.classList.contains('keyword')) {
                $popup.find('input.fr-keyword-attr[name="label"]').val(element.innerText);
                $popup.find('input.fr-keyword-attr[name="url"]').val(element.dataset.video_url);

                return;
            }

            $popup.find('input.fr-keyword-attr[name="label"]').val(editor.selection.text());
        }

        function clearKeywordValues () {
            let $popup = editor.popups.get('futureberry.popup');

            $popup.find('input.fr-keyword-attr[name="label"]').val('');
            $popup.find('input.fr-keyword-attr[name="url"]').val('');
        }

        return {
            showPopup: showPopup,
            hidePopup: hidePopup,
            getKeywordValues: getKeywordValues,
            clearKeywordValues: clearKeywordValues,
        }
    };

    FroalaEditor.DefineIcon('buttonIcon', { NAME: 'asterisk'});
    FroalaEditor.RegisterCommand('keyword', {
        title: 'Show Popup',
        icon: 'buttonIcon',
        plugin: 'futureberry',
        undo: false,
        focus: false,
        popup: true,

        callback: function () {
            if ( ! this.popups.isVisible('futureberry.popup')) {
                return this.futureberry.showPopup();
            }

            if (this.$el.find('.fr-marker')) {
                this.events.disableBlur();
                this.selection.restore();
            }

            this.popups.hide('futureberry.popup');
        }
    });

    FroalaEditor.RegisterCommand('keywordInsert', {
        title: 'Close',
        focus: true,
        undo: true,
        refreshAfterCallback: true,

        callback: function () {
            let values = this.futureberry.getKeywordValues();
            let element = this.selection.element();

            if (element.classList.contains('keyword')) {
                element.innerText = values.label;
                element.dataset.video_url = values.videoUrl;

                this.popups.hide('futureberry.popup');

                return;
            }

            this.html.insert(`<span class="keyword" data-video_url="${values.videoUrl}">${values.label}</span>`);

            this.popups.hide('futureberry.popup');
        }
    });
})(jQuery);
