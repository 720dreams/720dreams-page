/* global _ */

'use strict';

(function () {
  /*
   * Navigation
   *
   * */

  function currentYPosition() {

    // Firefox, Chrome, Opera, Safari
    if (window.pageYOffset) {
      return window.pageYOffset;
    }

    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    }

    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) {
      return document.body.scrollTop;
    }

    return 0;
  }

  function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent !== document.body) {
      node = node.offsetParent;
      y += node.offsetTop;
    }
    return y;
  }

  // yeahhh, let's pollute public name space
  window.smoothScroll = function (eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      scrollTo(0, stopY);
      return;
    }
    var speed = Math.round(distance / 10);
    if (speed >= 20) {
      speed = 20;
    }
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
      for (var i = startY; i < stopY; i += step) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
        leapY += step;
        if (leapY > stopY) {
          leapY = stopY;
        }
        timer++;
      }
      return;
    }
    for (var k = startY; k > stopY; k -= step) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY -= step;
      if (leapY < stopY) {
        leapY = stopY;
      }
      timer++;
    }
  };

  /*
   * Views and templates
   *
   * */

  function getParameterByName(searchString, name, defaultValue) {

    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(searchString);
    return results === null ? defaultValue : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  function setContent(root, tmplSelector, content) {
    var tmpl = document.getElementById(tmplSelector);
    if (!tmpl) {
      tmpl = document.getElementById('not-found-template');
    }
    root.insertAdjacentHTML('beforeend', _.template(tmpl.innerHTML)(content));
  }

  function serialize(obj) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  }

  function getLocation(href) {
    var l = document.createElement('a');
    l.href = href;
    return l;
  }

  /* /views.html?contactEmail=conact@720dreams.com&logo=%2Fimages%2Flogo-white-text.png&nameApp=Super%20App&urlWeb=http%3A%2F%2F720dreams.com&accentColor=009688&title=Privacy%20Policy
   */
  var root = document.getElementById('content');
  if (root) {

    var locationSearch = location.search;
    var encoded = getParameterByName(locationSearch, 'encoded', '');

    if (encoded) {
      locationSearch = '?' + window.Encode.decode(encoded);
    }

    var content = {
      contactEmail: getParameterByName(locationSearch, 'contactEmail', 'conact@720dreams.com'),
      logo: getParameterByName(locationSearch, 'logo', ''),
      nameApp: getParameterByName(locationSearch, 'nameApp', ''),
      name: getParameterByName(locationSearch, 'name', getParameterByName(locationSearch, 'nameApp', '')),
      urlWeb: getParameterByName(locationSearch, 'urlWeb', 'http://720dreams.com'),
      accentColor: getParameterByName(locationSearch, 'accentColor', '#009688')
    };

    // use query param title first
    content.pageTitle = getParameterByName(location.search, 'title', getParameterByName(locationSearch, 'title', 'Information'));
    content.urlWebDisplay = getLocation(content.urlWeb).hostname;

    var title = content.pageTitle;
    if (content.name) {
      title += ' | ' + content.name;
    }
    window.document.title = title;

    if (encoded) {
      content.query = 'encoded='+encoded;
    } else {
      content.query = serialize(content);
    }
    setContent(root, 'header-template', content);
    setContent(root, slugify(content.pageTitle) + '-template', content);
    setContent(root, 'footer-template', content);
  }

}.call(window));




