/**
 * Utility to calculate the distance between two points on the Earth's surface
 * using the Haversine formula.
 */
export declare class Haversine {
    private static readonly EARTH_RADIUS_METERS;
    /**
     * Calculates the distance between two coordinates in meters.
     * @param lat1 Latitude 1
     * @param lon1 Longitude 1
     * @param lat2 Latitude 2
     * @param lon2 Longitude 2
     * @returns Distance in meters
     */
    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    private static toRadians;
}
//# sourceMappingURL=haversine.d.ts.map