// import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: index + 1,
  // avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  // name: faker.name.fullName(),
  // company: faker.company.name(),
  // isVerified: faker.datatype.boolean(),
  
  name: sample([
    'Trident Academy Of Technology',
    'Silicon instutute of technology Silicon instutute of technology  Silicon instutute of technology',
    'Kalinga institute of technology',
    'Kaustav institute of technology',
    "Silicon instutute of technology",
  ]),
  status: sample(['active', 'inactive']),
}));

export default users;
