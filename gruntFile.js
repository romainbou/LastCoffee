module.exports = function(grunt) {
  ['grunt-contrib-jshint',
    'grunt-contrib-sass',
    'grunt-http-server',
    'grunt-contrib-watch'].forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    jshint: {
      files: '**/*.js',
      options: { jshintrc: '.jshintrc' }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'style',
          src: ['*.scss'],
          dest: 'style',
          ext: '.css'
        }]
      }
    },
    'http-server': {
      dev: {
        root: './',
        port: 8282,
        host: "127.0.0.1",
        showDir : true,
        autoIndex: true,
        ext: "html",
        runInBackground: true
      }
    },
    watch: {
      style: {
        files: 'style/**/*.scss',
        tasks: ['sass:dist']
      }
    }
  });

  grunt.registerTask('validate', ['jshint']);
  grunt.registerTask('dev', ['sass','http-server:dev', 'watch']);
};
