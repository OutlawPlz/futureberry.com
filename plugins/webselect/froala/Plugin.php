<?php namespace Webselect\Froala;

use Backend;
use Backend\FormWidgets\RichEditor;
use System\Classes\PluginBase;

/**
 * froala Plugin Information File
 */
class Plugin extends PluginBase
{
    /**
     * Returns information about this plugin.
     *
     * @return array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'froala',
            'description' => 'Froala editor customizations.',
            'author'      => 'webselect',
            'icon'        => 'icon-paragraph'
        ];
    }

    /**
     * Register method, called when the plugin is first registered.
     *
     * @return void
     */
    public function register()
    {

    }

    /**
     * Boot method, called right before the request route.
     *
     * @return array
     */
    public function boot()
    {
        RichEditor::extend(function (RichEditor $widget) {
            $widget->addJs('/plugins/webselect/froala/assets/js/line_height.plugin.js');
            $widget->addJs('/plugins/webselect/froala/assets/js/futureberry.plugin.js');
        });
    }

    /**
     * Registers any front-end components implemented in this plugin.
     *
     * @return array
     */
    public function registerComponents()
    {
        return []; // Remove this line to activate

        return [
            'Webselect\Froala\Components\MyComponent' => 'myComponent',
        ];
    }

    /**
     * Registers any back-end permissions used by this plugin.
     *
     * @return array
     */
    public function registerPermissions()
    {
        return []; // Remove this line to activate

        return [
            'webselect.froala.some_permission' => [
                'tab' => 'froala',
                'label' => 'Some permission'
            ],
        ];
    }

    /**
     * Registers back-end navigation items for this plugin.
     *
     * @return array
     */
    public function registerNavigation()
    {
        return []; // Remove this line to activate

        return [
            'froala' => [
                'label'       => 'froala',
                'url'         => Backend::url('webselect/froala/mycontroller'),
                'icon'        => 'icon-paragraph',
                'permissions' => ['webselect.froala.*'],
                'order'       => 500,
            ],
        ];
    }
}
