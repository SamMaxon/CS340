function updaterating(ratingID){
    $.ajax({
        url: '/rating/' + ratingID,
        type: 'PUT',
        data: $('#update_rating').serialize(),
        success: function(result){
            window.location.replace("../profile");
        }
    })
};


