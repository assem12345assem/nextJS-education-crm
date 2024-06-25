// SIGN-IN
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import Cors from "micro-cors";

// @ts-ignore
const handler = async (req, res) => {
  const db = await connectToDatabase();

  try {
    if (req.method === "POST") {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required." });
      }

      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({ username });
      if (!user || !(await compare(password, user.password))) {
        return res
          .status(401)
          .json({ message: "Invalid username or password." });
      }

      const token = sign(
        { _id: user._id, username: user.username, role: user.role },
        "your-secret-key",
        {
          expiresIn: "24h",
        }
      );

      return await usersCollection.updateOne({ _id: user._id }, { $set: {token: token} })
          .then(() => res.status(200).json({ message: "Sign-in successful", token }))
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "DB error"});
          });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const cors = Cors({
  origin: "*", // You might want to specify a more
  // @ts-ignore
  methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);
