import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

/*Create a Dexie database called "naturewatch-photos".*/
export const db = new Dexie("naturewatch-photos");
db.version(2).stores({
  photos: "id",     // id = report ID (string)
  profile: "id"     // id = "profile" (string)
});

// save a photo to IndexedDB (id = report ID, imgSrc = base64 string)
export async function addPhoto(id, imgSrc) {
  try {
    await db.photos.put({
      id: id,        // primary key
      imgSrc: imgSrc // base64 image data
    });
    console.log("Photo saved for report", id);
  } catch (error) {
    console.error("Failed to save photo", error);
  }
}

// get a photo for a specific report ID (returns base64 string or null)
export function GetPhotoSrc(id) {
  // useLiveQuery automatically re-runs when Dexie changes
  const result = useLiveQuery(() =>
    db.photos.where("id").equals(id).toArray()
  );

  // If a photo exists, return the base64 string
  if (Array.isArray(result) && result.length > 0) {
    return result[0].imgSrc;
  }

  // No photo found
  return null;
}

/*
  
  Only one profile picture is stored.
*/
export async function saveProfilePhoto(base64Image) {
  try {
    await db.profile.put({
      id: "profile",      // always the same key
      image: base64Image  // base64 image data
    });
    console.log("Profile photo saved");
  } catch (error) {
    console.error("Failed to save profile photo", error);
  }
}

// Get the profile picture (returns base64 string or null)
export function GetProfilePhoto() {
  const result = useLiveQuery(() =>
    db.profile.where("id").equals("profile").toArray()
  );

  if (Array.isArray(result) && result.length > 0) {
    return result[0].image;
  }

  return null;
}
