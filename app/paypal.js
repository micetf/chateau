((_) => {
    const form = document.createElement("form");
    form.action = "https://www.paypal.com/cgi-bin/webscr";
    form.method = "post";
    form.target = "_top";
    form.style.display = "none";

    [
        {
            type: "hidden",
            name: "cmd",
            value: "_s-xclick",
        },
        {
            type: "hidden",
            name: "hosted_button_id",
            value: "Q2XYVFP4EEX2J",
        },
        {
            type: "image",
            name: "submit",
        },
    ].forEach((props) => {
        const input = document.createElement("input");
        for (let prop in props) {
            if (props.hasOwnProperty(prop)) {
                input[prop] = props[prop];
            }
        }
        form.appendChild(input);
    });

    document.body.appendChild(form);

    const paypal =
        document.querySelector("#paypal") || document.createElement("img");
    if (paypal.id !== "paypal") {
        paypal.src =
            "https://" + document.location.hostname + "/img-micetf/don.gif";
        paypal.type = "image";
        paypal.style.position = "fixed";
        paypal.style.bottom = 0;
        paypal.style.right = 0;
        paypal.alt = "Faire un don";
        document.body.appendChild(paypal);
    }

    paypal.style.cursor = "pointer";
    paypal.title = "Si vous pensez que cet outil le mérite... Merci !";
    paypal.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        form.querySelector("[name=submit]").click();
    });
})();
