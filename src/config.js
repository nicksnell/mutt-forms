/**
 * @file Config - Registry of settings
 * @author Nick Snell <nick@boughtbymany.com>
 * @copyright Bought By Many 2018
 */

'use strict'

import MuttForm from './mutt'
import * as fields from './fields'

/**
 * Internal registry for Mutt fields & widgets. This is used
 * internally to register default fields & widgets, and can
 * also be used as a hook to install new fields & widgets
 * via plugins.
 * @class
 */
class MuttConfig {
    /**
     * MuttConfig is used for configuration information.
     * It's primarily used by the builder utility to decide
     * field mappings and by the plugins to extend the core
     * functionality.
     * @constructor
     */
    constructor() {
        this._config = {
            settings: {
                debug: false,
            },
            fields: {
                array: fields.ArrayField,
                boolean: fields.BooleanField,
                enum: fields.ChoiceField,
                integer: fields.IntegerField,
                object: fields.ObjectField,
                string: fields.StringField,
                date: fields.StringField,
                datetime: fields.StringField,
                button: fields.ButtonField,
            },
            widgets: {

            },
        }
    }

    /**
     * Get a setting by name
     * @param {string} name - Name of setting
     * @return {*} - Returns setting value or null
     */
    getSetting(name) {
        if (!this._config.settings.hasOwnProperty(name)) {
            return null
        }

        return this._config.settings[name]
    }

    /**
     * Set a setting by name
     * @param {string} name - Name of setting
     * @param {*} value - Value of the config setting
     */
    setSetting(name, value) {
        this._config.settings[name] = value
    }

    /**
     * Use a plugin in the registry
     * @param {object} plugin - a plugin to configure, requires install method.
     */
    use(plugin) {
        // Check we can install the plugin
        if (!plugin.hasOwnProperty('install')) {
            throw new Error(
                'Unable to install plugin - missing install!'
            )
        }

        let pluginComponents = {}
        let pluginFeatures = plugin.install()

        // NOTE: Support for legacy plugins returning an array
        if (Array.isArray(pluginFeatures)) {
            let [fields, widgets, settings] = pluginFeatures
            pluginComponents = {fields, widgets, settings}
        } else {
            pluginComponents = pluginFeatures
        }

        // Fields & Widgets allow for the extension of mutt default
        // fields & widgets
        if (pluginComponents.fields) {
            this.registerFields(pluginComponents.fields)
        }

        if (pluginComponents.widgets) {
            this.registerWidgets(pluginComponents.widgets)
        }

        // Settings
        // These allow for internal settings to be overidden or
        // extended by plugins
        if (pluginComponents.settings) {
            this._config.settings = Object.assign(
                this._config.settings,
                pluginComponents.settings
            )
        }

        // Extensions
        // These allow for the MuttForm class to be extended
        // or overidden by plugins
        if (pluginComponents.extensions) {
            Object.keys(pluginComponents.extensions).forEach((name) => {
                let extension = pluginComponents.extensions[name]
                MuttForm.prototype[name] = extension
            })
        }
    }

    /**
     * Register a new field type or overwrite an existing field
     * type with a new field class.
     * @param {string} type - field type
     * @param {Field} fieldKlass - field class to be used for type
     */
    registerField(type, fieldKlass) {
        this._config.fields[type] = fieldKlass
    }

    /**
     * Register a collection of fields
     * @param {object} fields - Array of Field classes to register
     */
    registerFields(fields) {
        if (fields) {
            for (let fieldType of Object.keys(fields)) {
                this.registerField(fieldType, fields[fieldType])
            }
        }
    }

    /**
     * Check if a field type exists in the registry
     * @param {string} type - name of field type to check
     * @return {bool} Returns true if field type exists in registry
     */
    hasField(type) {
        if (this._config.fields.hasOwnProperty(type)) {
            return true
        }
        return false
    }

    /**
     * Get a field class
     * @param {string} type - String type of field class
     * @return {*} Returns a Field class for a type or null
     */
    getField(type) {
        if (this._config.fields.hasOwnProperty(type)) {
            return this._config.fields[type]
        }
        return null
    }

    /**
     * Register a widget class with a key
     * @param {string} name - reference for widget
     * @param {Widget} widgetKlass - class of widget to be registered
     */
    registerWidget(name, widgetKlass) {
        this._config.widgets[name] = widgetKlass
    }

    /**
     * Register a collection of widgets - calls registerWidget
     * @param {array} widgets - list of widgets to register
     */
    registerWidgets(widgets) {
        if (widgets) {
            for (let widgetName of Object.keys(widgets)) {
                this.registerWidget(widgetName, widgets[widgetName])
            }
        }
    }

    /**
     * Check if a widget has been registered
     * @param {string} name - name of widget to check
     * @return {boolean} Returns true if widget exists, else false
     */
    hasWidget(name) {
        if (this._config.widgets.hasOwnProperty(name)) {
            return true
        }
        return false
    }

    /**
     * Get a widget class by name
     * @param {string} name - name of widget class to fetch
     * @return {*} Returns a Widget class for name or null
     */
    getWidget(name) {
        if (this._config.widgets.hasOwnProperty(name)) {
            return this._config.widgets[name]
        }
        return null
    }

    /**
     * Get currently configured widgets
     * @return {object} object of currently configured widgets
     */
    getWidgets() {
        return this._config.widgets
    }
}

export default MuttConfig
