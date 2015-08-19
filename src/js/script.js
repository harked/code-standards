"use strict";
/**
 * Author: Isobar
 */
var ISOBAR = {
    settings: {
        mobMenu: 770 // size at which the menu converts
    },
    common: {
        $body: {},

        init: function() {
            console.log('init()')
            
            this.$body = ISOBAR.util.$body;

            this.toc();
            this.anchors();
        },
        // generate table of contents
        toc: function() {
            var toc = document.getElementById('toc');
            var hx = $('section h2, section h3, section h4, section h5');
            // var frag = document.createDocumentFragment();
            var hx_len = hx.length;
            var toc_contents = '';
            var anchor, tag, the_text;
            var firstBlock = false;

            var firstWord = /\w+/;
            var currentMatch = '';
            var inner;

            for (var i = 0, j = hx_len; i < j; i++) {
                tag = hx[i].tagName.toLowerCase();
                inner = '';

                if (tag === 'h2') {
                    currentMatch = firstWord.exec(hx[i].innerHTML);
                    currentMatch = currentMatch[0].toLowerCase();
                };

                the_text = $.trim(hx[i].innerHTML);
                anchor = currentMatch + '_' + the_text.replace(/\s+|\-/g, '_').replace(/[^A-Z0-9_]/gi, '').replace(/_+/g, '_').toLowerCase();
                inner += '<a href="#' + anchor + '" class="anchor_link" title="Permalink">◊</a>';

                if (tag === 'h2' || tag === 'h3') {
                    toc_contents += '<li class="' + tag + '"><a href="#' + anchor + '">' + the_text + '</a></li>';
                }
                if (tag === 'h2' && firstBlock === true) {
                    inner += '<a href="#" class="back-anchor" title="Top">Back to Top</a>';
                }
                if (inner !== '') {
                    hx[i].id = anchor;
                    hx[i].innerHTML += inner;
                };
                if (tag === 'h2') {
                    firstBlock = true;
                }
            }
            toc.innerHTML = toc_contents;
            toc.style.display = 'block';
        },
        // just hooking up back to top
        anchors: function() {
            this.$body.on('click', '.back-anchor', function() {
                console.log('click 002');
                window.scrollTo(0, 0);
                window.location.hash = '';
                return false;
            });
        },
        toggleMenu: function(e){
            console.log('click 001')
            var iso = ISOBAR.util;
            iso.$body.toggleClass('menu-open');

            if (iso.$body.hasClass('mob')) {
                iso.$body.on('click', '#toc a', ISOBAR.common.scrollNow);
            };
        },
        scrollNow: function(e){
            e.preventDefault;
            // console.log('here we will use the scroll');
            var target = e.target.getAttribute('href');
            if (target[0] === '#') {
                $.scrollTo(target, { offset: -100, duration: 500 });
            };
        }
    },
    util: {
        $body : $('body'), // cache the body
        
        settings: {},

        fire: function(func, funcname, args) {
            var namespace = ISOBAR; // indicate your obj literal namespace here
            funcname = (funcname === undefined) ? 'init' : funcname;
            if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function') {
                namespace[func][funcname](args);
            }
        },
        loadEvents: function() {
            var iso = ISOBAR.util;
                iso.settings = ISOBAR.settings; // convenience

            //Fire resize event and call setLayout(). Put onresize events in there.
            window.addEventListener('resize', iso.debounce(iso.setLayout, 50));

            // hit up common first.
            iso.fire('common');
            
            iso.$body.on('click', '.menu-button', ISOBAR.common.toggleMenu);
            iso.setLayout();
        },
        debounce: function(func, wait, immediate) {

            var timeout;

            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        setLayout: function() {
            var iso = ISOBAR.util;

            //Set classes on the body based on screen width.
            //Display the, 'hamburger' button & menu through css based on these classes added.
            var screenWidth = window.innerWidth;
            if (screenWidth > iso.settings.mobMenu) {
                iso.$body.removeClass('menu-open');

                if (iso.$body.hasClass('mob')) {
                    iso.$body.removeClass('mob');
                    iso.$body.off('click', ISOBAR.common.scrollNow);
                };
            } else {
                iso.$body.addClass('mob');
                iso.overlay();
            };

        },
        overlay: function() {
            if ($('.overlay').length == 0) {
                $('body').append('<div class="overlay"></div>');
                $('.overlay').on('click', function(e) {
                    $('body').toggleClass('menu-open');
                });
            }
        }
    }
};

// kick it all off here 
$(document).ready(ISOBAR.util.loadEvents);

