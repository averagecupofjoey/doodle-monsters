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

  followingInfo = JSON.parse(JSON.stringify(followingInfo));
  followedInfo = JSON.parse(JSON.stringify(followedInfo));
  profileFollowed = JSON.parse(JSON.stringify(profileFollowed));

  return {
    followedInfo,
    followingInfo,
    profileFollowed
  }
}

export default getFollowingInfo;
