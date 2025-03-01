import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, userName, room }) => {
  const [currMessage, setCurrMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrMessage(""); // Clear input after sending
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler); // Cleanup listener
    };
  }, [socket]);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto h-[80vh] border border-gray-300 shadow-lg rounded-lg overflow-hidden mt-5 bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-3 px-4 text-lg  font-semibold text-center flex-shrink-0">
        Live Chat
      </div>

      {/* Chat Body */}
      <ScrollToBottom className="flex-1  overflow-y-auto p-4 space-y-3 bg-gray-100">
        {messageList.map((messageContent, index) => (
          <div
            key={index}
            className={`flex ${
              messageContent.author === userName ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg shadow ${messageContent.author === userName
                ? "bg-[#bde8f1] text-gray-800 rounded-br-none"
                : "bg-[#f2f2f0] text-gray-800 border rounded-bl-none"
                }`}
            >
              {/* Message Text */}
              <p className="text-sm break-words whitespace-pre-wrap">{messageContent.message}</p>
              {/* Message Footer (Time and Author) */}
              <div className="text-xs mt-1 text-gray-500 flex space-x-1 justify-between">
                <span>{messageContent.time}</span>
                <span>{messageContent.author === userName ? "You" : messageContent.author}</span>
              </div>
            </div>
          </div>
        ))}
      </ScrollToBottom>

      {/* Chat Footer */}
      <div className="flex items-center p-3 border-t border-gray-300 bg-white flex-shrink-0">
        <input
          type="text"
          value={currMessage}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-400 px-4"
          onChange={(e) => setCurrMessage(e.target.value)}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 flex items-center justify-center"
          onClick={sendMessage}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default Chat;
