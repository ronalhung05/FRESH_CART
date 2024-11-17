$(document).ready(function () {
    // Khởi tạo trạng thái ban đầu
    $(".linkVoteReview").each(function () {
        if ($(this).hasClass("active")) {
            $(this).addClass("text-primary").removeClass("text-muted");
        }
    });

    $(".linkVoteReview").on("click", function (e) {
        e.preventDefault();
        voteReview($(this));
    });
});

function voteReview(currentLink) {
    let requestURL = currentLink.attr("href");

    $.ajax({
        type: "POST",
        url: requestURL,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(csrfHeaderName, csrfValue);
        }
    }).done(function (voteResult) {
        console.log("Vote Result:", voteResult); // Log kết quả

        if (voteResult.successful) {
            updateVoteCountAndHighlight(currentLink, voteResult);
            showSuccessMessage(voteResult.message);
        } else {
            showWarningMessage(voteResult.message);
        }
    }).fail(function () {
        showErrorMessage("Error voting review.");
    });
}

function updateVoteCountAndHighlight(currentLink, voteResult) {
    let reviewId = currentLink.attr("reviewId");
    let voteUpLink = $("#linkVoteUp-" + reviewId);
    let voteDownLink = $("#linkVoteDown-" + reviewId);

    // Cập nhật số vote
    $("#voteCount-" + reviewId).text(voteResult.voteCount + " Votes");

    // Reset cả hai link về trạng thái mặc định
    voteUpLink.removeClass("text-primary").addClass("text-muted");
    voteDownLink.removeClass("text-primary").addClass("text-muted");

    let message = voteResult.message;

    // Xử lý highlight dựa trên message
    if (message.includes("successfully voted up")) {
        voteUpLink.addClass("text-primary").removeClass("text-muted");
    } else if (message.includes("successfully voted down")) {
        voteDownLink.addClass("text-primary").removeClass("text-muted");
    }
    // Khi unvote, không cần làm gì thêm vì đã reset ở trên
}

