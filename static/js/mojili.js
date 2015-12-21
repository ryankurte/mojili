(function mojili() {
    $(function onReady() {
        setTimeout(function getAndSetRandomEmoji() {
            var randomEmoji = $.get('/emoji', function (data) {
                if (data.result === 'okay') {
                    $("#titleHeader").prepend(data.emoji + " ");
                }
            });
        });
    });


    function getURL() {
        return $('#url').val().toLowerCase().trim();
    }

    $("#mojiliForm").submit(function submitURL(e) {
        e.preventDefault();
        var url = getURL();

        $('#result').toggleClass('hidden', true);

        $.post('/', {url: url}, function (data) {
            $('#result').toggleClass('hidden', false);

            if (data.result == 'okay') {
                $('#result').empty();
                $('#result').toggleClass('alert-success', true);
                $('#result').toggleClass('alert-danger', false);

                $('#result').append('<p><strong>Your Link:</strong> <a href="/' + data.emoji_url + '">moji.li/' + data.emoji_url + '</a></p>');
            } else {
                $('#result').empty();
                $('#result').toggleClass('alert-success', false);
                $('#result').toggleClass('alert-danger', true);
                $('#result').append('<p>' + data.message + '</p>');
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