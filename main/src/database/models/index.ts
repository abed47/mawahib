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
import Event from "./event";
import EventSubscription from "./event-subscription";
import Submission from "./submission";
import EventStage from "./event-stage";
import Participation from "./participation";
import Vote from "./vote";

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
Transaction.belongsTo(User, { foreignKey: 'user_id' });

/*======================================== EVENT ASSOCIATIONS ========================================================*/
//event associations
Category.hasMany(Event, { foreignKey: 'category_id' });
Event.belongsTo(Category, { foreignKey: 'category_id' });

//event vote associations
Vote.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Vote, { foreignKey: 'event_id' });
Vote.belongsTo(Submission, { foreignKey: 'submission_id' });
Submission.hasMany(Vote, { foreignKey: 'submission_id' });
Vote.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Vote, { foreignKey: 'user_id' });
Vote.belongsTo(Participation, { foreignKey: 'participation_id' });
Participation.hasMany(Vote, { foreignKey: 'participation_id' });

//event subscription associations
Event.belongsToMany(User, { through: EventSubscription, foreignKey: 'event_id' });
User.belongsToMany(Event, { through: EventSubscription, foreignKey: 'user_id' });
EventSubscription.belongsTo(Event, { foreignKey: 'event_id'});
EventSubscription.belongsTo(User, { foreignKey: 'user_id'});
Event.hasMany(EventSubscription, { foreignKey: 'event_id' });
User.hasMany(EventSubscription, { foreignKey: 'user_id' });

//event submissions associations
Event.hasMany(Submission, { foreignKey: 'event_id' });
Submission.belongsTo(Event, { foreignKey: 'event_id' });

Channel.hasMany(Submission, { foreignKey: 'channel_id'});
Submission.belongsTo(Channel, { foreignKey: 'channel_id'});

// Submission.hasOne(Video, { foreignKey: 'video_id'});
// Video.belongsTo(Submission, { foreignKey: 'video_id'});
Submission.belongsTo(Video, { foreignKey: 'video_id' });
Video.hasOne(Submission, { foreignKey: 'video_id'})

EventStage.hasMany(Submission, { foreignKey: 'stage_id'});
Submission.belongsTo(EventStage, { foreignKey: 'stage_id'});

//event stage associations
Event.hasMany(EventStage, { foreignKey: 'event_id' });
EventStage.belongsTo(Event, { foreignKey: 'event_id' });

//event participation associations
Participation.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Participation, { foreignKey: 'event_id' });
Participation.belongsTo(Channel, { foreignKey: 'channel_id' });
Channel.hasMany(Participation, { foreignKey: 'channel_id' });

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
    Transaction,
    Event,
    EventSubscription,
    Category,
    EventStage
}