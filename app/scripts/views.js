/* global Handlebars */
'use strict';

function getParameterByName(name, defaultValue) {

  if (defaultValue === null) {
    defaultValue = '';
  }

  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
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

function setContent(selector, content) {
  var tmpl = $(selector);
  if (tmpl.length === 0) {
    tmpl = $('#not-found-template');
  }
  $('#content').append(Handlebars.compile(tmpl.html())(content));
}


$(document).ready(function () {

  /* /views.html?contactEmail=conact@720dreams.com&logo=/images/logo-white-text.png&nameApp=Super%20App&urlWeb=http://720dreams.com&accentColor=009688&title=Privacy%20Policy
   */

  var content = {
    contactEmail: getParameterByName('contactEmail', 'conact@720dreams.com'),
    logo: getParameterByName('logo', ''),
    nameApp: getParameterByName('nameApp', ''),
    urlWeb: getParameterByName('urlWeb', 'http://720dreams.com'),
    accentColor: getParameterByName('accentColor', '#009688'),
    title: getParameterByName('title', '')
  };

  document.title = content.title;

  setContent('#header-template', content);
  setContent('#' + slugify(content.title) + '-template', content);

  delete content.title;
  content.query = jQuery.param(content);
  setContent('#footer-template', content);


});
