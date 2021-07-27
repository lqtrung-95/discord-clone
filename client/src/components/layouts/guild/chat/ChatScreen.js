import { Box, Flex, Spinner } from "@chakra-ui/react";
import { getMessages } from "api/handler/messages";
import useMessageSocket from "api/ws/useMessageSocket";
import Message from "components/items/message/Message";
import DateDivider from "components/sections/DateDivider";
import StartMessages from "components/sections/StartMessages";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { useParams } from "react-router-dom";
import { checkNewDay, getTimeDifference } from "utils/dateUtils";
import guildScrollbarCss from "../css/GuildScrollerCSS";
import ChatGrid from "./ChatGrid";

export default function ChatScreen() {
  const { channelId } = useParams();
  const [hasMore, setHasMore] = useState(true);
  const qKey = `messages-${channelId}`;

  const { data, isLoading, fetchNextPage } = useInfiniteQuery(
    qKey,
    async ({ pageParam = null }) => {
      const { data } = await getMessages(channelId, pageParam);
      if (data.length !== 35) setHasMore(false);
      return data;
    },
    {
      getNextPageParam: lastPage =>
        hasMore && lastPage.length
          ? lastPage[lastPage.length - 1].createdAt
          : ""
    }
  );

  useMessageSocket(channelId, qKey);

  if (isLoading) {
    return (
      <ChatGrid>
        <Flex align={"center"} justify={"center"} h={"full"}>
          <Spinner size={"xl"} thickness={"4px"} />
        </Flex>
      </ChatGrid>
    );
  }

  const checkIfWithinTime = (message1, message2) => {
    if (message1.user.id !== message2.user.id) return false;
    if (message1.createdAt === message2.createdAt) return false;
    return getTimeDifference(message1.createdAt, message2.createdAt) <= 5;
  };

  const messages = data ? data.pages.flatMap(p => p) : [];

  return (
    <ChatGrid>
      <Box h={"10px"} mt={4} />
      <Box
        as={InfiniteScroll}
        css={guildScrollbarCss}
        dataLength={messages.length}
        // next={fetchNextPage}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        inverse={true}
        hasMore={hasMore}
        loader={
          messages.length > 0 && (
            <Flex align={"center"} justify={"center"} h={"50px"}>
              <Spinner />
            </Flex>
          )
        }
        scrollableTarget="chatGrid"
      >
        {messages.map((m, i) => (
          <React.Fragment key={m.id}>
            <Message
              message={m}
              isCompact={checkIfWithinTime(
                m,
                messages[Math.min(i + 1, messages.length - 1)]
              )}
            />
            {checkNewDay(
              m.createdAt,
              messages[Math.min(i + 1, messages.length - 1)].createdAt
            ) && <DateDivider date={m.createdAt} />}
          </React.Fragment>
        ))}
      </Box>
      {!hasMore && <StartMessages />}
    </ChatGrid>
  );
}
