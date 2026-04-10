import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";


// Create a database called natureWatch photos
export const db = new Dexie ("naturewatch-photos");

db.version(1).stores({
    // photo table with a singel primary key : id.
    photos:"id"
});

// imgSrc = base64 image string from the camera
export async function addPhoto(id, imgSrc) {
    try{
        await db.photos.put({
            id:id, // primary key
            imgSrc: imgSrc // base64 image data
        });
        console.log ("Photo saved for report",id); 
    } catch (error){
        console.error("failed to save", error);
    }
}

//get photo from indexDB
// returns the base 4 image given for report id
export function GetPhotoSrc(id){
    // runs automatically whenever the db changes
    const result = useLiveQuery(() => 
        db.photos.where("id").equals(id).toArray()
    ); 

    // if a photo exists, return the base 65 string
    if (Array.isArray(result) && result.length > 0){
        return result[0].imgSrc;
    }

    // no photo found
    return null;
}
