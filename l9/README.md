# Run the tests

1. Install the dependencies.

   ```sh
   npm install
   ```

2. Migrate and run the server locally

   ```sh
   npx sequelize-cli db:create && npx sequelize-cli db:migrate
   PORT=3000 npm start &
   ```

3. From another terminal, run the cypress tests

   ```sh
   npx cypress run --env STUDENT_SUBMISSION_URL="http://localhost:3000/"
   ```
