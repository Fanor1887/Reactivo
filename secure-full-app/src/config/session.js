import session from 'express-session';

const sessionConfig = session({
  secret: 'secreto', // Cambia esto por un valor seguro
  resave: false,
  saveUninitialized: false,
});

export default sessionConfig;
