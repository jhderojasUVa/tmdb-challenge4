// @todo: import MediaPlayer from SDK
import {Lightning, Utils, MediaPlayer} from "wpe-lightning-sdk";
import {PlayPause, Back, Forward} from '../components'

export default class Player extends Lightning.Component {
    static _template() {
        return {
            /**
             * @todo:
             * - Add MediaPlayer component (that you've imported via SDK)
             * - Add a rectangle overlay with gradient color to the bottom of the screen
             * - Add A Controls:{} Wrapper that hosts the following components:
             *   - PlayPause button image (see static/mediaplayer folder)
             *   - A skip button (see static/mediaplayer folder)
             *   - Progress bar (2 rectangles?)
             *   - add duration label
             *   - add text label for currentTime
             */
            Video: {
                x: 0,
                y: 0,
                w: w => w || 1920,
                h: h => h || 1080,
                type: MediaPlayer
            },
            PlayPause: {
                x: 0,
                y: 0,
            },
            FileInformation: {
                x: 10,
                y: 10,
                w: 550,
                h: 80,
                Text: {
                    x: 15,
                    y: 15,
                    color: 0xCCffffff,
                    text: {
                        fontColor: 0xFFffffff,
                        fontSize: 20,
                        text: 'fffff'
                    }
                }
            },
            Controls: {
                alpha: 0,
                x: 50,
                y: 800,
                PlayPause: {
                    x: 10,
                    type: PlayPause,
                    signals: {
                        playerPlay: true
                    }
                },
                Backward: {
                    x: 200,
                    type: Back,
                    signals: {
                        playerBack: true
                    }
                },
                Forward: {
                    x: 310,
                    type: Forward,
                    signals: {
                        playerFF: true
                    }
                },
                DurationLine: {
                    y: 150,
                    x: 0,
                    w: 1000,
                    h: 2,
                    rect: true,
                    color: 0xFFffffff
                },
                TimeConsumed: {
                    y: 150,
                    x: 0,
                    h: 5,
                    w: 0,
                    rect: true,
                    color: 0xFFffffff
                }
            }
        };
    }

    _init() {
        /**
         * @todo:
         * tag MediaPlayer component and set correct consumer
         */

        this._index = 0;

        this._video = this.tag('Video');
        this._videoControls = this.tag('Controls');
        this._video.updateSettings({consumer: this});

        this._videoControlsPlay = this._videoControls.tag('PlayPause');

        this._playtime = 0;
        this._durationText = this.tag('FileInformation.Text');
        this._durationTimeInSeconds = 0;
    }

    /**
     *@todo:
     * add focus and unfocus handlers
     * focus => show controls
     * unfocus => hide controls
     */

     _focus() {
        this._videoControls.patch({
            smooth: {
                alpha: 0.1
            }
        })
     }

     _unfocus() {
        this._videoControls.patch({
            smooth: {
                alpha: 0
            }
        })
     }


    /**
     * @todo:
     * When your App is in Main state, call this method
     * and play the video loop (also looped)
     * @param src
     * @param loop
     */
    play(src, loop) {
        // this._video.playPause()
    }

    stop() {
        // Don't needed
    }

    set item(v){
        this._item = v;
        this._stream = v.stream;

        // Open the rainbow (remember that sometimes because network this fails)
        this._video.open(this._stream);
    }

    /**
     * @todo:
     * - add _handleEnter() method and make sure the video Pauses
     */
    _handleEnter(){
        this._putFocus = this._videoControls.tag('Play')
    }

    _handleUp() {
        this._putFocus = undefined;
        this._videoControls.patch({
            smooth: {
                alpha: 0.1
            }
        })
    }

    _handleDown() {
        this._putFocus = this._videoControls.children[this._index];
        this._videoControls.patch({
            smooth: {
                alpha: 1
            }
        })
    }

    _handleLeft() {
        if(this._index - 1 <= 0) {
            this._index = 0;
        } else {
            this._index--;
        }
        this._putFocus = this._videoControls.children[this._index];
    }

    _handleRight() {
        if (this._index + 1 < this._videoControls.children.length) {
            this._index++
        } else {
            this._index = this._videoControls.children.length;
        }
        this._putFocus = this.tag('Controls').children[this._index];
    }

    _getFocused() {
        return this._putFocus;
    }

    // Player controls
    playerPlay() {
        this._video.playPause()
    }

    playerBack() {
        // Back
        this._video.seek(-5)
    }

    playerFF() {
        // Forward
        this._video.seek(5)
    }

    /**
     * This will be automatically called when the mediaplayer pause event is triggerd
     * @todo:
     * - Add this Component in a Paused state
     */
    $mediaplayerPause() {
        this._video.play();
        this._redrawProgressBar()
    }

    $mediaplayerError() {
        alert('Error loading video!');
    }

    $mediaplayerLoadedData(data) {
        this._durationText.text.text = 'duration: ' + Math.floor(data.event.timeStamp / 10) + ' seconds';
        this._durationTime = Math.floor(data.event.timeStamp);
    }

    $mediaplayerPause(data) {
        // Update the time where are we
        this._playtime = Math.floor(data.event.timeStamp / 1000)
        // change the PLAY button label
        this._videoControlsPlay.setLabel = 'PAUSE';
        this._redrawProgressBar()
    }

    $mediaplayerPlaying(data) {
        console.log('Playing', data)
        this._videoControlsPlay.setLabel = 'PLAY';
        this._redrawProgressBar()
    }

    $mediaplayerSeeking(data) {
        // console.log('Seeking', data)
        this._redrawProgressBar()
    }

    $mediaplayerTimeupdate(data) {
        // console.log('timeupdate', data)
    }

    _redrawProgressBar() {
        // we have all the time
        // we have where I am
        // print it ;)

        // console.log(
        //     Math.floor(this._durationTime / this._playtime * 100)
        // )

        console.log('duration total', this._durationTime)
        console.log('playtime', this._playtime)

        let where = this._playtime != 0 ? Math.floor(this._durationTime / this._playtime * 100) : 0

        this.tag('TimeConsumed').patch({
            w: where,
        })
    }
 
    static _states(){
        return [
            /**
             * @todo:
             * - Add paused state
             * - on enter change the play to pause button (see static/mediaplayer folder)
             * - on _handleEnter() play the asset again
             * - reset state on play
             */
            class Paused extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/play.png");
                }
                _handleEnter(){
                    this._video.doPlay();
                }
            }
        ]
    }
}