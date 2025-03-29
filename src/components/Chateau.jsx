export default Chateau;
import { useRef, useEffect, useState } from "react";

export function Chateau({ ordre, height, onLoad }) {
    const imgRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Mettre à jour la source de l'image lorsque l'ordre change
    const imgSrc =
        ordre === "0-99" ? "/img/chateau-inverse.png" : "/img/chateau.png";

    // Initialiser l'image au chargement initial et à chaque changement d'image
    useEffect(() => {
        setIsLoaded(false);

        // Réinitialiser la référence à l'image
        if (imgRef.current) {
            imgRef.current.src = imgSrc;
        }
    }, [imgSrc]);

    // Informer le parent de la largeur de l'image après chargement
    useEffect(() => {
        // Si l'image est déjà complètement chargée
        if (
            imgRef.current &&
            imgRef.current.complete &&
            imgRef.current.naturalWidth
        ) {
            console.log(
                "Image déjà chargée, largeur:",
                imgRef.current.offsetWidth
            );
            onLoad(imgRef.current.offsetWidth);
            setIsLoaded(true);
        }
    }, [onLoad]);

    const handleImageLoad = () => {
        if (imgRef.current) {
            console.log(
                "Image chargée via onLoad, largeur:",
                imgRef.current.offsetWidth
            );
            onLoad(imgRef.current.offsetWidth);
            setIsLoaded(true);
        }
    };

    return (
        <div className="flex justify-center w-full">
            <img
                ref={imgRef}
                id="chateau"
                src={imgSrc}
                alt="chateau"
                title="Le château des nombres"
                style={{ height: `${height}px` }}
                onLoad={handleImageLoad}
                className="mx-auto"
            />
        </div>
    );
}
