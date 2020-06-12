import {Lightning} from "wpe-lightning-sdk";

export class Button extends Lightning.Component {
    static _template() {
        return {
            alpha: 0.2,
            Background: {
                w: 100,
                h: 100,
                x: 0,
                y: 0,
                rect: true,
                color: 0xFFffffff
            },
            Label: {
                zindex: 3,
                alpha: 1,
                Text: {
                    x: 25,
                    y: 35,
                    w: 50,
                    h: 50,
                    text: {
                        textAlign: 'center',
                        fontFace: 'SourceSansPro-Black',
                        fontSize: 20,
                        textColor: 0xFF000000,

                    }
                }
            }
        }
    }

    _init() {
        this._background = this.tag('Background');
        this._label = this.tag('Label');
    }

    _focus() {
        this.alpha = 1
    }

    _unfocus() {
        this.alpha = 0.5
    }
}

export class PlayPause extends Button {

    _init() {
        super._init();
        this._label.tag('Text').text = 'PLAY'
    }

    set status(v) {
        this._status = v;
    }

    get status() {
        return this._status;
    }

    _handleEnter() {
        this.signal('playerPlay');
    }

    set setLabel(v) {
        this.tag('Text').text = v;
    }
}

export class Back extends Button {
    _init() {
        super._init();
        this._label.tag('Text').text = 'BACK'
    }

    _handleEnter() {
        this.signal('playerBack');
    }
}

export class Forward extends Button {
    _init() {
        super._init();
        this._label.tag('Text').text = 'FF'
    }

    _handleEnter() {
        this.signal('playerFF');
    }
}