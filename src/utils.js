/**
 * @file Utilities
 */

'use strict'

import Mutt from './index'

/**
 * Function to provide mixin support to classes
 */
export function mixin(target, source) {
    target = target.prototype
    source = source.prototype

    Object.getOwnPropertyNames(source).forEach(
        function(name) {
            if (name !== 'constructor') {
                Object.defineProperty(
                    target,
                    name,
                    Object.getOwnPropertyDescriptor(source, name)
                )
            }
        }
    )
}

/**
 * Log a message to the console, used for debugging
 * @param message a message to be logged
 */
export function logger(message) {
    if (Mutt.config.getSetting('debug')) {
        console.log('Mutt :: ', message)
    }
}
