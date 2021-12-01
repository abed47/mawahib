import User from "./users";
import Channel from "./channel";
import Subscription from "./subscription";

User.hasOne(Channel, {foreignKey: 'user_id'});
Channel.belongsTo(User, {foreignKey: 'user_id'});
Channel.hasMany(Subscription, {foreignKey: 'channel_id'});
Subscription.belongsToMany(Channel, {through: 'channel_id'});
Subscription.belongsToMany(User, {through: 'user_id'});

export {User, Channel, Subscription}