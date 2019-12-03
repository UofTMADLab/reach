## Getting Started

*Prerequisites*

To get started with *reach* you first need to install `npm` on your system. *reach* uses `npm` to manage its development dependencies.

With npm installed, clone the reach repository and run `npm install`. 



## Development Environment

The *reach* development environment is set up so that you can make changes to `reach.js` (or one of it's included scripts), and then reload a running twine story in your browser, seeing the code changes immediately (without having to re-add the updated story format in the twine editor). Any javascript errors will point back to the original .js script file.

This is accomplished by leaving an http server running on your computer, serving the files from the `src` folder.

 *Steps To start the development environment and to add the local reach story format to Twine:*

- In the cloned `reach` folder run the command: `npm run devserver`. This will start serving files from `./src` at `http://localhost:8000`
- Open Twine (the local native app, not the website). Click `Formats -> Add a New Format`
- Add: `http://localhost:8000/format-dev.js`
- Open the twine story that you want to use with *reach*. Click `Change Story Format` and select `reach`
- Run the story. It will now run using the *reach* story format. You can verify that in the browser console.
- If you make a change to `src/reach.js` or any of the other .js files that are included from reach.js, you can imediately see the changes if you clear the browser cache (`cmd+opt+e` on Safari & Chrome), then reload the story in the browser (`cmd+r`).
- If you have to make a change to `format-dev.js` for any reason, then to see the changes you will have to remove, then re-add the story format in the twine editor. But making changes to this file is not as comman as the included .js files.



### Building the Production Version

The production build of *reach* is designed to be as compact as possible to make twine/reach stories more distributable. All of the reach scripts, underscore.js and a default 360 background images are packed together and stored entirely in the resulting story format description file.

From the reach folder:

* Run `npm run build`. 
* Open `makeformat.js` and increment the build number. This makes it easier to add the new format to the twine editor and force it to overwrite the previous one.
* Run `node makeformat.js` 
* The resulting file will be  `./dist/format-x.y.z-dist.js` (with x,y,z depending on the version in makeformat.js). The reach.js files and underscore-min.js are both minified and integrated into this new format file. The only external <script> dependency will be for *a-frame* itself.
* To test the file with the local twine app, run `npm run twineserver`. Then in the twine app, add a new story format again, but use the address `http://localhost:8000/format-x.y.z-dist.js`. Note that this will overwrite the development format version if you have previously added that.

### Including images and media in your reach story

If your passages are referencing media, like images, sound or video, likely you will host those on an external server. The server needs to serve files with the 'CORS' header set. I have found that using the `assets` container in a basic https://glitch.com project works. And so does a website hosted by *github pages*.

### A very, very brief formatting guide for reach.

*Links*

* Basic Syntax: `[[Passage Name]]`
* Separating the passage name and the text shown on the screen: `[[Visible Text|PassageName]]`

*Text Panels*

These work like links, except they are not clickable when the story is running in VR. The syntax is similar to the **basic** example above, except you put a backtick (`) just before it. When you enter this in the twine editor, it will create another linked passage. Any text you enter in that passage in the editor will be printed in a floating text panel in the scene passage where the link appears.

*Position of text panels and links*

Unless you override this with explicit options (as described below), the vr links and vr text panels will be positioned in an analogous way to the relative positions of the passage boxes in the twine editor. You can move text panels left, right, up ,down in the twine editor to move the virtual panels and links left, right, forward, behind the viewer in the resulting vr scene.

*360 background images*

Add this to VR scene passage:

* Basic Syntax: `((http://url_to_image.png))`

*Positioning text panels and links*

Use 'json' style data to add options.

e.g. Put a text link to the right in the vr space, regardless of the position of the passage boxes in the twine editor:

`{"direction": 3}[[NameOfPassage]]`

(If this is for a Text panel, put a "`" between the } and the [ )

*Direction numbers*: works like a clock, with 0 (or 12) being forward, 3 is directly to the right, 9 is to the left, 6 behind, and any floating point value in between is valid too.

Multiple options can be combined like a regular json dictionary.

e.g. Set the direction and distance (in meters) of a panel:

`{"direction": 3, "distance": 6}[[NameOfPassage]]`

with background color and opacity:

`{"direction": 3, "distance": 6, "backgroundColor":"#00AA00", "backgroundOpacity":0.7}[[NameOfPassage]]`

Note you cannot place a linebreak within an {options}[[link]] statement. It must be all on one line (soft-wrapping in the twine editor is ok).

*Audio file*

Wrap the url in double-tildes. This will start an audio file playing when the user opens the passage:

`~~https://link_to_mp3_file~~`

To play a sound from a particular position (e.g. from the left) in vr space:

`{"direction": 9}~~https://link_to_mp3_file`~~

*Scripting and templating*

New: in scene and text passages you can now add javascript. The javascript will run when the passage is opened. It operates the same as the scripting in the *Snowman* story format. Many of the same window.story and window.passage variables as you would find in Snowman are available.

Wrap your sections of script in:

`<% my script code %>`

Use `print()` to print text back into the passage at runtime.

(Or use `<%= ... %>` to output the result of a javascript expression to the passage.)

e.g.

`<% if (window.story.state.lightsAreOn === true) { %>`

`((https://example.com/backgroundWithLightsOn.jpg))`

`<% } else { %>`

`((https://example.com/backgroundWithLightsOff.jpg))`

`<% } %>`

