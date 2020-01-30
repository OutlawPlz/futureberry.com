(function ($) {
    const FroalaEditor = $.FroalaEditor;

    $.oc.richEditorButtons.splice(3, 0, 'keywordPopup');

    FroalaEditor.DefineIcon('keywordPopup', { NAME: 'diamond' });
    FroalaEditor.RegisterCommand('keywordPopup', {
        title: 'FUTUREBERRY Keyword',
        undo: false,
        focus: false,
        plugin: 'futureberryKeyword',

        callback: function () {
            if ( ! this.popups.isVisible('futureberryKeyword.popup')) {
                return this.futureberryKeyword.showPopup();
            }

            if (this.$el.find('.fr-marker')) {
                this.events.disableBlur();
                this.selection.restore();
            }

            this.popups.hide('futureberryKeyword.popup');
        }
    });

    Object.assign(FroalaEditor.POPUP_TEMPLATES, {
        'futureberryKeyword.popup': '[_CUSTOM_LAYER_]'
    });

    FroalaEditor.PLUGINS.futureberryKeyword = function (editor) {
        function initPopup() {
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

            let $popup = editor.popups.create('futureberryKeyword.popup', template);

            return $popup;
        }

        function showPopup() {
            let $popup = editor.popups.get('futureberryKeyword.popup');

            if ( ! $popup) $popup = initPopup();

            editor.popups.setContainer('futureberryKeyword.popup', editor.$tb);

            let $button = editor.$tb.find('.fr-command[data-cmd="keywordPopup"]');

            let left = $button.offset().left + $button.outerWidth() / 2;
            let top = $button.offset().top + (editor.opts.toolbarBottom ? 10 : $button.outerHeight() - 10);

            editor.popups.show('futureberryKeyword.popup', left, top, $button.outerHeight());
        }

        function hidePopup() {
            editor.popups.hide('futureberryKeyword.popup');
        }

        function getKeywordValues() {
            let $popup = editor.popups.get('futureberryKeyword.popup');

            let label = $popup.find('input.fr-keyword-attr[name="label"]').val();
            let url = $popup.find('input.fr-keyword-attr[name="url"]').val();

            return {
                label: label.trim(),
                url: url.trim(),
            }
        }

        return {
            showPopup: showPopup,
            hidePopup: hidePopup,
            getKeywordValues: getKeywordValues,
        }
    };

    FroalaEditor.RegisterCommand('keywordInsert', {
        callback: function () {
            let values = this.futureberryKeyword.getKeywordValues();

            // TODO: Validate keyword values.
            this.html.insert(`<span class="keyword" data-video="${values.url}">${values.label}</span>`);
        }
    });
})(jQuery);
