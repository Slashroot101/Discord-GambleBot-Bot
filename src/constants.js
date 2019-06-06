module.exports = {
  roles: {
    baseUser: '5caa8a409f78f82b90830b29',
    admin: '5caa8a659f78f82b90830b2c',
  },
  lottery: {
    localityType: {
      guild: 'Guild',
      global: 'Global',
    },
    INITIAL_NEEDED_TICKETS: 5,
    MAX_DURATION_HOURS: 48,
    MAX_TICKETS: 500,
  },
  regex: {
    WELL_FORMED_URL: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  }
};
