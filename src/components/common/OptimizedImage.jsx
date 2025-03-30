// src/components/common/OptimizedImage.jsx
import { useState, useEffect, memo } from "react";

/**
 * Composant pour charger des images de manière optimisée
 *
 * @param {Object} props
 * @param {string} props.src - Chemin de l'image
 * @param {string} props.alt - Texte alternatif
 * @param {number} props.width - Largeur de l'image
 * @param {number} props.height - Hauteur de l'image
 * @param {Object} props.style - Styles additionnels
 * @param {string} props.className - Classes CSS
 * @param {boolean} props.lazy - Activer le lazy loading (par défaut: true)
 * @param {string} props.placeholderColor - Couleur du placeholder (par défaut: background)
 * @param {function} props.onLoad - Callback lors du chargement complet
 */
const OptimizedImage = memo(function OptimizedImage({
    src,
    alt,
    width,
    height,
    style = {},
    className = "",
    lazy = true,
    placeholderColor = "#536e7d",
    onLoad,
    ...props
}) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        // Réinitialiser l'état lors du changement de source
        setLoaded(false);
        setError(false);

        // Importer dynamiquement l'image pour exploiter l'optimisation de Vite
        const loadImage = async () => {
            try {
                // Pour les images dans /public, utiliser directement le chemin
                if (src.startsWith("/")) {
                    setImageSrc(src);
                } else {
                    // Pour les imports dynamiques (recommandé)
                    const image = await import(`../../assets/${src}`);
                    setImageSrc(image.default);
                }
            } catch (err) {
                console.error(`Erreur de chargement d'image: ${src}`, err);
                setError(true);
                setImageSrc(src); // Fallback à l'URL directe
            }
        };

        loadImage();
    }, [src]);

    const handleLoad = () => {
        setLoaded(true);
        if (onLoad) onLoad();
    };

    const handleError = () => {
        setError(true);
        console.warn(`Échec de chargement de l'image: ${src}`);
    };

    // Styles pour le placeholder et l'image
    const containerStyle = {
        position: "relative",
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
        backgroundColor: !loaded ? placeholderColor : "transparent",
        borderRadius: "2px",
        overflow: "hidden",
        display: "inline-block",
        ...style,
    };

    const imgStyle = {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.3s ease",
    };

    return (
        <div style={containerStyle} className={className} aria-hidden={!loaded}>
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={alt}
                    loading={lazy ? "lazy" : "eager"}
                    onLoad={handleLoad}
                    onError={handleError}
                    style={imgStyle}
                    width={width}
                    height={height}
                    {...props}
                />
            )}
            {error && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        color: "#f2b28d",
                        fontSize: "12px",
                        textAlign: "center",
                        padding: "4px",
                    }}
                >
                    {alt || "Image non disponible"}
                </div>
            )}
        </div>
    );
});

export default OptimizedImage;
