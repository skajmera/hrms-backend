"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haversine = void 0;
/**
 * Utility to calculate the distance between two points on the Earth's surface
 * using the Haversine formula.
 */
class Haversine {
    /**
     * Calculates the distance between two coordinates in meters.
     * @param lat1 Latitude 1
     * @param lon1 Longitude 1
     * @param lat2 Latitude 2
     * @param lon2 Longitude 2
     * @returns Distance in meters
     */
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
                Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.EARTH_RADIUS_METERS * c;
    }
    static toRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }
}
exports.Haversine = Haversine;
Haversine.EARTH_RADIUS_METERS = 6371000;
//# sourceMappingURL=haversine.js.map