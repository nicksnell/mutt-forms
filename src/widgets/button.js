/**
 * @file Text input widget interface
 */

'use strict'

import {Widget} from './core'

/**
 * Button - Standard HTML Button
 * @class
 */
export class Button extends Widget {

    /**
     * Render the button field
     * @returns {HTMLElement} render the input widget
     */
    renderField() {
        let button = document.createElement('button')
        button.setAttribute('type', 'button')
        button.setAttribute('value', 'false')
        button.setAttribute('class', this.getFieldClass())

        for(let attrib in this.attribs) {
            button.setAttribute(attrib, this.attribs[attrib])
        }

        return button
    }

    /**
     * Get the class name for the widget element
     */
    getFieldClass() { return 'mutt-field mutt-field-button' }
}