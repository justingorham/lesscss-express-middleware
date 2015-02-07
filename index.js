var compiler = require('less-recursive-compiler');
var EOL = require('os').EOL;

var lessOptions = "<script>" +
    "less=" + JSON.stringify({
        env: "development",
        async: false,
        fileAsync: false,
        poll: 1000,
        functions: {},
        dumpLineNumbers: "comments",
        relativeUrls: false,
        rootpath: ":/a.com/"
    }) +
    ";</script>";

var watch = "<script>less.watch();</script>";

var lesscss = function (app, options) {
    var isDevelopment = app.get('env') === 'development';
    var lessPath = options.lessServerPath || '';
    var cssPath = options.cssServerPath || '';
    var useLessFiles = isDevelopment && !options.useCssFiles;
    if (!useLessFiles)
        try {
            compiler.compile(options.lessPhysicalPath, options.compiledPhysicalPath, options.compilerOptions || {});
        }
        catch (err) {
            console.log(err); //keep going
        }
    var lessjstag = '<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/2.3.1/less.min.js"></script>';
    var fullLessExpression = lessOptions + EOL + lessjstag + EOL + watch;

    var lessFunctions = {
        lesscss: function (fileName) {
            var rel = useLessFiles ? 'stylesheet/less' : 'stylesheet';
            var extName = useLessFiles ? '.less' : '.css';
            var dir = useLessFiles ? lessPath : cssPath;
            if (dir.slice(-1) !== "/") {
                dir = dir + '/';
            }
            return '<link rel="' + rel + '" type="text/css" href="' + dir + fileName + extName + '" />';
        },
        lessjs: function () {
            return useLessFiles ? fullLessExpression : '';
        }
    };

    app.use(function (req, res, next) {
        res.locals.lesscss = lessFunctions.lesscss;
        res.locals.lessjs = lessFunctions.lessjs;
        next();
    });

    return lessFunctions;
};

module.exports = lesscss;
