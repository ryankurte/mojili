(function mojili() {
    // On Load
    $(function onReady() {
        setTimeout(function getAndSetRandomEmoji() {
            var randomEmoji = $.get('/emoji', function (data) {
                if (data.result === 'okay') {
                    var $titleHeader = $("#titleHeader");
                    var emojiChar = data.emoji;
                    if (!Modernizr.emoji_old) {
                        emojiChar = emoji.parseEmoji(data.emoji);
                    }
                    $titleHeader.prepend(emojiChar + " ");
                }
            });
        });
    });
    
    // Polyfill 
    Modernizr.addTest('emoji_old', function() {
        if (!Modernizr.canvastext) {
            return false;
        }
        var node = document.createElement('canvas'); 
        var ctx = node.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '32px Arial';
        ctx.fillText('\ud83d\ude03', 0, 0); // "smiling face with open mouth" emoji
        return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
    });
    
    // URL
    var URLProtocolRegEx = new RegExp("^(\\w+:\\/\\/)");

    function URLProtocolToLowerCase(url) {
        if (URLProtocolRegEx.test(url)) {
            return url.replace(URLProtocolRegEx, (URLProtocolRegEx.exec(url)[0]).toLowerCase());
        } else {
            return url;
        }
    }

    function getURL() {
        return URLProtocolToLowerCase($('#url').val()).trim();
    }


    // Form logic
    $("#mojiliForm").submit(function submitURL(e) {
        e.preventDefault();
        var url = getURL();

        var $result = $("#result");
        $result.toggleClass('hidden', true);

        $.post('/', {url: url}, function (data) {
            $result.toggleClass('hidden', false);

            if (data.result == 'okay') {
                $result.empty();
                $result.toggleClass('alert-success', true);
                $result.toggleClass('alert-danger', false);
                
                var emojiUrl = data.emoji_url;
                if (!Modernizr.emoji_old) {
                    emojiUrl = emoji.parseEmoji(emojiUrl);
                }
                
                $result.append('<p><strong>Your Link:</strong> <a href="/' + data.emoji_url + '">moji.li/' + emojiUrl + '</a></p>');
            } else {
                $result.empty();
                $result.toggleClass('alert-success', false);
                $result.toggleClass('alert-danger', true);
                $result.append('<p>' + data.message + '</p>');
            }
        });
    });

    onURLChange = function onURLChange() {
        var url = getURL();

        var error = false;

        if (url.indexOf('http://') == -1 && url.indexOf('https://')) {
            error = true;
        }

        $('#submitButton').prop('disabled', error);
        $('#errorMessage').toggleClass('hidden', !error);
    }
})();