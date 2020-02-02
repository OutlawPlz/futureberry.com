(function ($) {
    const FroalaEditor = $.FroalaEditor;

    $.oc.richEditorButtons.splice(3, 0, 'keyword');

    Object.assign(FroalaEditor.POPUP_TEMPLATES, {
        'futureberry.popup': '[_BUTTONS_][_CUSTOM_LAYER_]'
    });

    Object.assign(FroalaEditor.DEFAULTS, {
        popupButtons: ['futureberryHotword', 'futureberryLink'],
    });

    FroalaEditor.PLUGINS.futureberry = function (editor) {
        function initPopup () {
            let template = FroalaEditor.POPUP_TEMPLATES.customPopup;

            if (typeof template == 'function') template = template.apply(editor);

            template = {
                buttons:
                    `<div class="fr-buttons">${editor.button.buildList(editor.opts.popupButtons)}</div>`,
                custom_layer:
                    `<div id="fr-futureberry-hotword-layer" class="fr-layer fr-active">
                        <div class="fr-input-line">
                            <input id="fr-hotword-label-input" type="text" name="label"
                                   class="fr-keyword-attr" placeholder="Label" tabindex="1" dir="auto">
                        </div>
                        <div class="fr-input-line">
                            <input id="fr-hotword-video-url-input" type="text" name="video_url"
                                   class="fr-keyword-attr" placeholder="Video URL" tabindex="1" dir="auto">
                        </div>
                        <div class="fr-action-buttons">
                            <button class="fr-command fr-submit" role="button" data-cmd="keywordInsert" href="#" tabindex="4" type="button">Insert</button>
                        </div>
                    </div>
                    <div id="fr-futureberry-link-layer" class="fr-layer">
                        <div class="fr-input-line">
                            <input id="fr-hotword-link-label-input" type="text" name="link_label"
                                   class="fr-keyword-attr" placeholder="Link label" tabindex="1" dir="auto">
                        </div>
                        <div class="fr-input-line">
                            <input id="fr-hotword-link-url-input" type="text" name="link_url"
                                   class="fr-keyword-attr" placeholder="Link URL" tabindex="1" dir="auto">
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

        function getHotwordValues () {
            let popup = editor.popups.get('futureberry.popup')[0];

            let label = popup.querySelector('#fr-hotword-label-input').value;
            let videoUrl = popup.querySelector('#fr-hotword-video-url-input').value;
            let linkLabel = popup.querySelector('#fr-hotword-link-label-input').value;
            let linkUrl = popup.querySelector('#fr-hotword-link-url-input').value;

            return {
                label: label.trim(),
                videoUrl: videoUrl.trim(),
                linkLabel: linkLabel.trim(),
                linkUrl: linkUrl.trim(),
            }
        }

        function setKeywordValues () {
            let popup = editor.popups.get('futureberry.popup')[0];
            let element = editor.selection.element().parentElement;

            if ( ! element.classList.contains('keyword')) {
                return (popup.querySelector('#fr-hotword-label-input').value = editor.selection.text());
            }

            let label = element.querySelector('.keyword__label');
            let link = element.querySelector('.keyword__link');

            popup.querySelector('#fr-hotword-label-input').value = label.innerText;
            popup.querySelector('#fr-hotword-video-url-input').value = element.dataset.video_url;

            if ( ! link) return;

            popup.querySelector('#fr-hotword-link-label-input').value = link.innerText;
            popup.querySelector('#fr-hotword-link-url-input').value = link.href;
        }

        function clearKeywordValues () {
            let popup = editor.popups.get('futureberry.popup')[0];

            popup.querySelector('#fr-hotword-label-input').value = '';
            popup.querySelector('#fr-hotword-video-url-input').value = '';

            popup.querySelector('#fr-hotword-link-label-input').value = '';
            popup.querySelector('#fr-hotword-link-url-input').value = '';
        }

        return {
            showPopup: showPopup,
            hidePopup: hidePopup,
            getHotwordValues: getHotwordValues,
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

    FroalaEditor.DefineIcon('futureberryLinkIcon', { NAME: 'link'});
    FroalaEditor.RegisterCommand('futureberryLink', {
        title: 'Hotword Link',
        icon: 'futureberryLinkIcon',
        plugin: 'futureberry',
        undo: false,
        focus: false,
        popup: true,

        callback: function () {
            let popup = this.popups.get('futureberry.popup')[0];

            let hotwordLayer = popup.querySelector('#fr-futureberry-hotword-layer');
            let linkLayer = popup.querySelector('#fr-futureberry-link-layer');

            hotwordLayer.classList.remove('fr-active');
            linkLayer.classList.add('fr-active');
        }
    });

    FroalaEditor.DefineIcon('futureberryHotwordIcon', { NAME: 'asterisk' });
    FroalaEditor.RegisterCommand('futureberryHotword', {
        title: 'Hotword',
        icon: 'futureberryHotwordIcon',
        plugin: 'futureberry',
        undo: false,
        focus: false,
        popup: true,

        callback: function () {
            let popup = this.popups.get('futureberry.popup')[0];

            let hotwordLayer = popup.querySelector('#fr-futureberry-hotword-layer');
            let linkLayer = popup.querySelector('#fr-futureberry-link-layer');

            linkLayer.classList.remove('fr-active');
            hotwordLayer.classList.add('fr-active');
        }
    });

    FroalaEditor.RegisterCommand('keywordInsert', {
        title: 'Insert',
        focus: true,
        undo: true,
        refreshAfterCallback: true,

        callback: function () {
            let values = this.futureberry.getHotwordValues();
            let element = this.selection.element().parentElement;
            let link = element.querySelector('.keyword__link');

            if ( ! values.label || ! values.videoUrl) return this.popups.hide('futureberry.popup');

            let hotword = `<span class="keyword" data-video_url="${values.videoUrl}"><span class="keyword__label">${values.label}</span><a href="${values.linkUrl}" class="keyword__link">${values.linkLabel}</a></span>`;

            if ( ! element.classList.contains('keyword')) {
                this.html.insert(hotword);

                return this.popups.hide('futureberry.popup');
            }

            if (values.linkLabel && values.linkUrl) {
                (element.outerHTML = hotword);

                return this.popups.hide('futureberry.popup');
            }

            element.dataset.video_url = values.videoUrl;
            element.firstElementChild.innerText = values.label;

            if (link) element.removeChild(link);

            return this.popups.hide('futureberry.popup');
        }
    });
})(jQuery);
