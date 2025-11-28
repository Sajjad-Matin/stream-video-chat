import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in recommendedUsers Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recieverId } = req.params;

    if (myId === recieverId)
      return res
        .status(400)
        .json({ message: "You can't send friend request to your self!" });

    const reciever = await User.findById(recieverId);
    if (!reciever) return res.status(404).json({ message: "User not found!" });

    if (reciever.friends.includes(myId))
      return res
        .status(400)
        .json({ message: "You are already friend with this user" });

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, reciever: recieverId },
        { sender: recieverId, reciever: myId },
      ],
    });
    if (existingRequest)
      return res.status(400).json({
        message: "A friend request is already between you and this user",
      });

    const friendRequest = await FriendRequest.create({
      sender: myId,
      reciever: recieverId,
    });

    res.status(202).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller:", error);
    res.status(500).json({ message: "Internal Server Error9ooooo9o" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest)
      return res.status(404).json({ message: "Friend request not found" });

    if (friendRequest.reciever.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.reciever },
    });

    await User.findByIdAndUpdate(friendRequest.reciever, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted!" });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error);
    res.status(500).json({message: "Internal Server Error!"})
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      reciever: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")

    const acceptedReqs = await FriendRequest.find({
      reciever: req.user.id,
      status: "accepted",
    }).populate("sender", "fullName profilePic")

res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("Error in getFriendRequests controller:", getFriendRequests);
    res.status(500).json({message: "Internal Server Error"})
  }
}

export async function getOutgoingFriendsReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending"
    }).populate('reciever', 'fullName profilePic nativeLanguage learningLanguage')

    res.status(200).json(outgoingRequests)
  } catch (error) {
    console.error("Error in getOutgoingFriendsReqs controller:", error);
    res.status(500).json({message: "Internal Server Error"})
  }
}