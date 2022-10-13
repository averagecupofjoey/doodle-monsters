import User from "../../server/models/user";

let getProfileId = async function(profileName){
    let profileUser = await User.findOne({
    where: {
      username: profileName,
    },
  });
  return profileUser.id
}

export default getProfileId
