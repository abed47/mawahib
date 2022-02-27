import User from "./users";
import Channel from "./channel";
import Subscription from "./subscription";
import Video from './videos';
import View from './views';
import Comments from './comments';
import Like from "./likes";
import Category from './category';
import Playlist from "./playlist";
import PlayListItem from "./playlist-item";
import Wallet from "./wallet";
import Transaction from './transaction';
import Product from "./products";

//category associations
// Category.hasMany(Video, {foreignKey: 'category_id'});
Channel.belongsTo(Category, {foreignKey: 'category_id'});
// Category.hasMany(Channel, {foreignKey: 'category_id'});
Video.belongsTo(Category, {foreignKey: 'category_id'});

//user associations
User.hasOne(Channel, {foreignKey: 'user_id'});
Channel.belongsTo(User, {foreignKey: 'user_id'});
User.hasMany(Like, {foreignKey: 'user_id'});
Like.belongsTo(User, {foreignKey: 'user_id'});

//comment associations
User.hasMany(Comments, {foreignKey: 'user_id'});
Video.hasMany(Comments, {foreignKey: 'video_id'});
Comments.belongsTo(User, {foreignKey: 'user_id'});
Comments.belongsTo(Video, {foreignKey: 'video_id'});

//Video associations
Channel.hasMany(Video, {foreignKey: 'channel_id'});
Video.belongsTo(Channel, {foreignKey:'channel_id'});

//subscriptions associations
Channel.hasMany(Subscription, {foreignKey: 'channel_id'});
Subscription.belongsTo(Channel, {foreignKey: 'channel_id'});
User.hasMany(Subscription, {foreignKey: 'user_id'});
Subscription.belongsTo(User, {foreignKey: 'user_id'});

Video.hasMany(Like, {foreignKey: 'video_id'});
Video.hasMany(View, {foreignKey: 'video_id'});
Like.belongsTo(Video, {foreignKey: 'video_id'});
View.belongsTo(Video, {foreignKey: 'video_id'});

Playlist.belongsTo(User, { foreignKey: 'user_id', onDelete: 'cascade', onUpdate: 'cascade'});
Playlist.belongsTo(Channel, { foreignKey: 'channel_id', onDelete: 'cascade', onUpdate: 'cascade'});
Channel.hasMany(Playlist, { foreignKey: 'channel_id', onDelete: 'cascade', onUpdate: 'cascade'});
User.hasMany(Playlist, { foreignKey: 'user_id', onDelete: 'cascade', onUpdate: 'cascade'});

PlayListItem.belongsTo(Playlist, { foreignKey: 'playlist_id', onDelete: 'cascade', onUpdate: 'cascade'});
PlayListItem.belongsTo(Video, { foreignKey: 'video_id', onDelete: 'cascade', onUpdate: 'cascade'});
Playlist.hasMany(PlayListItem, { foreignKey: 'playlist_id', onDelete: 'cascade', onUpdate: 'cascade'});
Video.hasMany(PlayListItem, { foreignKey: 'video_id', onDelete: 'cascade', onUpdate: 'cascade'});

// User.hasOne(Channel, {foreignKey: 'user_id'});
// Channel.belongsTo(User, {foreignKey: 'user_id'});
// Channel.hasMany(Subscription, {foreignKey: 'channel_id'});
// Subscription.belongsToMany(Channel, {through: 'channel_id'});
// Subscription.belongsToMany(User, {through: 'user_id'});

User.hasOne(Wallet, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'});
Wallet.belongsTo(User, { foreignKey: 'user_id', onDelete: 'cascade', onUpdate: 'cascade'});
Wallet.hasMany(Transaction, {foreignKey: 'wallet_id', onDelete: 'cascade', onUpdate: 'cascade'});
User.hasMany(Transaction, { foreignKey: 'user_id', onDelete: 'cascade', onUpdate: 'cascade'});
Product.hasOne(Transaction, { foreignKey: 'product_id'});

Transaction.hasOne(Channel, { foreignKey: 'channel_id' });

export {
    User, 
    Channel, 
    Subscription, 
    Video, 
    View, 
    Comments, 
    Like,
    PlayListItem,
    Playlist,
    Wallet,
    Product,
    Transaction
}