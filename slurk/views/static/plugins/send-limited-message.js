// to use this plugin you will need to define the variable MAX_MSG_WRDS in your template.
// messages with more words than MAX_MSG_WRDS will not be sent

if (text.match("^/")) {
    submit_command(text.substr(1));
    display_message(current_user, current_timestamp, text.substr(1), true);
} else if (text.match("^image:")) {
    submit_image(text.substr(6), 300, 300, () => {
        display_image(current_user, current_timestamp, text.substr(6), 300, 300, false);
    }, (error) => {
        display_image(current_user, current_timestamp, text.substr(6), 300, 300, true);
        if (error === undefined) {
            unknown_error(current_timestamp);
        } else if (error === "insufficient rights") {
            display_info(current_timestamp, "You are not allowed to send an image");
        } else {
            display_info(current_timestamp, error);
        }
    });
} else if (text.match("^@")) {
    let user = text.substr(1, text.indexOf(" ") - 1);
    let message = text.substr(text.indexOf(" ") + 1);
    if (message.match("^image:")) {
        submit_private_image(user, message.substr(6), 300, 300, () => {
            display_image(current_user, current_timestamp, message.substr(6), 300, 300, true);
        }, (error) => {
            display_image(current_user, current_timestamp, message.substr(6), 300, 300, true);
            if (error === undefined) {
                unknown_error(current_timestamp);
            } else if (error === "insufficient rights") {
                display_info(current_timestamp, "You are not allowed to send a private image");
            } else {
                display_info(current_timestamp, error);
            }
        });
    } else {
        submit_private_text(user, message, () => {
            display_message(current_user, current_timestamp, message, true);
        }, (error) => {
            display_message(current_user, current_timestamp, message, true);
            if (error === undefined) {
                unknown_error(current_timestamp);
            } else if (error === "insufficient rights") {
                display_info(current_timestamp, "You are not allowed to send a private message");
            } else {
                display_info(current_timestamp, error);
            }
        });
    }
} else {
    if (text.split(" ").length > MAX_MSG_WRDS){
        display_info(current_timestamp, `Your message is too long, you can only send up to ${MAX_MSG_WRDS} words`);
        socket.emit("keypress", {"typing": false})
    } else {
        submit_text(text, () => {
            display_message(current_user, current_timestamp, text, false);
        }, (error) => {
            display_message(current_user, current_timestamp, text, true);
            if (error === undefined) {
                unknown_error(current_timestamp);
            } else if (error === "insufficient rights") {
                display_info(current_timestamp, "You are not allowed to send a message");
            } else {
                display_info(current_timestamp, error);
            }
        });
    }
}