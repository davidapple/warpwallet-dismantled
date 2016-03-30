module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'bower_components/warpwallet/src/js/deps.js',
        ],
        dest: 'dist/js/warpwallet.js'
      },
    },
    coffee: {
      compile: {
        files: {
          'dist/js/warpwallet-ui.js': 'bower_components/warpwallet/src/coffee/site.coffee'
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      target: {
        files: {
          'dist/js/warpwallet.min.js': 'dist/js/warpwallet.js',
          'dist/js/warpwallet-ui.min.js': 'dist/js/warpwallet-ui.js'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['concat', 'coffee', 'uglify']);
};