# Database Commands :
For enter the database              -> psql -d shopnoneerdb -U eshrak
Show tables in the current database -> \dt
Describe a specific table           -> \d table_name
psql "postgresql://postgres.kxencugmpvfazmwduimm:shopnoneerdb@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
psql -h 192.168.10.120 -p 5432 -U eshrak -d shopnoneerdb 


# For view the table 
npx prisma studio 
npx prisma studio --port 5000 --browser none --hostname 192.168.10.33

# For migration Commands : 
database changes + generates client  -> npx prisma migrate dev
only generates the client            -> npx prisma generate 
For pure migration                   -> npx prisma migrate dev --name init


# Clear Terminal 
\! cls
