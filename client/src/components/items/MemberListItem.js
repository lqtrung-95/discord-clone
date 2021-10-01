import { Avatar, AvatarBadge, Flex, ListItem, Text } from "@chakra-ui/react";
import MemberContextMenu from "components/menus/MemberContextMenu";
import useGetCurrentGuild from "hooks/useGetCurrentGuild";
import React from "react";
import { useContextMenu } from "react-contexify";
import { useParams } from "react-router-dom";
import userStore from "stores/userStore";

export default function MemberListItem({ member }) {
  const { guildId } = useParams();
  const current = userStore(state => state.current);
  const guild = useGetCurrentGuild(guildId);
  const isOwner = guild !== undefined && guild.ownerId === current?.id;
  const { show } = useContextMenu({
    id: member.id
  });

  return (
    <>
      <ListItem
        p="2"
        mx="10px"
        color={"brandGray.accent"}
        _hover={{
          bg: "brandGray.light",
          borderRadius: "5px",
          cursor: "pointer",
          color: "#fff"
        }}
        onContextMenu={show}
      >
        <Flex align="center">
          <Avatar size="sm" src={member.image}>
            <AvatarBadge
              boxSize="1.25em"
              bg={member.isOnline ? "green.500" : "gray.500"}
            />
          </Avatar>
          <Text ml="2">{member.username}</Text>
        </Flex>
      </ListItem>
      {member.id !== current?.id && (
        <MemberContextMenu member={member} id={member.id} isOwner={isOwner} />
      )}
    </>
  );
}
