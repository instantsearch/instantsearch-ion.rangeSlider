'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    version: grunt.file.readJSON('package.json').version,

    buildDir: 'dist',

    banner: [
      '/*!',
      ' * instantsearch-ion.rangeSlider <%= version %>',
      ' * https://github.com/algolia/instantsearch-ion.rangeSlider',
      ' * Copyright <%= grunt.template.today("yyyy") %> Algolia, Inc. and other contributors; Licensed MIT',
      ' */'
    ].join('\n'),

    usebanner: {
      all: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },
        files: {
          src: ['dist/*.js']
        }
      }
    },

    uglify: {
      widget: {
        src: '<%= buildDir %>/instantsearch-ion.rangeSlider.js',
        dest: '<%= buildDir %>/instantsearch-ion.rangeSlider.min.js'
      }
    },

    webpack: {
      widget: {
        entry: './index.js',
        output: {
          path: '<%= buildDir %>',
          filename: 'instantsearch-ion.rangeSlider.js'
        },
        externals: [{
          jquery: 'jQuery',
          'ion-rangeslider': 'ion-rangeslider',
          'instantsearch.js': 'instantsearch'
        }]
      }
    },

    sed: {
      version: {
        pattern: '%VERSION%',
        replacement: '<%= version %>',
        recursive: true,
        path: '<%= buildDir %>'
      }
    },

    eslint: {
      options: {
        config: '.eslintrc'
      },
      src: ['src/**/*.js', 'Gruntfile.js']
    },

    watch: {
      js: {
        files: 'src/**/*.js',
        tasks: 'build'
      }
    },

    clean: {
      dist: 'dist'
    },

    connect: {
      server: {
        options: {port: 8888, keepalive: true}
      }
    },

    concurrent: {
      options: {logConcurrentOutput: true},
      dev: ['server', 'watch']
    },

    step: {
      options: {
        option: false
      }
    }
  });

  // aliases
  // -------

  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['webpack', 'sed:version', 'uglify', 'usebanner']);
  grunt.registerTask('server', 'connect:server');
  grunt.registerTask('lint', 'eslint');
  grunt.registerTask('dev', 'concurrent:dev');

  // load tasks
  // ----------

  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-step');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-webpack');
};
