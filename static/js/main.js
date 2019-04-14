// js
/* interact.js 1.4.0-rc.9 | https://raw.github.com/taye/interact.js/master/LICENSE */

//# sourceMappingURL=interact.min.js.map

// init
function init() {
    var menu = document.getElementById('slideout-menu'),
        x = 0, y = 0;

    // set initial bounds
    let menu_header = document.getElementById('slideout-menu-header');
    let menu_text = menu_header.querySelector('strong');

    // set initial menu position to the height of the header
    let total_offset_px = menu.style.bottom = (menu_header.clientHeight - menu.clientHeight) + 2 + 'px';
    menu.style.bottom = total_offset_px;

    // slide up menu on tap
    menu_header.addEventListener('click', function (e) {
        console.log(menu.dataset.open == 'true')
        if (menu.dataset.open == 'true') {
            // hide menu
            menu.dataset.open = 'false';
            menu.style.bottom = total_offset_px;
            menu_text.innerHTML = 'Open Menu'
        } else {
            // move up 
            menu.dataset.open = 'true';
            menu.style.bottom = '0px';
            menu_text.innerHTML = 'Close Menu'
        }
    });
}



window.addEventListener('load', init);