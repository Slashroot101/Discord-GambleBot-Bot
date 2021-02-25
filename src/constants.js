module.exports = {
  roles: {
    baseUser: '6037334712b87a4fb0cdffd6',
    admin: '603733bd12b87a4fb0cdffd8',
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
