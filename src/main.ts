import EnvVars from './common/constants/env';
import server from './server';

const SERVER_START_MESSAGE =
  'Express server started on port: ' + EnvVars.Port.toString();

// Start the server
server.listen(EnvVars.Port, (err) => {
  if (!!err) {
    console.error(err.message);
  } else {
    console.log(SERVER_START_MESSAGE);
  }
});
