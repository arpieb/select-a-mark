# Select-A-Mark
This project was born out of frustration with Firefox bookmarking utilities.  While in progress, someone pointed me to [Snap Links Plus](https://addons.mozilla.org/en-US/firefox/addon/snaplinksplus/) which I'm going to play with for a while.

In the interim, I'll continue working on this project as a learning exercise, and wanted to provide it as open source for anyone else who might find it useful for learning how Firefix Addon code looks!

# What works
* Selection of single or multiple regions on the page using normal content selection is properly parsed for links, and duplicates are removed as best as possible.
* Contextual menu item _Open selected links_ works, opening all links in new tabs in the current window.
* Hotkey `Accel-Shift-O` also opens all selected links in new tabs in the current window.

# TODO
* Add bookmarking feature.
* Add ability to open in new window vs. current window.
* Get a nicer icon, or remove it (was experimenting with menu items using FF sample icons).
* Add a nice toolbar widget and/or action button.

# Contributing
Feel free to fork and submit PRs!  At some point I might even publish it to the [Mozilla Add-Ons Site](https://addons.mozilla.org/en-US/firefox/)!