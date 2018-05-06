$('#entry-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/entries/search?' + search, function(data) {
    $('#entry-grid').html('');
    data.forEach(function(entry) {
      $('#entry-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ entry.image }">
            <div class="caption">
              <h4>${ entry.name }</h4>
            </div>
            <p>
              <a href="/entries/${ entry._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#entry-search').submit(function(event) {
  event.preventDefault();
});