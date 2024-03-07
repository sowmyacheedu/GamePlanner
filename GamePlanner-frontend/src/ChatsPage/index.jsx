import { useContext} from "react";

import img from "../images/1.jpg";

import { useIsMobile } from "../functions/isMobile";
import { Context } from "../functions/context";

import {
  MultiChatWindow,
  MultiChatSocket,
  useMultiChatLogic,
  MessageFormProps,
  ChatCardProps,
  ChatHeaderProps,
} from "react-chat-engine-advanced";

import "./theme.css";

import Sidebar from "./Sidebar";
import MessageForm from "./MessageForm";
import UserSearch from "./UserSearch";
import ChatCard from "./ChatCard";
import ChatHeader from "./ChatHeader";

//import { projectId } from "../functions/constants";

const ChatsPage = () => {
  const projectId = "79ca702a-5109-4cf9-8a33-8d576f5bd04f"
  // Hooks
  
  //const { user } = useContext(Context);
  const user = JSON.parse(localStorage.getItem('user'));
  const isMobile = useIsMobile();

  // Chat Engine Hooks
  const username = user ? user.username : "";
  const secret = user && user.secret !== null ? user.secret : "";
  console.log("users stored after login are: ", user);
  const chatProps = useMultiChatLogic(projectId, username, secret);

  const backgroundImage = {
    backgroundImage: `url(${img})`,
  };

  return (
    <div className="background-image" style={{backgroundImage}}>
      <div className="background-gradient-light">
        <div
          style={{
            position: "relative",
            top: isMobile ? "0px" : "10vh",
            left: isMobile ? "0px" : "calc(50vw - 3vw - 1.5vw - 35vw)",
            height: isMobile ? "100vh" : "80vh",
            width: isMobile ? "100vw" : "calc(100vw - 10.5vw - 10.5vw)",
            backgroundColor: "grey",
          }}
        >
          <div
            style={{
              width: "6vw",
              height: "100%",
              position: "absolute",
              top: "0px",
              left: "0px",
              backgroundColor: "rgb(40,43,54)",
            }}
          >
            <Sidebar />
          </div>

          <div
            style={{
              width: isMobile ? "100vw" : "calc(100vw - 6vw)",
              position: "absolute",
              top: "0px",
              left: isMobile ? "0px" : "6vw",
              height: "100%", // Fill parent height
            }}
          >
            <MultiChatSocket {...chatProps} />

            <MultiChatWindow
              {...chatProps}
              renderChatForm={() => (
                <UserSearch
                  username={chatProps.username}
                  secret={chatProps.secret}
                  onSelect={(chatId: number) =>
                    chatProps.onChatCardClick(chatId)
                  }
                />
              )}
              renderChatCard={(props: ChatCardProps) => (
                <ChatCard
                  {...props}
                  username={chatProps.username}
                  onChatCardClick={chatProps.onChatCardClick}
                  isActive={
                    props.chat !== undefined &&
                    chatProps.activeChatId === props.chat.id
                  }
                  chat={props.chat}
                />
              )}
              renderChatHeader={(props: ChatHeaderProps) => (
                <ChatHeader
                  {...props}
                  chat={chatProps.chat}
                  username={chatProps.username}
                  secret={chatProps.secret}
                />
              )}
              renderMessageForm={(props: MessageFormProps) => (
                <MessageForm {...props} />
              )}
              renderChatSettings={() => <div className="ce-empty-settings" />}
              style={{ height: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
