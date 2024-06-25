// SIGN-UP
import { connectToDatabase } from "@/app/consts/mongodbUrl";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import Cors from "micro-cors";

// @ts-ignore
const handler = async (req, res) => {
  const db = await connectToDatabase();

  try {
    if (req.method === "POST") {
      const { username, password, role } = req.body;

      //restrict only to 'mentor' and 'student' roles
      if (role !== 'mentor' && role !== 'student')
        return res
            .status(400)
            .json({ message: "Only 'mentor' and 'student' can be registered."})

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required." });
      }

      const usersCollection = db.collection("users");
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        return res
          .status(422)
          .json({ message: "User with this username already exists." });
      }

      const hashedPassword = await hash(password, 10);
      const insertedUser = await usersCollection.insertOne({
        username,
        password: hashedPassword,
        role,
      });

      const token = sign(
        { _id: insertedUser.insertedId, username, role },
        "your-secret-key",
        {
          expiresIn: "24h",
        }
      );

      await usersCollection.updateOne({ _id: insertedUser.insertedId }, { $set: { token: token }})

      res.status(201).json({ message: "User registered successfully.", token });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const cors = Cors({
  origin: "*", // You might want to specify a more
  // @ts-ignore
  methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);