class Photo {
    constructor( fileName, filePath, latitude, longitude, date ) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
    }

    get Coordinates() {
        return {
            lat: this.latitude,
            long: this.longitude
        }
    }
}