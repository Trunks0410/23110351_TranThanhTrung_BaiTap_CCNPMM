const delay = (req, res, next) => {
    // Add a 2-second artificial delay
    setTimeout(() => {
        next();
    }, 2000);
};

module.exports = delay;
