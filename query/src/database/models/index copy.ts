import Video from "./videos";
import Tag from "./tags";
import View from "./views";
import Comment from './comments';

Video.hasMany(Comment);
// Video.hasMany(Tag);
Video.hasMany(View);

Comment.belongsTo(Video);
View.belongsTo(Video);
// Tag.belongsTo(Video);

export {Video, Tag, View, Comment};