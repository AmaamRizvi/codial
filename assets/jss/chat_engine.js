class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.cahtBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    // console.log(userEmail);

    this.socket = io.connect("http://localhost:5000");

    if (this.userEmail) {
      this.connectionHeandler();
    }
  }

  connectionHeandler() {
    let self = this;

    this.socket.on("connect", function () {
      console.log("connection stablised!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "facebook",
      });

      self.socket.on("user_joined", (data) => {
        console.log("a user joined", data);
      });
    });

    $("#send-message").click(() => {
      let msg = $("#chat-message").val();

      if (msg != "") {
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatroom: "facebook",
        });
      }
    });

    self.socket.on("receive_message", (data) => {
      console.log("message receive: ", data.message);

      let newMessage = $("<li>");

      let messageType = "sender";

      if (data.user_email == self.userEmail) {
        messageType = "my-message";
      }

      newMessage.append(
        $("<span>", {
          html: data.message,
        })
      );

      newMessage.append(
        $("<sub>", {
          html: data.user_email,
        })
      );

      newMessage.addClass(messageType);

      $("#chat-message-list").append(newMessage);

      $("#chat-message").val("");
    });
  }
}
