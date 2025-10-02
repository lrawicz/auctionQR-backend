import anchor from "@coral-xyz/anchor";

require('dotenv').config();

type Settings = {
    port: number | string;
    solanaNetwork: anchor.web3.Cluster;
    solanaApiUrl: string;
    db: DBSettings;
}
type DBSettings = {
    user: string | undefined;
    password: string | undefined;
    database: string | undefined;
    host: string;
    port: number | string;
    dialect: 'postgres';
}
const settings:Settings = {
    port: process.env.PORT || 3001,
    solanaNetwork: process.env.SOLANA_NETWORK as anchor.web3.Cluster || 'devnet',
    solanaApiUrl: process.env.SOLANA_API_URL || '',
    db: {
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        dialect: 'postgres',
    }

}
export default settings;