import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  if (!tokenUserId) {
    return res.status(400).json({ error: "Missing user ID in request" });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

        const receiver = receiverId
          ? await prisma.user.findUnique({
              where: { id: receiverId },
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            })
          : null;

        return {
          ...chat,
          receiver: receiver || {
            id: "deleted",
            username: "Deleted User",
            avatar: null,
          },
          lastMessage: chat.messages[0]?.text || "",
        };
      })
    );

    enrichedChats.sort((a, b) => {
      const aTime = a.messages[0]?.createdAt || new Date(0);
      const bTime = b.messages[0]?.createdAt || new Date(0);
      return bTime - aTime;
    });

    res.status(200).json(enrichedChats);
  } catch (err) {
    console.error("🔥 getChats error:", err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat || !chat.userIDs.includes(tokenUserId)) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    await prisma.chat.update({
      where: { id: req.params.id },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
