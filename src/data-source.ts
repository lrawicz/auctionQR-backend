import "reflect-metadata";
import { DataSource } from "typeorm";
import settings from "./settings/settigs";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: settings.db.host,
    port: 5432,
    username: settings.db.user,
    password: settings.db.password,
    database: settings.db.database,
    synchronize: false,
    logging: true,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
});