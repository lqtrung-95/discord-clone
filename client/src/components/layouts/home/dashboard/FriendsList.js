import { Flex, Text, UnorderedList } from "@chakra-ui/react";
import { getFriends } from "api/handler/account";
import useFriendSocket from "api/ws/useFriendSocket";
import FriendsListItem from "components/items/FriendsListItem";
import OnlineLabel from "components/sections/OnlineLabel";
import React from "react";
import { useQuery } from "react-query";
import { fKey } from "utils/querykeys";

export default function FriendsList() {
  const { data } = useQuery(fKey, () => getFriends().then(res => res.data));
  useFriendSocket();

  if (data?.length === 0) {
    return (
      <Flex justify={"center"} align={"center"} w={"full"}>
        <Text textColor={"brandGray.accent"}>No one here yet</Text>
      </Flex>
    );
  }

  return (
    <>
      <UnorderedList listStyleType="none" ml="0" w="full" mt="2">
        <OnlineLabel label={`friends — ${data?.length || 0}`} />
        {data?.map(friend => (
          <FriendsListItem key={friend.id} friend={friend} />
        ))}
      </UnorderedList>
    </>
  );
}
