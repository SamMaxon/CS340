function delete_rating(ratingID){
    $.ajax({
        url: '/rating/' + ratingID,
        type: 'DELETE',
        success: function(result){
            window.location.replace("../profile");
        }
    })
};

