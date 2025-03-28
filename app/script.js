$(document).ready(function () {
    const CROISSANT = "0-99";
    const DECROISSANT = "99-0";
    const wSection = $(window).innerWidth();
    const hHeader = document.querySelector("header").offsetHeight;
    const hSection = $(window).innerHeight() - hHeader;
    const ordre = document.querySelector("#ordre");
    const chateau = document.querySelector("#chateau");

    const getChateau = () => {
        chateau.src =
            ordre.value === CROISSANT
                ? "./img/chateau-inverse.png"
                : "./img/chateau.png";
    };
    getChateau();
    ordre.onchange = (e) => {
        e.preventDefault();
        getChateau();
        console.log(document.querySelectorAll('img[alt="masque"]'));
    };
    $("section").height(hSection);
    $("#chateau").height(hSection + "px");

    const wChateau = $("#chateau").width();
    const coef = wChateau / 1024;
    const wCellule = 50 * coef;

    document.querySelector("#poubelle").width = wCellule;
    const loadPostit = (postit) => {
        $("section").append(postit);
        $(postit).draggable({
            helper: "clone",
            cursor: "move",
            containment: "section",
            stop: (event, ui) => {
                const copie = ui.helper.clone();
                copie.appendTo($(postit).parent()).draggable({
                    cursor: "move",
                    containment: "section",
                    stop: (event, ui) => {
                        if (
                            ui.position.left <= wCellule &&
                            ui.position.top + postit.width > hSection - wCellule
                        ) {
                            copie.remove();
                        }
                    },
                });
            },
        });
    };

    const creerCache = (c, n) => {
        const cache = document.createElement("canvas");
        const postit = document.createElement("img");
        const ctx = cache.getContext("2d");

        cache.width = wCellule;
        cache.height = wCellule;

        ctx.fillStyle = c;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, wCellule, wCellule);
        ctx.strokeRect(0, 0, wCellule, wCellule);

        postit.src = cache.toDataURL();
        postit.alt = "cache" + n;
        postit.style.position = "absolute";
        postit.style.top = n * wCellule + 10 + hSection / 3 + hHeader + "px";
        postit.style.left = (wSection - wChateau) / 4 + "px";
        postit.style.cursor = "pointer";
        postit.onload = loadPostit(postit);
    };
    const creerMasque = (c) => {
        const zone = (x, y, txt = "") => {
            ctx.fillRect(x, y, wCellule, wCellule);
            ctx.strokeRect(x, y, wCellule, wCellule);
            ctx.save();
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "bold " + wCellule / 3 + "pt Helvetica";
            ctx.fillText(txt, x + wCellule / 2, y + wCellule / 2);
            ctx.restore();
        };

        const cache = document.createElement("canvas");
        const postit = document.createElement("img");
        const ctx = cache.getContext("2d");

        cache.width = 3 * wCellule;
        cache.height = 3 * wCellule;

        ctx.fillStyle = c;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";

        zone(0, 0);
        zone(wCellule, 0, ordre.value === CROISSANT ? "+10" : "-10");
        zone(2 * wCellule, 0);
        zone(0, wCellule, "-1");
        zone(2 * wCellule, wCellule, "+1");
        zone(0, 2 * wCellule);
        zone(wCellule, 2 * wCellule, ordre.value === CROISSANT ? "-10" : "+10");
        zone(2 * wCellule, 2 * wCellule);

        postit.src = cache.toDataURL();
        postit.alt = "masque";
        postit.style.position = "absolute";
        postit.style.top = 10 + hSection / 3 + hHeader + "px";
        postit.style.right = (wSection - wChateau) / 4 + "px";
        postit.style.cursor = "pointer";
        postit.onload = loadPostit(postit);
    };

    ["#FF9117", "#B33514", "#FF5700", "#0079B3", "#00FFEA"].forEach((c, n) =>
        creerCache(c, n)
    );

    creerMasque("#FFFF00");
});
