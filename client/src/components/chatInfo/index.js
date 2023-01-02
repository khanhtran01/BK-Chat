import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CustomizedAccordions from "../accordion";
import { textcolor, bcolors } from "../../colors";
import { context } from "../../layout/dashboard/context";
import { conversationContext } from "../../context";

const AboutElement = ({ title, content, marginBottom }) => {
    return (
        <Box boxSizing={"content-box"} marginBottom={marginBottom}>
            <Typography sx={{ color: textcolor.white, fontSize: ".9375rem" }}>
                {title}
            </Typography>
            <Typography
                sx={{ color: textcolor.primaryGray, fontSize: "0.875rem" }}
            >
                {content}
            </Typography>
        </Box>
    );
};

export default function ChatInfo() {
    let user = {
        name: "Tran Le Viet Khanh",
        age: "21",
        email: "khanh.tran01@hcmut.edu.vn",
        location: "Viet Nam",
    };
    const { userData } = useContext(conversationContext);
    const { chatInfoPopup } = useContext(context);

    if (userData.chatInfo.type === "single") {
        if (userData.chatInfo.name === userData.chatInfo.member[0].username) {
            user = userData.chatInfo.member[0];
        } else {
            user = userData.chatInfo.member[1];
        }
    }
    const AboutBox = () => {
        return userData.chatInfo.type === "single" ? (
            <Box>
                <AboutElement
                    marginBottom="1.5rem"
                    title="Name"
                    content={user.username}
                />
                <AboutElement
                    marginBottom="1.5rem"
                    title="Email"
                    content={user.email}
                />
                <AboutElement
                    title="Location"
                    content={user.address ? user.address : "none"}
                />
            </Box>
        ) : (
            <Box>
                <AboutElement
                    marginBottom="1.5rem"
                    title="Name"
                    content={userData.chatInfo.name}
                />
            </Box>
        );
    };
    return (
        <Box
            display={chatInfoPopup ? "block" : "none"}
            sx={{
                height: "100%",
                padding: "24px",
                width: "40rem",
                overflow: "scroll",
                backgroundColor: bcolors.bluedark,
            }}
        >
            {/* Avatar and name part */}
            <Box display="flex" flexDirection="column" alignItems={"center"}>
                <Box
                    height="6.5rem"
                    width="6.5rem"
                    borderRadius="50%"
                    border={"solid 1px #36404a"}
                    display="flex"
                    justifyContent="center"
                    alignItems={"center"}
                >
                    {/* <Avatar
            alt={`${userData.chatInfo.name}`}
            src={`${userData.chatInfo.avatar}`}
            sx={{ height: "5.375rem", width: "5.375rem" }}
          /> */}
                    {userData.chatInfo.avatar ? (
                        <Avatar
                            src={`${userData.chatInfo.avatar}`}
                            alt={`${userData.chatInfo.name}}`}
                            sx={{
                                height: "5.375rem",
                                width: "5.375rem",
                            }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                backgroundColor: "#7269ef40",
                                color: "rgb(114,105,239)",
                                fontSize: ".9375rem",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                height: "5.375rem",
                                width: "5.375rem",
                            }}
                        >
                            {userData.chatInfo.name
                                ? `${userData.chatInfo.name[0]}`
                                : "N"}
                        </Avatar>
                    )}
                </Box>
                <Typography
                    fontWeight={600}
                    marginBottom={0.5}
                    marginTop={3}
                    color={textcolor.primaryGray}
                >
                    {`${userData.chatInfo.name}`}
                </Typography>
                <Box
                    display="flex"
                    alignItems={"center"}
                    marginBottom={"1.5rem"}
                    width="4.188rem"
                    justifyContent="space-around"
                >
                    <FiberManualRecordIcon
                        sx={{ color: bcolors.online, fontSize: "12px" }}
                    />
                    <Typography color={textcolor.white} fontSize={"1rem"}>
                        Active
                    </Typography>
                </Box>
            </Box>

            {/* quote and About infomation */}
            <Box>
                <Box
                    borderTop={`solid 1px ${bcolors.sidebar}`}
                    padding="1.5rem 0rem"
                >
                    <Typography color={textcolor.white}>
                        {user.desc ? user.desc : "No description"}
                    </Typography>
                </Box>
                <Box>
                    <CustomizedAccordions
                        title={
                            <Box
                                display={"flex"}
                                justifyContent="center"
                                alignItems={"flex-start"}
                            >
                                <PersonIcon />
                                <Typography marginLeft={"5px"}>
                                    About
                                </Typography>
                            </Box>
                        }
                        description={<AboutBox user={user} />}
                    />
                    {userData.chatInfo.type === "group" && (
                        <CustomizedAccordions
                            title={
                                <Box
                                    display={"flex"}
                                    justifyContent="center"
                                    alignItems={"flex-start"}
                                >
                                    <GroupsIcon />
                                    <Typography marginLeft={"5px"}>
                                        Member
                                    </Typography>
                                </Box>
                            }
                            description={
                                <Box
                                    sx={{
                                        maxHeight: "500px",
                                        overflow: "scroll",
                                    }}
                                >
                                    {userData.chatInfo.member.map((mem) => (
                                        <Box
                                            key={uuidv4()}
                                            display={"flex"}
                                            alignItems={"center"}
                                            padding={"6px"}
                                        >
                                            {/* <Avatar
                                                sx={{
                                                    width: "28px",
                                                    height: "28px",
                                                }}
                                                src={mem.avatar}
                                                alt={mem.username}
                                            /> */}
                                            {mem.avatar ? (
                                                <Avatar
                                                    src={`${mem.avatar}`}
                                                    alt={`${mem.username}}`}
                                                    sx={{
                                                        width: "28px",
                                                        height: "28px",
                                                    }}
                                                />
                                            ) : (
                                                <Avatar
                                                    sx={{
                                                        backgroundColor:
                                                            "#7269ef40",
                                                        color: "rgb(114,105,239)",
                                                        fontSize: ".9375rem",
                                                        fontWeight: 500,
                                                        textTransform:
                                                            "uppercase",
                                                        width: "28px",
                                                        height: "28px",
                                                    }}
                                                >
                                                    {mem.username
                                                        ? `${mem.username[0]}`
                                                        : "N"}
                                                </Avatar>
                                            )}
                                            <Typography
                                                color={textcolor.primaryGray}
                                                marginLeft={"10px"}
                                            >
                                                {mem.username}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            }
                        />
                    )}

                    <CustomizedAccordions
                        title={
                            <Box
                                display={"flex"}
                                justifyContent="center"
                                alignItems={"flex-start"}
                            >
                                <AttachFileIcon />
                                <Typography marginLeft={"5px"}>
                                    Attact File
                                </Typography>
                            </Box>
                        }
                        description={""}
                    />
                </Box>
            </Box>
        </Box>
    );
}
