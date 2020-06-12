// @todo: import MediaPlayer from SDK
import {Lightning, Utils, MediaPlayer} from "wpe-lightning-sdk";
import {PlayPause, Back, Forward} from '../components'


/*

The way I have done it it's different the way I guess you want:

I have created the buttons (with text, don't worry I see the images after I did it...).
The buttons will launch several signals depending what you press and this component
will handle the button you pressed.

How? The buttons calls the methos of the MediaPlayer

After that I listed to the events of it in order to do several things like update
the progress bar (yes, it's not done right) by setting a property called this._playtime that
handles the second you are.

I calculate the size and where is on the bar by a method called _redrawProgressBar by
an small calculus. This method is called everytime you play/stop/go back/go forward and...
on the timer for the progress bar (see next).

Because we need to update the progress bar when playing and there's no event that (for example)
every second or so throws and have the time the video is I did a setInterval who is
the responsible that every second update the this._playtime.

The problem with this way it's that I must be really aware of stoping or setting the timer
in order not to keeo playing after something or while updating the this._playtime inside the
method don't kill the real timer (something that happens).

So, several questions:

- Is there any event on the mediaplayer that shouts at what time is while playing? if not,
it will be a great idea
- Is there a better way to upgrade the progress bar that what I do?

As you can see I didn't use your way of the states of doing the job (I guess it's why you put
the states there... but I don't think it's necesary). How did you resolve this with the states?
It will be redundant to play/pause/etc... by states if I can do it directly inside the
class? I will wait for your resolution to see how you think to solve this (that it's different from
my way, of couse).

Ahh! I know that the setTimeout way is broken in some possibility, be kind xD
AHh (2) I changed the video from the one you give to another different. Don't worry if you see a different
video on the player.

*/

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
            PlayPauseBackground: {
                x: w => w / 2 || 1920 / 2,
                y: h => h / 2 || 1080 / 2,
            },
            FileInformation: {
                x: 40,
                y: 950,
                w: 550,
                h: 80,
                Text: {
                    x: 15,
                    y: 15,
                    color: 0xCCffffff,
                    text: {
                        fontColor: 0xFFffffff,
                        fontSize: 20,
                        text: 'duration: '
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
                    y: 145,
                    x: 0,
                    h: 10,
                    w: 1,
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
        this._video.playPause();
        // Redraw the line

    }

    playerBack() {
        // Back
        this._video.seek(-5)
    }

    playerFF() {
        // Forward
        this._video.seek(5)
    }

    _startTimer() {
        // Update every 500 miliseconds
        this._barTimer = setInterval(() => {
            this._playtime = this._playtime + 1;
            this._redrawProgressBar();
        }, 1000);
    }

    _stopTimer() {
        clearInterval(this._barTimer);
    }

    /**
     * This will be automatically called when the mediaplayer pause event is triggerd
     * @todo:
     * - Add this Component in a Paused state
     */
    $mediaplayerPause(event) {
        console.log('Pause', event)
        this._video.play();
        this._redrawProgressBar()

        this._setState('Paused');
    }

    $mediaplayerError() {
        alert('Error loading video!');
    }

    $mediaplayerLoadedData(data) {
        // Set the time duration and the text
        this._durationText.text.text = 'duration: ' + Math.floor(data.event.timeStamp / 10) + ' seconds';
        this._durationTime = Math.floor(data.event.timeStamp);
    }

    $mediaplayerPause(data) {
        // Update the time where are we
        this._playtime = Math.floor(data.event.timeStamp / 1000)
        // change the PLAY button label
        this._videoControlsPlay.setLabel = 'PAUSE';
        // when pause, redraw the bar
        this._redrawProgressBar();
        // set the timer
        // this._startTimer();
    }

    $mediaplayerPlaying(data) {
        console.log('Playing', data)
        this._videoControlsPlay.setLabel = 'PLAY';
        // When play, redraw de bar
        this._redrawProgressBar()

        // who knows
        // if (this._barTimer) {
        //     this._stopTimer();
        // }
        // this._startTimer();
    }

    $mediaplayerSeeking(data) {
        // When going back or forward, redraw the bar
        this._redrawProgressBar()
    }

    $mediaplayerTimeupdate(data) {
    }

    $mediaplayerProgress({currentTime, duration}) {
        this._playtime = Math.floor(currentTime)
        this._redrawProgressBar();
    }

    _redrawProgressBar() {
        // we have all the time
        // we have where I am
        // print it ;)

        // Remember that total size is 1000 of the bar
        let percentagePlayed = this._playtime !== 0 ? Math.floor((this._playtime * 100) / this._durationTime ) : 1;

        let where = Math.floor((this.tag('DurationLine').w * percentagePlayed) / 100)

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
                    this.tag("PlayPauseBackground").alpha = 1;
                    this.tag("PlayPauseBackground").src = Utils.asset("mediaplayer/play.png");
                }
                $exit() {
                    this.tag("PlayPauseBackground").alpha = 0;
                }
                _handleEnter(){
                    this._video.doPlay();
                }
            }
        ]
    }
}