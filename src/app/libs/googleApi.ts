//@ts-ignore
import {connectToDatabase} from "@/app/consts/mongodbUrl";
import authCheck from "@/app/libs/authCheck";
import {baseUrl} from "@/app/config/baseUrl";
import {google} from "googleapis";
import {web} from "../../../oauth";
import { ObjectId } from "mongodb";


export async function refresh(user: any) {
    const collectionName = 'googleAuthTokens';
    const db = await connectToDatabase();
    const token = await db.collection(collectionName).findOne({user: user?._id})

    const reqBody = {
        client_id: web.client_id,
        client_secret: web.client_secret,
        refresh_token: token?.oauthToken.refresh_token,
        grant_type: "refresh_token"
    }
    const request = new Request(web.token_uri, {
        method: "POST",
        body: JSON.stringify(reqBody)
    })
    const resp = await fetch(request)

    const data = await resp.json()

    if (data.error) {
        // await db.collection('googleAuthTokens').deleteOne({ user: user?._id})
        throw new Error(`Can't refresh token. Error response: ${data.error}`)
    }

    await db.collection('googleAuthTokens').updateOne({user: user?._id}, {
        $set: {
            'oauthToken.access_token': data.access_token,
            'oauthToken.id_token': data.id_token
        }
    })

    return data
}

const TIME_ZONE = 'UTC+6'

type MeetingData = {
    summary: string,
    description: string,
    //example: 2024-03-24
    start_date: string,
    end_date: string,
    //example: 01:30:00
    start_time: string,
    end_time: string,
}


// @ts-ignore
export async function createMeeting(user: any, eventData: MeetingData) {
    const db = await connectToDatabase();
    const collectionName = 'googleAuthTokens';
    const id = user?._id.toString();
    const oauth = await db.collection(collectionName).findOne({user: new ObjectId(id)})
    if (!oauth)
        throw new Error("Login first.") //return res.redirect(baseUrl + 'oauth/login?redirect=oauth/create-meeting')

    let cl = {
        type: 'authorized_user',
        refresh_token: oauth.oauthToken.refresh_token,
        client_id: web.client_id,
        client_secret: web.client_secret
    }

    const token = google.auth.fromJSON(cl)

    // const token = new OAuth2Client(web.client_id, web.client_secret, baseUrl + 'oauth/callback')

    //@ts-ignore
    const calendar = google.calendar({version: 'v3', auth: token})

    const event = {
        'summary': eventData.summary,
        'description': eventData.description,
        'start': {
            'dateTime': `${eventData.start_date}T${eventData.start_time}`,
            'timeZone': TIME_ZONE,
        },
        'end': {
            'dateTime': `${eventData.end_date}T${eventData.end_time}`,
            'timeZone': TIME_ZONE,
        },
        'conferenceData': {
            'createRequest': {
                'requestId': 'random-identifier'
            }
        }
    };

    //@ts-ignore
    return await calendar.events.insert({
        //@ts-ignore
        auth: token,
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all',
        conferenceDataVersion: 1
    })
        .then((response) => {
            // @ts-ignore
            // return res.json({message: "Meeting created.", link: response.data.hangoutLink})

            return response.data

        })
        .catch(async () => {
            return refresh(user)
                .then(async () => {

                    return await createMeeting(user, eventData)
                    //return res.json({message: "refreshed."})
                })
                .catch(() => {
                    return new Error("Can't refresh token.")
                    // return res.status(400).json({message: "Can't refresh token. You need to login again."});
                })
        })
}
