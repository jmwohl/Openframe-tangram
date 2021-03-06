var pjson = require('./package.json'),
    debug = require('debug')('openframe:tangram'),
    Extension = require('openframe-extension'),
    fs = require('fs'),
    yaml = require('yaml-js');

/**
 * Extensions should expose an instance of the Extension class.
 *
 * For info on building extensions, see [Openframe-Extension](https://github.com/OpenframeProject/Openframe-Extension).
 */

module.exports = new Extension({
    format: {
        // the name should be the same as the npm package name
        'name': pjson.name,
        // displayed to the user, perhaps?
        'display_name': 'Map',
        // does this type of artwork need to be downloaded to the frame?
        'download': true,
        // how do start this type of artwork? currently two token replacements, $filepath and $url
        'start_command': function(_config, _tokens) {
            debug('Artwork config: ', _config);

            var config = _config || {};
            var command = 'tangram -m ';

            var data = fs.readFileSync(_tokens['$filepath']);
            var scene = yaml.load(data);

            if (scene.scene) {
                console.log('SCENE: ', scene.scene);
                if (scene.scene.zoom) {
                    console.log('ZOOM: ', scene.scene.zoom);
                    command += ' -z ' + scene.scene.zoom;
                }
                if (scene.scene.tilt) {
                    console.log('TILT: ', scene.scene.tilt);
                    command += ' -t ' + scene.scene.tilt;
                }
                if (scene.scene.lon) {
                    console.log('LON: ', scene.scene.lon);
                    command += ' -lon ' + scene.scene.lon;
                }
                if (scene.scene.lat) {
                    console.log('LAT: ', scene.scene.lat);
                    command += ' -lat ' + scene.scene.lat;
                }
                if (scene.scene.rotation) {
                    console.log('ROT: ', scene.scene.rotation);
                    command += ' -r ' + scene.scene.rotation;
                }
                if (scene.scene.position) {
                    console.log('LAT: ', scene.scene.lat);
                    command += ' -lon ' + scene.scene.position[0] + ' -lat ' + scene.scene.position[1];
                }
            }
            if (config.w) {
                command += ' -w ' + config.w;
            }
            if (config.h) {
                command += ' -h ' + config.h;
            }
            command += ' -s $filepath';
            return command;
        },
        // how do we stop this type of artwork?
        'end_command': 'pkill tangram'
    }
});
