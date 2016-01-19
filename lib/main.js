/**
 * @file
 * Firefox plugin that allows a user to quickly bookmark all links in the selected content area(s), optionally adding
 * them to a specific folder/toolbar.
 */

/**
 * Set up the UI elements.
 * Encapsulated here to prevent polluting global namespace.
 */
function selectAMarkSetupUI() {
  // Add context menu items for selected text.
  var cm = require('sdk/context-menu');
  cm.Item({
    label: 'Bookmark selected links',
    image: _self.data.url('icon-16.png'),
    context: cm.SelectionContext(),
    contentScript: 'self.on("click", self.postMessage);',
    onMessage: function () {
      bookmarkSelectedLinks();
    }
  });
  cm.Item({
    label: 'Open selected links',
    image: _self.data.url('icon-16.png'),
    context: cm.SelectionContext(),
    contentScript: 'self.on("click", self.postMessage);',
    onMessage: function () {
      openSelectedLinks();
    }
  });

  // Add hotkey for bookmarking links in selected text.
  var { Hotkey } = require('sdk/hotkeys');
  var selectAMarkBookmark = Hotkey({
    combo: 'accel-shift-m',
    onPress: function() {
      bookmarkSelectedLinks();
    }
  });
  var selectAMarkOpen = Hotkey({
    combo: 'accel-shift-o',
    onPress: function() {
      openSelectedLinks();
    }
  });
}

/**
 * Extract links from selected text and bookmark them to the designated folder.
 */
function bookmarkSelectedLinks() {
  var links = extractLinksFromSelection();
}

/**
 * Open links from selected text in new tabs.
 */
function openSelectedLinks() {
  var links = extractLinksFromSelection();

  for (var [uri, link] of links) {
    //console.log('Opening ' + link.text + ' [' + uri + ']');
    tabs.open(uri);
  }
}

/**
 * Callback to extract links from selected text.
 *
 * @return Map of link elements, keyed by URI.
 */
function extractLinksFromSelection() {
  var parser = Cc['@mozilla.org/xmlextras/domparser;1'].createInstance(Ci.nsIDOMParser);
  var selection = require('sdk/selection');
  var bookmarks = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
  var history = Cc["@mozilla.org/browser/nav-history-service;1"].getService(Ci.nsINavHistoryService);

  // Collect selected content, handling multiple selections if available.
  var selections = [];

  if (!selection.isContiguous) {
    for (var subselection in selection) {
      selections.push(subselection.html);
    }
  }
  else {
    selections.push(selection.html);
  }

  // Iterate over selections, extracting links found.
  // Use absolute resolution code from http://stackoverflow.com/a/8057145/773376
  var ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  var baseURI = ioService.newURI(tabs.activeTab.url, null, null);
  var retlinks = new Map();

  selections.forEach(function (content) {
    var doc = parser.parseFromString(content, 'text/html');
    var links = doc.getElementsByTagName('a');

    for (var i = 0; i < links.length; ++i) {
      // Store in a map using the URI as the key so we can reduce duplicates.
      link = links[i];
      var absURI = ioService.newURI(link.href, null, baseURI);
      retlinks.set(absURI.spec, link);
    }
  });

  return retlinks;
}

/**************************************
 * Main entry point for addon setup.
 *************************************/
// Load add-on global resources.
var {Cc, Ci} = require('chrome');
var tabs = require("sdk/tabs");
var _self = require("sdk/self");

// Execute UI setup.
selectAMarkSetupUI();