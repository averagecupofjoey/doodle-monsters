import User from "../../server/models/user";

let getProfileId = async function(profileName){
    let profileUser = await User.findOne({
    where: {
      username: profileName,
    },
  });

  profileUser = JSON.parse(JSON.stringify(profileUser));
  return profileUser.id
}

export default getProfileId
