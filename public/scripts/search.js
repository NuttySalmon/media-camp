$('#title-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/titles?' + search, function(data) {
    $('#title-grid').html('');
    data.forEach(function(title) {
      $('#title-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ title.image }">
            <div class="caption">
              <h4>${ title.name }</h4>
            </div>
            <p>
              <a href="/titles/${ title._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#title-search').submit(function(event) {
  event.preventDefault();
});