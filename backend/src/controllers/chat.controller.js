import { generateStreamToken, upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";

export async function getStreamToken(req, res) {
  try {
    // use the Mongo _id to generate the token
    const token = generateStreamToken(req.user._id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function ensureStreamUser(req, res) {
  try {
    const { userId } = req.params;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upsert user to Stream
    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePic || "",
    });

    res.status(200).json({ success: true, message: "User ensured in Stream" });
  } catch (error) {
    console.log("Error in ensureStreamUser controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
