import Video from "./videos";
import Tag from "./tags";
import View from "./views";
import Comment from './comments';
import Like from './likes';
import Category from './category';

Video.belongsTo(Category, {foreignKey: 'category_id'});
Category.hasMany(Video, {foreignKey: 'category_id'});

Video.hasMany(Comment);
// Video.hasMany(Tag);
Video.hasMany(View);

Comment.belongsTo(Video);
View.belongsTo(Video);
// Tag.belongsTo(Video);

export {Video, Tag, View, Comment, Like};