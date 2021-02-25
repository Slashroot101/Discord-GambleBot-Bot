module.exports = {
  roles: {
    baseUser: '6037dbce0db395664004b658',
    admin: '6037dbee0db395664004b659',
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
