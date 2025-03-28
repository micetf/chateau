(function (h) {
    "use strict";
    var a = document.createElement('a');

    a.href = h.join("") + document.location.pathname;
    a.textContent = 'Contact';
    a.style.display = 'none';
    a.id = 'js-micetf-contact';

    document.querySelector('body').appendChild(a);

    document.querySelector('#contact').title = "Pour contacter le webmaster...";

    document.querySelector('#contact').addEventListener('click', function (e) {
        e.preventDefault();
        console.log('mail : ' + a.href);
        a.click();
    });

}(["mailto:", "webmaster", "@", "micetf.fr", "?", "subject=Au sujet de "]));
