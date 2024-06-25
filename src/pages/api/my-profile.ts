import Cors from "micro-cors";
import {InstructorProfile, StudentProfile} from "@/app/models/profiles";
import authCheck from "@/app/libs/authCheck";
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import {ObjectId} from "mongodb";
import {IInstructor, IStudent} from "@/app/interfaces/user/profile";

// @ts-ignore
const handler = async (req, res) => {
    const db = await connectToDatabase();
    const user = await authCheck(req, res);

    if (!user)
        return res.status(400).json({message: "User is undefined."})

    const mentorProfiles = db.collection('instructors')
    const studentProfiles = db.collection('students')

    if (req.method === 'GET') {
        if (user.role !== 'student' && user.role !== 'mentor')
            return res.status(400).json({message: "This user can't have a profile."})

        if (!user.profile)
            return res.status(404).json({message: "Profile not found."})

        if (user.role === 'student')
            return res.status(200).json(await studentProfiles.findOne({_id: new ObjectId(user.profile)}))
        else if (user.role === 'mentor')
            return res.status(200).json(await mentorProfiles.findOne({_id: new ObjectId(user.profile)}))
        else
            return res.status(400).json({message: "This user can't have a profile."})

    } else if (req.method === 'POST') {
        if (user.profile) {
            return res.status(400).json({message: "You already have a profile. Please proceed to 'Edit Profile' if you would like to make changes."})
        }
        if (user.role === 'student') {
            const profile: StudentProfile = req.body;
            const newProfile = await studentProfiles.insertOne(profile)
            await db.collection('users').updateOne({_id: new ObjectId(user._id)}, {$set: {profile: new ObjectId(newProfile.insertedId)}});
            return res.status(201).json({message: "profile was created successfully"})
        } else if (user.role === 'mentor') {
            const profile: InstructorProfile = req.body;
            const newProfile = await mentorProfiles.insertOne(profile)
            await db.collection('users').updateOne({_id: new ObjectId(user._id)}, {$set: {profile: new ObjectId(newProfile.insertedId)}})
            return res.status(201).json({message: "profile was created successfully"})
        } else
            return res.status(400).json({message: "This user can't have a profile."})

    } else if (req.method === 'PUT') {
        if (user.profile !== null) {
            if (user.role === 'student') {
                const profile: IStudent = req.body;
                await db.collection('students').replaceOne({_id: new ObjectId(profile._id)}, profile);
                return res.status(200).json({message: "profile was updated successfully"})
            } else if (user.role === 'mentor') {
                const profile: IInstructor = req.body;
                await db.collection('users').replaceOne({_id: new ObjectId(profile._id)}, profile)
                return res.status(200).json({message: "profile was updated successfully"})
            }
        } else {
            return res.status(400).json({message: "You do not have a profile yet. Please proceed to 'Create Profile'."})
        }
    } /*else if (req.method === 'DELETE') {
        const profile = user.profile;
        if (!profile)
            return res.status(400).json({message: "You don't have profile to delete."})

        try {
            const deletionResult = await db.collection('students').deleteOne({_id: new ObjectId(profile)});
            if (deletionResult.deletedCount === 1) {
                const updateResult = await db.collection('users').updateOne(
                    {"profile": new ObjectId(profile)},
                    {$unset: {"profile": ""}}
                );
                if (updateResult.modifiedCount === 1) {
                    return res.status(200).json({message: "Profile was deleted successfully."});
                } else {
                    return res.status(500).json({message: "Error updating user profile reference."});
                }
            } else {
                const deletionResultInstructors = await db.collection('instructors').deleteOne({_id: new ObjectId(profile)});
                if (deletionResultInstructors.deletedCount === 1) {
                    const updateResult = await db.collection('users').updateOne(
                        {"profile": new ObjectId(profile)},
                        {$unset: {"profile": ""}}
                    );
                    if (updateResult.modifiedCount === 1) {
                        return res.status(200).json({message: "Profile was deleted successfully."});
                    } else {
                        return res.status(500).json({message: "Error updating user profile reference."});
                    }
                } else {
                    return res.status(400).json({message: "Profile could not be found."});
                }
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            return res.status(500).json({message: "An unexpected error occurred while deleting the profile."});
        }

    }*/ else {
        return res.status(400).json({message: "Method is not allowed."})
    }

};

const cors = Cors({
    origin: "*", // You might want to specify a more
    // @ts-ignore
    methods: ["GET", "POST", "PUT", "DELETE"],
});

export default cors(handler);