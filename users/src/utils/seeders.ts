import * as faker from 'faker';
import { User, Subscription, Channel } from '../database/models';

export default  async () => {
    try{

        let user1 = {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: 'abed@gmail.com',
            password: 123456
        };

        let user2 = {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: 'abed1@gmail.com',
            password: 123456
        };

        let channel1 = {
            name: faker.name.jobTitle(),
            user_id: 1,
            description: faker.lorem.paragraph(2)
        };

        let channel2 = {
            name: faker.name.jobTitle(),
            user_id: 2,
            description: faker.lorem.paragraph(2)
        };

        let subscription = {
            user_id: 1,
            channel_id: 2,
            channel_name: 'test'
        };

        let subscription2 = {
            user_id: 2,
            channel_id: 1,
            channel_name: 'test 2'
        };

        await User.create(user1);
        await User.create(user2);
        await Channel.create(channel1);
        await Channel.create(channel2);
        await Subscription.create(subscription);
        await Subscription.create(subscription2);
        return true

    }catch(err){
        throw(err)
    }
}