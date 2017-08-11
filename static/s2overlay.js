// https://arxiv.org/abs/1705.10311

var NARTICLES = 5;
//var URL_LOGO = 'http://127.0.0.1:8000/static/s2logo.png';
var URL_LOGO = chrome.extension.getURL('static/s2logo.png');
var URL_S2_HOME = 'https://semanticscholar.org';
var URL_S2_API = 'http://api.semanticscholar.org/v1/';

function min(a, b){return (a < b) ? a : b;}
function max(a, b){return (a > b) ? a : b;}

function url_s2_paper(id)   {return URL_S2_API+'paper/arXiv:'+id;}
function url_s2_paperId(id) {return URL_S2_API+'paper/'+id;}
function url_s2_author(id)  {return URL_S2_API+'author/'+id;}

function current_article(){
    var url = $(location).attr('href');
    var re_url = new RegExp('^http(?:s)?://arxiv.org/abs/(\\d{4}\\.\\d{4,5})(?:\\?.*)?$');
    var match = re_url.exec(url);

    if (!match)
        $.fail(function (err) {console.log("Semantic Scholar Overlay: no article ID extracted");});

    return match[1];
}

function is_overlay_loaded(){
    if (typeof _s2overlayed !== 'undefined')
        return true;
    _s2overlayed = true;
    return false;
}

function brand(target, before) {
    if (typeof(before)==='undefined') before = true;

    var height = target.height();
    var width = Math.floor(55./44. * height);

    var img = $('<img>')
        .attr('src', URL_LOGO)
        .width(width)
        .height(height)

    var link = $('<a>').attr('href', URL_S2_HOME);

    if (before)  link.prependTo(target);
    if (!before) link.appendTo(target);

    img.appendTo(link);
}

function load_data(url, callback, failmsg){
    $.get(url, callback)
     .fail(function(err) {
         alert(failmsg);
     });
}

function gogogo(){
    if (is_overlay_loaded())
        return;

    var url = url_s2_paper(current_article());
    load_data(
        url, draw_overlays,
        'S2 unavailable -- click the shield in the '+
        'address bar and allow unathenticated sources '+
        '(load unsafe scripts) due to http requests to '+
        'Semantic Scholar API'
    );
}

function influential_to_top(references){
    var used = [];
    var newlist = [];

    for (var i=0; i<references.length; i++){
        if (references[i].isInfluential){
            newlist.push(references[i]);
            used.push(i);
        }
    }

    for (var i=0; i<references.length; i++){
        if (i in used)
            continue

        newlist.push(references[i]);
    }

    return newlist;
}

function draw_overlays(data){
    function _authors(ref, base){
        var url = url_s2_paperId(ref.paperId);
        load_data(url,
            function(data) {
                var len = data.authors.length;
                var elem = $('<div>').addClass('s2-authors');

                for (var j=0; j<len; j++){
                    $('<a>')
                        .appendTo(elem)
                        .attr('href', data.authors[j].url)
                        .text(data.authors[j].name);
                }

                base.append(elem);
            },
            'Could not find paper "'+ref.title+'"'
        );
    }

    function _paper(ref){
        var classes = ref.isInfluential ? 'influential' : 'notinfluential';

        return $('<div>')
            .addClass('s2-paper')
            .append(
                $('<a>')
                  .addClass(classes)
                  .attr('href', ref.url)
                  .text(ref.title)
            );
    }

    function create_column(references, header, anchorbase, anchorlink, ID){
        var column = $('<div>');

        $('<span>')
            .text(header)
            .attr('id', ID)
            .appendTo(
                $('<a>')
                    .attr('href', anchorbase+anchorlink)
                    .appendTo(column)
            );

        sortedrefs = influential_to_top(references);
        var len = sortedrefs.length;
        for (var i=0; i<min(NARTICLES, len); i++){
            var e = _paper(sortedrefs[i]);
            _authors(sortedrefs[i], e);
            column.append(e);
        }

        if (len > NARTICLES){
            $('<h2>')
                .appendTo(column)
                .css('text-align', 'center')
                .append(
                    $('<a>').attr('href', anchorbase+anchorlink).text('...')
                )
        }

        return column;
    }


    function replace_author_links(authors){
        var auths = $('div.authors a');

        for (var i=0; i<auths.length; i++){
            $(auths[i])
                .attr('href', authors[i].url)
                .text(authors[i].name);
        }

    }

    var link = data.url;
    var cl = create_column(data.references, 'References', link, '#citedPapers', 'colhl');
    var cr = create_column(data.citations, 'Citations', link, '#citingPapers', 'colhr');

    $('<div>')
        .insertBefore($('.submission-history'))
        .addClass('s2-col2')
        .append(cl)
        .append(cr);

    brand($('#colhl'));
    brand($('#colhr'));
    replace_author_links(data.authors);
}

gogogo();
