( function($) {
    "use strict";

    $( document ).ready( function() {
        // default array to store images
        let photos = [];

        // init map
        let map = new Map( 'map' );
        map.init();



        // convert gps data to latitude, longitude
        function gpsCoordinates(coord) {
            return coord[0].numerator + coord[1].numerator /(60 * coord[1].denominator) + coord[2].numerator / (3600 * coord[2].denominator);
        }

        // get data from user photos
        function handlePhotos( files ) {
            [...files].forEach( file => {
                console.log( file )
                EXIF.getData( file, function() {
                    if ( Object.keys(file.exifdata).length === 0 || EXIF.getTag(this, 'GPSLatitude') === undefined || EXIF.getTag(this, 'GPSLongitude') === undefined ) {
                        return false; // no exif data found
                    }
                    let lat = EXIF.getTag(this, 'GPSLatitude');
                    let long = EXIF.getTag(this, 'GPSLongitude');
                    let date = EXIF.getTag( this, 'DateTimeOriginal' ) === undefined ? EXIF.getTag( this, 'DateTime' ) : EXIF.getTag( this, 'DateTimeOriginal' );
                    let photo = new Photo( file.name.slice( 0, -4 ), (window.URL || window.webkitURL).createObjectURL(file), gpsCoordinates( lat ), gpsCoordinates( long ), date );
                    photos.push( photo );
                    map.addPhotoToMap( photo );
                });
            } );
            // update drop zone text
            //updateDropzone( 'body', files, false );
        }

        // handle photos selected from clicking the drag and drop area
        function handlePhotoSelect() {
            var $photosInput = $('body').find( '#select-photos' );
            $photosInput.on( 'change', function() {
                handlePhotos( this.files, map );
            } );
        }

        // add photos to map using drag and drop to area
        function makeDragDropArea() {
            let $photosInput = $('body').find( '#photos-input' );
            $photosInput.on( 'dragover', function(e){
                e.preventDefault();
                $( this ).addClass( 'dragover' );
            } ).on( 'dragleave', function(e) {
                let self = $(this);
                e.preventDefault();
                $( this ).addClass( 'dragleave' ).removeClass( 'dragover' );
                setTimeout( function() {
                    self.removeClass( 'dragleave' );
                }, 2000 );
            } ).on( 'drop', function(e) {
                e.preventDefault();
                $( this ).addClass( 'drop' ).removeClass( 'dragover dragleave' );
                let files;
                if( e.originalEvent.dataTransfer ) {
                    files = e.originalEvent.dataTransfer.files;
                } else if( e.target ) {
                    files = e.target.files;
                }
                handlePhotos( files );
            } ).on( 'click', function(){
                $('body').find( '#select-photos' ).trigger( 'click' );
            } );
        }

        // init drag & drop area
        makeDragDropArea();

        // handle photos selected from clicking the drag and drop area
        handlePhotoSelect();

    } );
} )(jQuery);