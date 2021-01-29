/**
 * Composition
 * @param functions
 * @returns {function(*=): *}
 */
export const compose = (...functions) => args => functions.reduceRight((arg, fn) => fn(arg), args);

/**
 * Generate a simple point geometry using position data
 * @param {object} point/position data from the map
 * @return {{coordinates: [number, string], projection: string, type: string}|*} geometry of type Point
 */
export const getGeometry = point => {
    const geometry = point?.geometricFilter?.value?.geometry;
    if (geometry) {
        return geometry;
    }
    let wrongLng = point.lng || point.latlng.lng;
    let lngCorrected = wrongLng - 360 * Math.floor(wrongLng / 360 + 0.5);
    return {
        coordinates: [lngCorrected, point.lat || point.latlng.lat],
        projection: "EPSG:4326",
        type: "Point"
    };
};
