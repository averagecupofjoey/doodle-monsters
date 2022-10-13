import Following from "../../server/models/following";

let getFollowingInfo = async function(profileId, session){
    let followedInfo = await Following.findAll({
    where: {
      followed_id: profileId,
      unfollowed: false,
    },
  });

  let followingInfo = await Following.findAll({
    where: {
      follower_id: profileId,
      unfollowed: false,
    },
  });

  let profileFollowed = await Following.findOne({
    where: {
      follower_id: session.id,
      followed_id: profileId,
      unfollowed: false,
    },
  });

  return {
    followedInfo,
    followingInfo,
    profileFollowed
  }
}

export default getFollowingInfo;
