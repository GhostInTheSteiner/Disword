jsdom = require('jsdom')

exports.getJqueryByHtml = (html) => {
    
    var document = new jsdom.JSDOM(html);
    var window = document.window;
    
    return jquery(window);
}