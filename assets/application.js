// Put your application javascript here
document.querySelector('#sort_by').addEventListener('change', function(e) {
    var url = new URL (window.location.href);
    url.searchParams.set('sort_by', e.currentTarget.value);

    window.location = url.href;
});