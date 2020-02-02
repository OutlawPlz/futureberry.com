<?php namespace WebSelect\FutureberryKeyword;

use Backend;
use Backend\FormWidgets\RichEditor;
use System\Classes\PluginBase;

/**
 * FutureberryKeyword Plugin Information File
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
            'name'        => 'FutureberryKeyword',
            'description' => 'No description provided yet...',
            'author'      => 'WebSelect',
            'icon'        => 'icon-leaf'
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
            $widget->addJs('/plugins/webselect/futureberrykeyword/assets/js/froala.futureberry.plugin.js ');
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
            'WebSelect\FutureberryKeyword\Components\MyComponent' => 'myComponent',
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
            'webselect.futureberrykeyword.some_permission' => [
                'tab' => 'FutureberryKeyword',
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
            'futureberrykeyword' => [
                'label'       => 'FutureberryKeyword',
                'url'         => Backend::url('webselect/futureberrykeyword/mycontroller'),
                'icon'        => 'icon-leaf',
                'permissions' => ['webselect.futureberrykeyword.*'],
                'order'       => 500,
            ],
        ];
    }
}
