/**
 * @file Main Mutt API
 * @author Nick Snell <nick@boughtbymany.com>
 * @copyright Bought By Many 2018
 */

'use strict'

import MuttForm from './mutt'
import MuttConfig from './config'
import {logger, mixin} from './utils'

import * as fields from './fields'
import * as widgets from './widgets'
import * as validators from './validators'

/**
 * Main Mutt API.
 * @param {object} schema - A JSON Schema definition
 * @param {object} [options] - Configuration options for form
 * @param {boolean} [debug] - Run Mutt in debug mode
 * @return {MuttForm} - Returns an instance of a MuttForm
 * @example
 * let form = new Mutt({ name: { type: 'string' } })
 */
function Mutt(schema, options = {}, debug = false) {
    if (debug) {
        this.config.setSetting('debug', true)
    }

    if(schema === undefined) {
        throw new Error('You must specify a Schema!')
    }

    // Setup a new form instance if called directly
    return new MuttForm(schema, options)
}

/**
 * Internal setup for Mutt API
 * @param {object} Mutt - Mutt interface too bootstrap
 * @private
 */
function initApi(Mutt) {
    // Setup the config
    let config = new MuttConfig()
    Mutt.config = config

    // Setup plugin interface
    Mutt.use = function(plugins) {
        if (!Array.isArray(plugins)) {
            plugins = [plugins]
        }

        for (let plugin of plugins) {
            Mutt.config.use(plugin)
        }
    }

    // Setup Utilities
    Mutt.logger = logger
    Mutt.mixin = mixin

    // Add in hooks for fields, widgets & validators
    Mutt.fields = fields
    Mutt.widgets = widgets
    Mutt.validators = validators
}

initApi(Mutt)

Mutt.version = '2.0.0-alpha'

export default Mutt
