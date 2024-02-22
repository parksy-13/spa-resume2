import typeorm from "typeorm";
import ResumeEntity from './entity/resume.entity.js'
import UserEntity from './entity/user.entity.js'
import dotenv from 'dotenv';

dotenv.config();

const dataSource = new typeorm.DataSource({
    type: "mysql",
    host:process.env.DATABASE_HOST,
    port:process.env.DATABASE_PORT,
    username:process.env.DATABASE_USERNAME,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    synchronize: false,
    entities:[ResumeEntity, UserEntity]
})

dataSource.initialize()

export default dataSource;